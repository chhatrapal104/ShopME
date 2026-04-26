import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container px-4 py-32 text-center space-y-4">
      <p className="text-7xl font-bold text-muted-foreground/30">404</p>
      <h1 className="text-3xl font-bold">Page Not Found</h1>
      <p className="text-muted-foreground">
        The page you are looking for doesn&apos;t exist.
      </p>
      <Link href="/">
        <Button size="lg" className="mt-2">Go Home</Button>
      </Link>
    </div>
  );
}
