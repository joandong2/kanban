'use client'

import React, { DragEventHandler, useState } from 'react'
import { FaCircle } from "react-icons/fa";
import { motion, PanInfo } from "framer-motion";
import { IColumns, ITask, ITaskData } from '@/lib/type';

export const Tasks = () => {
	// Define draggable item component
	const [tasks, setTasks] = useState<ITask[]>(DEFAULT_CARDS);

	return (
		<div className="h-screen w-full bg-neutral-900 text-neutral-50">
			<div className="flex h-full w-full gap-3 overflow-scroll p-12">
				<Column
					title="Backlog"
					column="backlog"
					headingColor="text-neutral-500"
					tasks={tasks}
					setTasks={setTasks}
				/>
				<Column
					title="TODO"
					column="todo"
					headingColor="text-yellow-200"
					tasks={tasks}
					setTasks={setTasks}
				/>
				<Column
					title="In progress"
					column="doing"
					headingColor="text-blue-200"
					tasks={tasks}
					setTasks={setTasks}
				/>
				<Column
					title="Complete"
					column="done"
					headingColor="text-emerald-200"
					tasks={tasks}
					setTasks={setTasks}
				/>
				{/* <BurnBarrel setCards={setCards} /> */}
			</div>
		</div>
	);
};

const Column: React.FC<IColumns> = ({
	title,
	headingColor,
	column,
	tasks,
	setTasks,
}) => {
	const [active, setActive] = useState(false);
	const filteredTasks = tasks.filter((c: ITask) => c.column === column);

	const handleDragStart = (e: any, task: ITask) => {
		console.log(e);
		console.log(task);
		e.dataTransfer.setData("cardId", task.id);
	};

	// set highlight column active on drag
	const handleDragOver: DragEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();
		setActive(true);
	};

	// set highlight column active=false on drag
	const handleDragLeave: DragEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();
		setActive(false);
	};

	// set highlight column active=false on drag
	const handleDragEnd: DragEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();
		setActive(false);
	};

	return (
		<div className="w-56 shrink-0">
			<div className="mb-3 flex items-center justify-between">
				<h3 className={`font-medium ${headingColor}`}>{title}</h3>
				<span className="rounded text-sm text-neutral-400">
					{filteredTasks.length}
				</span>
			</div>
			<div
				onDrop={handleDragEnd}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				className={`h-full w-full transition-colors ${
					active ? "bg-neutral-800/50" : "bg-neutral-800/0"
				}`}
			>
				{filteredTasks.map((c: ITask) => {
					return <Task key={c.id} {...c} handleDragStart={handleDragStart} />;
				})}
				<DropIndicator beforeId="-1" column={column} />
				{/* <DropIndicator beforeId={null} column={column} />
				<AddCard column={column} setCards={setCards} /> */}
			</div>
		</div>
	);
};

const Task: React.FC<ITask> = ({ title, id, column, handleDragStart }) => {
	return (
		<>
			<DropIndicator beforeId={id} column={column} />
			<motion.div
				layout
				layoutId={id}
				draggable="true"
				onDragStart={(e) =>
					handleDragStart && handleDragStart(e, {title, id, column})
				}
				className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
			>
				<p className="text-sm text-neutral-100">{title}</p>
			</motion.div>
		</>
	);
};

const DropIndicator = ({ beforeId, column }: {beforeId : any, column: any}) => {
	return (
		<div
			// which card is dragging near
			data-before={beforeId || "-1"}
			// what column
			data-column={column}
			className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
		/>
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
	// DONE
	{
		title: "Set up DD dashboards for Lambda listener",
		id: "10",
		column: "done",
	},
];


export default Task