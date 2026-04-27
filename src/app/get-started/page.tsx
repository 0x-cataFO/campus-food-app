// src/app/get-started/page.tsx
import { UtensilsCrossed, Store, GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "@/auth";

export default function GetStartedPage() {
  return (
    // THE FIX: Changed justify-center to justify-start on mobile. Added pt-8 so it doesn't clip the top.
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-start md:justify-center p-4 pt-8 md:p-8 selection:bg-orange-200">
      
      <div className="w-full max-w-5xl">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 md:mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-orange-100 text-orange-600 rounded-full mb-4 md:mb-6">
            <UtensilsCrossed className="w-5 h-5 md:w-8 md:h-8" />
          </div>
          <h1 className="text-2xl md:text-5xl font-black tracking-tight text-slate-900 mb-2 md:mb-4">
            Welcome to CampusKlub
          </h1>
          <p className="text-sm md:text-xl text-slate-500">
            How would you like to use the app today?
          </p>
        </div>

        {/* The Two Cards - Added pb-12 so mobile users can scroll past the bottom button comfortably */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto pb-12 md:pb-0">
          
          {/* --- STUDENT CARD --- */}
          {/* THE FIX: Shrunk padding from p-8 to p-6 on mobile, adjusted border radius */}
          <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all flex flex-col items-center text-center group cursor-default">
            {/* THE FIX: Shrunk icon container from w-20 to w-16 on mobile */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 text-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center mb-4 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <GraduationCap className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">I'm a Student</h2>
            <p className="text-slate-500 mb-6 md:mb-8 flex-1 text-sm md:text-base leading-relaxed">
              I want to browse menus, order food, pay securely online, and skip the line at my favorite campus spots.
            </p>

            <form action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }} className="w-full">
              {/* THE FIX: Button height h-12 on mobile, h-16 on desktop */}
              <Button type="submit" className="w-full h-12 md:h-16 text-base md:text-lg rounded-xl md:rounded-2xl bg-slate-900 text-white hover:bg-blue-600 font-bold transition-colors">
                Continue as Student
              </Button>
            </form>
          </div>

          {/* --- VENDOR CARD --- */}
          <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border-2 border-transparent hover:border-orange-200 hover:shadow-xl transition-all flex flex-col items-center text-center group cursor-default">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-50 text-orange-600 rounded-2xl md:rounded-3xl flex items-center justify-center mb-4 md:mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <Store className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">I'm a Vendor</h2>
            <p className="text-slate-500 mb-6 md:mb-8 flex-1 text-sm md:text-base leading-relaxed">
              I want to set up my digital store, manage my menu, and receive secure online orders from students.
            </p>

            <form action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }} className="w-full">
              <Button type="submit" variant="outline" className="w-full h-12 md:h-16 text-base md:text-lg rounded-xl md:rounded-2xl border-2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 font-bold transition-colors">
                Continue as Vendor
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}