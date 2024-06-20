'use client'

import React, { useState } from 'react'
import clsx from 'clsx';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { TbLayoutBoardSplit } from "react-icons/tb";
import { createBoard, getBoardAndColumns, getBoards } from "@/lib/_actions";
import toast from "react-hot-toast";
import { IBoard } from '@/lib/type';
import { useKanbanStore } from "@/lib/store";
import ToggleSwitch from './ToggleSwitch';

type FormValues = z.infer<typeof ColumnDataSchema>;

const Sidebar = () => {
	const [hideSide, setHideSide] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const boards = useKanbanStore((state) => state.boards);
	const board = useKanbanStore((state) => state.board);
	const setBoardCode = useKanbanStore((state) => state.setBoardCode);
	const setBoard = useKanbanStore((state) => state.setBoard);
	const setBoards = useKanbanStore((state) => state.setBoards);

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
	};

	const toggleClass = clsx({
		"transition-all duration-1500 h-full h-screen overflow-y-hidden pt-4 flex flex-col bg-white pointer mt-[-86px] pt-[113px] relative z-1":
			true,
		"opacity-0 w-0": hideSide,
		"opacity-100 w-[260px] max-w-[260px] xl:w-[300px] xl:min-w-[300px]":
			!hideSide,
	});

	const toggleEye = clsx({
		"z-[99] absolute bottom-20 cursor-pointer bg-[#635fc7] text-white text-[18px] py-3 px-5 rounded-r-[15px]":
			true,
		hidden: !hideSide,
		visible: hideSide,
	});

	const processAddBoard: SubmitHandler<FormValues> = async (data) => {

		const result = await createBoard(data);
		// console.log(result)
		if (result) {
			setOpen(false);
			const res = await getBoards();
			if(res) {
				setBoards(res);
				setBoard(res[res.length - 1])
				reset();
				toast.success("Board Created", {});
			}
		}
	};

	const handleBoardLinks = async (e: string) => {
		//console.log(e)
		setBoardCode(e);
		const board = await getBoardAndColumns(e);
		if (board) {
			setBoard(board);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<span className="relative">
				<span onClick={hideSidebar} className={toggleEye}>
					<FaEye />
				</span>
				<span className={toggleClass}>
					<span className="flex justify-between flex-col h-full ">
						<span>
							<ul className="flex flex-col sidebar">
								<li className="uppercase ml-6 tracking-[2.4px] text-[12px] text-medium-grey-#828FA3 mb-2">
									<span>All Boards ({boards.length})</span>
								</li>
								{boards
									? boards.map((res: IBoard, index: number) => (
											<li
												key={index}
												className={`flex h-[48px] w-[90%] items-center gap-3 rounded-r-[100px] px-6 bg-purple-#635FC7 text-white ${
													res.boardCode === board.boardCode ? "active" : ""
												}`}
											>
												<TbLayoutBoardSplit className="text-[#828fa3] text-[24px]" />
												<span
													onClick={() =>
														handleBoardLinks(res.boardCode.toLowerCase())
													}
												>
													{res.name}
												</span>
											</li>
									  ))
									: "No boards created!"}
								<li className="flex h-[48px] w-[90%] items-center gap-3 rounded-r-[100px] px-6 bg-purple-#635FC7 text-white">
									<DialogTrigger asChild className="border-none">
										<span className="fle">
											<TbLayoutBoardSplit className="text-[#828fa3] text-[24px]" />
											<button>+ Create a New Board</button>
										</span>
									</DialogTrigger>
								</li>
							</ul>
						</span>
						<span className="relative py-12 px-8 flex flex-col gap-3 justify-center w-full">
							<span>
								<ToggleSwitch />
							</span>
							<span
								onClick={hideSidebar}
								className="cursor-pointer flex items-center gap-3 text-[#828fa3] justify-center"
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
					<DialogTitle className="text-[16px] mb-4">Add New Board</DialogTitle>
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
												{...register(`columnLists.${index}.columnCode`)}
												className="input p-3 border rounded w-full mb-2"
												type="hidden"
												defaultValue={Math.random().toString(36).slice(2)}
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
};

export default Sidebar
