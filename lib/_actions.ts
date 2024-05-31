"use server"

import { prisma } from "@/prisma";
import { z } from "zod";
import { ColumnDataSchema, TasksSchema } from "@/lib/schema";

type ColumnData = z.infer<typeof ColumnDataSchema>;
type TaskData = z.infer<typeof TasksSchema>;

export const createBoard = async (data: ColumnData) => {
	try {

        const newBoard = await prisma.board.create({
			data: {
				name: data.name,
				boardCode: data.name.replace(/[^A-Z0-9]/gi, "-").toLowerCase(),
			},
		});

        // optional
        if (data.columnLists.length > 0) {
            for (let i = 0; i < Number(data.columnLists.length); i++) {
            await prisma.column.create({
							data: {
								boardCode: newBoard.boardCode,
								name: data.columnLists[i].columnName,
								column: data.columnLists[i].columnName
									.replace(/[^A-Z0-9]/gi, "-")
									.toLowerCase(),
								columnCode: Math.random().toString(36).slice(2) ,
							},
						});
            }
        }

        if (newBoard) {
            return {
                status: "success",
            };
        }

	} catch (error) {
		console.error("Error editing invoice:", error);
	}
};


export const getBoards = async () => {
	try {
		const boards = await prisma.board.findMany({
			include: {
				columns: true,
			},
		});
		return boards;
	} catch (error) {
		console.error("Error editing invoice:", error);
	}
};

export const getBoardAndColumns = async (boardCode: string) => {
	try {
		// Fetch the board details
		const board = await prisma.board.findUnique({
			where: {
				boardCode: boardCode,
			},
			include: {
				columns: true,
			}
		});

		return board;
	} catch (error) {
		console.error("Error fetching board and columns:", error);
		throw error; // Optionally handle or rethrow the error
	}
};

export const deleteBoard = async (boardCode: string) => {
	try {
		// Delete all sub-tasks associated with the board's tasks
		await prisma.subTask.deleteMany({
			where: {
				task: {
					boardCode: boardCode,
				},
			},
		});

		await prisma.task.deleteMany({
			where: {
				board: {
					boardCode,
				},
			},
		});

		// Delete all columns associated with the board
		await prisma.column.deleteMany({
			where: {
				board: {
					boardCode,
				},
			},
		});

		await prisma.board.delete({
			where: {
				boardCode: boardCode,
			},
		});

		return {
			status: "success",
		};
	} catch (error) {
		console.error("Error fetching tasks:", error);
		throw error; // Optionally handle or rethrow the error
	}
};

export const updateBoard = async (data: ColumnData, boardCode: string) => {
	try {
		//console.log(data);
		console.log(boardCode);
		const newBoardCode = data.name.replace(/[^A-Z0-9]/gi, "-").toLowerCase();
		console.log(newBoardCode);

		// Update or create board columns
		for (let i = 0; i < data.columnLists.length; i++) {
			const columnNameSlug = data.columnLists[i].columnName
				.replace(/[^A-Z0-9]/gi, "-")
				.toLowerCase();

			await prisma.column.upsert({
				where: {
					columnCode: columnNameSlug + "-" + newBoardCode,
				},
				update: {
					boardCode: newBoardCode,
					name: data.columnLists[i].columnName,
					column: columnNameSlug,
					columnCode: columnNameSlug + "-" + newBoardCode,
				},
				create: {
					boardCode: newBoardCode,
					name: data.columnLists[i].columnName,
					column: columnNameSlug,
					columnCode: columnNameSlug + "-" + newBoardCode,
				},
			});
		}

		//Find columns that were not included in the update and delete them
		const existingColumns = await prisma.column.findMany({
			where: {
				boardCode: boardCode,
			},
		});

		// update columns
		const columnsToKeep = existingColumns.map((column) => {
			const columnNameSlug = column.name
				.replace(/[^A-Z0-9]/gi, "-")
				.toLowerCase();
			return `${columnNameSlug}-${newBoardCode}`;
		});
		const columnsToDelete = existingColumns.filter(
			(column) => !columnsToKeep.includes(column.columnCode)
		);

		console.log("existing", existingColumns);
		console.log("keep", columnsToKeep);
		console.log('delete', columnsToDelete)

		for (const column of columnsToDelete) {
			await prisma.column.delete({
				where: {
					columnCode: column.columnCode,
				},
			});

			await prisma.task.deleteMany({
				where: {
					boardCode: boardCode,
					column: column.column,
				},
			});
		}

		// Update the board name and board code if needed
		const updatedBoard = await prisma.board.update({
			where: {
				boardCode: boardCode,
			},
			data: {
				name: data.name,
				boardCode: newBoardCode,
			},
		});

		if (newBoardCode !== boardCode) {
			// Update columns with the new board code
			// Update the board code for columns with a matching board code
			for (const column of existingColumns) {
				await prisma.column.updateMany({
					where: {
						columnCode: column.columnCode,
					},
					data: {
						boardCode: newBoardCode,
						columnCode: column.name.replace(/[^A-Z0-9]/gi, "-").toLowerCase() + "-" + newBoardCode,
					},
				});
			}

			// Update tasks with the new board code
			const tasks = await prisma.task.findMany({
				where: {
					boardCode: boardCode,
				},
			});

			for (const task of tasks) {

				await prisma.task.update({
					where: {
						taskCode: task.taskCode,
					},
					data: {
						taskCode:
							task.title.split(" ")[0].toLowerCase(),
						boardCode: newBoardCode,
					},
				});

				// Update subtasks with the new taskCode
				await prisma.subTask.updateMany({
					where: {
						taskCode: task.title.split(" ")[0].toLowerCase() + "-" + boardCode,
					},
					data: {
						taskCode:
							task.title.split(" ")[0].toLowerCase(),
					},
				});
			}
		}

		return {
			status: "success",
			boardCode: newBoardCode,
		};
	} catch (error) {
		console.error("Error fetching tasks:", error);
		throw error; // Optionally handle or rethrow the error
	}
};

