import { getBillById } from "@/actions/bill.actions";
import BillDetails from "@/components/BillDetails";
import { notFound } from "next/navigation";

export default async function BillPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const bill = await getBillById(Number(id))

    if (!bill) {
        notFound()
    }

    return (
        <div className="max-w-5xl mx-auto">
            <BillDetails bill={bill} />
        </div>
    )
}
