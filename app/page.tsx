import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Tasks } from "./components/Task";

export default function Home() {
  return (
		<main className="">
			<Header />
			<div className="flex">
				<Sidebar />
				<Tasks />
			</div>
		</main>
	);
}
