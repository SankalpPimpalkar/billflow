// Push notification utilities for the frontend

export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
        console.error('This browser does not support notifications')
        return 'denied'
    }

    if (Notification.permission === 'granted') {
        return 'granted'
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission()
        return permission
    }

    return Notification.permission
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.error('Push notifications not supported')
        return null
    }

    try {
        const registration = await navigator.serviceWorker.ready

        // Get VAPID public key from environment
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidPublicKey) {
            console.error('VAPID public key not configured')
            return null
        }

        // Convert VAPID key to Uint8Array
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
        })

        return subscription
    } catch (error) {
        console.error('Failed to subscribe to push notifications:', error)
        return null
    }
}

export async function unsubscribeFromPush(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
        return false
    }

    try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()

        if (subscription) {
            await subscription.unsubscribe()
            return true
        }

        return false
    } catch (error) {
        console.error('Failed to unsubscribe from push notifications:', error)
        return false
    }
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator)) {
        return null
    }

    try {
        const registration = await navigator.serviceWorker.ready
        return await registration.pushManager.getSubscription()
    } catch (error) {
        console.error('Failed to get current subscription:', error)
        return null
    }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray.buffer
}
