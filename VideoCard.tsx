import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Video, User } from "@shared/schema";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${video.userId}`],
  });

  const formatViews = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    } else {
      return `${count} views`;
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group">
      <Link href={`/video/${video.id}`}>
        <div className="aspect-video relative rounded-xl overflow-hidden bg-muted mb-2 cursor-pointer">
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
      </Link>
      
      <div className="flex">
        {user && (
          <Link href={`/channel/${user.id}`}>
            <Avatar className="h-9 w-9 rounded-full mr-3 mt-0.5 cursor-pointer">
              <AvatarImage src={user.avatarUrl} alt={user.displayName} />
              <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
        )}
        
        <div className="flex-1 min-w-0">
          <Link href={`/video/${video.id}`}>
            <h3 className="text-sm font-medium line-clamp-2 cursor-pointer">
              {video.title}
            </h3>
          </Link>
          
          {user && (
            <Link href={`/channel/${user.id}`}>
              <p className="text-xs text-muted-foreground mt-1 cursor-pointer hover:text-foreground">
                {user.displayName}
              </p>
            </Link>
          )}
          
          <p className="text-xs text-muted-foreground">
            {formatViews(video.viewCount)} • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}
