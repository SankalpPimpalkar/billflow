"use client"

import { useEffect } from 'react'
import NotificationPermissionBanner from './NotificationPermissionBanner'

export default function DashboardClientWrapper({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
        }
    }, [])

    return (
        <>
            <NotificationPermissionBanner />
            {children}
        </>
    )
}
