"use client"

import { useState } from "react"
import { toggleInstituteStatus } from "@/lib/User/admin/ToggleInstitute"
import toast from "react-hot-toast"
import { Power, Eye, EyeOff } from "lucide-react"

export default function ToggleStatusButton({ 
    instituteId, 
    isActive, 
    isPublished 
}: { 
    instituteId: string; 
    isActive: boolean; 
    isPublished: boolean;
}) {
    const [loadingType, setLoadingType] = useState<'active' | 'publish' | null>(null)

    // Hum field parameter bhejenge taaki backend ko pata chale kya update karna hai
    async function handleToggle(field: 'isActive' | 'isPublished', currentValue: boolean) {
        setLoadingType(field === 'isActive' ? 'active' : 'publish');
        
        // Backend Server Action call
        const result = await toggleInstituteStatus(instituteId, currentValue, field);
        
        if (result.success) {
            toast.success(result.message || "Status updated successfully");
        } else {
            toast.error(result.error || "Cannot change status");
        }
        setLoadingType(null);
    }

    return (
        <div className="flex flex-col gap-2 mt-2 w-full min-w-[120px]">
            {/* 1. Active / Inactive Button */}
            <button 
                onClick={() => handleToggle('isActive', isActive)}
                disabled={loadingType !== null}
                className={`flex items-center justify-center gap-1.5 w-full px-2 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    isActive 
                        ? 'border-red-200 text-red-600 hover:bg-red-50' 
                        : 'border-green-200 text-green-600 hover:bg-green-50'
                }`}
            >
                <Power className="w-3.5 h-3.5" />
                {loadingType === 'active' ? "Wait..." : (isActive ? "Mark Inactive" : "Mark Active")}
            </button>

            {/* 2. Publish / Hide Button */}
            <button 
                onClick={() => handleToggle('isPublished', isPublished)}
                disabled={loadingType !== null}
                className={`flex items-center justify-center gap-1.5 w-full px-2 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    isPublished 
                        ? 'border-slate-300 text-slate-600 hover:bg-slate-100' 
                        : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
            >
                {loadingType === 'publish' ? (
                    "Wait..."
                ) : isPublished ? (
                    <><EyeOff className="w-3.5 h-3.5" /> Hide Profile</>
                ) : (
                    <><Eye className="w-3.5 h-3.5" /> Publish Profile</>
                )}
            </button>
        </div>
    )
}