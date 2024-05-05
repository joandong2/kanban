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
	const boards = useKanbanStore((state) => state.boards);
	const tasks = useKanbanStore((state) => state.tasks);
	//const boardCode = useKanbanStore((state) => state.boardCode);
	//const setBoardCode = useKanbanStore((state) => state.setBoardCode);
	const setBoards = useKanbanStore((state) => state.setBoards);
	const setBoard = useKanbanStore((state) => state.setBoard);
	const setColumns = useKanbanStore((state) => state.setColumns);
	const setTasks = useKanbanStore((state) => state.setTasks);

	useEffect(() => {
		const fetchBoards = async () => {
			// Fetch all boards
			setLoading(true);
			const boardsRes = await getBoards();
			if (boardsRes) {
				const tasks = await getTasks();
				setBoards(boardsRes);
				setBoard(boardsRes[0]);
				if(tasks) {
					setTasks(tasks);
				}
			}
		};
		fetchBoards();
	}, []);

	// console.log("board", board);
	// console.log('boards', boards)
	// console.log("tasks", tasks);

  	return (
			<>
				<Header board={board}/>
				<div className="flex">
					<Sidebar />
					{board && tasks ? <Tasks tasks={tasks} columns={board.columns}/> : "No active board"}
				</div>
			</>
		);
}

export default Board