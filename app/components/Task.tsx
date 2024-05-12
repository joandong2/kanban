import React, { useState } from 'react'
import { IColumns, ITask } from '@/lib/type';

export const Tasks = ({ columns, tasks }: { columns: IColumns[] | undefined, tasks: ITask[] }) => {

	// console.log("columns", columns);
	// console.log("tasks", tasks);

	return (
		<span className="flex gap-4">
			{columns &&
				columns.map((column) => (
					<Column key={column.id} column={column.name} name={column.name} tasks={tasks} />
				))}
		</span>
	);
};

const Column: React.FC<IColumns> = ({ tasks, column, setTasks}) => {

	//console.log('columns tasks', tasks);

	const handleDragStart = (e: React.DragEvent, task: ITask) => {
		e.dataTransfer.setData("id", task?.id || ''); // set data drag id to be used in dropping
	};

	// task drop position
	const handleColumnDrop = (e: React.DragEvent) => {
		e.preventDefault(); // Prevent the default behavior
		const id = e.dataTransfer.getData("id"); // id from setData
		//setTasks((pv) => pv.filter((c) => c.id !== id));
	};

	 const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	// udpate task data
	const handleSpotDrop = (e: React.DragEvent, position: number) => {
		const id = e.dataTransfer.getData("id");
		// console.log('task id to move', id)
		//console.log("spot drop column", column);
		// console.log("spot drop position", position);

		if(tasks) {
			const taskToMove = tasks.find((task: ITask) => task.id == id);
			const updatedTasks = tasks.filter((c: ITask) => c.id !== id);

			// updatedTasks.splice(position, 0, {
			// 	...taskToMove,
			// 	column: column || "",
			// });

			if (setTasks) {
				setTasks(updatedTasks);
			}
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
			{/* {tasks &&
				tasks.map(
					(task: ITask, index: number) =>
						task.column === column && (
							<span key={index} className="flex flex-col">
								<span
									draggable
									onDragStart={(e) =>
										handleDragStart && handleDragStart(e, { ...task })
									}
									className="rounded border p-3 border-neutral-700 bg-white-800 active:cursor-grabbing"
								>
									{task.title}
								</span>
								<DropSpot
									handleSpotDrop={handleSpotDrop}
									position={index}
								/>
							</span>
						)
				)} */}
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

const DEFAULT_CARDS = [
	// BACKLOG
	{ title: "Look into render bug in dashboard", id: "1", column: "backlog" },
	{ title: "SOX compliance checklist", id: "2", column: "backlog" },
	{ title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
	{ title: "Document Notifications service", id: "4", column: "backlog" },
	// TODO
	{
		title: "Research DB options for new microservice",
		id: "5",
		column: "todo",
	},
	{ title: "Postmortem for outage", id: "6", column: "todo" },
	{ title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },

	// DOING
	{
		title: "Refactor context providers to use Zustand",
		id: "8",
		column: "doing",
	},
	{ title: "Add logging to daily CRON", id: "9", column: "doing" },
];


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