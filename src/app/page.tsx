import CartDrawer from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MenuGrid from "@/components/MenuGrid";
// 1. We import signIn, signOut, and auth from our new auth.ts file
import { signIn, auth } from "@/auth";
import Link from "next/link"; 
import { ClipboardList, LogOut, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// 2. We add 'async' here because fetching the session takes time
export default async function Home() {
  // 3. We ask Auth.js: "Is anyone currently logged in?"
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-slate-900 pb-24">
      {/* Navbar */}
      <header className="p-4 sm:p-6 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-black tracking-tighter">CampusKlub.</h1>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <CartDrawer />

          {session ? (
            <>
              {/* NEW: The Profile Button */}
              <Button variant="ghost" size="icon" asChild className="rounded-full bg-slate-100 hover:bg-slate-200">
                <Link href="/profile">
                  <User className="w-5 h-5 text-slate-700" />
                </Link>
              </Button>
              
              {/* --- MOBILE VIEW (Icons Only) --- */}
              <div className="flex sm:hidden items-center gap-1">
                <Link href="/orders">
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-500 hover:text-slate-900">
                    <ClipboardList className="w-5 h-5" />
                  </Button>
                </Link>
                <form action={async () => {
                  "use server";
                  const { signOut } = await import("@/auth");
                  await signOut();
                }}>
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-500 hover:text-red-600">
                    <LogOut className="w-5 h-5" />
                  </Button>
                </form>
              </div>

              {/* --- DESKTOP VIEW (Full Text) --- */}
              <div className="hidden sm:flex items-center gap-4">
                 <span className="font-medium text-sm">Hi, {session.user?.name?.split(" ")[0]}</span>
                 
                 <Link href="/orders">
                   <Button variant="ghost" className="rounded-full font-semibold text-slate-500 hover:text-slate-900">
                     My Orders
                   </Button>
                 </Link>

                 <form action={async () => {
                   "use server";
                   const { signOut } = await import("@/auth");
                   await signOut();
                 }}>
                   <Button variant="outline" className="rounded-full font-semibold">Logout</Button>
                 </form>
              </div>
            </>
          ) : (
            <form action={async () => {
                "use server";
                const { signIn } = await import("@/auth");
                await signIn("google", { redirectTo: "/dashboard" });
              }}>
              <Button type="submit" variant="ghost" className="rounded-full font-semibold">
                Vendor Login
              </Button>
            </form>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <Badge className="mb-6 bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 px-4 py-1 text-sm rounded-full">
          🚀 The #1 Campus Food App
        </Badge>
        
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight max-w-4xl">
          Skip the line. <br className="hidden md:block"/>
          Get your favorite campus meals <span className="text-[#FFD100]">faster.</span>
        </h2>
        
        <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl">
          Order fresh food from top student vendors, track your meal in real-time, and pick it up the second it's ready.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* If they are NOT logged in, show the Student Login button */}
          {!session ? (
            <form action={async () => {
              "use server";
              const { signIn } = await import("@/auth");
              // Students stay on the homepage to browse food!
              await signIn("google", { redirectTo: "/" });
            }} className="w-full sm:w-auto">
              <Button type="submit" size="lg" className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full h-14 px-8 text-lg font-bold">
                Log in to Order
              </Button>
            </form>
          ) : (
            /* If they ARE logged in, let them go to the menu */
            <Link href="/menu" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-[#FFD100] text-black hover:bg-[#E6BC00] rounded-full h-14 px-8 text-lg font-bold">
                Browse Menu
              </Button>
            </Link>
          )}

          {/* If they are logged in AND they are a vendor (or want to be), give them dashboard access */}
          {session && (
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full rounded-full h-14 px-8 text-lg font-bold border-2">
                Vendor Dashboard
              </Button>
            </Link>
          )}
        </div>
      </main>

    </main>
  );
}