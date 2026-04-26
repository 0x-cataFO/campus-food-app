// src/components/MenuGrid.tsx
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "./AddToCartButton";

export default async function MenuGrid() {
  // THE FIX: Strict filtering for Active Food AND Open Stores
  const items = await prisma.foodItem.findMany({
    where: {
      isAvailable: true,         // 1. The food item itself must not be paused
      vendor: {
        isOpen: true             // 2. The vendor's master switch must be OPEN
      }
    },
    include: {
      vendor: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <h3 className="text-xl font-bold mb-2">No food available right now</h3>
        <p className="text-slate-500">All our vendors are currently in class or sold out! Check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden bg-white border-slate-100 hover:shadow-lg transition-all group flex flex-col">
          <div className="relative h-48 overflow-hidden bg-slate-100">
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url(${item.imageUrl})` }}
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur-sm font-bold border-0">
                {item.vendor.storeName}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-5 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg leading-tight line-clamp-1">{item.name}</h3>
              <span className="font-black text-lg ml-2 shrink-0">₦{item.price.toLocaleString()}</span>
            </div>
            <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">
              {item.description}
            </p>
            
            {/* We pass the full item to our client-side cart button */}
            <AddToCartButton item={item} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}