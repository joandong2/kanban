'use client'

import React, { useState } from 'react'
import Image from "next/image";
import clsx from 'clsx';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Sidebar = () => {
	const [hideSide, setHideSide] = useState<boolean>(false)

	const hideSidebar = () => {
		setHideSide(!hideSide);
	}

	const toggleClass = clsx({
		"transition-all duration-1500 h-screen pt-4 flex flex-col bg-white h-screen pointer mt-[-86px] pt-[86px] relative z-1":
			true,
		"opacity-0 w-0": hideSide,
		"opacity-100 w-[260px]": !hideSide,
	});

	const toggleEye = clsx({
		"z-[99] absolute bottom-20 cursor-pointer bg-[#635fc7] text-white text-[18px] py-3 px-5 rounded-r-[15px]": true,
		"hidden": !hideSide,
		"visible": hideSide,
	});

	console.log(hideSide)

	return (
		<span className="relative">
			<span onClick={hideSidebar} className={toggleEye}>
				<FaEye />
			</span>
			<span className={toggleClass}>
				<span className="flex justify-between flex-col h-full ">
					<span>
						<ul className="flex flex-col gap-1 sidebar">
							<li className="uppercase">All Boards (3)</li>
							<li className="active flex gap-2">
								<Image
									src="/assets/icon-board.svg"
									alt="Image Best Gear"
									width="20"
									height="20"
									className=""
								/>{" "}
								Platform Launch
							</li>
							<li className="flex gap-2">
								<Image
									src="/assets/icon-board.svg"
									alt="Image Best Gear"
									width="20"
									height="20"
								/>{" "}
								Roadmap
							</li>
							<li className="flex gap-2">
								<Image
									src="/assets/icon-board.svg"
									alt="Image Best Gear"
									width="20"
									height="20"
								/>{" "}
								Marketing Plan
							</li>
							<li className="!text-[#635fc7]">+ Create A New Board</li>
						</ul>
					</span>
					<span className="relative p-12 flex flex-col gap-3">
						<span></span>
						<span
							onClick={hideSidebar}
							className="cursor-pointer flex items-center gap-3 text-[#828fa3]"
						>
							<FaEyeSlash />
							Hide Sidebar
						</span>
					</span>
				</span>
			</span>
		</span>
	);
}

export default Sidebar