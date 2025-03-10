import { Metadata } from "next";
import React from "react";
import TrainerSessions from "./TrainerSessions";

export const metadata: Metadata = {
  title: "Your Sessions",
};

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <TrainerSessions />
    </div>
  );
}
