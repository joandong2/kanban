import React from 'react'
import Image from "next/image";

const Header = () => {
  return (
		<span className="flex">
			<Image
				src="/assets/logo-light.svg"
				alt="Image Best Gear"
                width="138"
                height="40"
				className="w-[120px] h-[25px]"
			/>{" "}
			<span className="font-bold text-[24px] drop-shadow-xl">kanban</span>
		</span>
	);
}

export default Header