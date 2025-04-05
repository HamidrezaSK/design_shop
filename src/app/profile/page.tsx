// app/profile/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ArtistProfilePage() {
  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">Artist Profile</h2>
      <p className="text-muted-foreground">Portfolio | Reviews | Contact</p>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5].map((img) => (
          <div key={img} className="bg-gray-200 aspect-square rounded" />
        ))}
      </div>
      <Textarea placeholder="Send a message or tattoo idea..." />
      <Button>Send Message</Button>
    </div>
  );
}
