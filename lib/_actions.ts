"use server"

import { prisma } from "@/prisma";
import { z } from "zod";
import { ColumnDataSchema } from "@/lib/schema";

type ColumnData = z.infer<typeof ColumnDataSchema>;

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
								name: data.columnLists[i].columnName as string,
								columnCode: data.columnLists[i].columnName
									.replace(/[^A-Z0-9]/gi, "-")
									.toLowerCase() as string,
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

		// Fetch the columns associated with the board, including tasks
		// const columns = await prisma.column.findMany({
		// 	where: {
		// 		boardCode: boardCode,
		// 	},
		// 	include: {
		// 		tasks: true,
		// 	},
		// });

		// Combine the board and columns into a single object or array
		// const boardWithColumns = {
		// 	board: board,
		// 	columns: columns,
		// };

		return board;
	} catch (error) {
		console.error("Error fetching board and columns:", error);
		throw error; // Optionally handle or rethrow the error
	}
};

export const getTasks = async (boardCode : string) => {
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
};111

export const updateTaskOrder = async (
	taskCode: string,
	position: number,
	old_position: number,
	column: string,
	old_column: string,
) => {

	try {
		// find task & update order
		if (column != old_column) {
			// Update each task in old column
			const old_column_tasks = await prisma.task.findMany({
				where: {
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
			const new_column = await prisma.task.findMany({
				where: {
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
				status: "success",
				tasks: tasks
			};
		}

	} catch (error) {
		console.error("Error editing invoice:", error);
	}


};
