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

    // Mock logic for "change from last month" as we don't have historical snapshots
    // In a real app, we'd query last month's data separately.
    const change = 12

    bills.forEach(bill => {
        if (!bill.is_paid) {
            totalOwed += bill.amount
            if (new Date(bill.due_date) < now) {
                overdue += bill.amount
            } else {
                upcoming += bill.amount
            }
        }
    })

    return {
        totalOwed,
        overdue,
        upcoming,
        change
    }
}
