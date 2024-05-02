'use client'

import { useKanbanStore } from '@/lib/store';
import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar';
import Header from './Header';
import { getBoards } from "@/lib/_actions";

const Board = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const board = useKanbanStore((state) => state.board);
	const boards = useKanbanStore((state) => state.boards);
	const boardCode = useKanbanStore((state) => state.boardCode);
	const setBoardCode = useKanbanStore((state) => state.setBoardCode);
	const setBoards = useKanbanStore((state) => state.setBoards);
	const setBoard = useKanbanStore((state) => state.setBoard);
	const setColumns = useKanbanStore((state) => state.setColumns);

	useEffect(() => {
		const fetchBoards = async () => {
			// Fetch all boards
			setLoading(true)
			const boardsRes = await getBoards();
			if (boardsRes) {
				setBoards(boardsRes)
				setBoard(boardsRes[0]);
			}
		};
		fetchBoards();
	}, []);

	console.log('boards', boards)

  	return (
			<>
				<Header board={board}/>
				<div className="flex">
					<Sidebar />
					{/*board ? <Tasks board={board} /> : "No active board"} */}
				</div>
			</>
		);
}

export default Board