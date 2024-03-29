import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Task from "./components/Task";

export default function Home() {
  return (
		<main className="">
			<Header />
			<div className="flex">
				<Sidebar />
				<Task />
			</div>
		</main>
	);
}
