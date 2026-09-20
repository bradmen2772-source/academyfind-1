"use client";

import { useState, useEffect } from "react";
import { MapPin, IndianRupee, Lock, Sparkles, ArrowRight } from "lucide-react";
import { submitStudentEnquiry } from "@/lib/User/user/user-enquiry";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import CallBackSuccessPopUp from "@/components/User/CallBackFillPopUp";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildAuthHref } from "@/lib/auth/redirect-utils";
import { INDIAN_PHONE_REGEX } from "@/lib/phone-validation";

type Props = {
  instituteId: string;
  instituteName?: string | null;
  feeInfo?: string | null;
  mapsUrl?: string | null;
  isLoggedIn?: boolean;
  defaultName?: string | null;
  defaultPhone?: string | null;
  defaultEmail?: string | null;
};

export default function InstituteEnquiryForm({
  instituteId,
  instituteName,
  feeInfo,
  mapsUrl,
  isLoggedIn = false,
  defaultName = "",
  defaultPhone = "",
  defaultEmail = "",
}: Props) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState(defaultName || "");
  const [mobile, setMobile] = useState(defaultPhone || "");
  const [email, setEmail] = useState(defaultEmail || "");
  const [msg, setmsg] = useState("");

  useEffect(() => {
    if (defaultName && !name) setName(defaultName);
    if (defaultPhone && !mobile) setMobile(defaultPhone);
    if (defaultEmail && !email) setEmail(defaultEmail);
  }, [defaultName, defaultPhone, defaultEmail]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoggedIn) {
      window.location.href = buildAuthHref("/login", pathname);
      return;
    }

    if (!name.trim() || !mobile.trim()) {
      toast.error("Please fill your Name and Mobile Number.");
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, "");
    if (!INDIAN_PHONE_REGEX.test(cleanMobile)) {
      toast.error("Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("instituteId", instituteId);

    try {
      const res = await submitStudentEnquiry(formData);
      if (res.success) {
        setShowPopup(true);
      } else {
        toast.error(res.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to submit enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Post-enquiry success popup */}
      <CallBackSuccessPopUp
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        isLoggedIn={isLoggedIn}
        instituteName={instituteName || undefined}
      />

      <div className="sticky top-24 rounded-3xl border bg-white p-6 shadow-sm relative overflow-hidden">
        <h3 className="text-xl font-bold text-slate-900">Get Admission Guidance</h3>
        <p className="mt-2 text-sm text-slate-600">
          Connect directly with {instituteName || "the institute"} for admission details.
        </p>

        {feeInfo && (
          <div className="mt-4 p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Fees</span>
            <span className="text-sm font-bold text-slate-800 flex items-center gap-0.5">
              <IndianRupee className="w-3.5 h-3.5" />{feeInfo}
            </span>
          </div>
        )}

        {/* ── Form Container with Blur / Overlay when Logged Out ── */}
        <div className="relative mt-5">
          {/* Subtle Glassmorphic Login Overlay for Logged-Out Users */}
          {!isLoggedIn && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-white/70 backdrop-blur-[2px] rounded-2xl text-center">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mb-3 shadow-inner ring-1 ring-amber-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900">Login to Submit Enquiry</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-[250px] leading-relaxed">
                Sign in with your AcademyFind account to connect directly with {instituteName || "the institute"}.
              </p>
              <Link href={buildAuthHref("/login", pathname)} className="w-full mt-4 max-w-[240px]">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md shadow-amber-500/20 py-5 text-sm flex items-center justify-center gap-1.5 cursor-pointer">
                  Login to Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}

          {/* Underneath Form (visible but blurred & disabled when logged out) */}
          <form
            onSubmit={handleSubmit}
            className={`space-y-3 transition-all duration-300 ${!isLoggedIn ? "filter blur-[3px] select-none pointer-events-none opacity-50" : ""}`}
            noValidate
          >
            {/* Honeypot for bot suppression */}
            <input type="text" name="website_hp" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

            <input
              required
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name*"
              disabled={!isLoggedIn}
              className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all duration-300"
            />
            <div className="relative flex items-center w-full py-3 px-3 text-sm border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/20 transition-all duration-300">
              <input
                required
                name="phone"
                maxLength={10}
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="Mobile* (10 digits)"
                disabled={!isLoggedIn}
                className="peer order-2 flex-1 bg-transparent outline-none border-none min-w-0 p-0 text-slate-900 placeholder:text-slate-500 focus:placeholder:text-transparent"
              />
              <span className="hidden peer-focus:inline-block peer-[:not(:placeholder-shown)]:inline-block order-1 text-slate-900 font-medium whitespace-nowrap pointer-events-none mr-2">
                +91
              </span>
            </div>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (Optional)"
              disabled={!isLoggedIn}
              className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all duration-300"
            />
            <textarea
              name="message"
              rows={3}
              value={msg}
              onChange={(e) => setmsg(e.target.value)}
              placeholder="Your Query (Optional)"
              disabled={!isLoggedIn}
              className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all duration-300 resize-none"
            ></textarea>

            <Button
              disabled={loading || !isLoggedIn}
              type="submit"
              className="w-full rounded-xl bg-amber-400 px-5 py-3.5 font-bold text-white transition hover:bg-amber-500 shadow-xs cursor-pointer mt-2"
            >
              {loading ? "Sending..." : "Get CallBack"}
            </Button>
          </form>
        </div>

        {mapsUrl && (
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <button className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer">
              <MapPin className="h-4 w-4 text-slate-400" /> View on Maps
            </button>
          </a>
        )}
      </div>
    </>
  );
}