'use client'

import React, { DragEventHandler, useState } from 'react'
import { FaCircle } from "react-icons/fa";
import { ITask, ITaskData } from '@/lib/type';
import { TbAsterisk } from 'react-icons/tb';

export const Tasks = () => {
	// Define draggable item component
	const [tasks, setTasks] = useState<ITask[]>(DEFAULT_CARDS);

	const backlog = tasks.filter((task) => task.column === 'backlog')
	const todo = tasks.filter((task) => task.column === "todo");
	const doing = tasks.filter((task) => task.column === "doing");

	return (
		<span className="flex gap-4">
			<Column tasks={backlog} column="backlog"/>
			<Column tasks={todo} column="todo"/>
		</span>
	);
};

const Column = ({ tasks, column }: {tasks : ITask[], column: string}) => {

	const handleDragStart = (e: React.DragEvent, task: ITask) => {
		console.log(e);
		// console.log(task);
		e.dataTransfer.setData("id", task.id); // set data drag id to be used in dropping
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault(); // Prevent the default behavior
		const id = e.dataTransfer.getData("id"); // id from setData
		//console.log("id", id);
		//console.log(e)
	};

	 const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault(); // Prevent default to allow dropping
	};

	return (
		<span
			className="flex flex-col gap-4"
			onDrop={(e) => handleDrop(e)}
			onDragOver={(e) => handleDragOver(e)}
		>
			<DropSpot id="0" column={column}/>
			{tasks &&
				tasks.map((task: ITask, index) => (
					<Task
						key={index}
						title={task.title}
						id={task.id}
						column={task.column}
						handleDragStart={handleDragStart}
					/>
				))}
		</span>
	);
}

const Task: React.FC<ITask> = ({ title, id, column, handleDragStart }) => {
	return (
		<>
			<span
				draggable
				onDragStart={(e) =>
					handleDragStart && handleDragStart(e, { title, id, column })
				}
				className="rounded border p-3 border-neutral-700 bg-white-800 active:cursor-grabbing"
			>
				{title}
			</span>
			<DropSpot id={id} column={column}/>
		</>
	);
};

const DropSpot = ({id, column} : {id:string, column:string}) => {
	const [active, setActive] = useState(false);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setActive(true)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		console.log('drop area');
		console.log('id', id);
		console.log('column', column)
	}

	return (
		<span
			onDragOver={handleDragOver}
			onDragLeave={() => setActive(false)}
			onDrop={(e) => handleDrop(e)}
			className={`shrink-0 place-content-center rounded border ${
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