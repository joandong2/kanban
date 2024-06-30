import { IBoard, ITask } from "@/lib/type";
import React, { useEffect } from "react";
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
import toast from "react-hot-toast";
import { getTasks, updateTask } from "@/lib/_actions";
type FormValues = z.infer<typeof TasksSchema>;

const EditTask = ({
	setIsTaskEditDialogOpen,
	setTask,
	setTasks,
	task,
	board,
}: {
	setIsTaskEditDialogOpen: (bool: boolean) => void;
	setTask: (task: ITask) => void;
	setTasks: (tasks: ITask[]) => void;
	task: ITask;
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
			title: "",
			description: "",
			subTaskLists: [{ subTitle: "", subTaskCode: "" }],
			column: "",
		},
	});

	const { fields, append, remove } = useFieldArray({
		name: "subTaskLists", // unique name for your Field Array
		control, // control props comes from useForm (optional: if you are using FormContext)
	});

  useEffect(() => {
      reset({
				title: task.title,
				description: task.description,
				subTaskLists: task.subTasks?.map((subTask) => ({
					subTitle: subTask.title,
					status: subTask.status,
					subTaskCode: subTask.subTaskCode,
				})) || [{ subTitle: "" }],
				column: task.column,
			});
	}, [task, reset]);

  const handleEditTask: SubmitHandler<FormValues> = async (data) => {

    if (!task.taskCode) {
			toast.error("Task code is missing");
			return;
		}

		try {
			// Assume addTaskAction is a function that handles the task creation
			const result = await updateTask(data, task.taskCode);
			if (result?.status == "success") {
				const updatedTasks = await getTasks(board.boardCode);
				if (updatedTasks) {
					setTasks(updatedTasks);
					toast.success("Task Updated", {});
					reset();
					setIsTaskEditDialogOpen(false);
				}
			}
		} catch (error) {
			console.error("Error adding task:", error);
			toast.error("An error occurred while editing the task");
		}
	};

	return (
		<DialogContent className="bg-white overflow-auto h-auto max-h-screen bg-background">
			<DialogHeader>
				<DialogTitle className="text-[16px] mb-4">Edit Task</DialogTitle>
				<DialogDescription>
					<span className="flex flex-col">
						<form onSubmit={handleSubmit(handleEditTask)}>
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
								<span className="label-text text-toggle  font-medium">
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
								<span className="label-text text-toggle  font-medium">
									SubTasks
								</span>
								{fields.map((field, index) => (
									<span className="flex gap-2 mb-1 w-full" key={index}>
										<input
											{...register(`subTaskLists.${index}.subTitle`)}
											className="input p-3 border rounded w-full mb-2"
										/>
										<input
											type="hidden"
											{...register(`subTaskLists.${index}.status`)}
										/>
										<input
											type="hidden"
											{...register(`subTaskLists.${index}.subTaskCode`)}
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
									className="btn text-toggle  font-bold bg-[#f9fafe] rounded-[25px] w-full border-none mb-4 py-3 mt-5"
									onClick={() =>
										append({
											subTitle: "",
											status: false,
											subTaskCode: "",
										})
									}
								>
									+ Add Subtasks
								</button>
							</span>

							<span className="form-control w-full mb-2 flex flex-col">
								<span className="label-text text-[#7e88c3] font-medium">
									Column
								</span>
								<select
									className="select p-3 border rounded w-full mb-2"
									{...register("column")}
								>
									{board.columns?.map((column) => (
										<option value={column.column} className="capitalize">
											{column.name}
										</option>
									))}
								</select>
							</span>

							<button
								type="submit"
								className="text-[#fff] font-bold bg-[#7c5dfa] rounded-[25px] py-3 px-8 border-none w-full"
							>
								Edit Task
							</button>
						</form>
					</span>
				</DialogDescription>
			</DialogHeader>
		</DialogContent>
	);
};

export default EditTask;
