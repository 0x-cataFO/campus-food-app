import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Phone, User as UserIcon, Wallet, Save } from "lucide-react";
import Link from "next/link";
import { updateProfile } from "./actions";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  // Fetch the user, their phone number, and all their COMPLETED orders
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        where: { status: "COMPLETED" } // Only count orders they actually received
      }
    }
  });

  if (!user) redirect("/");

  // Calculate total lifetime spending
  const totalSpent = user.orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <main className="min-h-screen bg-slate-50 pt-8 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-[#FFD100] transition-colors">
            <Link href="/">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">My Profile</h1>
          <p className="text-slate-500 mt-2">Manage your details and track your food spending.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          
          {/* STATS CARD */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Lifetime Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-[#FFD100]">
                ₦{totalSpent.toLocaleString()}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Total spent on CampusKlub across {user.orders.length} orders.
              </p>
            </CardContent>
          </Card>

          {/* PROFILE UPDATE CARD */}
          <Card className="md:col-span-2 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-slate-500" /> Edit Profile
              </CardTitle>
              <CardDescription>
                Update your name and phone number for vendors to reach you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Point to our new updateProfile action */}
              <form action={updateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      defaultValue={user.name || ""} 
                      required 
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      placeholder="e.g. 08012345678" 
                      defaultValue={user.phone || ""} 
                      required 
                      className="bg-slate-50"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" className="px-8 bg-black text-white hover:bg-slate-800 font-bold">
                    <Save className="w-4 h-4 mr-2" /> Save Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  );
}