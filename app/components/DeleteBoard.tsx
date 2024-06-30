import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { deleteBoard, getBoards } from '@/lib/_actions';
import { IBoard } from '@/lib/type';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';

const DeleteBoard = ({
	setIsDeleteDialogOpen,
	setBoards,
	setBoard,
	board,
}: {
	setIsDeleteDialogOpen: (bool: boolean) => void;
	setBoards: (boards: IBoard[]) => void;
	setBoard: (boards: IBoard) => void;
	board: IBoard;
}) => {
	const router = useRouter();

	const handleDelete = async () => {
		setIsDeleteDialogOpen(true);
		await deleteBoard(board.boardCode);
		const boards = await getBoards();
		if (boards) {
			setBoards(boards);
			setBoard(boards[0])
			router.refresh();
			toast.success("Board Deleted", {});
		}
		setIsDeleteDialogOpen(false);
	};

	return (
		<DialogContent className="bg-background">
			<DialogHeader>
				<DialogTitle className="text-[20px] mb-4 text-red-600">
					Delete this board?
				</DialogTitle>
				<span className="text-toggle !mb-[30px]">
					Are you sure you want to delete the '{board.name}' board? This
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
						onClick={() => setIsDeleteDialogOpen(false)}
						className="w-[50%] rounded bg-[#efeff9] py-2 px-16 cursor-pointer text-[#635fc7] text-center"
					>
						Cancel
					</span>
				</span>
			</DialogHeader>
		</DialogContent>
	);
};

export default DeleteBoard