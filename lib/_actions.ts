"use server"

"use server";

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
            await prisma.boardColumn.create({
                    data: {
                        boardCode: newBoard.boardCode,
                        name: data.columnLists[i].columnName as string,
                        columnCode: (data.columnLists[i].columnName +
                            data.columnLists[i].columnCode) as string,
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


// GET
// parameter is optional object
//export const getBoards = async ( boardCode? : {boardCode: string}) => {

export const getBoards = async ( boardCode? : string) => {
	try {
        if (boardCode) {
					const columns = await prisma.boardColumn.findMany({
						where: {
							boardCode: boardCode,
						},
						include: {
							tasks: true
						},
					});
					return columns;
				}

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


export const getBoard = async (boardCode: string) => {
	try {
		const columns = await prisma.boardColumn.findMany({
			where: {
				boardCode: boardCode,
			},
			include: {
				tasks: true,
			},
		});
		return columns;
	} catch (error) {
		console.error("Error editing invoice:", error);
	}
};
