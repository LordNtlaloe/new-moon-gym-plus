// components/dashboard/StatsContainer.tsx
"use client"; // Mark this as a Client Component
import { motion } from "framer-motion";
import StatCard from "@/components/dashboard/StatCard"; // Update this path as necessary
import { Zap, Users, ShoppingBag, BarChart2 } from "lucide-react";

const StatsContainer = () => {
  return (
    <motion.div
      className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <StatCard name='Total Sales' icon={<Zap size={20} style={{ color: '#6366F1' }} />} value='$12,345' color='#6366F1' />
      <StatCard name='New Users' icon={<Users size={20} style={{ color: '#8B5CF6' }} />} value='1,234' color='#8B5CF6' />
      <StatCard name='Total Products' icon={<ShoppingBag size={20} style={{ color: '#EC4899' }} />} value='567' color='#EC4899' />
      <StatCard name='Conversion Rate' icon={<BarChart2 size={20} style={{ color: '#10B981' }} />} value='12.5%' color='#10B981' />
    </motion.div>
  );
};

export default StatsContainer;
