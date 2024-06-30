import { IBoard, ITask } from '@/lib/type';
import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TasksSchema } from "@/lib/schema";
import {
	useForm,
	SubmitHandler,
	useFieldArray,
	useWatch,
} from "react-hook-form";
import { AiFillDelete } from "react-icons/ai";
import toast from 'react-hot-toast';
import { addTask, getBoardAndColumns, getTasks } from '@/lib/_actions';
type FormValues = z.infer<typeof TasksSchema>;

const AddTask = ({
	setIsAddTaskDialogOpen,
	setTasks,
	board,
}: {
	setIsAddTaskDialogOpen: (bool: boolean) => void;
	setTasks: (tasks: ITask[]) => void;
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
		resolver: zodResolver(TasksSchema),
		defaultValues: {
			subTaskLists: [{ subTitle: "" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		name: "subTaskLists", // unique name for your Field Array
		control, // control props comes from useForm (optional: if you are using FormContext)
	});

	const handleAddTask: SubmitHandler<FormValues> = async (data) => {
		try {
			// Assume addTaskAction is a function that handles the task creation
			const result = await addTask(data, board.boardCode);
			if (result?.status == "success") {
				const updateTasks = await getTasks(board.boardCode);
				if (updateTasks) {
					setTasks(updateTasks);
					toast.success("Board Updated", {});
					reset();
					setIsAddTaskDialogOpen(false);
				}
			}
		} catch (error) {
			console.error("Error adding task:", error);
			toast.error("An error occurred while adding the task");
		}
	};

	return (
		<>
			<DialogContent className="bg-background overflow-auto h-auto max-h-screen">
				<DialogHeader>
					<DialogTitle className="text-[16px] mb-4">Add New Task</DialogTitle>
					<DialogDescription>
						<span className="flex flex-col">
							<form onSubmit={handleSubmit(handleAddTask)}>
								<span className="form-control w-full mb-2 flex flex-col">
									<span className="label-text text-toggle font-medium">
										Title
									</span>
									<input
										className="input p-3 border rounded w-full mb-2"
										{...register("title")}
									/>
									{errors.title?.message && (
										<span className="text-sm text-red-400">
											{errors.title.message}
										</span>
									)}
								</span>
								<span className="form-control w-full mb-2 flex flex-col">
									<span className="label-text text-toggle font-medium">
										Description
									</span>
									<textarea
										className="input p-3 border rounded w-full mb-2"
										{...register("description")}
										rows={4}
									></textarea>
									{errors.description?.message && (
										<span className="text-sm text-red-400">
											{errors.description.message}
										</span>
									)}
								</span>
								<span className="columns" id="columns">
									<span className="label-text text-toggle font-medium">
										SubTasks
									</span>
									{fields.map((field, index) => (
										<span className="flex gap-2 mb-1 w-full" key={index}>
											<input
												{...register(`subTaskLists.${index}.subTitle`)}
												className="input p-3 border rounded w-full mb-2"
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
												subTitle: "",
											})
										}
									>
										+ Add Subtasks
									</button>
								</span>

								<span className="form-control w-full mb-2 flex flex-col">
									<span className="label-text text-toggle font-medium">
										Column
									</span>
									<select
										className="select p-3 border rounded w-full mb-2"
										{...register("column")}
									>
										{board.columns?.map((column) => (
											<>
												<option value={column.column}>{column.name}</option>
												<input
													type="hidden"
													{...register("columnCode")}
													value={column.columnCode}
												/>
											</>
										))}
									</select>
								</span>

								<button
									type="submit"
									className="text-[#fff] font-bold bg-[#7c5dfa] rounded-[25px] py-3 px-8 border-none w-full"
								>
									Create Task
								</button>
							</form>
						</span>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</>
	);
};

export default AddTask