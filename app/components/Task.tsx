import React from 'react'
import { FaCircle } from "react-icons/fa";

const Task = () => {
  return (
		<span className="px-8 py-4 gap-8 flex">
			<span className="tasks">
				<span className="flex items-center gap-2 mb-6">
					<FaCircle className="text-red-500" />
					<span className="uppercase">todo (4)</span>
				</span>
				<span className="sub-tasks flex flex-col gap-6">
					<span className="task shadow-lg">
						<p className="text-[14px] mb-2">
							Build UI for onboarding flow Build UI for onboarding flow
						</p>
						<span className="text-[#828fa3] font-bold text-[12px]">
							0 of 3 subtasks
						</span>
					</span>
					<span className="task shadow-lg">
						<p className="text-[14px] mb-2">
							Build UI for onboarding flow Build UI for onboarding flow
						</p>
						<span className="text-[#828fa3] font-bold text-[12px]">
							0 of 3 subtasks
						</span>
					</span>
				</span>
			</span>
			<span className="tasks">
				<span className="flex items-center gap-2 mb-8">
					<FaCircle />
					<span className="uppercase">doing (2)</span>
				</span>
				<span className="sub-tasks flex flex-col gap-6"></span>
			</span>
			<span className="tasks">
				<span className="flex items-center gap-2 mb-8">
					<FaCircle />
					<span className="uppercase">done (4)</span>
				</span>
				<span className="sub-tasks"></span>
			</span>
		</span>
	);
}

export default Task