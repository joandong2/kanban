import React, { Dispatch, SetStateAction, useState } from 'react'
import { IColumns, ITask } from '@/lib/type';
import { getTask, updateTaskOrder } from '@/lib/_actions';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaCircle } from 'react-icons/fa';

export const Tasks = ({
	columns,
	tasks,
	setTasks,
	boardCode,
	setIsEditDialogOpen,
	setIsTaskDialogOpen,
	setTask,
}: {
	columns: IColumns[] | undefined;
	tasks: ITask[];
	setTasks: (tasks: ITask[]) => void;
	boardCode: string;
	setIsEditDialogOpen: (status: boolean) => void;
	setIsTaskDialogOpen: (status: boolean) => void;
	setTask: (task: ITask) => void;
}) => {
	return (
		<span className="flex w-full gap-6 px-8 py-6 overflow-x-auto">
			{columns &&
				columns.map((column, index) => (
					<Column
						key={index}
						column={column.column}
						name={column.name}
						tasks={tasks}
						count={index}
						setTasks={setTasks}
						setTask={setTask}
						setIsTaskDialogOpen={setIsTaskDialogOpen}
						boardCode={boardCode}
					/>
				))}
			<span
				className="mt-8 rounded-[10px] min-w-[280px] bg-[#f0effa] py-5 flex justify-center items-center cursor-pointer"
				onClick={() => setIsEditDialogOpen(true)}
			>
				+ New Columnn
			</span>
		</span>
	);
};


const Column: React.FC<IColumns> = ({
	tasks,
	column,
	setTasks,
	setTask,
	count,
	name,
	boardCode,
	setIsTaskDialogOpen,
}) => {
	const router = useRouter();

	const handleDragStart = (e: React.DragEvent, task: ITask) => {
		e.dataTransfer.setData("id", task.order.toString() || "");
		e.dataTransfer.setData("task_code", task.taskCode || "");
		e.dataTransfer.setData("current_column", task.column || "");
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

	const handleOnClickTask = async (e: string) => {
		//console.log(e);
		setIsTaskDialogOpen && setIsTaskDialogOpen(true);
		const task = await getTask(e);
		if(task) {
			setTask && setTask(task.task[0]);
		}
	}

	// udpate task data
	const handleSpotDrop = async (e: React.DragEvent, position: number) => {
		const old_position = e.dataTransfer.getData("id");
		const task_code = e.dataTransfer.getData("task_code");
		const old_column = e.dataTransfer.getData("current_column");

		// console.log("current column", old_column);
		// console.log("current position", old_position);
		// console.log("task code", task_code);
		// console.log("spot drop column", column);
		// console.log("spot drop position", position);

		if (task_code && old_column && column && boardCode) {
			const tasks = await updateTaskOrder(
				task_code,
				position,
				Number(old_position),
				column,
				old_column,
				boardCode
			);

			if (tasks && setTasks) {
				setTasks(tasks);
				router.refresh();
			}
		}
	};

	return (
		<span
			className="flex flex-col w-[280px] min-w-[280px]"
			onDrop={(e) => handleColumnDrop(e)}
			onDragOver={(e) => handleDragOver(e)}
		>
			<h2>
				<span className="flex gap-2 items-center">
					<span className="flex gap-1 items-center">
						<FaCircle className={"color-" + count} />{" "}
						<span className="capitalize">{name}</span>
					</span>
				</span>
			</h2>
			<DropSpot handleSpotDrop={handleSpotDrop} position={0} />
			{tasks &&
				tasks.map(
					(task: ITask, index) =>
						task.column == column && (
							<>
								<motion.div
									layout
									className="flex flex-col rounded-[5px] bg-white"
								>
									<span
										draggable="true"
										onDragStart={(e) =>
											handleDragStart && handleDragStart(e, { ...task })
										}
										className="flex flex-col cursor-grab rounded border-neutral-700 bg-white-800 active:cursor-grabbing px-5 py-5 shadow-lg"
										onClick={() =>
											task.taskCode && handleOnClickTask(task.taskCode)
										}
									>
										<span className="leading-4 mb-2">{task.title}</span>
										<span className="text-[#828fa3] font-bold text-[12px]">
											{`0 of 3 subtasks`}
										</span>
									</span>
								</motion.div>
								<DropSpot
									handleSpotDrop={handleSpotDrop}
									position={task.order + 1}
								/>
							</>
						)
				)}
		</span>
	);
};

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
			className={`rounded border text-black-700 p-1 w-full bg-violet-400 ${
				active ? "active_drop" : "hide_drop"
			}`}
		>
			{' '}
		</span>
	);
};

export default Tasks