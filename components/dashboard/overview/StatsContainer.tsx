// "use client";

// import { motion } from "framer-motion";
// import StatCard from "@/components/dashboard/StatCard";
// import { Zap, Users, ShoppingBag, BarChart2 } from "lucide-react";
// import { useEffect, useState } from "react";
// import { getNewUsersCount } from "@/app/_actions/users.actions";
// // import { getTotalRevenueByMonth } from "@/app/_actions/_orderActions";
// // import { getAllProductsCount } from "@/app/_actions/_productsActions";

// const StatsContainer = () => {
//   const [totalRevenue, setTotalRevenue] = useState<string>("Loading...");
//   const [newUsers, setNewUsers] = useState<string>("Loading...");
//   const [totalProducts, setTotalProducts] = useState<string>("Loading...");

//   useEffect(() => {
//     const fetchStats = async () => {
//       // Fetch Total Revenue
//       const revenueResponse = await getTotalRevenueByMonth();
//       if (revenueResponse.success) {
//         const currentMonth = new Date().getMonth() + 1;
//         const currentYear = new Date().getFullYear();

//         const currentMonthRevenue = revenueResponse.data.find(
//           (entry: { year: number; month: number }) =>
//             entry.year === currentYear && entry.month === currentMonth
//         );

//         setTotalRevenue(
//           currentMonthRevenue
//             ? `R${currentMonthRevenue.totalRevenue.toLocaleString()}.00`
//             : "R0.00"
//         );
//       } else {
//         setTotalRevenue("Error fetching revenue");
//       }

//       // Fetch New Users
//       const usersResponse = await getNewUsersCount();
//       if (usersResponse.success) {
//         setNewUsers(usersResponse.count.toString());
//       } else {
//         setNewUsers("Error fetching users");
//       }

//       // Fetch Total Products
//       const productsResponse = await getAllProductsCount();
//       if (productsResponse.success) {
//         setTotalProducts(
//           `${productsResponse.totalProducts} (${productsResponse.totalQuantity} items)`
//         );
//       } else {
//         setTotalProducts("Error fetching products");
//       }
//     };

//     fetchStats();
//   }, []);

//   return (
//     <motion.div
//       className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 1 }}
//     >
//       <StatCard
//         name="Total Sales"
//         icon={<Zap size={20} style={{ color: "#6366F1" }} />}
//         value={totalRevenue}
//         color="#6366F1"
//       />
//       <StatCard
//         name="New Users"
//         icon={<Users size={20} style={{ color: "#8B5CF6" }} />}
//         value={newUsers}
//         color="#8B5CF6"
//       />
//       <StatCard
//         name="Total Products"
//         icon={<ShoppingBag size={20} style={{ color: "#EC4899" }} />}
//         value={totalProducts}
//         color="#EC4899"
//       />
//       <StatCard
//         name="Conversion Rate"
//         icon={<BarChart2 size={20} style={{ color: "#10B981" }} />}
//         value="12.5%"
//         color="#10B981"
//       />
//     </motion.div>
//   );
// };

// export default StatsContainer;
import React from 'react'

export default function StatsContainer() {
  return (
    <div>StatsContainer</div>
  )
}
