"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addFoodItem } from "@/app/dashboard/actions";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AddFoodModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // New state for handling the image upload
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  // Function to instantly upload the image to Cloudinary
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "campus_food"); // The preset we just made

    try {
      // ⚠️ REPLACE 'YOUR_CLOUD_NAME' WITH YOUR ACTUAL CLOUDINARY CLOUD NAME
      const res = await fetch("https://api.cloudinary.com/v1_1/dgwjuqyi3/image/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      setUploadedUrl(data.secure_url); // Save the permanent URL
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  }

  // Handle the final form submission
  async function handleAction(formData: FormData) {
    setLoading(true);
    await addFoodItem(formData);
    setLoading(false);
    setOpen(false);
    setUploadedUrl(""); // Reset the form for next time
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#FFD100] text-black hover:bg-[#E6BC00] font-bold">
          + Add Food Item
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
          <DialogDescription>
            Add a new meal to your store. Students will be able to order this immediately.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleAction} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Meal Name</Label>
            <Input id="name" name="name" placeholder="e.g. Jollof Rice & Chicken" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price (₦)</Label>
            <Input id="price" name="price" type="number" placeholder="e.g. 2500" required min="0" />
          </div>
          
          {/* --- NEW FILE UPLOAD SECTION --- */}
          <div className="space-y-2">
            <Label>Food Image</Label>
            
            {uploadedUrl ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Image uploaded successfully!</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={imageUploading}
                />
                {imageUploading && <Loader2 className="w-5 h-5 animate-spin text-slate-500" />}
              </div>
            )}
            
            {/* We secretly pass the uploaded URL to the backend here! */}
            <input type="hidden" name="imageUrl" value={uploadedUrl} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Briefly describe the meal..." required />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-slate-900 text-white rounded-full" 
            disabled={loading || imageUploading}
          >
            {loading ? "Saving to Menu..." : "Save to Menu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}