'use client'

import { useKanbanStore } from '@/lib/store';
import React from 'react'
import Sidebar from './Sidebar';

const Board = () => {
    const board = useKanbanStore((state) => state.board);
	const setBoard = useKanbanStore((state) => state.setBoard);

  return (
		<>
			<Sidebar board={board} setBoard={setBoard} />
		</>
	);
}

export default Board