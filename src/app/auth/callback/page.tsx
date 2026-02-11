'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client.supabase'
import { Loader2 } from 'lucide-react'

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

    return (
        <div className="min-h-screen bg-base-300 flex items-center justify-center">
            <div className="text-center space-y-8 p-8">
                {/* Animated Logo/Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-primary/20 animate-ping absolute"></div>
                        <div className="w-20 h-20 rounded-full bg-base-200 border-4 border-primary flex items-center justify-center relative">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        </div>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-base-content">
                        Signing you in...
                    </h2>
                    <p className="text-base-content/60">
                        Please wait while we set up your account
                    </p>
                </div>

                {/* Loading Progress Bar */}
                <div className="max-w-xs mx-auto">
                    <progress className="progress progress-primary w-full"></progress>
                </div>

                {/* Subtle hint */}
                <p className="text-xs text-base-content/40">
                    This should only take a moment
                </p>
            </div>
        </div>
    )
}
