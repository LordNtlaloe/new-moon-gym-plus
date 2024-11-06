"use client"
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const categoryData = [
	{ name: "Electronics", value: 4500 },
	{ name: "Clothing", value: 3200 },
	{ name: "Home & Garden", value: 2800 },
	{ name: "Books", value: 2100 },
	{ name: "Sports & Outdoors", value: 1900 },
];

const data = {
	labels: categoryData.map((data) => data.name),
	datasets: [
		{
			label: "Category Distribution",
			data: categoryData.map((data) => data.value),
			backgroundColor: ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"],
			hoverOffset: 10,
		},
	],
};

const CategoryDistributionChart = () => (
	<motion.div
		className='bg-violet-200 bg-opacity-50 text-[#51358C] backdrop-blur-md shadow-sm shadow-violet-900 rounded-xl p-6'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: 0.3 }}
	>
		<h2 className='text-lg font-medium mb-4 text-[#51358C]'>Category Distribution</h2>
		<div className='h-80'>
			<Pie data={data} options={{ maintainAspectRatio: false, responsive: true }} />
		</div>
	</motion.div>
);

export default CategoryDistributionChart;
