import React, { useEffect } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	useForm,
	SubmitHandler,
	useFieldArray,
	useWatch,
} from "react-hook-form";
import { AiFillDelete } from "react-icons/ai";
import { zodResolver } from "@hookform/resolvers/zod";

type FormValues = z.infer<typeof ColumnDataSchema>;
import { z } from "zod";
import { ColumnDataSchema } from "@/lib/schema";
import { IBoard } from '@/lib/type';
import toast from 'react-hot-toast';
import { updateBoard } from '@/lib/_actions';

const EditBoard = ({
	setIsEditDialogOpen,
	board,
}: {
	setIsEditDialogOpen: (bool: boolean) => void;
	setBoards: (boards: IBoard[]) => void;
	setBoard: (boards: IBoard) => void;
	board: IBoard;
}) => {
	const {
		register,
		handleSubmit,
		watch,
		reset,
		control,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(ColumnDataSchema),
		defaultValues: {
			name: board.name,
			columnLists: board.columns
				? board.columns.map((column) => ({
						columnName: column.name,
						columnCode: column.columnCode,
						id: column.id
				  }))
				: [{ columnName: "", columnCode: "" }],
		},
	});

	// Set the form values when the component mounts or when the board prop changes
	useEffect(() => {
		if (board && board.columns) {
			reset({
				name: board.name,
				columnLists: board.columns.map((column) => ({
					columnName: column.name,
					columnCode: column.columnCode,
					id: column.id,
				})),
			});
		}
	}, [board, reset]);

	const { fields, append, remove } = useFieldArray({
		name: "columnLists", // unique name for your Field Array
		control, // control props comes from useForm (optional: if you are using FormContext)
	});

	const processEditBoard: SubmitHandler<FormValues> = async (data) => {
		const result = await updateBoard(data);
		// if (result) {
		// 	const res = await getBoards();
		// 	if (res) {
		// 		setBoards(res);
		// 		setBoard(res[res.length - 1]);
		// 		toast.success("Board Created", {});
		// 	}
		// 	reset();
		// 	setIsDeleteDialogOpen(false);
		// }
	};

	console.log("fields", fields);
	console.log("board", board.columns);

	return (
		<>
			<DialogContent className="bg-white">
				<DialogHeader>
					<DialogTitle className="text-[16px] mb-4">Edit Board</DialogTitle>
					<DialogDescription>
						<span className="flex flex-col">
							<form onSubmit={() => handleSubmit(processEditBoard)}>
								<span className="form-control w-full mb-2 flex flex-col">
									<span className="label-text text-[#7e88c3] font-medium">
										Name
									</span>
									<input
										className="input p-3 border rounded w-full mb-2"
										{...register("name")}
										defaultValue={board.name}
									/>
									{errors.name?.message && (
										<span className="text-sm text-red-400">
											{errors.name.message}
										</span>
									)}
								</span>
								<span className="columns" id="columns">
									<span className="label-text text-[#7e88c3] font-medium">
										Columns
									</span>
									{fields.map((field, index) => (
										<span className="flex gap-2 mb-1 w-full" key={index}>
											<input
												{...register(`columnLists.${index}.columnName`)}
												className="input p-3 border rounded w-full mb-2"
											/>
											<input
												type="hidden"
												{...register(`columnLists.${index}.columnCode`)}
											/>
											<span
												onClick={() => remove(index)}
												className="total col-span-1 cursor-pointer flex flex-col justify-center"
											>
												<AiFillDelete className="text-[18px] text-[#888eb0]" />
											</span>
										</span>
									))}
									<button
										type="button"
										className="btn text-[#7e88c3] font-bold bg-[#f9fafe] rounded-[25px] w-full border-none mb-4 py-3 mt-5"
										onClick={() =>
											append({
												columnName: "",
												columnCode: "",
											})
										}
									>
										+ Add New Column
									</button>
								</span>
								<button
									type="submit"
									className="text-[#fff] font-bold bg-[#7c5dfa] rounded-[25px] py-3 px-8 border-none w-full"
								>
									Create New Board
								</button>
							</form>
						</span>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</>
	);
};

export default EditBoard