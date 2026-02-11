"use client"

import { Bell, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { requestNotificationPermission, subscribeToPush, getCurrentSubscription } from '@/lib/pushNotifications'
import { savePushSubscription } from '@/actions/push.actions'

export default function NotificationPermissionBanner() {
    const [showBanner, setShowBanner] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        checkNotificationStatus()
    }, [])

    const checkNotificationStatus = async () => {
        if (!('Notification' in window)) return

        // Check if already subscribed
        const subscription = await getCurrentSubscription()
        if (subscription) {
            setShowBanner(false)
            return
        }

        // Show banner if permission not granted
        if (Notification.permission === 'default') {
            setShowBanner(true)
        }
    }

    const handleEnableNotifications = async () => {
        setIsLoading(true)
        try {
            // Request permission
            const permission = await requestNotificationPermission()

            if (permission === 'granted') {
                // Subscribe to push
                const subscription = await subscribeToPush()

                if (subscription) {
                    // Save subscription to database
                    await savePushSubscription(subscription.toJSON())
                    setShowBanner(false)
                }
            } else {
                alert('Notification permission denied. You can enable it later in your browser settings.')
                setShowBanner(false)
            }
        } catch (error) {
            console.error('Failed to enable notifications:', error)
            alert('Failed to enable notifications. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!showBanner) return null

    return (
        <div className="alert alert-info bg-base-200 border border-base-100 rounded-lg shadow-none mb-4">
            <Bell className="w-6 h-6" />
            <div className="flex-1">
                <h3 className="font-bold">Stay Updated!</h3>
                <div className="text-xs">Enable notifications to get reminders about overdue bills.</div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleEnableNotifications}
                    className="btn btn-sm btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        'Enable'
                    )}
                </button>
                <button
                    onClick={() => setShowBanner(false)}
                    className="btn btn-sm btn-ghost"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
