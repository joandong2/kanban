import React from 'react'
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
type FormValues = z.infer<typeof TasksSchema>;

const Task = ({task, board} : {task : ITask, board: IBoard}) => {

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
		},
	});

	console.log(task);

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
							{task.subTasks &&
								task.subTasks.map((subTask: ISubTask, index: number) => (
									<span
										key={index}
										className="bg-[#f4f7fd] py-3 px-2 items-center mb-3 flex gap-3"
									>
										<input
											type="checkbox"
											id="subTask"
											name={subTask.subTaskCode}
										/>
										<span className="capitalize">{subTask.title}</span>
									</span>
								))}
						</span>
						<span className="form-control w-full mb-2 flex flex-col">
							<span className="label-text text-[#7e88c3] font-medium mb-2">
								Column
							</span>
							{task.column && (
								<select
									className="select p-3 border rounded w-full mb-2"
									{...register("column")}
									defaultValue={task.column}
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
}

export default Task;