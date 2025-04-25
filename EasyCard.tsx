import { useState, useRef } from "react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HeartIcon, MessageCircle, Share2Icon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Video, User } from "@shared/schema";
import ReactPlayer from "react-player";

interface EasyCardProps {
  video: Video;
  active?: boolean;
}

export default function EasyCard({ video, active = false }: EasyCardProps) {
  const [isPlaying, setIsPlaying] = useState(active);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${video.userId}`],
  });

  const formatViews = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    } else {
      return `${count}`;
    }
  };

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div 
      className="w-full h-full flex flex-col bg-card overflow-hidden relative"
      onClick={handleVideoClick}
      ref={videoRef}
    >
      {/* Video Player */}
      <div className="relative flex-1 bg-black">
        <ReactPlayer
          url={video.videoUrl}
          width="100%"
          height="100%"
          playing={isPlaying}
          loop
          muted={false}
          controls={false}
          playsinline
          className="absolute top-0 left-0 w-full h-full"
        />
        
        {/* Overlay for better touch/click handling */}
        <div className="absolute inset-0 z-10"></div>
      </div>
      
      {/* Info Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white z-20">
        <h3 className="font-medium mb-2 text-sm">{video.title}</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {user && (
              <>
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{user.displayName}</span>
              </>
            )}
          </div>
          
          <div className="text-xs opacity-80">
            {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="absolute right-3 bottom-16 flex flex-col items-center space-y-4 z-20">
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-full"
          onClick={handleLike}
        >
          <HeartIcon 
            size={24} 
            className={isLiked ? "text-red-500 fill-red-500" : ""} 
          />
          <span className="text-xs block mt-1">{formatViews(video.likeCount)}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-full"
        >
          <MessageCircle size={24} />
          <span className="text-xs block mt-1">120</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-full"
        >
          <Share2Icon size={24} />
          <span className="text-xs block mt-1">Share</span>
        </Button>
      </div>
    </div>
  );
}
