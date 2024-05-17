'use client'

import { useKanbanStore } from '@/lib/store';
import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar';
import Header from './Header';
import { getBoards, getTasks } from "@/lib/_actions";
import Tasks from './Task';

const Board = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const board = useKanbanStore((state) => state.board);
	const tasks = useKanbanStore((state) => state.tasks);
	const setBoards = useKanbanStore((state) => state.setBoards);
	const setBoard = useKanbanStore((state) => state.setBoard);
	const setTasks = useKanbanStore((state) => state.setTasks);

	useEffect(() => {
		const fetchBoards = async () => {
			// Fetch all boards
			setLoading(true);
			const boardsRes = await getBoards();
			if (boardsRes) {
				setBoards(boardsRes);
				setBoard(boardsRes[0]);
			}
		};
		fetchBoards();
	}, []);

	useEffect(() => {
		const fetchBoard = async () => {
			const tasks = await getTasks(board.boardCode);
			if (tasks) {
				setTasks(tasks);
			}
		};
		fetchBoard();
	}, [board.boardCode]);

	// console.log("board", board);
	// console.log('boards', boards)

  	return (
			<>
				<Header board={board}/>
				<div className="flex">
					<Sidebar />
					{board && tasks ? <Tasks tasks={tasks} columns={board.columns} setTasks={setTasks}/> : "No active board"}
				</div>
			</>
		);
}

export default Board