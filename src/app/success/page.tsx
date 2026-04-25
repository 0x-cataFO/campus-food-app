import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full border border-slate-100">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-black tracking-tight mb-2">Order Received!</h1>
        <p className="text-slate-500 mb-8">
          The vendor has been notified and is preparing your food. Pay when you pick it up!
        </p>
        <Link href="/">
          <Button className="w-full rounded-full h-12 text-lg font-bold bg-slate-900 text-white hover:bg-slate-800">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}