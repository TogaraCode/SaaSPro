import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
<section>
  <div className="container px-4 md:px-6 mx-auto">
<div className="flex flex-col items-center space-y-4 text-center">
<div className="space-y-2">
<h1 className="text-3xl font-bold tracking-tighter sm:text4xl md:text-5xl lg:text-6xl"> Intelligent Receipt Scanning</h1>
<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
  Scan, analyze and organize your receipts with AI-powered precision. Save time and gain insights from your expenses.
</p>
</div>

<div className="space-x-4">
  <Link href="/receipts">
    <Button className="bg-blue-600 hover:bg-blue-700">
      Get Started <ArrowRight className="ml-2 h-4 w-4"/>
    </Button>
  </Link>
  <Link href="#features">
    <Button variant="outline">
      Learn More
    </Button>
  </Link>
</div>
</div>
  </div>
</section>
      {/* Features */}

      {/* Pricing */}

      {/* Info */}

      {/* Footer */}
    </div>
  );
}

