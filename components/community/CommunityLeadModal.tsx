"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitCommunityLead } from "@/lib/community/lead-funnel";
import { GraduationCap, Sparkles, CheckCircle2, Phone, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface CommunityLeadModalProps {
  institute?: {
    id: string;
    name: string;
    city?: string | null;
  } | null;
  availableInstitutes?: Array<{
    id: string;
    name: string;
    city?: string | null;
  }>;
  defaultExam?: string;
  trigger?: React.ReactNode;
}

export function CommunityLeadModal({
  institute,
  availableInstitutes = [],
  trigger,
}: CommunityLeadModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [selectedInstId, setSelectedInstId] = useState(
    institute?.id || availableInstitutes[0]?.id || ""
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Sync selected institute ID if prop changes
  React.useEffect(() => {
    if (institute?.id) {
      setSelectedInstId(institute.id);
    } else if (availableInstitutes.length > 0 && !selectedInstId) {
      setSelectedInstId(availableInstitutes[0].id);
    }
  }, [institute, availableInstitutes]);

  const activeInstitute =
    institute ||
    availableInstitutes.find((i) => i.id === selectedInstId) ||
    availableInstitutes[0] ||
    null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!phone || phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    const targetId = institute?.id || selectedInstId || availableInstitutes[0]?.id;
    if (!targetId) {
      toast.error("Please select a target coaching institute.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("phone", phone);
      formData.append("email", email.trim());
      formData.append("instituteId", targetId);
      formData.append("message", message.trim());

      const res = await submitCommunityLead(formData);
      if (res.success) {
        setSubmitted(true);
        toast.success(`Callback request sent to ${res.instituteName || "institute"}!`);
      } else {
        toast.error(res.error || "Failed to submit callback request.");
      }
    } catch (err) {
      toast.error("Failed to submit callback request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setMessage("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs gap-1.5 shadow-xs">
            <GraduationCap className="w-4 h-4" />
            Request Free Callback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px] p-6 rounded-2xl">
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Callback Request Sent!
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-sm max-w-sm mx-auto">
              The admissions desk at <strong>{activeInstitute?.name || "the coaching center"}</strong> has received your callback request and will call you directly on <strong>{phone}</strong> regarding admissions, batch schedules, and fee details.
            </DialogDescription>
            <div className="pt-3">
              <Button onClick={handleClose} className="rounded-full bg-slate-900 text-white font-semibold px-6">
                Back to Community
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Admissions Partner
              </div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                Request Institute Admission Callback
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-sm">
                Get a direct callback from admissions counselors at <strong>{activeInstitute?.name || "top coaching centers"}</strong>.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
              {!institute && availableInstitutes.length > 0 ? (
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Preferred Institute *</Label>
                  <select
                    value={selectedInstId}
                    onChange={(e) => setSelectedInstId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {availableInstitutes.map((inst: (typeof availableInstitutes)[number]) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} {inst.city ? `(${inst.city})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ) : institute ? (
                <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Target Coaching:</span>
                  <span className="font-bold text-slate-900">{institute.name}</span>
                </div>
              ) : null}

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Full Name *</Label>
                <Input
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Mobile Number (WhatsApp) *
                </Label>
                <Input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  required
                  maxLength={10}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </Label>
                <Input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  Your Query / Target Course <span className="text-slate-400 font-normal">(Optional)</span>
                </Label>
                <Textarea
                  placeholder="e.g. Inquiring for JEE 2026 dropper batch fees, scholarship test dates, or demo class..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  maxLength={300}
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    "Request Callback"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
