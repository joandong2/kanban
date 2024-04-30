import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { IBoard, IColumns } from "./type";

type KanbanStore = {
	boardCode: string;
	setBoardCode: (boardCode: string) => void;
	// setBoard: (board: IColumns[]) => void;
};

export const useKanbanStore = create<KanbanStore>()(
	devtools(
		(set) => ({
			boardCode: "",
			setBoardCode: (boardCode) => set(() => ({ boardCode })),
			// board: [],
			// setBoard: (board) => set(() => ({ board: board })),
		}),
		{
			name: "kanban-app", // name of the item in the storage (must be unique)
			//storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
			//skipHydration: false,
		}
	)
);
