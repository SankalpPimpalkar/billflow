import { Plus } from "lucide-react";
import Link from "next/link";

interface Bill {
    id: number;
    merchant_name: string;
    amount: number;
    due_date: string;
    category: string;
    is_paid: boolean;
}

export default function BillList({ bills }: { bills: Bill[] }) {
    if (!bills || bills.length === 0) {
        return (
            <div className="card bg-base-100 shadow-xl border border-base-100">
                <div className="card-body items-center text-center py-10">
                    <h2 className="card-title text-2xl mb-2">No bills found</h2>
                    <p className="text-base-content/70 mb-6">Start tracking your expenses by adding your first bill.</p>
                    <Link href="/dashboard/bills/create" className="btn btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Bill
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="card bg-base-100 shadow-xl border border-base-100">
            <div className="card-body p-0">
                <div className="p-4 border-b border-base-100 flex justify-between items-center">
                    <h2 className="card-title text-lg">Your Bills</h2>
                    <Link href="/dashboard/bills/create" className="btn btn-sm btn-ghost text-primary">
                        <Plus className="w-4 h-4 mr-1" /> Add Bill
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Merchant</th>
                                <th>Due Date</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => (
                                <tr key={bill.id} className="hover">
                                    <td>
                                        <div className="font-bold">{bill.merchant_name}</div>
                                    </td>
                                    <td>
                                        {new Date(bill.due_date).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className="badge badge-ghost badge-sm">{bill.category}</span>
                                    </td>
                                    <td className="font-mono">
                                        ${bill.amount.toFixed(2)}
                                    </td>
                                    <td>
                                        {bill.is_paid ? (
                                            <span className="badge badge-success badge-sm text-white">Paid</span>
                                        ) : (
                                            <span className={`badge badge-sm font-semibold ${new Date(bill.due_date) < new Date() ? 'badge-error text-white' : 'badge-warning'}`}>
                                                {new Date(bill.due_date) < new Date() ? 'Overdue' : 'Unpaid'}
                                            </span>
                                        )}
                                    </td>
                                    <th>
                                        <Link href={`/dashboard/bills/${bill.id}`} className="btn btn-ghost btn-xs">
                                            details
                                        </Link>
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
