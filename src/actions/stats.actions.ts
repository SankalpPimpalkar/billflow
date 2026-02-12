"use server"

import { createClient } from "@/utils/supabase/server.supabase"
import { cookies } from "next/headers"

export async function getStats() {
    const supabase = createClient(cookies())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { totalOwed: 0, overdue: 0, upcoming: 0, change: 0 }

    const { data: bills, error } = await supabase
        .from("bills")
        .select("amount, due_date, is_paid")
        .eq("owner", user.id)
        .eq("is_deleted", false)

    if (error || !bills) return { totalOwed: 0, overdue: 0, upcoming: 0, change: 0 }

    const now = new Date()
    let totalOwed = 0
    let overdue = 0
    let upcoming = 0

    // Calculate last month's date range
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    let lastMonthOwed = 0

    bills.forEach(bill => {
        const dueDate = new Date(bill.due_date)

        // Calculate current month's unpaid bills
        if (!bill.is_paid) {
            totalOwed += bill.amount
            if (dueDate < now) {
                overdue += bill.amount
            } else {
                upcoming += bill.amount
            }
        }

        // Calculate last month's total (bills that were due in last month, regardless of paid status)
        if (dueDate >= lastMonthStart && dueDate <= lastMonthEnd) {
            lastMonthOwed += bill.amount
        }
    })

    // Calculate percentage change from last month
    const change = lastMonthOwed > 0
        ? Math.round(((totalOwed - lastMonthOwed) / lastMonthOwed) * 100)
        : 0

    return {
        totalOwed,
        overdue,
        upcoming,
        change
    }
}
