"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { JobApplicationStatus } from "@/app/generated/prisma/enums";
import { updateApplicationStatus } from "@/lib/User/admin/adminhandleJob";

type Props = {
    applicationId: string;
    currentStatus: JobApplicationStatus;
    currentNotes: string;
};

export default function ApplicationStatusForm({ applicationId, currentStatus, currentNotes }: Props) {
    const [status, setStatus] = useState<JobApplicationStatus>(currentStatus);
    const [notes, setNotes] = useState(currentNotes);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await updateApplicationStatus(applicationId, status, notes);
            if (res.success) {
                toast.success(res.message || "Application Status update successfully");
            } else {
                toast.error(res.error || "Failed to save data.");
            }
        } catch (error) {
            toast.error("Internal Server Error.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white sticky top-24">
            <h3 className="text-lg font-extrabold mb-4 border-b border-slate-700 pb-2">ATS Controls</h3>
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Status</label>
                    <Select value={status} onValueChange={(val) => setStatus(val as JobApplicationStatus)}>
                        <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white font-bold h-11">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="NEW" className="font-bold text-blue-400">NEW</SelectItem>
                            <SelectItem value="REVIEWING" className="font-bold text-amber-400">REVIEWING</SelectItem>
                            <SelectItem value="SHORTLISTED" className="font-bold text-emerald-400">SHORTLISTED</SelectItem>
                            <SelectItem value="REJECTED" className="font-bold text-rose-400">REJECTED</SelectItem>
                            <SelectItem value="HIRED" className="font-bold text-purple-400">HIRED</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Internal HR Notes</label>
                    <Textarea 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)} 
                        placeholder="Add private remarks about this candidate (e.g., Expected salary, interview feedback)..." 
                        rows={6}
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none text-sm"
                    />
                    <p className="text-[10px] text-slate-500">Only visible to administrators.</p>
                </div>

                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 mt-4"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? "Saving Data..." : "Save Updates"}
                </button>
            </div>
        </div>
    );
}