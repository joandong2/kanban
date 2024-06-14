import { z } from "zod";

export const ColumnDataSchema = z.object({
	name: z.string().nonempty("Field is required."),
	columnLists: z
		.array(
			z.object({
				columnName: z.string(),
				columnCode: z.string()
			})
		),
});

export const TasksSchema = z.object({
	title: z.string().nonempty("Field is required."),
	description: z.string().nonempty("Field is required."),
	column: z.string().nonempty("Field is required."),
	columnCode: z.string().optional(),
	subTaskLists: z
		.array(
			z.object({
				subTitle: z.string(),
				status: z.boolean().optional(),
				subTaskCode: z.string().optional()
			})
		)
		.nonempty("Items area required."),
});
