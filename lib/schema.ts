import { z } from "zod";

export const ColumnDataSchema = z.object({
	name: z.string().nonempty("Field is required."),
	columnLists: z
		.array(
			z.object({
				column: z.string(),
				columnName: z.string(),
				columnCode: z.string(),
			})
		)
		.nonempty("Items area required."),
});
