import React, { useEffect, useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ITask, ISubTask, IBoard } from '@/lib/type';
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	useForm,
	SubmitHandler,
	useFieldArray,
	useWatch,
} from "react-hook-form";
import { TasksSchema } from '@/lib/schema';
import { getTask, getTasks, updateSubTaskStatus, updateTaskColumn } from '@/lib/_actions';
import toast from 'react-hot-toast';
import { FaEllipsisVertical } from "react-icons/fa6";


type FormValues = z.infer<typeof TasksSchema>;
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Task = ({
	task,
	board,
	setTask,
	setTasks,
	setIsTaskEditDialogOpen,
	setIsTaskDeleteDialogOpen,
	setIsTaskDialogOpen
}: {
	task: ITask;
	board: IBoard;
	setTask: (task: ITask) => void;
	setTasks: (tasks: ITask[]) => void;
	setIsTaskDialogOpen: (status: boolean) => void;
	setIsTaskEditDialogOpen: (status: boolean) => void;
	setIsTaskDeleteDialogOpen: (status: boolean) => void;
}) => {
	const [selectedColumn, setSelectedColumn] = useState(task.column);
	const [position, setPosition] = useState("top center");

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		control,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(TasksSchema),
		defaultValues: {},
	});

	useEffect(() => {
		setSelectedColumn(task.column);
	}, [task]);

	const handleColumnChange = async (
		e: React.ChangeEvent<HTMLSelectElement>,
		taskCode: string
	) => {
		setSelectedColumn(e.target.value);
		const res = await updateTaskColumn(taskCode, e.target.value);
		const tasks = await getTasks(board.boardCode);
		if (res?.status == "success") {
			setTasks(tasks);
			toast.success("Task Updated", {});
		}
	};

	const handleCheckBox = async (subTaskCode: string) => {
		const res = await updateSubTaskStatus(subTaskCode);
		const tasks = await getTasks(board.boardCode);
		if (res && task.taskCode) {
			const taskRes = await getTask(task.taskCode);
			if (taskRes?.status == "success" && taskRes.task) {
				setTask(taskRes.task[0]);
				setTasks(tasks);
				toast.success("Task Updated", {});
			}
		}
	};

	const handleEditTask = () => {
		setIsTaskDeleteDialogOpen(false);
		setIsTaskDialogOpen(false);
		setIsTaskEditDialogOpen(true);
	}

	const handleShowTask = () => {
		setIsTaskEditDialogOpen(false);
		setIsTaskDialogOpen(false);
		setIsTaskDeleteDialogOpen(true);
	}

	return (
		<DialogContent>
			<form>
				<DialogHeader>
					<DialogTitle className="text-[16px] mb-4">
						<span className="flex justify-between">
							<span className="text-[17px] leading-[24px]">{task.title}</span>
							<span className="cursor-pointer">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<span>
											<FaEllipsisVertical className="text-[26px] text-[#828fa3]" />
										</span>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-[190px] mt-[10px] py-4 px-4 rounded-[5px] backgound-toggle text-black mr-[185px]">
										<DropdownMenuRadioGroup
											value={position}
											onValueChange={setPosition}
											className="flex flex-col gap-1"
										>
											<DropdownMenuRadioItem
												value="top"
												className="cursor-pointer p-0"
												onClick={handleEditTask}
											>
												Edit
											</DropdownMenuRadioItem>
											<DropdownMenuRadioItem
												value="bottom"
												className="text-red-800 cursor-pointer p-0"
												onClick={handleShowTask}
											>
												Delete
											</DropdownMenuRadioItem>
										</DropdownMenuRadioGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</span>
						</span>
					</DialogTitle>
					<DialogDescription>
						<span className="text-[#828fa3] leading-[20px] mb-4">
							{task.description}
						</span>
						<span className="flex flex-col my-5">
							<span className="mb-4 text-toggle">
								Subtasks{" "}
								{`${
									task.subTasks?.filter((subTask) => subTask.status).length
								} of ${task.subTasks?.length}`}
							</span>
							{task.subTasks &&
								task.subTasks.map((subTask: ISubTask, index: number) => (
									<span
										key={subTask.subTaskCode}
										className="check-box py-2 px-4 items-center mb-2 flex gap-3"
									>
										<input
											type="checkbox"
											id={`subTask-${subTask.subTaskCode}`}
											checked={subTask.status}
											name={subTask.subTaskCode}
											onChange={() =>
												subTask.subTaskCode &&
												handleCheckBox(subTask.subTaskCode)
											}
										/>
										<span
											className={`capitalize ${
												subTask.status ? "line-through line-text" : ""
											}`}
										>
											<span className="text-[13px]">{subTask.title}</span>
										</span>
									</span>
								))}
						</span>
						<span className="form-control w-full mb-2 flex flex-col">
							<span className="label-text text-toggle font-medium mb-2">
								Column
							</span>
							{task && (
								<select
									className="select p-3 border rounded w-full mb-2"
									{...register("column")}
									value={selectedColumn}
									onChange={(e) =>
										task.taskCode && handleColumnChange(e, task.taskCode)
									}
								>
									{board.columns?.map((column, index) => (
										<option key={index} value={column.column}>
											{column.name}
										</option>
									))}
								</select>
							)}
						</span>
					</DialogDescription>
				</DialogHeader>
			</form>
		</DialogContent>
	);
};

export default Task;