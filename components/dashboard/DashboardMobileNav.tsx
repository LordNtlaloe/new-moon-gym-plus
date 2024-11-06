import { MenuIcon, Settings2Icon, User2Icon } from 'lucide-react'
import React from 'react'
import SaveButton from '../general/SaveButton'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { dashboardMenu } from '@/lib/constants'
import Link from 'next/link'

const DashboardMobileNav = () => {
    return (
        <main className='flex items-center justify-between w-full px-4'>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MenuIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='bg-blue-950 ml-6 text-white md: mt-2'>
                    <DropdownMenuLabel className='border-b pb-2'>DASHBOARD MENU</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div>
                        {dashboardMenu.map((item) => (
                            <Link
                                href={item.href}
                                key={item.id}
                                className="items-center md:pl-6 py-3 pl-3 "
                            >
                                <DropdownMenuItem className="flex pl-3 gap-3 w-72 hover:bg-slate-600 mx-2 py-2 rounded-[5px] transition-all duration-500">
                                    <item.icon className={`shrink-0  text-${item.color}`} />
                                    <span>{item.label}</span>
                                </DropdownMenuItem>

                            </Link>
                        ))}
                    </div>

                    <div className="pt-10 border-t mb-3 justify-end flex flex-col border-white/20">

                        <Link href="/dashboard/settings">
                            <DropdownMenuItem className="flex pl-3 gap-6 hover:bg-slate-600 mx-2 py-2 rounded-[5px] transition-all duration-500">
                                <Settings2Icon className="shrink-0 text-yellow-400" />
                                Settings
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/dashboard/profile">
                            <DropdownMenuItem className="flex pl-3 gap-6 hover:bg-slate-600 mx-2 py-2 rounded-[5px] transition-all duration-500">
                                <User2Icon className="shrink-0 text-pink-400" />
                                profile
                            </DropdownMenuItem>
                        </Link>

                    </div>

                </DropdownMenuContent>
            </DropdownMenu>

            <SaveButton
                btnFunction="registerBusiness"
                btnText="Register Business"
                bgColor="bg-secondary"
            />

        </main>
    )
}

export default DashboardMobileNav