import { motion } from "framer-motion";
import { FC, ReactNode } from "react";

interface SettingSectionProps {
	icon: React.ComponentType<{ className?: string; size?: string | number }>; // Allow size to be string or number
	title: string;
	children: ReactNode;
}

const SettingSection: FC<SettingSectionProps> = ({ icon: Icon, title, children }) => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className='flex items-center mb-4'>
				<Icon className='text-indigo-400 mr-4' size={24} /> {/* Pass size as a number */}
				<h2 className='text-xl font-semibold text-gray-100'>{title}</h2>
			</div>
			{children}
		</motion.div>
	);
};

export default SettingSection;
