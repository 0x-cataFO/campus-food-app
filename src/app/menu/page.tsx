import MenuGrid from "@/components/MenuGrid";
import { Badge } from "@/components/ui/badge";

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 text-center">
          <Badge className="mb-4 bg-[#FFD100] text-black hover:bg-[#E6BC00] border-0 px-4 py-1 text-sm rounded-full">
            Available Deals
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Campus Menu</h1>
          <p className="text-slate-500 text-lg">Browse fresh meals from your favorite student vendors.</p>
        </div>
        
        {/* We moved your grid here! */}
        <MenuGrid />
      </div>
    </main>
  );
}