'use client'

import React, { useState } from 'react'
import Image from "next/image";
import clsx from 'clsx';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	useForm,
	SubmitHandler,
	useFieldArray,
	useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ColumnDataSchema } from '@/lib/schema';
import { AiFillDelete } from 'react-icons/ai';
import { createBoard, getBoard } from "@/lib/_actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IBoard } from '@/lib/type';
import Link from 'next/link';

type FormValues = z.infer<typeof ColumnDataSchema>;

const Sidebar = ({board, setBoard} : {board: any, setBoard: any}) => {
	const [hideSide, setHideSide] = useState<boolean>(false)
	const [open, setOpen] = useState<boolean>(false);
	const router = useRouter();

	console.log("board", );

	const {
		register,
		handleSubmit,
		watch,
		reset,
		control,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(ColumnDataSchema),
		defaultValues: {
			columnLists: [{ columnName: "" }],
		},
	});

	const { fields, append, prepend, remove, update, swap, move, insert } =
		useFieldArray({
			name: "columnLists", // unique name for your Field Array
			control, // control props comes from useForm (optional: if you are using FormContext)
		});

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


	const processAddBoard: SubmitHandler<FormValues> = async (data) => {
		const result = await createBoard(data);
		if (result?.status == "success") {
			setOpen(false);
			toast.success("Board Created", {});
			reset();
			router.refresh();
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
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
								{/* {boards &&
									boards.map((board: IBoard, index) => (
										<li key={index}>
											<Link className="" href={`/${board.boardCode.toLowerCase()}`}>
												{board.name}
											</Link>
										</li>
									))} */}
								<li>
									<DialogTrigger asChild className="border-none">
										<button>+ Create a New Board</button>
									</DialogTrigger>
								</li>
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
			<DialogContent className="bg-white">
				<DialogHeader>
					<DialogTitle className="text-[24px]">Add New Board</DialogTitle>
					<DialogDescription>
						<span className="flex flex-col">
							<form onSubmit={handleSubmit(processAddBoard)}>
								<span className="form-control w-full mb-2 flex flex-col">
									<span className="label-text text-[#7e88c3] font-medium">
										Name
									</span>
									<input
										className="input p-3 border rounded w-full mb-2"
										{...register("name")}
									/>
									{errors.name?.message && (
										<span className="text-sm text-red-400">
											{errors.name.message}
										</span>
									)}
								</span>
								<span className="columns" id="columns">
									<span className="label-text text-[#7e88c3] font-medium">
										Columns
									</span>
									{fields.map((field, index) => (
										<span className="flex gap-2 mb-1 w-full" key={index}>
											<input
												{...register(`columnLists.${index}.columnName`)}
												className="input p-3 border rounded w-full mb-2"
											/>
											<input
												type="hidden"
												{...register(`columnLists.${index}.columnCode`)}
												defaultValue={Math.random()
													.toString(36)
													.slice(1, 9)
													.toUpperCase()}
											/>
											<span
												onClick={() => remove(index)}
												className="total col-span-1 cursor-pointer flex flex-col justify-center"
											>
												<AiFillDelete className="text-[18px] text-[#888eb0]" />
											</span>
										</span>
									))}
									<button
										type="button"
										className="btn text-[#7e88c3] font-bold bg-[#f9fafe] rounded-[25px] w-full border-none mb-4 py-3 mt-5"
										onClick={() =>
											append({
												columnName: "",
												columnCode: "",
											})
										}
									>
										+ Add New Column
									</button>
								</span>
								<button
									type="submit"
									className="text-[#fff] font-bold bg-[#7c5dfa] rounded-[25px] py-3 px-8 border-none w-full"
								>
									Create New Board
								</button>
							</form>
						</span>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

export default Sidebar