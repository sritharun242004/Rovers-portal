import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { QrCode, UserPlus, Users, LineChart, HomeIcon, User, ClipboardList, HelpCircle, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"

export function Sidebar() {
  const { userEmail, userRole } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = userRole === 'manager' || userEmail === 'gilani@gmail.com';
  const isVolunteer = userRole === 'volunteer' || userEmail === 'datta@gmail.com';
  const isParent = userRole === 'parent';
  const isSchool = userRole === 'school';
  const parentMenuItems = [
    { to: "/parent", icon: <HomeIcon className="mr-2 h-4 w-4" />, label: "Home" },
    { to: "/parent/students", icon: <User className="mr-2 h-4 w-4" />, label: "Students" },
    { to: "/parent/registrations", icon: <ClipboardList className="mr-2 h-4 w-4" />, label: "My Registrations" },
    { to: "/support", icon: <HelpCircle className="mr-2 h-4 w-4" />, label: "Support" }
  ];

  const schoolMenuItems = [
    { to: "/parent", icon: <HomeIcon className="mr-2 h-4 w-4" />, label: "Home" },
    { to: "/parent/students", icon: <User className="mr-2 h-4 w-4" />, label: "Students" },
    { to: "/parent/registrations", icon: <ClipboardList className="mr-2 h-4 w-4" />, label: "Registrations" },
    { to: "/support", icon: <HelpCircle className="mr-2 h-4 w-4" />, label: "Support" }
  ];

  const supportMenuItem = parentMenuItems.find(item => item.to === "/support");

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      if (sidebar && !sidebar.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="space-y-1">
          {(isParent || isSchool) && (
            <>
              <NavLink 
                to="/parent" 
                onClick={handleNavClick}
                className={({ isActive }) => cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <HomeIcon className="mr-2 h-4 w-4" />
                Home
              </NavLink>
              <NavLink 
                to="/parent/students" 
                onClick={handleNavClick}
                className={({ isActive }) => cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <User className="mr-2 h-4 w-4" />
                Students
              </NavLink>
              <NavLink 
                to="/parent/registrations" 
                onClick={handleNavClick}
                className={({ isActive }) => cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                {isSchool ? "Registrations" : "My Registrations"}
              </NavLink>
              <NavLink 
                to="/support" 
                onClick={handleNavClick}
                className={({ isActive }) => cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Support
              </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink 
                to="/live" 
                onClick={handleNavClick}
                className={({ isActive }) => cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <LineChart className="mr-2 h-4 w-4" />
                Live Dashboard
              </NavLink>
              <NavLink 
                to="/volunteer/register" 
                onClick={handleNavClick}
                className={({ isActive }) => cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Register Volunteer
              </NavLink>
              <NavLink 
                to="/volunteers" 
                onClick={handleNavClick}
                className={({ isActive }) => cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Volunteers
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Sidebar - Reduced mt-16 to mt-14 */}
      <div
        id="mobile-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background/80 backdrop-blur-sm transform transition-transform duration-200 ease-in-out md:hidden mt-14",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="h-[calc(100vh-3.5rem)] py-4">
          <SidebarContent />
        </ScrollArea>
      </div>

      {/* Desktop Sidebar - Reduced mt-16 to mt-14 */}
      <div className="hidden border-r bg-background/80 backdrop-blur-sm md:block md:w-64 mt-14">
        <ScrollArea className="h-[calc(100vh-3.5rem)] py-4">
          <SidebarContent />
        </ScrollArea>
      </div>

      {/* Overlay for mobile - Reduced mt-16 to mt-14 */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden mt-14"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}