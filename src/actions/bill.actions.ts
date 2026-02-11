'use server'

import { createClient } from "@/utils/supabase/server.supabase";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createBill(formData: FormData) {
    const supabase = createClient(cookies())

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const merchant_name = formData.get('merchant_name') as string
    const amount = formData.get('amount')
    const due_date = formData.get('due_date') as string
    const category = formData.get('category') as string
    const attachment = formData.get('attachment') as File

    let attachment_url = null

    if (attachment && attachment.size > 0) {
        const fileExt = attachment.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('bill-attachments')
            .upload(fileName, attachment)

        if (uploadError) {
            console.error('Error uploading file:', uploadError)
            // Handle error or throw
            throw new Error("Failed to upload attachment")
        }

        const { data: { publicUrl } } = supabase.storage
            .from('bill-attachments')
            .getPublicUrl(fileName)

        attachment_url = publicUrl
    }

    const { error } = await supabase.from('bills').insert({
        merchant_name,
        amount: Number(amount),
        due_date,
        category,
        attachment_url,
        owner: user.id,
        is_paid: false,
        is_deleted: false
    })

    if (error) {
        console.error('Error creating bill:', error)
        throw new Error("Failed to create bill")
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

export async function getCategories() {
    const supabase = createClient(cookies())
    const { data, error } = await supabase.from('bill_categories').select('*')
    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }
    return data
}

export async function getBills() {
    const supabase = createClient(cookies())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('owner', user.id)
        .eq('is_deleted', false)
        .order('due_date', { ascending: true })

    if (error) {
        console.error('Error fetching bills:', error)
        return []
    }
    return data
}

export async function getBillById(id: number) {
    const supabase = createClient(cookies())
    const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching bill:', error)
        return null
    }
    return data
}

export async function markBillAsPaid(formData: FormData) {
    const supabase = createClient(cookies())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const billId = formData.get('bill_id')
    const receipt = formData.get('receipt') as File

    let receipt_url = null

    if (receipt && receipt.size > 0) {
        const fileExt = receipt.name.split('.').pop()
        const fileName = `receipts/${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('bill-attachments')
            .upload(fileName, receipt)

        if (uploadError) {
            console.error('Error uploading receipt:', uploadError)
            throw new Error("Failed to upload receipt")
        }

        const { data: { publicUrl } } = supabase.storage
            .from('bill-attachments')
            .getPublicUrl(fileName)

        receipt_url = publicUrl
    }

    const { error } = await supabase.from('bills')
        .update({
            is_paid: true,
            attachment_url: receipt_url
        })
        .eq('id', billId)
        .eq('owner', user.id)

    if (error) {
        console.error('Error marking bill as paid:', error)
        throw new Error("Failed to update bill")
    }

    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/bills/${billId}`)
    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/bills/${billId}`)
}

export async function createCategory(name: string) {
    const supabase = createClient(cookies())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase.from('bill_categories')
        .insert({ name, owner: user.id })
        .select()
        .single()

    if (error) {
        console.error('Error creating category:', error)
        throw new Error("Failed to create category")
    }

    revalidatePath('/dashboard/bills/create')
    return data
}
