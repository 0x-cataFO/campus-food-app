// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// ADDED ArrowLeft HERE!
import { Package, ShoppingBag, DollarSign, LogOut, Edit, Trash, Menu, Store, Pause, Play, History, CheckCircle, ArrowLeft } from "lucide-react";
import AddFoodModal from "@/components/AddFoodModal";
import EditFoodModal from "@/components/EditFoodModal";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <p className="text-slate-500 mb-6">You need to be signed in to view your dashboard.</p>
          <Button asChild className="rounded-full px-8">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fetch Vendor Profile, Items, and Orders
  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      foodItems: { 
        where: { isArchived: false },
        orderBy: { createdAt: 'desc' } 
      },
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          student: true,
          items: { include: { foodItem: true } }
        }
      }
    }
  });

  if (!vendor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
          <Store className="w-16 h-16 text-[#FFD100] mx-auto mb-6" />
          <h1 className="text-2xl font-black tracking-tight mb-2">Become a Vendor</h1>
          <p className="text-slate-500 mb-8">Set up your store and start taking orders from students today.</p>
          <AddFoodModal />
        </div>
      </div>
    );
  }

  // Data helpers
  const menuItems = vendor.foodItems || [];
  const activeOrders = vendor.orders?.filter((order) => order.status !== "COMPLETED" && order.status !== "CANCELLED") || [];
  const completedOrders = vendor.orders?.filter((order) => order.status === "COMPLETED") || [];
  
  const pendingOrdersCount = activeOrders.filter((order) => order.status === "PENDING").length || 0;
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* --- MOBILE NAVIGATION --- */}
      <div className="md:hidden flex items-center justify-between bg-white border-b p-4 sticky top-0 z-20">
        <h2 className="text-xl font-black tracking-tighter">CampusKlub.</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu className="w-6 h-6" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-white p-6 flex flex-col h-full">
            <SheetHeader className="text-left mb-6">
              <SheetTitle className="text-xl font-black tracking-tighter">CampusKlub.</SheetTitle>
              <SheetDescription className="sr-only">Dashboard navigation</SheetDescription>
            </SheetHeader>
            <nav className="space-y-2 flex-1">
              {/* THE MOBILE BACK BUTTON */}
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start gap-2 text-slate-500 hover:text-slate-900 mb-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Home
                </Button>
              </Link>
              <Button variant="secondary" className="w-full justify-start gap-2">
                <Store className="w-4 h-4" /> My Store
              </Button>
            </nav>
            <div className="mt-auto pt-8">
              <form action={async () => {
                "use server";
                const { signOut } = await import("@/auth");
                await signOut({ redirectTo: "/" });
              }}>
                <Button variant="outline" className="w-full justify-start gap-2 text-red-500 hover:bg-red-50">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex w-64 bg-white border-r p-6 flex-col sticky top-0 h-screen z-10">
        <div>
          <h2 className="text-xl font-black tracking-tighter mb-6">CampusKlub.</h2>
          <nav className="space-y-2">
            {/* THE DESKTOP BACK BUTTON */}
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start gap-2 text-slate-500 hover:text-slate-900 mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
            <Button variant="secondary" className="w-full justify-start gap-2">
              <Store className="w-4 h-4" /> My Store
            </Button>
          </nav>
        </div>
        <div className="mt-auto pt-8">
          <form action={async () => {
            "use server";
            const { signOut } = await import("@/auth");
            await signOut({ redirectTo: "/" });
          }}>
            <Button variant="outline" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Welcome back, {session.user?.name?.split(" ")[0]} 👋
              </h1>
              
              {/* THE MASTER STORE TOGGLE */}
              <form action={async () => {
                "use server";
                const { toggleStoreStatus } = await import("@/app/dashboard/actions");
                await toggleStoreStatus();
              }}>
                <Button 
                  type="submit" 
                  variant={vendor.isOpen ? "default" : "destructive"} 
                  className={`rounded-full text-xs h-7 px-3 font-bold ${vendor.isOpen ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                >
                  {vendor.isOpen ? "🟢 Store Open" : "🔴 Store Closed"}
                </Button>
              </form>
            </div>
            
            <p className="text-slate-500 mt-1">Manage your store and orders below.</p>
          </div>
          <AddFoodModal />
        </header>

        {/* --- TABBED WORKSPACE --- */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-2 sm:grid-cols-4 h-auto mb-8 gap-1 p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs sm:text-sm py-2">Active Orders</TabsTrigger>
            <TabsTrigger value="menu" className="text-xs sm:text-sm py-2">Menu Items</TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm py-2">Past Sales</TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
                  <DollarSign className="w-4 h-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold text-green-600">₦{totalRevenue.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Pending Orders</CardTitle>
                  <ShoppingBag className="w-4 h-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold">{pendingOrdersCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Active Items</CardTitle>
                  <Package className="w-4 h-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold">{menuItems.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: ACTIVE ORDERS */}
          <TabsContent value="orders">
            {activeOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border p-12 text-center text-slate-400">
                No active orders at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="bg-white border-2 border-[#FFD100]/20 shadow-sm rounded-2xl p-5 flex flex-col">
                    <div className="flex justify-between items-start mb-4 border-b pb-4">
                      <div>
                        <h3 className="font-bold text-lg">{order.student.name}'s Order</h3>
                        {/* NEW: Display the Student's Phone Number */}
                        <p className="text-sm text-slate-600 font-medium mt-1">
                          📞 {order.student.phone || "No phone provided"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Order ID: #{order.id.slice(-6).toUpperCase()}</p>
                      </div>
                      <Badge className={order.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex-1 space-y-3 mb-6">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm font-medium">
                          <span className="text-slate-700">
                            <span className="font-black mr-2 text-slate-900">{item.quantity}x</span> 
                            {item.foodItem.name}
                          </span>
                          <span>₦{(item.priceAtBuy * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t">
                      <span className="font-black text-xl">₦{order.totalAmount.toLocaleString()}</span>
                      {order.status === "PENDING" ? (
                        <form action={async () => {
                          "use server";
                          const { updateOrderStatus } = await import("@/app/dashboard/actions");
                          await updateOrderStatus(order.id, "READY");
                        }}>
                          <Button type="submit" className="bg-[#FFD100] text-black hover:bg-[#E6BC00] font-bold rounded-full px-6">
                            Mark Ready
                          </Button>
                        </form>
                      ) : (
                        <form action={async () => {
                          "use server";
                          const { updateOrderStatus } = await import("@/app/dashboard/actions");
                          await updateOrderStatus(order.id, "COMPLETED");
                        }}>
                          <Button type="submit" className="bg-green-600 text-white hover:bg-green-700 font-bold rounded-full px-6">
                            Handed over
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 3: MENU ITEMS */}
          <TabsContent value="menu">
            {menuItems.length === 0 ? (
              <div className="bg-white rounded-xl border p-8 text-center border-dashed">
                <h3 className="text-lg font-semibold">Empty Menu</h3>
                <p className="text-slate-500 mb-4">Add your first food item to start selling.</p>
                <AddFoodModal />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden bg-white flex flex-col">
                    <div className="h-40 bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})` }} />
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg leading-tight line-clamp-1">{item.name}</h3>
                        <Badge className={item.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {item.isAvailable ? "Active" : "Paused"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{item.description}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="font-bold text-lg">₦{item.price.toLocaleString()}</span>
                        <div className="flex gap-2">
                          <form action={async () => {
                            "use server";
                            const { toggleFoodAvailability } = await import("@/app/dashboard/actions");
                            await toggleFoodAvailability(item.id);
                          }}>
                            <Button type="submit" variant="outline" size="icon" className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:bg-amber-50">
                              {item.isAvailable ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                          </form>
                          <EditFoodModal item={item} />
                          <form action={async () => {
                            "use server";
                            const { deleteFoodItem } = await import("@/app/dashboard/actions");
                            await deleteFoodItem(item.id);
                          }}>
                            <Button type="submit" variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 4: PAST SALES (HISTORY) */}
          <TabsContent value="history">
            {completedOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border p-12 text-center text-slate-400">
                <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No completed sales yet.</p>
              </div>
            ) : (
              <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Order ID</th>
                        <th className="px-6 py-4 font-semibold">Student</th>
                        <th className="px-6 py-4 font-semibold">Items</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {completedOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-900">#{order.id.slice(-6).toUpperCase()}</td>
                          <td className="px-6 py-4">{order.student.name}</td>
                          <td className="px-6 py-4 text-slate-500 max-w-[200px] truncate">
                            {order.items.map(i => `${i.quantity}x ${i.foodItem.name}`).join(", ")}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-green-600">
                            ₦{order.totalAmount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}