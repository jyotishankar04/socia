import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <Link href="/auth/signup">
        <Button className="w-full">Get Started</Button>
      </Link>
    </div>
  );
}
