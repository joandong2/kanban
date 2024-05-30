import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { IBoard, IColumns, ITask } from "./type";

type KanbanStore = {
	boardCode: string;
	boards: IBoard[];
	board: IBoard;
	columns: IColumns[];
	tasks: ITask[];
	task: ITask;
	setBoardCode: (boardCode: string) => void;
	setBoards: (boards: IBoard[]) => void;
	setBoard: (board: IBoard) => void;
	setColumns: (columns: IColumns[]) => void;
	setTasks: (tasks: ITask[]) => void;
	setTask: (tasks: ITask) => void;
	isEditDialogOpen: boolean;
	setIsEditDialogOpen: (status: boolean) => void;
};

export const useKanbanStore = create<KanbanStore>()(
	devtools(
		(set) => ({
			isEditDialogOpen: false,
			setIsEditDialogOpen: (status) =>
				set(() => ({ isEditDialogOpen: status })),
			boardCode: "",
			boards: [],
			board: {
				id: "",
				boardCode: "",
				name: "",
			},
			columns: [],
			tasks: [],
			task: {
				title: "",
				description: "",
				column: "",
				order: 0,
			},
			setTask: (task) => set(() => ({ task })),
			setBoardCode: (boardCode) => set(() => ({ boardCode })),
			setBoards: (boards) => set(() => ({ boards })),
			setBoard: (board) => set(() => ({ board })),
			setColumns: (columns) => set(() => ({ columns })),
			setTasks: (tasks) => set(() => ({ tasks })),
		}),
		{
			name: "kanban-app", // name of the item in the storage (must be unique)
			//storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
			//skipHydration: false,
		}
	)
);
