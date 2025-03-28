"use client"

import { SignedIn, SignInButton, SignedOut, UserButton } from "@clerk/nextjs"
import { Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

function Header() {
  return (
    <div className="p-4 flex justify-between items-center">
    <Link href="/" className="flex items-center">
        <Shield className="w-6 h-6 text-blue-600 mr-2" />

        <h1 className="text-xl font-semibold">Togara SaaS App</h1>
    </Link>

<div className="flex items-center space-x-4">
    <SignedIn>
        <UserButton />
    </SignedIn>
    <SignedOut>
        <SignInButton mode="modal">
            <Button>Login</Button>
        </SignInButton>
    </SignedOut>
    </div>
    </div>
    
  )
}

export default Header