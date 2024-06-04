"use client";

import React, { useState } from "react";
import Image from "next/image";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteBoard from "./DeleteBoard";
import { Dialog } from "@/components/ui/dialog";
import EditBoard from "./EditBoard";
import { useKanbanStore } from "@/lib/store";
import AddTask from "./AddTask";
import Task from "./Task";

const TaskAction = () => {
	const [position, setPosition] = useState("bottom right");
	const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
	//const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const setBoards = useKanbanStore((state) => state.setBoards);
	const setBoard = useKanbanStore((state) => state.setBoard);
	const setTasks = useKanbanStore((state) => state.setTasks);
	const setTask = useKanbanStore((state) => state.setTask);
	const board = useKanbanStore(state => state.board)
	const task = useKanbanStore(state => state.task)
	const isEditDialogOpen = useKanbanStore((state) => state.isEditDialogOpen);
	const setIsEditDialogOpen = useKanbanStore((state) => state.setIsEditDialogOpen)
	const isTaskDialogOpen = useKanbanStore((state) => state.isTaskDialogOpen);
	const setIsTaskDialogOpen = useKanbanStore(
		(state) => state.setIsTaskDialogOpen
	);

	return (
		<span className="flex gap-5 items-center cursor-pointer py-7 px-9">
			<span
				className="bg-[#635FC7] text-white rounded-[55px] py-2 px-6 font-medium"
				onClick={() => setIsAddTaskDialogOpen(true)}
			>
				{" "}
				+ Add New Task
			</span>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Image
						src="/assets/icon-vertical-ellipsis.svg"
						alt="Image Best Gear"
						height="10"
						width="10"
						className="h-[20px] w-[6px]"
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-[190px] mt-[10px] py-4 px-4 rounded-[5px] bg-white text-black mr-[45px]">
					<DropdownMenuRadioGroup
						value={position}
						onValueChange={setPosition}
						className="flex flex-col gap-1"
					>
						<DropdownMenuRadioItem
							value="top"
							className="cursor-pointer p-0"
							onClick={() => setIsEditDialogOpen(true)}
						>
							Edit
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem
							value="bottom"
							className="text-red-800 cursor-pointer p-0"
							onClick={() => setIsDeleteDialogOpen(true)}
						>
							Delete
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
				{board ? (
					<AddTask
						setIsAddTaskDialogOpen={setIsAddTaskDialogOpen}
						setTasks={setTasks}
						board={board}
					/>
				) : (
					""
				)}
			</Dialog>
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				{board ? (
					<EditBoard
						setIsEditDialogOpen={setIsEditDialogOpen}
						setBoards={setBoards}
						setBoard={setBoard}
						board={board}
					/>
				) : (
					""
				)}
			</Dialog>
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				{board ? (
					<DeleteBoard
						setIsDeleteDialogOpen={setIsDeleteDialogOpen}
						setBoards={setBoards}
						setBoard={setBoard}
						board={board}
					/>
				) : (
					""
				)}
			</Dialog>
			<Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
				{board ? (
					<Task task={task} board={board} setTask={setTask} setTasks={setTasks}/>
				):(
					""
				)}
			</Dialog>
		</span>
	);
};

export default TaskAction;
