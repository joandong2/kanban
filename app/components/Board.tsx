"use client";

import { useKanbanStore } from "@/lib/store";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { getBoards, getTasks } from "@/lib/_actions";
import Tasks from "./Tasks";

const Board = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const board = useKanbanStore((state) => state.board);
	//const boards = useKanbanStore((state) => state.boards);
	const theme = useKanbanStore((state) => state.theme);
	const tasks = useKanbanStore((state) => state.tasks);
	const setBoards = useKanbanStore((state) => state.setBoards);
	const setBoard = useKanbanStore((state) => state.setBoard);
	const setTask = useKanbanStore((state) => state.setTask);
	const setTasks = useKanbanStore((state) => state.setTasks);
	const setIsEditDialogOpen = useKanbanStore(
		(state) => state.setIsEditDialogOpen
	);
	const setIsTaskDialogOpen = useKanbanStore(
		(state) => state.setIsTaskDialogOpen
	);

	useEffect(() => {
		const fetchBoards = async () => {
			setLoading(true);
			const boardsRes = await getBoards();
			if (boardsRes) {
				setBoards(boardsRes);
				setBoard(boardsRes[0]);
			}
			setLoading(false);
		};
		fetchBoards();
	}, []);

	useEffect(() => {
		const fetchBoard = async () => {
			if (board?.boardCode) {
				const tasksRes = await getTasks(board.boardCode);
				if (tasksRes) {
					setTasks(tasksRes);
				}
			}
		};
		fetchBoard();
	}, [board?.boardCode,setTasks]);

	return (
		<div>
			<Header board={board} />
			<div className="flex">
				<Sidebar />
				{board && tasks ? (
					<Tasks
						tasks={tasks}
						columns={board.columns}
						setTasks={setTasks}
						setTask={setTask}
						boardCode={board?.boardCode}
						setIsEditDialogOpen={setIsEditDialogOpen}
						setIsTaskDialogOpen={setIsTaskDialogOpen}
					/>
				) : (
					<span className="p-8">No active board!</span>
				)}
			</div>
		</div>
	);
};

export default Board;
