import React from 'react'
import Image from "next/image";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  return (
		<span className="absolute top-0 left-0 z-[-1] flex flex-col bg-white w-[260px] h-screen pt-24">
			<span className="flex justify-between flex-col h-full">
				<span>
					<ul className="flex flex-col gap-1 sidebar">
						<li>All Boards (3)</li>
						<li className="active">
							<Image
								src="/assets/icon-board.svg"
								alt="Image Best Gear"
								width="24"
								height="10"
								className=""
							/>{" "}
							Platform Launch
						</li>
						<li className="">
							<Image
								src="/assets/icon-board.svg"
								alt="Image Best Gear"
								width="24"
								height="10"
							/>{" "}
							Roadmap
						</li>
						<li className="flex gap-2">
							<Image
								src="/assets/icon-board.svg"
								alt="Image Best Gear"
								width="24"
								height="10"
							/>{" "}
							Marketing Plan
						</li>
						<li className="!text-[#635fc7]">+ Create A New Board</li>
					</ul>
				</span>
				<span className="p-12 flex flex-col gap-3">
					<span></span>
					<span>Hide Sidebar</span>
				</span>
			</span>

			<Drawer direction="left">
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent>
					<span className="absolute top-0 left-0 z-[-1] flex flex-col bg-white w-[260px] h-screen pt-24">
			<span className="flex justify-between flex-col h-full">
				<span>
					<ul className="flex flex-col gap-1 sidebar">
						<li>All Boards (3)</li>
						<li className="active">
							<Image
								src="/assets/icon-board.svg"
								alt="Image Best Gear"
								width="24"
								height="10"
								className=""
							/>{" "}
							Platform Launch
						</li>
						<li className="">
							<Image
								src="/assets/icon-board.svg"
								alt="Image Best Gear"
								width="24"
								height="10"
							/>{" "}
							Roadmap
						</li>
						<li className="flex gap-2">
							<Image
								src="/assets/icon-board.svg"
								alt="Image Best Gear"
								width="24"
								height="10"
							/>{" "}
							Marketing Plan
						</li>
						<li className="!text-[#635fc7]">+ Create A New Board</li>
					</ul>
				</span>
				<span className="p-12 flex flex-col gap-3">
					<span></span>
					<span>Hide Sidebar</span>
				</span>
			</span>

			<Drawer direction="left">
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent className="w-240px">

				</DrawerContent>
			</Drawer>
		</span>

				</DrawerContent>
			</Drawer>
		</span>
	);
}

export default Sidebar