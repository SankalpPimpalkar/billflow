"use server"

import { createClient } from "@/utils/supabase/server.supabase"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function getNotifications() {
    const supabase = createClient(cookies())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("owner", user.id)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching notifications:", error)
        return []
    }

    return data
}

export async function markNotificationAsRead(id: number) {
    const supabase = createClient(cookies())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .eq("owner", user.id)

    if (error) {
        console.error("Error marking notification as read:", error)
        throw new Error("Failed to mark notification as read")
    }

    revalidatePath("/dashboard/notifications")
}

export async function markAllNotificationsAsRead() {
    const supabase = createClient(cookies())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("owner", user.id)
        .eq("is_read", false)

    if (error) {
        console.error("Error marking all notifications as read:", error)
        throw new Error("Failed to mark all notifications as read")
    }

    revalidatePath("/dashboard/notifications")
}
