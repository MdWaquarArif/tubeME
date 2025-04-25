import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Compass, Clock, ThumbsUp, Clapperboard, PlaySquare, History, ChevronRight, ChevronLeft } from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const mainLinks = [
    { icon: <Home size={20} />, label: "Home", href: "/" },
    { icon: <Compass size={20} />, label: "Explore", href: "/explore" },
    { icon: <Clapperboard size={20} />, label: "Easy", href: "/easy" }
  ];

  const personalLinks = [
    { icon: <Clock size={20} />, label: "Watch Later", href: "/watch-later" },
    { icon: <ThumbsUp size={20} />, label: "Liked Videos", href: "/liked" },
    { icon: <PlaySquare size={20} />, label: "Your Videos", href: "/your-videos" },
    { icon: <History size={20} />, label: "History", href: "/history" }
  ];

  const renderLinks = (links: typeof mainLinks) => {
    return links.map((link) => {
      const isActive = location === link.href;
      
      return (
        <li key={link.href}>
          {expanded ? (
            <Link href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                {link.icon}
                <span className="ml-2">{link.label}</span>
              </Button>
            </Link>
          ) : (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link href={link.href}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "w-full h-12",
                        isActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      {link.icon}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {link.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </li>
      );
    });
  };

  return (
    <aside 
      className={cn(
        "bg-card text-card-foreground border-r border-border transition-all duration-300 z-10 h-screen",
        expanded ? "w-56" : "w-16"
      )}
    >
      {/* Logo and collapse toggle */}
      <div className="flex items-center h-14 px-4 border-b border-border">
        {expanded ? (
          <div className="flex items-center">
            <span className="text-primary font-bold text-2xl">tube</span>
            <span className="font-bold text-xl">ME</span>
          </div>
        ) : (
          <span className="text-primary font-bold text-xl">t</span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto"
          onClick={toggleSidebar}
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="px-2 py-2">
          <nav className="space-y-1">
            <ul className="space-y-1">
              {renderLinks(mainLinks)}
            </ul>

            {expanded && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="px-4 text-sm font-medium mb-2">Library</h3>
                <ul className="space-y-1">
                  {renderLinks(personalLinks)}
                </ul>
              </div>
            )}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
}
