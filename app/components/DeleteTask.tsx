import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { deleteBoard, deleteTask, getBoards, getTasks } from "@/lib/_actions";
import { IBoard, ITask } from "@/lib/type";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const DeleteBoard = ({
	board,
	task,
	setTasks,
	setIsTaskDeleteDialogOpen,
}: {
	board: IBoard;
	task: ITask;
	setTasks: (boards: ITask[]) => void;
	setIsTaskDeleteDialogOpen: (bool: boolean) => void;
}) => {
	const router = useRouter();

	const handleDelete = async () => {
		if (task.taskCode) {
			const res = await deleteTask(task.taskCode);
			if (res) {
				const tasks = await getTasks(board.boardCode);
				setTasks(tasks);
				toast.success("Task Deleted", {});
			}
		}
		setIsTaskDeleteDialogOpen(false);
	};

	return (
		<>
			<DialogContent className="bg-background">
				<DialogHeader>
					<DialogTitle className="text-[20px] mb-4 text-red-600">
						Delete this task?
					</DialogTitle>
					<span className="text-toggle !mb-[30px]">
						Are you sure you want to delete the '{task.title}' board? This
						action will remove all columns and tasks and cannot be reversed.
					</span>
					<span className="mt-14 flex align-middle items-center gap-2">
						<span
							onClick={handleDelete}
							className="w-[50%] rounded bg-[#ea5555] py-2 px-16 cursor-pointer text-white text-center"
						>
							Delete
						</span>
						<span
							onClick={() => setIsTaskDeleteDialogOpen(false)}
							className="w-[50%] rounded bg-[#efeff9] py-2 px-16 cursor-pointer text-[#635fc7] text-center"
						>
							Cancel
						</span>
					</span>
				</DialogHeader>
			</DialogContent>
		</>
	);
};

export default DeleteBoard;
