import React from 'react'
import Image from "next/image";
import NewTask from './NewTask';
import { IBoard } from '@/lib/type';

const Header = ({board} : {board: string}) => {

  return (
		<span className="relative py-6 px-10 flex justify-between border-b border-[#e4ebfa] bg-white z-50">
			<span className="flex gap-4 md:gap-0">
				<span className="hidden md:block w-[260px]">
					<Image
						src="/assets/logo-dark.svg"
						alt="Image Best Gear"
						width="153"
						height="26"
					/>{" "}
				</span>
				<span className="block md:hidden">
					<Image
						src="/assets/logo-mobile.svg"
						alt="Image Best Gear"
						width="25"
						height="25"
					/>{" "}
				</span>
				<span className="border-r-1">
					<p className="text-[20px] font-bold">
						{board ? board : "No active board!"}
					</p>
				</span>
			</span>
			<span>
				<NewTask />
			</span>
		</span>
	);
}

export default Header