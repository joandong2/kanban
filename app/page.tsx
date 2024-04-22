
import Board from "./components/Board";
import { getBoards } from "@/lib/_actions";

export default async function Home() {
	const boards = await getBoards();

	return (
		<main className="">
			{boards && <Board boards={boards} />}
		</main>
	);
}