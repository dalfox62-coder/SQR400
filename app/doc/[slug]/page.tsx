"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DeutschePrintout from "@/app/banks/deutsche/DeutschePrintout";
// import HSBCPrintout from "@/app/banks/hsbc/HSBCPrintout"; // Can add others later

export default function PublicDocumentPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Override viewport for this specific page so the A4 document fits on mobile screens without being cut off
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute('content', 'width=850, initial-scale=0.4');
    }
    
    if (!slug) return;
    const fetchDoc = async () => {
      try {
        const res = await fetch(`/api/transactions?slug=${encodeURIComponent(slug as string)}`);
        const json = await res.json();
        
        if (!res.ok) {
          throw new Error(json.error || "Document not found");
        }
        
        setData(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();

    return () => {
      // Restore viewport on unmount
      if (meta) {
        meta.setAttribute('content', 'width=device-width, initial-scale=1');
      }
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-red-400 font-mono text-xl">
        [ERROR]: {error || "Document not found"}
      </div>
    );
  }

  // Render the appropriate bank printout
  // Right now only Deutsche is fully configured for QR code in this task, but we can switch if needed
  if (data.bankId === "deutsche") {
    return (
      <div className="min-h-screen bg-[#525659] print:bg-white flex flex-col items-center py-8 print:py-0 px-2 print:px-0 overflow-x-auto print:overflow-visible">
        <DeutschePrintout data={data} isPublic={true} />
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-yellow-400 font-mono text-xl text-center px-6">
      [WARNING]: Public view for {data.selectedBank} is not fully implemented yet.
    </div>
  );
}
