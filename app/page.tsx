import { getBoard } from "@/lib/_actions";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Tasks from "./components/Task";

export default async function Home() {
	const boards = await getBoard();
	//console.log("boards", boards);

	return (
		<main className="">
			<Header />
			<div className="flex">
				{boards && <Sidebar boards={boards} />}
				<Tasks />
			</div>
		</main>
	);
	}
