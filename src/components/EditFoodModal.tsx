// src/components/EditFoodModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Loader2 } from "lucide-react";
import { updateFoodItem } from "@/app/dashboard/actions";

// FIX: We now tell TypeScript that description and imageUrl might be null from the database
type FoodItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
};

export default function EditFoodModal({ item }: { item: FoodItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      await updateFoodItem(item.id, formData);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update item", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Menu Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input id="name" name="name" defaultValue={item.name} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price (₦)</Label>
            <Input id="price" name="price" type="number" defaultValue={item.price} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {/* FIX: Add fallback to empty string if null */}
            <Textarea 
              id="description" 
              name="description" 
              defaultValue={item.description || ""} 
              required 
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
             <Label htmlFor="imageUrl">New Image URL (Optional)</Label>
             <Input 
                id="imageUrl" 
                name="imageUrl" 
                type="url" 
                placeholder="Leave blank to keep current image" 
             />
          </div>
          
          <Button type="submit" className="w-full bg-[#FFD100] text-black hover:bg-[#E6BC00] font-bold" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...</> : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}