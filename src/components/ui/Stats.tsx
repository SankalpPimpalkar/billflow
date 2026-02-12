"use client"

import { getStats } from '@/actions/stats.actions'
import { useQuery } from '@tanstack/react-query'
import { PiggyBankIcon, TrendingDown, AlertCircle, CalendarClock, TrendingUp } from 'lucide-react'
import React from 'react'

export default function Stats() {
    const { data, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => getStats()
    })

    if (isLoading) {
        return (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-32 w-full"></div>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
            <StatCard
                title="Total Owed"
                value={data?.totalOwed || 0}
                icon={<PiggyBankIcon className='fill-secondary-content' />}
                description="from last month"
                change={data?.change}
            />
            <StatCard
                title="Overdue"
                value={data?.overdue || 0}
                icon={<AlertCircle className='text-error' />}
                valueClassName="text-error"
                description="needs attention"
            />
            <StatCard
                title="Upcoming"
                value={data?.upcoming || 0}
                icon={<CalendarClock className='text-warning' />}
                valueClassName="text-warning"
                description="next 30 days"
            />
        </div>
    )
}


function StatCard({ title, value, icon, description, change, valueClassName = '' }: {
    title: string, value: number, icon: React.ReactNode, description?: string, change?: number, valueClassName?: string
}) {
    return (
        <div className='card card-sm bg-base-200 border border-base-100 col-span-1 p-6 space-y-2'>
            <span className='flex items-center justify-between w-full'>
                <p className='text-neutral-500 text-xs'>
                    {title}
                </p>
                {icon}
            </span>

            <span className='space-y-1'>
                <h3 className={`text-2xl font-extrabold ${valueClassName}`}>
                    ₹{value.toLocaleString()}
                </h3>
                <div className='flex items-center gap-2'>
                    {
                        change !== undefined && (
                            <span className={`flex items-center gap-2 text-xs bg-base-100 px-2 py-1 w-fit rounded-full ${change < 0 ? 'text-error' : 'text-success'}`}>
                                <>
                                    {change < 0 ?
                                        <TrendingDown className='size-4' /> : <TrendingUp className='size-4' />
                                    }
                                    <p>
                                        {change > 0 ? `+${change}%` : `${change}%`}
                                    </p>
                                </>
                            </span>
                        )
                    }
                    <p className='text-xs opacity-70'>
                        {description}
                    </p>
                </div>
            </span>

            {/* <section className='pt-1'>
                <progress className="progress w-full" value="30" max="100"></progress>
            </section> */}
        </div>
    )
}
