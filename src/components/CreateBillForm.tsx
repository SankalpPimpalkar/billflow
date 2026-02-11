'use client'

import { createBill, createCategory } from "@/actions/bill.actions";
import { Upload, X, Plus, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useFormStatus } from 'react-dom';

type Category = {
    id: number;
    name: string;
};

const CalendarDate = "calendar-date" as any;
const CalendarMonth = "calendar-month" as any;

export default function CreateBillForm({ categories: initialCategories }: { categories: Category[] }) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [dueDate, setDueDate] = useState<string>("")
    const dueDateButtonRef = useRef<HTMLButtonElement>(null)
    const calendarRef = useRef<any>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        setIsCreatingCategory(true);
        try {
            const category = await createCategory(newCategory);
            setCategories([...categories, category]);
            setSelectedCategory(category.name);
            setIsAddingCategory(false);
            setNewCategory("");
        } catch (error) {
            console.error("Failed to create category", error);
        } finally {
            setIsCreatingCategory(false);
        }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleFile = (file: File) => {
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setFileType('image');
        } else if (file.type === 'application/pdf') {
            setPreviewUrl(null);
            setFileType('pdf');
        }
    };

    const removeFile = () => {
        setPreviewUrl(null);
        setFileType(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        let el: any

        import("cally").then(() => {
            el = calendarRef.current
            if (!el) return

            const handler = () => {
                const value = el.value
                if (value) {
                    setDueDate(value)
                        ; (document.getElementById("cally-popover-due-date") as any)?.hidePopover()
                }
            }

            el.addEventListener("click", handler)

            return () => {
                el.removeEventListener("click", handler)
            }
        })
    }, [])


    return (
        <form action={createBill} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Merchant Name</span>
                    </label>
                    <input name="merchant_name" type="text" placeholder="e.g. Electric Company" className="input input-bordered w-full" required />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Amount</span>
                    </label>
                    <input name="amount" type="number" step="0.01" placeholder="e.g. 150.00" className="input input-bordered w-full" required />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Due Date</span>
                    </label>

                    {/* Trigger button (styled like daisy input) */}
                    <button
                        type="button"
                        ref={dueDateButtonRef}
                        popoverTarget="cally-popover-due-date"
                        className="input input-bordered w-full text-left flex items-center"
                        style={{ anchorName: "--due-date-anchor" }}
                    >
                        {dueDate
                            ? new Date(dueDate).toLocaleDateString()
                            : "Pick a date"}
                    </button>

                    {/* Popover */}
                    <div
                        popover="auto"
                        id="cally-popover-due-date"
                        className="dropdown bg-base-100 rounded-box shadow-lg mt-2"
                        style={{ positionAnchor: "--due-date-anchor" }}
                    >
                        <CalendarDate
                            ref={(el: any) => {
                                calendarRef.current = el
                            }}
                            className="cally"
                        >
                            <svg
                                aria-label="Previous"
                                className="fill-current size-4"
                                slot="previous"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>

                            <svg
                                aria-label="Next"
                                className="fill-current size-4"
                                slot="next"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>

                            <CalendarMonth />
                        </CalendarDate>
                    </div>

                    {/* Hidden input for form submission */}
                    <input type="hidden" name="due_date" value={dueDate} required />
                </div>

                <div className="form-control w-full space-y-3">
                    <label className="label">
                        <span className="label-text">Category</span>
                    </label>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <label
                                key={cat.id}
                                className={`btn btn-sm ${selectedCategory === cat.name ? 'btn-primary' : 'btn-outline text-base-content/70 hover:bg-base-200'}`}
                            >
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat.name}
                                    className="hidden"
                                    checked={selectedCategory === cat.name}
                                    onChange={() => setSelectedCategory(cat.name)}
                                />
                                {cat.name}
                            </label>
                        ))}

                        <button
                            type="button"
                            className="btn btn-sm btn-ghost btn-circle border border-dashed border-base-content/30"
                            onClick={() => setIsAddingCategory(true)}
                            title="Add new category"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {isAddingCategory && (
                        <div className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-top-2">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="New category name"
                                className="input input-bordered input-sm w-full max-w-xs"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className="btn btn-sm btn-primary btn-square"
                                disabled={!newCategory.trim() || isCreatingCategory}
                            >
                                {isCreatingCategory ? <span className="loading loading-spinner loading-xs"></span> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsAddingCategory(false); setNewCategory(''); }}
                                className="btn btn-sm btn-ghost btn-square"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Hidden input to ensure form submission includes category if radio logic fails or just as backup */}
                    <input type="hidden" name="category" value={selectedCategory} />
                </div>
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Attachment (Receipt/Bill)</span>
                </label>

                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${previewUrl || fileType === 'pdf' ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary'}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        name="attachment"
                        accept="image/*,.pdf"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    {previewUrl ? (
                        <div className="relative w-full max-w-xs mx-auto aspect-[3/4]">
                            <Image
                                src={previewUrl}
                                alt="Bill preview"
                                fill
                                className="object-contain rounded-md"
                            />
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : fileType === 'pdf' ? (
                        <div className="relative inline-block">
                            <div className="flex flex-col items-center gap-2 text-primary">
                                <span className="text-4xl">📄</span>
                                <span className="font-medium">PDF Attached</span>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-base-content/60">
                            <Upload className="w-10 h-10" />
                            <p>Click to upload or drag and drop</p>
                            <p className="text-xs">SVG, PNG, JPG or PDF (MAX. 5MB)</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <SubmitButton />
            </div>
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? <span className="loading loading-spinner"></span> : 'Create Bill'}
        </button>
    )
}
