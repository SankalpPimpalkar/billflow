'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client.supabase'

export default function AuthCallbackPage() {
    const router = useRouter()

    useEffect(() => {
        const getSession = async () => {
            const supabase = createClient()
            const { data, error } = await supabase.auth.getSession()

            if (error) {
                console.error(error)
                return
            }

            if (data.session) {
                router.replace('/dashboard')
            }
        }

        getSession()
    }, [router])

    return <p>Signing you in...</p>
}
