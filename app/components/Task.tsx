import React, { useState } from 'react'
import { IColumns, ITask } from '@/lib/type';
import { updateTaskOrder } from '@/lib/_actions';
import { revalidatePath } from 'next/cache';

export const Tasks = ({ columns, tasks }: { columns: IColumns[] | undefined, tasks: ITask[] }) => {

	return (
		<span className="flex gap-4">
			{columns &&
				columns.map((column) => (
					<Column key={column.id} column={column.columnCode} name={column.name} tasks={tasks} />
				))}

		</span>
	);
};

const Column: React.FC<IColumns> = ({ tasks, column, setTasks}) => {
	const counter = 0;
	const handleDragStart = (e: React.DragEvent, task: ITask) => {
		e.dataTransfer.setData("id", task?.order.toString() || "");
		e.dataTransfer.setData("task_code", task?.taskCode || "");
		e.dataTransfer.setData("current_column", task?.column || "");
	};

	// task drop position
	const handleColumnDrop = (e: React.DragEvent) => {
		e.preventDefault(); // Prevent the default behavior
		//const id = e.dataTransfer.getData("id"); // id from setData
		//setTasks((pv) => pv.filter((c) => c.id !== id));
	};

	 const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	// udpate task data
	const handleSpotDrop = (e: React.DragEvent, position: number) => {
		const old_position = e.dataTransfer.getData("id");
		const task_code = e.dataTransfer.getData("task_code");
		const old_column = e.dataTransfer.getData("current_column");

		console.log("current column", old_column);
		console.log("current position", old_position);
		console.log("task code", task_code);
		console.log("spot drop column", column);
		console.log("spot drop position", position);

		if (task_code && old_column && column) {
			const tasks = updateTaskOrder(task_code, position, Number(old_position), column, old_column);

			console.log('tasks', tasks);
		}
	}

	return (
		<span
			className="flex flex-col gap-4"
			onDrop={(e) => handleColumnDrop(e)}
			onDragOver={(e) => handleDragOver(e)}
		>
			<h2>{column}</h2>
			<DropSpot handleSpotDrop={handleSpotDrop} position={0} />
			{tasks &&
				tasks.map(
					(task: ITask, index) =>
						task.column == column && (
							<span key={index} className="flex flex-col">
								<span
									draggable
									onDragStart={(e) =>
										handleDragStart && handleDragStart(e, { ...task })
									}
									className="rounded border p-3 border-neutral-700 bg-white-800 active:cursor-grabbing"
								>
									{task.title + " " + task.order + " " + task.column}
								</span>
								<DropSpot
									handleSpotDrop={handleSpotDrop}
									position={task.order + 1}
								/>
								{task.order + 1}
							</span>
						)
				)}
		</span>
	);
}

const DropSpot = ({
	handleSpotDrop,
	position,
}: {
	handleSpotDrop: any;
	position: number;
}) => {
	const [active, setActive] = useState(false);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setActive(true);
	};

	return (
		<span
			onDragOver={handleDragOver}
			onDragLeave={() => setActive(false)}
			onDrop={(e) => {
				handleSpotDrop(e, position);
				setActive(false);
			}}
			className={`rounded border text-black ${
				active ? "active_drop" : "hide_drop"
			}`}
		>
			Drop Here
		</span>
	);
};

export default Tasks


// <span className="px-8 py-4 gap-8 flex">
		// 	<span className="tasks">
		// 		<span className="flex items-center gap-2 mb-6">
		// 			<FaCircle className="text-red-500" />
		// 			<span className="uppercase">todo (4)</span>
		// 		</span>
		// 		<span className="sub-tasks flex flex-col gap-6">
		// 			<span className="task shadow-lg">
		// 				<p className="text-[14px] mb-2">
		// 					Build UI for onboarding flow Build UI for onboarding flow
		// 				</p>
		// 				<span className="text-[#828fa3] font-bold text-[12px]">
		// 					0 of 3 subtasks
		// 				</span>
		// 			</span>
		// 			<span className="task shadow-lg">
		// 				<p className="text-[14px] mb-2">
		// 					Build UI for onboarding flow Build UI for onboarding flow
		// 				</p>
		// 				<span className="text-[#828fa3] font-bold text-[12px]">
		// 					0 of 3 subtasks
		// 				</span>
		// 			</span>
		// 		</span>
		// 	</span>
		// 	<span className="tasks">
		// 		<span className="flex items-center gap-2 mb-6">
		// 			<FaCircle className="text-green-500" />
		// 			<span className="uppercase">doing (2)</span>
		// 		</span>
		// 		<span className="sub-tasks flex flex-col gap-6">
		// 			<span className="task shadow-lg">
		// 				<p className="text-[14px] mb-2">
		// 					Build UI for onboarding flow Build UI for onboarding flow
		// 				</p>
		// 				<span className="text-[#828fa3] font-bold text-[12px]">
		// 					0 of 3 subtasks
		// 				</span>
		// 			</span>
		// 			<span className="task shadow-lg">
		// 				<p className="text-[14px] mb-2">
		// 					Build UI for onboarding flow Build UI for onboarding flow
		// 				</p>
		// 				<span className="text-[#828fa3] font-bold text-[12px]">
		// 					0 of 3 subtasks
		// 				</span>
		// 			</span>
		// 		</span>
		// 	</span>
		// 	<span className="tasks">
		// 		<span className="flex items-center gap-2 mb-6">
		// 			<FaCircle />
		// 			<span className="uppercase">done (4)</span>
		// 		</span>
		// 		<span className="sub-tasks"></span>
		// 	</span>
		// </span>