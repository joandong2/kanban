import React from 'react'
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { IoIosSunny } from "react-icons/io";
import { BsMoonStarsFill } from "react-icons/bs";

const ToggleSwitch = ({
	setTheme
}: {
	setTheme: () => void
}) => {
  return (
		<div className="switch flex items-center justify-center bg-[#f4f7fd] rounded-[8px] py-2 text-center w-[100%] align-middle text-[#828fa3] gap-4">
			<Label htmlFor="airplane-mode">
				<IoIosSunny className="text-[24px]" />
			</Label>
			<Switch onCheckedChange={setTheme}  id="color-mode" />
			<Label htmlFor="airplane-mode">
				<BsMoonStarsFill className="text-[18px]" />
			</Label>
		</div>
	);
}

export default ToggleSwitch