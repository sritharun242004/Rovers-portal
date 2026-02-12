import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { Sidebar } from "./Sidebar"
import { useEffect } from "react"

export function Layout() {
  const isMobileMenuOpen = false; // Assuming a default value

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Header />
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}