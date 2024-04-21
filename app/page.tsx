import { getBoard } from "@/lib/_actions";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Tasks from "./components/Task";
import { useKanbanStore } from "@/lib/store";
import Board from "./components/Board";

export default async function Home() {

	//console.log("boards", boards);

	return (
		<main className="">
			<Header />
			<div className="flex">
				<Board />
				<Tasks />
			</div>
		</main>
	);
}