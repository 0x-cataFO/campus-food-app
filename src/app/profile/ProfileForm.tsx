// src/app/profile/ProfileForm.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { updateProfile } from "./actions"; // Your existing server action!

export default function ProfileForm({ user }: { user: any }) {
  const { update } = useSession();
  const [isSaving, setIsSaving] = useState(false);

  // This intercepts the form submission to run our update() hook!
  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    
    await updateProfile(formData); // 1. Save to database
    await update();                // 2. Force NextAuth to refresh the browser cache!
    
    setIsSaving(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
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
        <Button type="submit" disabled={isSaving} className="px-8 bg-black text-white hover:bg-slate-800 font-bold transition-all">
          {isSaving ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-4 h-4 mr-2" /> Save Profile</>
          )}
        </Button>
      </div>
    </form>
  );
}