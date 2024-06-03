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
	count?: number;
	position?: number;
	setTasks?: (tasks: ITask[]) => void;
	setTask?: (tasks: ITask) => void;
	setIsTaskDialogOpen?: (status: boolean) => void;
}

export interface ITask {
	id?: string;
	title?: string;
	taskCode?: string;
	description?: string;
	column: string;
	order: number;
	subTasks?: ISubTask[];
	//position?: number | undefined;
	handleDragStart?: (e: React.DragEvent, info: ITask) => void;
}

export interface ISubTask {
	title: string
}