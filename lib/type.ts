import { Dispatch, SetStateAction } from "react";

export interface ITaskData {
	id: string;
	title: string;
	column: string;
}

export interface IBoard {
	id: string;
	boardCode: string;
	name: string;
	columns?: IColumns[];
}

export interface IColumns {
	board?: IBoard;
	id?: string;
	columnCode?: string;
	boardCode?: string;
	name?: string;
	column?: string;
	tasks?: ITask[];
	position?: number;
	setTasks?: Dispatch<SetStateAction<ITask[]>>;
}

export interface ITask {
	id?: string;
	title?: string;
	taskCode?: string;
	description?: string;
	order: number;
	//position?: number | undefined;
	handleDragStart?: (e: React.DragEvent, info: ITask) => void;
}