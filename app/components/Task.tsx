import React, { Dispatch, SetStateAction, useState } from 'react'
import { IColumns, ITask } from '@/lib/type';
import { updateTaskOrder } from '@/lib/_actions';
import { useRouter } from "next/navigation";

export const Tasks = ({
	columns,
	tasks,
	setTasks,
}: {
	columns: IColumns[] | undefined;
	tasks: ITask[];
	setTasks: (tasks: ITask[]) => void;
}) => {
	return (
		<span className="flex gap-4">
			{columns &&
				columns.map((column) => (
					<Column
						key={column.id}
						column={column.columnCode}
						name={column.name}
						tasks={tasks}
						setTasks={setTasks}
					/>
				))}
		</span>
	);
};


const Column: React.FC<IColumns> = ({ tasks, column, setTasks}) => {
	const router = useRouter();
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
	const handleSpotDrop = async (e: React.DragEvent, position: number) => {
		const old_position = e.dataTransfer.getData("id");
		const task_code = e.dataTransfer.getData("task_code");
		const old_column = e.dataTransfer.getData("current_column");

		console.log("current column", old_column);
		console.log("current position", old_position);
		console.log("task code", task_code);
		console.log("spot drop column", column);
		console.log("spot drop position", position);

		if (task_code && old_column && column) {
			const tasks = await updateTaskOrder(task_code, position, Number(old_position), column, old_column);

			//console.log('tasks', tasks);
			if(tasks && setTasks) {
				setTasks(tasks);
				router.refresh();
			}
			console.log("tasks", tasks);
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