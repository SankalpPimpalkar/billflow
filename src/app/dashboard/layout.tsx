import Navbar from '@/components/ui/Navbar'
import DashboardClientWrapper from '@/components/DashboardClientWrapper'
import { createClient } from '@/utils/supabase/server.supabase'
import { cookies } from 'next/headers'
import React, { ReactNode } from 'react'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const supabase = createClient(cookies())
    const { data } = await supabase.auth.getUser()
    const user = data.user?.user_metadata!

    return (
        <div className='bg-base-300 h-full min-h-dvh'>
            <Navbar user={user} />
            <div className='w-full max-w-5xl mx-auto p-4'>
                <DashboardClientWrapper>
                    {children}
                </DashboardClientWrapper>
            </div>
        </div>
    )
}
