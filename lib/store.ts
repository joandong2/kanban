import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { IColumns } from "./type";

type KanbanStore = {
	boardCode: string;
	board: IColumns;
	setBoard: (action: string) => void;
};

export const useKanbanStore = create<KanbanStore>()(
	devtools(
		(set) => ({
			boardCode: "",
			board: {
				name: "",
			},
			setBoard: (boardCode) => set(() => ({ boardCode })),
		}),
		{
			name: "kanban-app", // name of the item in the storage (must be unique)
			//storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
			//skipHydration: false,
		}
	)
);
