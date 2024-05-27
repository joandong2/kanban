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


export const deleteBoard = async (boardCode: string) => {
	try {

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


		const tasks = await prisma.board.delete({
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

export const updateBoard = async (data: ColumnData) => {
	try {
		// Update board columns
		for (let i = 0; i < Number(data.columnLists.length); i++) {
			//const updatedItem = data.itemLists[i];
			await prisma.column.upsert({
				where: {
					invoiceID_ItemName: {
						invoiceID: data.invoiceCode as string,
						itemName: data.itemLists[i].itemName as string,
					},
				},
				update: {
					itemName: data.itemLists[i].itemName as string,
					itemQuantity: Number(data.itemLists[i].itemQuantity),
					itemPrice: Number(data.itemLists[i].itemPrice),
				},
				create: {
					invoiceID: data.invoiceCode as string,
					itemName: data.itemLists[i].itemName as string,
					itemQuantity: Number(data.itemLists[i].itemQuantity),
					itemPrice: Number(data.itemLists[i].itemPrice),
				},
			});
		}

		await prisma.invoiceItem.deleteMany({
			where: {
				AND: [
					{ invoiceID: data.invoiceCode as string },
					{
						// exclude items with the same 'itemName' as any item in the itemLists
						NOT: {
							itemName: {
								in: data.itemLists.map((item) => item.itemName),
							},
						},
					},
				],
			},
		});

		const tasks = await prisma.board.delete({
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

