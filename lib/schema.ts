import { z } from "zod";

export const ColumnDataSchema = z.object({
	name: z.string(),
	columnLists: z
		.array(
			z.object({
				columnName: z.string().nonempty("Field is required."),
			})
		)
		.nonempty("Items area required."),
});
