import { Dispatch, SetStateAction } from "react";

export interface IColumns {
	id: string;
	columnCode: any;
	name: string;
	position?: number;
	setTasks?: Dispatch<SetStateAction<ITask[]>>;
}

export interface ITaskData {
	id: string;
	title: string;
	column: string;
}

export interface ITask {
	id: string;
	title: string;
	column: string;
	position?: number | undefined;
	handleDragStart?: (e :React.DragEvent, info: ITask) => void
}

export interface IBoard {
	id: string;
	boardCode: string;
	name: string;
	columns: IColumns[];
}