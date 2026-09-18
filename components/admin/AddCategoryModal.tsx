"use client"

import { useState } from "react"
import { createCategory } from "@/lib/User/admin/adminCategories"
import toast from "react-hot-toast"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog"
import { Plus, Save } from "lucide-react"

export default function AddCategoryModal({ categories }: { categories: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const result = await createCategory(formData);
        
        if (result.success) {
            toast.success(result.message || "Category added successfully");
            setIsOpen(false); // Success hone par popup band ho jayega
        } else {
            toast.error(result.error || "Can't add category");
        }
        setIsLoading(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* The Trigger Button */}
            <DialogTrigger asChild>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow-sm">
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </DialogTrigger>
            
            {/* The Modal Content */}
            <DialogContent className="sm:max-w-md p-6 bg-white border-slate-100 rounded-3xl shadow-xl outline-none">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold text-slate-800">Create New Category</DialogTitle>
                </DialogHeader>
                
                <form action={handleSubmit} className="space-y-5">
                    {/* Category Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Category Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            required
                            placeholder="e.g. Programming, Class 10, etc."
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                        />
                        <p className="text-[10px] text-slate-400">URL slug will be generated automatically.</p>
                    </div>

                    {/* Parent Category Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Parent Category (Optional)</label>
                        <select 
                            name="parentId" 
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                        >
                            <option value="">-- Make this a Main Category --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.level === 0 ? cat.name : `${'—'.repeat(cat.level)} ${cat.name}`}
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-slate-500">If you select a parent, this will become a nested sub-category.</p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : <><Save className="w-4 h-4" /> Create Category</>}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}