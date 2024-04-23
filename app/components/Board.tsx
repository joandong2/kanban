'use client'

import { useKanbanStore } from '@/lib/store';
import React, { useEffect, useState } from 'react'
import Tasks from './Task';
import Sidebar from './Sidebar';
import { IBoard } from '@/lib/type';
import Header from './Header';
import { getColumns, getBoards } from "@/lib/_actions";

const Board = () => {
	const [boards, setBoards] = useState<IBoard[]>([]);
	const board = useKanbanStore((state) => state.board)
	const boardCode = useKanbanStore((state) => state.boardCode);
    const setBoard = useKanbanStore((state) => state.setBoard);
	const setBoardCode = useKanbanStore((state) => state.setBoardCode);

	useEffect(() => {
		const fetchBoards = async () => {
			// Fetch all boards
			const boardsRes = await getBoards();
			if (boardsRes) {
				setBoards(boardsRes);
				setBoardCode(boardsRes[0].boardCode);
			}
		};
		fetchBoards();
	}, [boardCode]);

	useEffect(() => {
		const fetchBoard = async () => {
			// Fetch all boards
			const res = await getColumns(boardCode);
			if (res) {
				setBoard(res);
			}
		};
		fetchBoard();
	}, [])

	//console.log("boardcode", boards[0].boardCode);
	console.log("boardcode", boardCode);
	console.log("board", board);
	console.log("boards", boards);

  	return (
			<>
				<Header board={board} />
				<div className="flex">
					<Sidebar boards={boards} />
					{board ? <Tasks board={board} /> : "No active board"}
				</div>
			</>
		);
}

export default Board