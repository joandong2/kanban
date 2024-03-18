import React from 'react'
import Image from "next/image";

const NewTask = () => {
  return (
		<span className="flex gap-5 items-center">
			<span className="bg-[#635FC7] text-white rounded-[45px] py-2 px-6 font-medium">
				{" "}
				+ Add New Task
			</span>
			<Image
				src="/assets/icon-vertical-ellipsis.svg"
				alt="Image Best Gear"
                height="1"
                width="1"
				className="h-[20px] w-[6px]"
			/>{" "}
		</span>
	);
}

export default NewTask