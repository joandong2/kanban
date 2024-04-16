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
                name: ,
                boardCode: ,
            }
        })

        // optional
        if (data.columnLists.length > 0) {
            for (let i = 0; i < Number(data.columnLists.length); i++) {
            await prisma.boardColumn.create({
                data: {
                    name: data.columnLists as string,
                    columnCode: data.columnLists[i].itemName as string,
                },
            });
        }
        }

        if (newBoard) {
            //revalidatePath('/')
            return {
                status: "success",
            };
        }

	} catch (error) {
		console.error("Error editing invoice:", error);
	}
};
