"use client"
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, PointElement);

const salesData = [
	{ name: "Jul", sales: 4200 },
	{ name: "Aug", sales: 3800 },
	{ name: "Sep", sales: 5100 },
	{ name: "Oct", sales: 4600 },
	{ name: "Nov", sales: 5400 },
	{ name: "Dec", sales: 7200 },
	{ name: "Jan", sales: 6100 },
	{ name: "Feb", sales: 5900 },
	{ name: "Mar", sales: 6800 },
	{ name: "Apr", sales: 6300 },
	{ name: "May", sales: 7100 },
	{ name: "Jun", sales: 7500 },
];

const data = {
	labels: salesData.map((data) => data.name),
	datasets: [
		{
			label: "Sales",
			data: salesData.map((data) => data.sales),
			borderColor: "#6366F1",
			backgroundColor: "rgba(99, 102, 241, 0.2)",
			borderWidth: 2,
			pointRadius: 5,
			pointHoverRadius: 8,
		},
	],
};

const SalesOverviewChart = () => (
	<motion.div
		className='bg-violet-200 bg-opacity-50 backdrop-blur-md shadow-sm shadow-violet-900 rounded-xl p-6 '
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: 0.2 }}
	>
		<h2 className='text-lg font-medium mb-4 text-[#51358C]'>Sales Overview</h2>
		<div className='h-80'>
			<Line data={data} options={{ maintainAspectRatio: false, responsive: true }} />
		</div>
	</motion.div>
);

export default SalesOverviewChart;
