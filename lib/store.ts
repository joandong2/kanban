import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type KanbanStore = {
	board: string;
	setBoard: (action: string) => void;
};

export const useKanbanStore = create<KanbanStore>()(
	devtools(
		(set) => ({
			board: "",
			setBoard: (board) => set(() => ({ board: board })),
		}),
		{
			name: "kanban-app", // name of the item in the storage (must be unique)
			//storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
			//skipHydration: false,
		}
	)
);
