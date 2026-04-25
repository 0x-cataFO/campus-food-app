// src/components/MenuGrid.tsx
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store } from "lucide-react";

// Import our new Client Component button that talks to Zustand
import AddToCartButton from "@/components/AddToCartButton";

export default async function MenuGrid() {
  // 1. Fetch real food from the database!
  // We only fetch items that are 'available' and from vendors who are 'open'
  const foods = await prisma.foodItem.findMany({
    where: { 
      isAvailable: true,
      vendor: { isOpen: true } 
    },
    include: {
      vendor: true // This pulls in the vendor's profile so we know the store name!
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Available Deals</h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          Freshly prepared meals from your favorite campus vendors. Order now and skip the line.
        </p>
      </div>

      {foods.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-dashed">
          <p className="text-slate-500">No food items available right now. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => (
            <Card key={food.id} className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 flex flex-col">
              
              {/* Real Image Area */}
              <div 
                className="h-48 bg-slate-200 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${food.imageUrl})` }}
              >
                {/* Store Name Badge */}
                <Badge className="absolute top-4 left-4 bg-white/90 hover:bg-white text-black font-bold border-0 shadow-sm backdrop-blur-sm">
                  <Store className="w-3 h-3 mr-1 inline-block" />
                  {food.vendor.storeName}
                </Badge>
              </div>

              {/* Content Area */}
              <CardContent className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-xl mb-2 line-clamp-1">{food.name}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                  {food.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4">
                   <span className="font-black text-xl">₦{food.price.toLocaleString()}</span>
                   
                   {/* Our new Client Component Bridge! */}
                   <AddToCartButton food={{
                     id: food.id,
                     name: food.name,
                     price: food.price,
                     imageUrl: food.imageUrl || "",
                     vendorId: food.vendorId
                   }} />

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}