"use client";
import {
    Zap,
    Play,
    CheckCircle2,
    TrendingUp,
    CheckCheck,
    LucideIcon,
    Bell,
    AlertCircle,
} from 'lucide-react'
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/actions/notification.actions'

export type NotificationProps = {
    id: number
    title: string
    body: string
    created_at: string
    type: 'overdue' | 'success' | 'warning' | 'info'
    is_read: boolean
    bill?: number
}

export default function Notifications() {
    const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all')
    const queryClient = useQueryClient()

    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => getNotifications()
    })

    const markAllAsReadMutation = useMutation({
        mutationFn: markAllNotificationsAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        }
    })

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'unread') return !n.is_read
        if (activeTab === 'archived') return n.is_archived
        return !n.is_archived
    })

    const groupedNotifications = groupByDate(filteredNotifications)

    if (isLoading) {
        return (
            <div className="space-y-8 py-3">
                <div className="skeleton h-8 w-48"></div>
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-32 w-full"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 py-3">
            <section className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Notifications</h2>
                    <p className="pt-2 text-sm text-base-content/70">
                        Stay updated on your upcoming bills and payment statuses.
                    </p>
                </div>

                <button
                    className="btn btn-ghost gap-2"
                    onClick={() => markAllAsReadMutation.mutate()}
                    disabled={markAllAsReadMutation.isPending}
                >
                    {markAllAsReadMutation.isPending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        <CheckCheck className="size-4" />
                    )}
                    Mark all read
                </button>
            </section>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-base-300">
                {['all', 'unread', 'archived'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 text-sm capitalize relative
                            ${activeTab === tab
                                ? 'text-base-content font-semibold'
                                : 'text-base-content/60'
                            }`}
                    >
                        {tab}
                        {tab === 'unread' && notifications.filter(n => !n.is_read).length > 0 && (
                            <span className="ml-2 inline-block size-2 rounded-full bg-primary" />
                        )}
                        {activeTab === tab && (
                            <span className="absolute left-0 -bottom-px h-0.5 w-full bg-base-content" />
                        )}
                    </button>
                ))}
            </div>

            {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                    <Bell className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
                    <p className="text-base-content/60">No notifications yet</p>
                </div>
            ) : (
                <>
                    {Object.entries(groupedNotifications).map(([date, items]) => (
                        <Section key={date} title={date}>
                            {items.map((item) => (
                                <NotificationRow key={item.id} {...item} />
                            ))}
                        </Section>
                    ))}
                </>
            )}
        </div>
    )
}

function groupByDate(notifications: NotificationProps[]) {
    const groups: Record<string, NotificationProps[]> = {}
    const now = new Date()
    const today = now.toDateString()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()

    notifications.forEach(n => {
        const date = new Date(n.created_at).toDateString()
        let label = date
        if (date === today) label = 'Today'
        else if (date === yesterday) label = 'Yesterday'

        if (!groups[label]) groups[label] = []
        groups[label].push(n)
    })

    return groups
}

function Section({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">{title}</h3>
            </div>

            <div className="space-y-3">{children}</div>
        </div>
    )
}

function NotificationRow({
    id,
    title,
    body,
    created_at,
    type,
    is_read,
    bill,
}: NotificationProps) {
    const queryClient = useQueryClient()

    const markAsReadMutation = useMutation({
        mutationFn: () => markNotificationAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        }
    })

    const styles = {
        overdue: 'bg-error/10 text-error',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        info: 'bg-info/10 text-info',
    }

    const icons: Record<string, LucideIcon> = {
        overdue: AlertCircle,
        success: CheckCircle2,
        warning: TrendingUp,
        info: Bell,
    }

    const Icon = icons[type]

    return (
        <div className="flex items-center justify-between rounded-xl bg-base-200 p-4 border border-base-100">
            <div className="flex items-start gap-4">
                <div
                    className={`size-12 rounded-full flex items-center justify-center ${styles[type]}`}
                >
                    <Icon className="size-5" />
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">{title}</p>
                        {type === 'overdue' && (
                            <span className="badge badge-error badge-sm">overdue</span>
                        )}
                    </div>

                    <p className="text-sm text-base-content/70">{body}</p>
                    <p className="text-xs text-base-content/50">
                        {new Date(created_at).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {bill && (
                    <a
                        href={`/dashboard/bills/${bill}`}
                        className={`btn btn-sm ${type === 'overdue' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        View Bill
                    </a>
                )}

                {!is_read && (
                    <>
                        <button
                            onClick={() => markAsReadMutation.mutate()}
                            className="btn btn-ghost btn-sm"
                            disabled={markAsReadMutation.isPending}
                        >
                            {markAsReadMutation.isPending ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                'Mark read'
                            )}
                        </button>
                        <span className="size-2 rounded-full bg-primary" />
                    </>
                )}
            </div>
        </div>
    )
}
