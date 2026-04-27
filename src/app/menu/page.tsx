// src/app/menu/page.tsx
import MenuGrid from "@/components/MenuGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* THE FIX: We use flexbox to push the Back button left and Cart right */}
        <div className="flex justify-between items-center mb-6">
          {/* The Back Button */}
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-orange-500 transition-colors">
            <Link href="/">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </Button>

          {/* NEW: The Cart Drawer dropped right here! */}
          <CartDrawer />
        </div>

        <div className="mb-10 text-center">
          <Badge className="mb-4 bg-[#FFD100] text-black hover:bg-[#E6BC00] border-0 px-4 py-1 text-sm rounded-full">
            Available Deals
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Campus Menu</h1>
          <p className="text-slate-500 text-lg">Browse fresh meals from your favorite student vendors.</p>
        </div>
        
        <MenuGrid />
      </div>
    </main>
  );
}