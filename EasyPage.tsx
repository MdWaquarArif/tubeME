import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Video } from "@shared/schema";
import EasyCard from "@/components/EasyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function EasyPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: easyVideos = [], isLoading } = useQuery<Video[]>({
    queryKey: ['/api/easy'],
  });

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const totalHeight = container.scrollHeight;
    const windowHeight = container.clientHeight;
    const scrollTop = container.scrollTop;
    
    // Calculate which video is most visible in the viewport
    const videoHeight = windowHeight;
    const visibleIndex = Math.round(scrollTop / videoHeight);
    
    if (visibleIndex !== currentVideoIndex) {
      setCurrentVideoIndex(visibleIndex);
    }
  };

  // Initial scroll handler setup
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Scroll to the next or previous video
  const scrollToVideo = (direction: 'next' | 'prev') => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const videoHeight = container.clientHeight;
    
    if (direction === 'next' && currentVideoIndex < easyVideos.length - 1) {
      container.scrollTo({
        top: (currentVideoIndex + 1) * videoHeight,
        behavior: 'smooth'
      });
    } else if (direction === 'prev' && currentVideoIndex > 0) {
      container.scrollTo({
        top: (currentVideoIndex - 1) * videoHeight,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Skeleton className="h-full w-full max-w-md" />
      </div>
    );
  }

  if (easyVideos.length === 0) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">No Easy videos available</h2>
          <p className="text-muted-foreground">Check back later for new content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center relative bg-black">
      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 bg-black/50 text-white rounded-full"
        onClick={() => scrollToVideo('prev')}
        disabled={currentVideoIndex === 0}
      >
        <ChevronUp size={24} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-4 right-4 z-50 bg-black/50 text-white rounded-full"
        onClick={() => scrollToVideo('next')}
        disabled={currentVideoIndex === easyVideos.length - 1}
      >
        <ChevronDown size={24} />
      </Button>

      {/* Easy videos container */}
      <div 
        ref={containerRef}
        className="h-full w-full max-w-md overflow-y-auto snap-y snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {easyVideos.map((video, index) => (
          <div 
            key={video.id} 
            className="h-full w-full snap-start snap-always"
          >
            <EasyCard 
              video={video} 
              active={index === currentVideoIndex} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
