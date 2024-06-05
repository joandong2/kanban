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
type FormValues = z.infer<typeof TasksSchema>;

const Task = ({
	task,
	board,
	setTask,
	setTasks,
}: {
	task: ITask;
	board: IBoard;
	setTask: (task: ITask) => void;
	setTasks: (tasks: ITask[]) => void;
}) => {
	const [selectedColumn, setSelectedColumn] = useState(task.column);

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

	return (
		<DialogContent className="bg-white">
			<form>
				<DialogHeader>
					<DialogTitle className="text-[16px] mb-4">
						<span className="flex justify-between">
							<span>{task.title}</span>
							<span className="mr-4">
								<Image
									src="/assets/icon-vertical-ellipsis.svg"
									alt="Image Best Gear"
									height="10"
									width="10"
									className="h-[20px] w-[6px]"
								/>
							</span>
						</span>
					</DialogTitle>
					<DialogDescription>
						<span className="text-[#828fa3] leading-[20px] mb-4">
							{task.description}
						</span>
						<span className="flex flex-col my-5">
							<span className="mb-4 text-[#828fa3]">
								Subtasks{" "}
								{`${
									task.subTasks?.filter((subTask) => subTask.status).length
								} of ${task.subTasks?.length}`}
							</span>
							{task.subTasks &&
								task.subTasks.map((subTask: ISubTask, index: number) => (
									<span
										key={index}
										className="bg-[#f4f7fd] py-2 px-4 items-center mb-3 flex gap-3"
									>
										<input
											type="checkbox"
											id="subTask"
											defaultChecked={subTask.status}
											name={subTask.subTaskCode}
											onChange={() =>
												subTask.subTaskCode &&
												handleCheckBox(subTask.subTaskCode)
											}
										/>
										<span
											className={`capitalize ${
												subTask.status ? "line-through" : ""
											}`}
										>
											{subTask.title}
										</span>
									</span>
								))}
						</span>
						<span className="form-control w-full mb-2 flex flex-col">
							<span className="label-text text-[#7e88c3] font-medium mb-2">
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