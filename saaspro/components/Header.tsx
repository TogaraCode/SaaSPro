"use client"
import { Shield } from "lucide-react"
import Link from "next/link"

function Header() {
  return (
    <div className="">
    <Link href="/">
        <Shield className="w-6 h-6 text-blue-600 mr-2" />
        <h1 className="text-xl font-semibold">Togara SaaS App</h1>
    </Link>
    
    </div>
  )
}

export default Header