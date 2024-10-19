import { cn } from "@/lib/utils";
import React from "react";

export default function Button({className, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement>){
    return (
        <button {...props} className={cn("flex items-center justify-center gap-2 bg-[#FF0000] text-white px-3 py-2 font-semibold transition-colors hover:bg-red-600 active:bg-red-600 disabled:bg-gray-200", className)}></button>
    )
}