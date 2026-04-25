// src/app/orders/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Clock, Store, CheckCircle2 } from "lucide-react";

export default async function StudentOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/"); // Kick them out if not logged in
  }

  // Fetch all orders for this specific student, including the vendor and food details
  const orders = await prisma.order.findMany({
    where: { studentId: session.user.id },
    orderBy: { createdAt: "desc" }, // Newest orders at the top
    include: {
      vendor: true,
      items: {
        include: {
          foodItem: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-slate-900 pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="p-4 sm:p-6 flex items-center gap-4 max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-black tracking-tighter">My Orders</h1>
        </div>
      </header>

      {/* Orders List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {orders.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-dashed shadow-sm">
            <h3 className="text-xl font-bold mb-2">No orders yet!</h3>
            <p className="text-slate-500 mb-6">You haven't placed any orders. Go grab some food!</p>
            <Link href="/">
              <Button className="bg-[#FFD100] text-black hover:bg-[#E6BC00] font-bold rounded-full px-8">
                Browse Menu
              </Button>
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="rounded-3xl overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-slate-50 border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Store className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-lg">{order.vendor.storeName}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Order #{order.id.slice(-6).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Dynamic Status Badge */}
                <div>
                  {order.status === "PENDING" && <Badge className="bg-amber-100 text-amber-700 text-sm px-3 py-1"><Clock className="w-3 h-3 mr-1" /> Preparing</Badge>}
                  {order.status === "READY" && <Badge className="bg-green-500 text-white animate-pulse text-sm px-3 py-1"><CheckCircle2 className="w-3 h-3 mr-1" /> Ready for Pickup!</Badge>}
                  {order.status === "COMPLETED" && <Badge className="bg-slate-200 text-slate-600 text-sm px-3 py-1">Picked Up</Badge>}
                  {order.status === "CANCELLED" && <Badge className="bg-red-100 text-red-700 text-sm px-3 py-1">Cancelled</Badge>}
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm sm:text-base">
                      <div className="flex items-center gap-3">
                        <span className="font-black bg-slate-100 text-slate-600 w-8 h-8 flex items-center justify-center rounded-md">
                          {item.quantity}x
                        </span>
                        <span className="font-medium">{item.foodItem.name}</span>
                      </div>
                      <span className="text-slate-500">₦{(item.priceAtBuy * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-slate-500 font-medium">Total Amount</span>
                  <span className="text-2xl font-black">₦{order.totalAmount.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}