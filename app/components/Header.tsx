import React from 'react'
import Image from "next/image";

const Header = () => {
  return (
		<span className="flex justify-between">
			<span className="flex">
				<span>
					<Image
						src="/assets/logo-dark.svg"
						alt="Image Best Gear"
						width="153"
						height="26"
					/>{" "}
				</span>
				<span className="border-r-1">
					<p>Platform Launch</p>
				</span>
			</span>
			<span>Add New Task</span>
		</span>
	);
}

export default Header