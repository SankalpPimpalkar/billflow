"use client";
import React, { useState } from 'react'
import {
    TriangleAlert,
    CalendarClock,
    DumbbellIcon,
    Wifi,
    Home,
} from 'lucide-react'

type Bill = {
    id: number
    name: string
    category: string
    dueDate: string
    amount: number
    daysLate?: number
    icon: React.ReactNode
}

const overdueBills: Bill[] = [
    {
        id: 1,
        name: 'Gym Membership',
        category: 'Subscription',
        dueDate: 'Oct 1, 2026',
        amount: 1200,
        daysLate: 5,
        icon: <DumbbellIcon className="size-4" />,
    },
]

const upcomingBills: Bill[] = [
    {
        id: 2,
        name: 'Internet Bill',
        category: 'Utilities',
        dueDate: 'Oct 15, 2026',
        amount: 899,
        icon: <Wifi className="size-4" />,
    },
    {
        id: 3,
        name: 'House Rent',
        category: 'Rent',
        dueDate: 'Oct 20, 2026',
        amount: 12000,
        icon: <Home className="size-4" />,
    },
]

export default function BillsTableCard() {
    const [activeTab, setActiveTab] = useState<'overdue' | 'upcoming'>('overdue')
    const [paidBills, setPaidBills] = useState<number[]>([])

    const bills = activeTab === 'overdue' ? overdueBills : upcomingBills

    const togglePaid = (id: number) => {
        setPaidBills((prev) =>
            prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
        )
    }

    return (
        <div className="card bg-base-200 border border-base-300 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {activeTab === 'overdue' ? (
                        <TriangleAlert className="text-error" />
                    ) : (
                        <CalendarClock className="text-warning" />
                    )}
                    <h3 className="font-semibold text-lg">
                        {activeTab === 'overdue' ? 'Overdue Bills' : 'Upcoming Bills'}
                    </h3>
                </div>

                <span className="link link-hover text-sm">View All</span>
            </div>

            {/* Pill Switcher */}
            <div className="flex p-1 w-fit gap-2">
                <button
                    onClick={() => setActiveTab('overdue')}
                    className={`px-4 py-1.5 text-sm rounded-full transition
                        ${activeTab === 'overdue'
                            ? 'bg-red-900 border border-red-800 text-error'
                            : 'text-base-content/70 border border-base-100'
                        }`}
                >
                    Overdue
                </button>

                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-4 py-1.5 text-sm rounded-full transition
            ${activeTab === 'upcoming'
                            ? 'bg-yellow-900 border border-yellow-800 text-warning'
                            : 'text-base-content/70 border border-base-100'
                        }`}
                >
                    Upcoming
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-base-100 rounded-md">
                <table className="table table-md">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Bill</th>
                            <th>Category</th>
                            <th>Due Date</th>
                            {activeTab === 'overdue' && <th>Delay</th>}
                            <th className="text-right">Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bills.map((bill) => {
                            const isPaid = paidBills.includes(bill.id)

                            return (
                                <tr
                                    key={bill.id}
                                    className={`transition
                                        ${isPaid
                                            ? 'bg-success/10 text-success'
                                            : 'hover:bg-base-300/40'
                                        }`}
                                >
                                    {/* Checkbox */}
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={isPaid}
                                            onChange={() => togglePaid(bill.id)}
                                            className="checkbox checkbox-sm checkbox-success"
                                        />
                                    </td>

                                    {/* Bill Name + Icon */}
                                    <td className={isPaid ? 'line-through' : ''}>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-base">{bill.name}</span>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className={`${isPaid ? 'line-through' : ''} text-base`}>
                                        {bill.category}
                                    </td>

                                    {/* Due Date */}
                                    <td className={`${isPaid ? 'line-through' : ''} text-base`}>
                                        {bill.dueDate}
                                    </td>

                                    {/* Delay */}
                                    {activeTab === 'overdue' && (
                                        <td className="text-error font-medium text-base">
                                            {bill.daysLate} days
                                        </td>
                                    )}

                                    {/* Amount */}
                                    <td
                                        className={`text-right font-bold text-base ${isPaid ? 'line-through' : ''
                                            }`}
                                    >
                                        ₹{bill.amount}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
