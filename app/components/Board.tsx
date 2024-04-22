'use client'

import { useKanbanStore } from '@/lib/store';
import React, { useEffect } from 'react'
import Tasks from './Task';
import Sidebar from './Sidebar';
import { IBoard } from '@/lib/type';
import Header from './Header';

const Board = (boards : {boards: IBoard[]}) => {;
    const board = useKanbanStore((state) => state.board);
    const setBoardCode = useKanbanStore((state) => state.setBoardCode);

	useEffect(() => {
		if(boards) {
			setBoardCode(boards.boards[0].boardCode);
		}
	}, [])

  	return (
		<>
			{/* <Header board={board} /> */}
			<div className="flex">
				<Sidebar boards={boards.boards} />
				{board ? <Tasks /> : "No active board"}
				<Tasks />
			</div>
		</>
	);
}

export default Board