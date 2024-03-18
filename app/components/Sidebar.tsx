import React from 'react'
import Image from "next/image";

const Sidebar = () => {
  return (
		<span className="flex flex-col justify-between bg-white max-w-[260px] h-full min-h-screen">
			<span>
				<ul className="flex flex-col gap-2 sidebar">
					<li>All Boards (3)</li>
					<li className="active">
						<Image
							src="/assets/icon-board.svg"
							alt="Image Best Gear"
							width="24"
							height="10"
							className=""
						/>{" "}
						Platform Launch
					</li>
					<li className="">
						<Image
							src="/assets/icon-board.svg"
							alt="Image Best Gear"
							width="24"
							height="10"
						/>{" "}
						Roadmap
					</li>
					<li className="flex gap-2">
						<Image
							src="/assets/icon-board.svg"
							alt="Image Best Gear"
							width="24"
							height="10"
						/>{" "}
						Marketing Plan
					</li>
					<li className="!text-[#635fc7]">+ Create A New Board</li>
				</ul>
			</span>
      <span>
        Hide Sidebar
      </span>
		</span>
	);
}

export default Sidebar