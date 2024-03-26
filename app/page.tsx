import Image from "next/image";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
		<main className="">
			<Header />
			<div className="flex">
				<Sidebar />
				<h1>hello world</h1>
			</div>
		</main>
	);
}
