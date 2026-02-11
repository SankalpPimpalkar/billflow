import { getCategories } from "@/actions/bill.actions";
import CreateBillForm from "@/components/CreateBillForm";

export default async function CreateBillPage() {
    const categories = await getCategories()

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Create New Bill</h1>
            <div className="bg-base-100 p-6 rounded-lg shadow-sm border border-base-100">
                <CreateBillForm categories={categories || []} />
            </div>
        </div>
    )
}
