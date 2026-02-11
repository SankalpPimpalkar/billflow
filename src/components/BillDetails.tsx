'use client'

import { markBillAsPaid } from "@/actions/bill.actions";
import { ArrowLeft, Calendar, CheckCircle, CreditCard, Download, FileText, Store, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";

interface Bill {
    id: number;
    merchant_name: string;
    amount: number;
    due_date: string;
    category: string;
    attachment_url: string | null;
    is_paid: boolean;
}

export default function BillDetails({ bill }: { bill: Bill }) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="btn btn-circle btn-ghost">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold">Bill Details</h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <div className="md:col-span-2 space-y-6">
                    <div className="card bg-base-100 shadow-xl border border-base-100">
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="card-title text-3xl">{bill.merchant_name}</h2>
                                    <div className="badge bg-primary text-primary-content font-semibold text-xs mt-2">{bill.category}</div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-70">Amount Due</p>
                                    <p className="text-3xl font-mono font-bold text-primary">${bill.amount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="divider"></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-base-content/70" />
                                    <div>
                                        <p className="text-xs opacity-70">Due Date</p>
                                        <p className="font-medium">{new Date(bill.due_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full ${bill.is_paid ? 'bg-success' : 'bg-warning'}`}></div>
                                    <div>
                                        <p className="text-xs opacity-70">Status</p>
                                        <p className={`font-medium ${bill.is_paid ? 'text-success' : 'text-warning'}`}>
                                            {bill.is_paid ? 'Paid' : 'Unpaid'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attachment Section */}
                    {bill.attachment_url && (
                        <div className="card bg-base-100 shadow-xl border border-base-100">
                            <div className="card-body">
                                <h3 className="card-title text-lg flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Attachment
                                </h3>
                                <div className="mt-4 p-4 bg-base-200 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-sm overflow-hidden">
                                        <span className="truncate max-w-[200px]">{bill.attachment_url.split('/').pop()}</span>
                                    </div>
                                    <a href={bill.attachment_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
                                        <Download className="w-4 h-4 mr-2" />
                                        View/Download
                                    </a>
                                </div>
                                {/* Preview if image */}
                                {['jpg', 'jpeg', 'png', 'webp'].some(ext => bill.attachment_url?.toLowerCase().includes(ext)) && (
                                    <div className="mt-4 relative h-64 w-full rounded-lg overflow-hidden border border-base-300">
                                        <Image
                                            src={bill.attachment_url}
                                            alt="Attachment preview"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions Sidebar */}
                <div className="space-y-6">
                    <div className="card bg-base-100 shadow-xl border border-base-100">
                        <div className="card-body">
                            <h3 className="card-title text-lg">Actions</h3>
                            <div className="space-y-3 mt-2">
                                {!bill.is_paid ? (
                                    <button
                                        className="btn btn-primary w-full"
                                        onClick={() => dialogRef.current?.showModal()}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Mark as Paid
                                    </button>
                                ) : (
                                    <div className="alert alert-success text-sm py-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Bill Paid on {new Date().toLocaleDateString()} {/* Ideal to store paid_at */}
                                    </div>
                                )}

                                <button className="btn btn-outline w-full" disabled>
                                    Edit Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mark as Paid Modal */}
            <dialog ref={dialogRef} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mb-4">Mark Bill as Paid</h3>
                    <p className="py-2 text-sm text-base-content/70 mb-4">
                        Please upload the receipt to confirm payment for <strong>{bill.merchant_name}</strong>.
                    </p>

                    <MarkPaidForm billId={bill.id} closeDialog={() => dialogRef.current?.close()} />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}

function MarkPaidForm({ billId, closeDialog }: { billId: number, closeDialog: () => void }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(file));
                setFileType('image');
            } else {
                setPreviewUrl(null);
                setFileType('pdf');
            }
        }
    }

    return (
        <form action={async (formData) => {
            await markBillAsPaid(formData);
            closeDialog();
        }} className="space-y-4">
            <input type="hidden" name="bill_id" value={billId} />

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Receipt Attachment</span>
                </label>
                <div
                    className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        name="receipt"
                        accept="image/*,.pdf"
                        required
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    {previewUrl ? (
                        <div className="relative w-full max-w-[200px] mx-auto aspect-video">
                            <Image
                                src={previewUrl}
                                alt="Receipt preview"
                                fill
                                className="object-contain rounded-md"
                            />
                        </div>
                    ) : fileType === 'pdf' ? (
                        <div className="flex flex-col items-center gap-2 text-primary">
                            <span className="font-medium">PDF Selected</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-base-content/60">
                            <Upload className="w-6 h-6" />
                            <span className="text-sm">Upload Receipt</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="modal-action">
                <SubmitButton />
            </div>
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? <span className="loading loading-spinner"></span> : 'Confirm Payment'}
        </button>
    )
}
