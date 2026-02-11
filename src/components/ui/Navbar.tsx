"use client"
import { Bell, LogOut } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { logout } from '@/actions/auth.actions'

export default function Navbar({ user }: { user: any }) {
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await logout()
        } catch (error) {
            console.error("Logout failed:", error)
            setIsLoggingOut(false)
        }
    }

    return (
        <div className='border-b border-base-100 bg-base-100 w-full'>
            <div className='w-full max-w-5xl mx-auto p-4 flex items-center justify-between'>
                <Link href={'/dashboard'} className='font-bold text-xl'>
                    BillFlow
                </Link>

                <div className='flex items-center gap-2'>
                    <Link href={'/dashboard/notifications'} className='btn btn-ghost btn-sm border-none shadow-none hover:bg-transparent'>
                        <Bell className='fill-secondary-content' />
                    </Link>

                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="avatar btn btn-sm btn-ghost border-none shadow-none bg-base-100">
                            <div className="mask mask-squircle w-8">
                                <img src={user.picture} alt="User Avatar" />
                            </div>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow border border-base-100 mt-2">
                            <li>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="flex items-center gap-2"
                                >
                                    {isLoggingOut ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <LogOut className="w-4 h-4" />
                                    )}
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
