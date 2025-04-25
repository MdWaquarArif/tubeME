import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, VideoIcon, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import SearchBar from "./SearchBar";

export default function Header() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="h-14 border-b border-border bg-card sticky top-0 z-10">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo and mobile search button */}
        {!showMobileSearch && (
          <div className="flex items-center">
            <Link href="/" className="mr-2 hidden md:flex">
              <h1 className="text-xl font-bold">
                <span className="text-primary">tube</span>
                <span>ME</span>
              </h1>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSearch(true)}
              className="md:hidden"
            >
              <Search size={20} />
            </Button>
          </div>
        )}

        {/* Search Bar (desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <SearchBar />
        </div>

        {/* Mobile Search (when active) */}
        {showMobileSearch && (
          <div className="absolute inset-0 h-14 bg-card flex items-center px-2 z-50 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSearch(false)}
              className="mr-1"
            >
              <X size={20} />
            </Button>
            <div className="flex-1">
              <SearchBar />
            </div>
          </div>
        )}

        {/* Right section with buttons */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          
          <Button variant="ghost" size="icon">
            <VideoIcon size={20} />
          </Button>
          
          <Link href="/profile">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
