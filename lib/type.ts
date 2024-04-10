import { DragHandlers } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

export interface ColumnProps {
	title: string;
	headingColor: any;
	cards: any;
	column: string;
	setCards: Dispatch<SetStateAction<Cards[]>>;
}

export interface Item {

}

export interface Cards {
	id: string;
	title: string;
	column: string;
	handleDragStart?: DragHandlers["onDragStart"];
}