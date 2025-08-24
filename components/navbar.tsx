"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState<{
    id: string
    email: string
    role: string
    is_approved: boolean
    name?: string
  } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check localStorage for user data on component mount
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        setLoggedInUser(JSON.parse(userData))
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e)
        localStorage.removeItem("user") // Clear invalid data
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setLoggedInUser(null)
    router.push("/login")
  }

  const navItems = [
    { href: "/", label:"होम" },
    { href: "/about", label: "सभा सदस्य" },
    { href: "/patra-patrikaen", label: "पत्र पत्रिकाएँ" },
    { href: "/sadasya-suchi", label: "समाज सूची" },
    { href: "/events", label: "कार्यक्रम" },
    //{ href: "/members", label: "समाज लिस्ट" },
    { href: "/committees", label: "सभा / समितियां" },
    { href: "/contact", label: "संपर्क करें" },
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-orange-600 object-contain">
              <img
              src="/logo.jpg"
              alt="Bilaspur Agrawal Sabha"
              className="h-10 w-auto object-contain"
            />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-gray-700 hover:text-orange-600 transition-colors">
                {item.label}
              </Link>
            ))}
            {loggedInUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" /> {/* Placeholder for user image */}
                      <AvatarFallback>
                        {loggedInUser.name
                          ? loggedInUser.name.charAt(0).toUpperCase()
                          : loggedInUser.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{loggedInUser.name || loggedInUser.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">{loggedInUser.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push(loggedInUser.role === "admin" ? "/admin" : "/dashboard")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Join Us</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {loggedInUser ? (
                <>
                  <Link
                    href={loggedInUser.role === "admin" ? "/admin" : "/dashboard"}
                    className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600"
                  >
                    Log out ({loggedInUser.name || loggedInUser.email})
                  </button>
                </>
              ) : (
                <div className="flex space-x-2 px-3 py-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Join Us</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
