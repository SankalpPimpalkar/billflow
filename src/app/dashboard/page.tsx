import BillList from "@/components/BillList"
import Stats from "@/components/ui/Stats"
import { createClient } from "@/utils/supabase/server.supabase"
import { cookies } from "next/headers"
import { getBills } from "@/actions/bill.actions"

export default async function Dashboard() {

    const supabase = createClient(cookies())
    const { data } = await supabase.auth.getUser()
    const user = data.user?.user_metadata!

    const bills = await getBills()

    return (
        <div className="py-3 space-y-8">
            <section>
                <h2 className="text-2xl font-bold">
                    Dashboard
                </h2>
                <p className="pt-2 text-sm">
                    Welcome back, {user?.name?.split(" ")[0].trim() || 'User'}. Nice to see you again here is your financial overview
                </p>
            </section>

            <Stats />

            <BillList bills={bills || []} />
        </div>
    )
}
