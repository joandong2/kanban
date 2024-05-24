"use client";

import React, { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NewTask = () => {
	const [position, setPosition] = useState("bottom right");

	return (
		<span className="flex gap-5 items-center cursor-pointer py-7 px-9">
			<span className="bg-[#635FC7] text-white rounded-[55px] py-2 px-6 font-medium">
				{" "}
				+ Add New Task
			</span>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Image
						src="/assets/icon-vertical-ellipsis.svg"
						alt="Image Best Gear"
						height="10"
						width="10"
						className="h-[20px] w-[6px]"
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-[158px] py-2 px-4 rounded-[5px] bg-white text-black mr-[45px]">
					<DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
						<DropdownMenuRadioItem value="top" className="cursor-pointer p-0">Edit</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="bottom" className="text-red-800 cursor-pointer p-0">Delete</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</span>
	);
};

export default NewTask;
