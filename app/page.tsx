import { useEffect } from "react";
import Board from "./components/Board";
import { getBoards } from "@/lib/_actions";

export default async function Home() {
	return (
		<main className="">
			<Board />
		</main>
	);
}