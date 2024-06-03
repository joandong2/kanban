import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ITask, ISubTask } from '@/lib/type';
import Image from "next/image";

const Task = ({task} : {task : ITask}) => {

	return (
		<>
			<DialogContent className="bg-white">
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
						<span className="text-[#828fa3]">{task.description}</span>
						<span>
							<ul>
								{task.subTasks &&
									task.subTasks.map((subTask: ISubTask, index: number) => (
										<li key={index}>
											<input type="checkbox" id="subTask" name={subTask.subTaskCode} />
											 {subTask.title}
										</li>
									))}
							</ul>
						</span>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</>
	);
}

export default Task;