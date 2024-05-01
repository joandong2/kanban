'use client'

import { useKanbanStore } from '@/lib/store';
import React, { useEffect, useState } from 'react'
import Tasks from './Task';
import Sidebar from './Sidebar';
import { IBoard, IColumns } from '@/lib/type';
import Header from './Header';
import { getBoards, getBoardAndColumns } from "@/lib/_actions";

const Board = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const board = useKanbanStore((state) => state.board);
	const columns = useKanbanStore((state) => state.columns);
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
				setBoardCode(boardsRes[0].boardCode);
			}
		};
		fetchBoards();
	}, [boardCode]);

	useEffect(() => {
		const fetchBoard = async () => {
			try {
				const res = await getBoardAndColumns(boardCode);
				if (res && res.board) {
					setBoard(res.board);
					setColumns(res.columns);
					setLoading(false);
				} else {
					console.warn("No board found for the specified boardCode.");
				}
			} catch (error) {
				console.error("Error fetching board and columns:", error);
			}
		};

		fetchBoard();
	}, [boardCode]);

	//console.log("boardcode", boards[0].boardCode);
	// console.log("boardcode", boardCode);
	//console.log("board", board);
	// console.log("boards", boards);

  	return (
			<>
				{/* <Header board={board} columns={columns}/> */}
				{loading ? (
					<p>Loading...</p>
				) : (
					<>
						<Header board={board}/>
						<div className="flex">
							<Sidebar />
							{/*board ? <Tasks board={board} /> : "No active board"} */}
						</div>
					</>
				)}
			</>
		);
}

export default Board