export const getTask = async (boardCode : string) => {
	try {
		// Fetch the board details
		const tasks = await prisma.task.findMany({
			where: {
				boardCode: boardCode,
			},
			include: {
				subTasks: true,
			},
			orderBy: [
				{
					order: "asc",
				},
			],
		});

		return tasks;
	} catch (error) {
		console.error("Error fetching tasks:", error);
		throw error; // Optionally handle or rethrow the error
	}
};

export const getTasks = async (boardCode: string) => {
	try {
		// Fetch the board details
		const tasks = await prisma.task.findMany({
			where: {
				boardCode: boardCode,
			},
			include: {
				subTasks: true,
			},
			orderBy: [
				{
					order: "asc",
				},
			],
		});

		return tasks;
	} catch (error) {
		console.error("Error fetching tasks:", error);
		throw error; // Optionally handle or rethrow the error
	}
};

export const addTask = async (data: TaskData, boardCode: string) => {
	try {

		const existingTasks = await prisma.task.findMany({
			where: {
				boardCode: boardCode,
				column: data.column
			}
		})

		const newTask = await prisma.task.create({
			data: {
				title: data.title,
				description: data.description,
				order: existingTasks.length <= 0 ? 0 : existingTasks.length,
				column: data.column,
				boardCode: boardCode,
				taskCode: data.title.split(" ")[0].toLowerCase() + "-" + boardCode,
			},
		});

		// optional
		if (data.subTaskLists.length > 0) {
			for (let i = 0; i < Number(data.subTaskLists.length); i++) {
				await prisma.subTask.create({
					data: {
						title: data.subTaskLists[i].subTitle as string,
						taskCode: newTask.taskCode as string,
					},
				});
			}
		}

		return {
			status: "success",
		};

	} catch (error) {
		console.error("Error:", error);
	}
};

export const updateTaskOrder = async (
	taskCode: string,
	position: number,
	old_position: number,
	column: string,
	old_column: string,
	boardCode: string
) => {

	try {
		// find task & update order
		if (column != old_column) {
			// Update each task in old column
			const old_column_tasks = await prisma.task.findMany({
				where: {
					boardCode: boardCode,
					column: old_column,
				},
				orderBy: [
					{
						order: "asc",
					},
				],
			});

			if (old_column_tasks) {
				for (let i = old_position; i < old_column_tasks.length; i++) {
					await prisma.task.update({
						where: { id: old_column_tasks[i].id },
						data: { order: i - 1 },
					});
				}
			}

			// Update each task in new column
			const new_column = await prisma.task.findMany({
				where: {
					boardCode: boardCode,
					column: column,
				},
				orderBy: [
					{
						order: "asc",
					},
				],
			});

			for (let i = position; i < new_column.length; i++) {
				await prisma.task.update({
					where: { id: new_column[i].id },
					data: { order: i + 1 },
				});
			}
		} else {

			if(position !== old_position) {
				const new_column = await prisma.task.findMany({
					where: {
						boardCode: boardCode,
						column: column,
					},
					orderBy: [
						{
							order: "asc",
						},
					],
				});

				for (let i = position; i < new_column.length; i++) {
					await prisma.task.update({
						where: { id: new_column[i].id },
						data: { order: i + 1 },
					});
				}
			}
		}

		const task = await prisma.task.update({
			where: {
				taskCode,
			},
			data: {
				order: position as number,
				column: column,
			},
		});

		if(task) {
			const tasks = await prisma.task.findMany({
				where: {
					boardCode: boardCode
				},
				include: {
					subTasks: true,
				},
				orderBy: [
					{
						order: "asc",
					},
				],
			});


			return tasks
		}

	} catch (error) {
		console.error("Error editing invoice:", error);
	}


};


