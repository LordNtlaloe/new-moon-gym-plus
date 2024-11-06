import { motion } from "framer-motion";
import React from "react";

interface CardStatsProp {
	name: string;
	icon: React.ReactNode; // Accepts JSX elements
	value: number | string; // Allow string for percentages or currency
	color: string;
}

const StatCard = ({ name, icon, value, color }: CardStatsProp) => {
	return (
		<motion.div
			className='bg-violet-200 text-[#51358C] bg-opacity-50 backdrop-blur-md overflow-hidden shadow-sm shadow-violet-900 rounded-xl'
			whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
		>
			<div className='px-4 py-5 sm:p-6'>
				<span className='flex items-center text-sm font-medium text-violet-500 gap-4'>
					{icon} {/* Render the icon directly as JSX */}
					{name}
				</span>
				<p className='mt-1 text-3xl font-semibold text-[#51358C]'>{value}</p>
			</div>
		</motion.div>
	);
};

export default StatCard;
