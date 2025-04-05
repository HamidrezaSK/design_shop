'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Tattoo Design Platform</h1>

      <Button onClick={() => router.push("/chat")}>
        Chat Tattoo Generator
      </Button>

      <Button variant="outline" onClick={() => router.push("/explore")}>
        Find Artists
      </Button>
    </div>
  );
}
