import React from "react";

const DashboardSummary = () => {
  return (
    <main className="rounded bg-white mt-2 grid grid-cols-2 md:grid-cols-4 items-center   px-4 py-2 gap-3 w-full">
      <div className="bg-orange-300 h-20 rounded p-1 ">
        <p>Registered Customers</p>
        <h1 className="text-3xl font-bold text-center mt-1">567</h1>
      </div>
      <div className="bg-pink-200 h-20 rounded p-1 ">
        <p>Registered Suppliers</p>
        <h1 className="text-3xl font-bold text-center mt-1">78</h1>
      </div>
      <div className="bg-green-300 h-20 rounded p-1 ">
        {"Today's Bookings"}
        <h1 className="text-3xl font-bold text-center mt-1">9</h1>
      </div>
      <div className="bg-sky-300 h-20 rounded p-1">
        Today Income
        <h1 className="text-3xl font-bold text-center mt-1">M9,871.50</h1>
      </div>
    </main>
  );
};

export default DashboardSummary;