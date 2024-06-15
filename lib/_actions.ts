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
								columnCode: Math.random().toString(36).slice(2),
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
		//console.log("Original boardCode:", boardCode);
		const newBoardCode = data.name.replace(/[^A-Z0-9]/gi, "-").toLowerCase();
		//console.log("New boardCode:", newBoardCode);

		// Update or create board columns
        for (let i = 0; i < data.columnLists.length; i++) {
				const columnNameSlug = data.columnLists[i].columnName
					.replace(/[^A-Z0-9]/gi, "-")
					.toLowerCase();

				const columnCode = data.columnLists[i].columnCode;

				console.log("column", data.columnLists[i].columnCode);

				// Update tasks with the new column name and column code
				await prisma.task.updateMany({
					where: {
						boardCode: boardCode,
						columnCode: columnCode,
					},
					data: {
						column: columnNameSlug,
					},
				});

				// Upsert column
				await prisma.column.upsert({
					where: {
						columnCode: columnCode,
					},
					update: {
						boardCode: newBoardCode,
						name: data.columnLists[i].columnName,
						column: columnNameSlug,
					},
					create: {
						boardCode: newBoardCode,
						name: data.columnLists[i].columnName,
						column: columnNameSlug,
						columnCode: columnCode,
					},
				});
			}

		// Find columns that were not included in the update and delete them
		const existingColumns = await prisma.column.findMany({
			where: {
				boardCode: boardCode,
			},
		});

		const columnsToKeep = data.columnLists.map((column) => column.columnCode);
		const columnsToDelete = existingColumns.filter(
			(column) => !columnsToKeep.includes(column.columnCode)
		);

		// console.log('---------------------')
		// console.log("after submit columns", data.columnLists);
		// console.log("Existing columns:", existingColumns);
		// console.log("Columns to keep:", columnsToKeep);
		// console.log("Columns to delete:", columnsToDelete);

		// delete current column and create new column with the same name issue
		for (const column of columnsToDelete) {
			// Get tasks related to the column
			const tasks = await prisma.task.findMany({
				where: {
					boardCode: boardCode,
					column: column.columnCode,
				},
			});

			// Delete subtasks related to tasks in the column
			for (const task of tasks) {
				await prisma.subTask.deleteMany({
					where: {
						taskCode: task.taskCode,
					},
				});
			}

			// Delete tasks in the column
			await prisma.task.deleteMany({
				where: {
					boardCode: boardCode,
					column: column.columnCode,
				},
			});

			// Finally, delete the column
			await prisma.column.delete({
				where: {
					columnCode: column.columnCode,
				},
			});
		}

		// If the board code is changing, update related columns and tasks
		if (newBoardCode !== boardCode) {
			await prisma.board.update({
				where: {
					boardCode: boardCode,
				},
				data: {
					name: data.name,
					boardCode: newBoardCode,
				},
			});

			// Update tasks with the new board code
			await prisma.task.updateMany({
				where: {
					boardCode: boardCode,
				},
				data: {
					boardCode: newBoardCode,
				},
			});
		}

		return {
			status: "success",
			boardCode: newBoardCode,
		};
	} catch (error) {
		console.error("Error updating board:", error);
		throw error; // Optionally handle or rethrow the error
	}
};

export const getTask = async (taskCode: string) => {
	try {
		// Fetch the board details
		const task = await prisma.task.findMany({
			where: {
				taskCode: taskCode,
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

		return {
			task: task,
			status: 'success'
		};
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
				columnCode: data.columnCode || '',
				boardCode: boardCode,
				taskCode: Math.random().toString(36).slice(2),
			},
		});

		// optional
		if (data.subTaskLists.length > 0) {
			for (let i = 0; i < Number(data.subTaskLists.length); i++) {
				await prisma.subTask.create({
					data: {
						title: data.subTaskLists[i].subTitle,
						taskCode: newTask.taskCode,
						status: false,
						subTaskCode: Math.random().toString(36).slice(2),
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
	columnCode: string,
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
				columnCode: columnCode
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

export const updateTaskColumn = async (
	taskCode: string,
	column: string
) => {
	try {

		const tasks = await prisma.task.findMany({
			where: {
				column: column
			}
		})

		const task = await prisma.task.update({
			where: {
				taskCode,
			},
			data: {
				column: column,
				order: tasks.length
			},
		});

		return {
			status: "success",
		};

	} catch (error) {
		console.error("Error editing invoice:", error);
	}
}

export const updateSubTaskStatus = async (subTaskCode: string ) => {
	try {
		const subTask = await prisma.subTask.findUnique({
			where: {
				subTaskCode,
			},
		});

		if (!subTask) {
			throw new Error("Sub-task not found");
		}

		const updatedSubTask = await prisma.subTask.update({
			where: {
				subTaskCode,
			},
			data: {
				status: !subTask.status,
			},
		});

		return {
			status: "success",
		};
	} catch (error) {
		console.error("Error editing invoice:", error);
	}
};

export const updateTask = async (data: TaskData, taskCode: string) => {
	try {
		const existingTask = await prisma.task.findMany({
			where: {
				taskCode
			},
		});

		if (existingTask) {
			// Find columns that were not included in the update and delete them
			const existingSubTask = await prisma.subTask.findMany({
				where: {
					taskCode,
				},
			});

			const subTaskToKeep = data.subTaskLists.map((subTask) => subTask.subTaskCode);
			const subTaskToDelete = existingSubTask.filter(
				(subTask) => !subTaskToKeep.includes(subTask.subTaskCode)
			);

			for (const subtask of subTaskToDelete) {
				// Delete tasks related to the column
				await prisma.subTask.deleteMany({
					where: {
						taskCode: taskCode,
						subTaskCode: subtask.subTaskCode,
					},
				});
			}

			await prisma.task.update({
				where: {
					taskCode,
				},
				data: {
					title: data.title,
					description: data.description,
					column: data.column,
				},
			});

			for (let i = 0; i < data.subTaskLists.length; i++) {
				await prisma.subTask.upsert({
					where: {
						subTaskCode: data.subTaskLists[i].subTaskCode,
					},
					update: {
						title: data.subTaskLists[i].subTitle,
						status: data.subTaskLists[i].status ?? false,
					},
					create: {
						title: data.subTaskLists[i].subTitle,
						subTaskCode: Math.random().toString(36).slice(2),
						taskCode: taskCode,
						status: data.subTaskLists[i].status ?? false, // default to false if undefined
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


export const deleteTask = async (taskCode: string) => {
	try {
		// Delete all sub-tasks associated with the board's tasks
		await prisma.subTask.deleteMany({
			where: {
				taskCode,
			},
		});

		await prisma.task.delete({
			where: {
				taskCode,
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