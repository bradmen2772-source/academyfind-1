"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { FileText, Send, Loader2, CheckCircle2, UploadCloud } from "lucide-react";
import { applyForJob } from "@/lib/User/user/user-job-apply";

export default function ApplyJobForm({ jobId }: { jobId: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Please upload your resume in PDF format only.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) { 
            toast.error("File is too large. Maximum size is 5MB.");
            return;
        }
        setResumeFile(file);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!resumeFile) {
            toast.error("Please attach your Resume/CV to proceed.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        formData.append("jobId", jobId);
        formData.append("resumeFile", resumeFile);

        try {
            const result = await applyForJob(formData);
            if (result.success) {
                setIsSuccess(true);
                toast.success("Application submitted successfully!");
            } else {
                toast.error(result.error || "Failed to submit application.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-10 space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-amber-100">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Application Received!</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Thank you for applying. Your profile has been logged in our system. Our hiring team will review it and contact you shortly.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name *</label>
                <input name="name" required placeholder="Jane Doe" className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none text-sm transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email *</label>
                    <input name="email" type="email" required placeholder="jane@example.com" className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none text-sm transition-all" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone *</label>
                    <input name="phone" type="tel" required placeholder="+91 98765 43210" className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none text-sm transition-all" />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">LinkedIn URL</label>
                <input name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/jane" className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none text-sm transition-all" />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Portfolio / Website</label>
                <input name="portfolioUrl" type="url" placeholder="https://janedoe.com" className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none text-sm transition-all" />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Resume / CV (PDF) *</label>
                <div className="border border-dashed border-amber-300 rounded-xl p-4 bg-amber-50/30 hover:bg-amber-50 transition-all cursor-pointer relative group">
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                        {resumeFile ? (
                            <>
                                <FileText className="w-6 h-6 text-amber-600" />
                                <span className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{resumeFile.name}</span>
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-6 h-6 text-amber-400 group-hover:text-amber-500 transition-colors" />
                                <span className="text-xs font-medium text-slate-600">Click to upload your resume</span>
                                <span className="text-[10px] text-slate-400">PDF up to 5MB</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Cover Letter Notes</label>
                <textarea name="coverLetter" rows={3} placeholder="Briefly describe why you fit this role..." className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none text-sm transition-all resize-none"></textarea>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-600/10 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
            </button>
        </form>
    );
}