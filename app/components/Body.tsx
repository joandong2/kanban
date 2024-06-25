'use client'

import React from 'react'
import { Toaster } from 'react-hot-toast';
import { plusJakartaSans } from '../utils/font';
import { useKanbanStore } from '@/lib/store';

const Body = ({ children }: { children: React.ReactNode }) => {

    const theme = useKanbanStore((state) => state.theme);

	return (
		<body className={`${plusJakartaSans.variable} h-[100%] ${theme ? 'dark' : 'light' }`}>
			<Toaster position="top-right" />
			{children}
		</body>
	);
};

export default Body