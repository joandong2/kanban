import { DragHandlers } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

export interface IColumns {
	title: string;
	headingColor: any;
	tasks: any;
	column: string;
	setTasks: Dispatch<SetStateAction<ITask[]>>;
}

export interface Item {

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
	handleDragStart?: (e : any, info: ITask) => void;
}

export type HandleDragStart = (e: MouseEvent | TouchEvent | PointerEvent, task: ITask) => void;