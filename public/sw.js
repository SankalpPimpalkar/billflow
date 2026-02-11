// Service Worker for Push Notifications

self.addEventListener('push', function (event) {
    const data = event.data?.json() || {}

    const options = {
        body: data.body || 'You have a new update',
        icon: '/billflow.png',
        badge: '/badge.png',
        data: {
            billId: data.billId,
            url: data.url || '/dashboard'
        },
        actions: [
            {
                action: 'view',
                title: 'View Bill'
            },
            {
                action: 'close',
                title: 'Dismiss'
            }
        ],
        requireInteraction: true,
        tag: data.tag || 'bill-notification'
    }

    event.waitUntil(
        self.registration.showNotification(data.title || 'Bill Reminder', options)
    )
})

// Handle notification click
self.addEventListener('notificationclick', function (event) {
    event.notification.close()

    if (event.action === 'view' || !event.action) {
        const urlToOpen = event.notification.data?.url || '/dashboard'

        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then(function (clientList) {
                    // Check if there's already a window open
                    for (let i = 0; i < clientList.length; i++) {
                        const client = clientList[i]
                        if (client.url.includes(urlToOpen) && 'focus' in client) {
                            return client.focus()
                        }
                    }
                    // Open new window if none found
                    if (clients.openWindow) {
                        return clients.openWindow(urlToOpen)
                    }
                })
        )
    }
})

// Handle service worker installation
self.addEventListener('install', function (event) {
    self.skipWaiting()
})

// Handle service worker activation
self.addEventListener('activate', function (event) {
    event.waitUntil(clients.claim())
})