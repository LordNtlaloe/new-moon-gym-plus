"use client"
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SALES_CHANNEL_DATA = [
	{ name: "Website", value: 45600 },
	{ name: "Mobile App", value: 38200 },
	{ name: "Marketplace", value: 29800 },
	{ name: "Social Media", value: 18700 },
];

const data = {
	labels: SALES_CHANNEL_DATA.map((data) => data.name),
	datasets: [
		{
			label: "Sales by Channel",
			data: SALES_CHANNEL_DATA.map((data) => data.value),
			backgroundColor: ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"],
		},
	],
};

const SalesChannelChart = () => (
	<motion.div
		className='bg-violet-200 text-[#51358C] bg-opacity-50 backdrop-blur-md shadow-sm shadow-violet-900 rounded-xl p-6 lg:col-span-2'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: 0.4 }}
	>
		<h2 className='text-lg font-medium mb-4 text-[#51358C]'>Sales by Channel</h2>
		<div className='h-80'>
			<Bar data={data} options={{ maintainAspectRatio: false, responsive: true }} />
		</div>
	</motion.div>
);

export default SalesChannelChart;
