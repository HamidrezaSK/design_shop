// app/explore/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">Explore Artists</h2>
      <Input placeholder="Search by name or style..." />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {[1, 2, 3].map((id) => (
          <Card key={id}>
            <CardContent className="p-4 space-y-2">
              <h3 className="text-lg font-medium">Artist {id}</h3>
              <p className="text-sm text-muted-foreground">4.9 ★ | Neo-traditional</p>
              <Button onClick={() => router.push("/profile")}>View Profile</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
