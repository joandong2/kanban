import React from 'react'
import Image from "next/image";
import { IBoard, IColumns } from '@/lib/type';
import TaskAction from './TaskAction';

// destructure props
const Header = ({board, }: {board: IBoard}) => {
  	return (
			<span className="relative flex justify-between border-[#e4ebfa] bg-white z-50">
				<span className="flex gap-4 md:gap-0">
					<span className="hidden md:block w-[261px] border-r-[1px] border-solid border-[#e4ebfa] py-2 px-9 xl:w-[301px] xl:min-w-[301px]">
						<span className="p-6">
							<Image
								src="/assets/logo-dark.svg"
								alt="Image Best Gear"
								width="153"
								height="26"
							/>{" "}
						</span>
					</span>
					<span className="block md:hidden">
						<Image
							src="/assets/logo-mobile.svg"
							alt="Image Best Gear"
							width="25"
							height="25"
						/>{" "}
					</span>
					<span className="border-r-1 py-7 px-9">
						<p className="text-[20px] font-bold">
							{board ? board.name : "No active board!"}
						</p>
					</span>
				</span>
				<span>
					<TaskAction />
				</span>
			</span>
		);
}

export default Header