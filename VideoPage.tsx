import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2,
  Save,
  MoreHorizontal,
  Clock,
  Flag
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import VideoPlayer from "@/components/VideoPlayer";
import CommentSection from "@/components/CommentSection";
import VideoCard from "@/components/VideoCard";
import { Video, User } from "@shared/schema";
import { formatViewCount } from "@/lib/data";

export default function VideoPage() {
  const { id } = useParams();
  const videoId = parseInt(id || "0");

  const { data: video, isLoading: videoLoading } = useQuery<Video>({
    queryKey: [`/api/videos/${videoId}`],
    enabled: !!videoId,
  });

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: [`/api/users/${video?.userId}`],
    enabled: !!video?.userId,
  });

  const { data: recommendedVideos = [], isLoading: recommendedLoading } = useQuery<Video[]>({
    queryKey: ['/api/videos'],
  });

  // Filter out current video from recommendations
  const filteredRecommendations = recommendedVideos.filter(v => v.id !== videoId);

  if (videoLoading || !video) {
    return (
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="w-full aspect-video rounded-lg" />
          <Skeleton className="h-8 w-2/3" />
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-2">
              <Skeleton className="h-24 w-40 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content - Video and info */}
      <div className="lg:col-span-2 space-y-4">
        {/* Video Player */}
        <VideoPlayer 
          videoUrl={video.videoUrl} 
          thumbnailUrl={video.thumbnailUrl} 
        />
        
        {/* Video Info */}
        <h1 className="text-xl font-bold mt-4">{video.title}</h1>
        
        <div className="flex flex-wrap justify-between items-center py-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{formatViewCount(video.viewCount)}</span>
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
          </div>
          
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Button variant="ghost" size="sm" className="space-x-1">
              <ThumbsUp size={18} />
              <span>{video.likeCount}</span>
            </Button>
            
            <Button variant="ghost" size="sm">
              <ThumbsDown size={18} />
            </Button>
            
            <Button variant="ghost" size="sm" className="space-x-1">
              <Share2 size={18} />
              <span className="hidden sm:inline">Share</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="space-x-1">
              <Save size={18} />
              <span className="hidden sm:inline">Save</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={18} />
            </Button>
          </div>
        </div>
        
        {/* Channel info */}
        <div className="flex items-start justify-between pt-4 border-t">
          <div className="flex">
            {user && (
              <Link href={`/channel/${user.id}`}>
                <Avatar className="h-10 w-10 mr-3 cursor-pointer">
                  <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
            )}
            
            <div>
              {user && (
                <Link href={`/channel/${user.id}`}>
                  <h3 className="font-medium text-sm cursor-pointer">{user.displayName}</h3>
                </Link>
              )}
              <p className="text-xs text-muted-foreground">
                {user?.subscriberCount.toLocaleString()} subscribers
              </p>
            </div>
          </div>
          
          <Button>Subscribe</Button>
        </div>
        
        {/* Video description */}
        <div className="bg-muted/30 rounded-lg p-3 mt-4">
          <p className="text-sm whitespace-pre-line">{video.description}</p>
        </div>
        
        {/* Comments section */}
        <CommentSection videoId={video.id} />
      </div>
      
      {/* Sidebar - Recommended videos */}
      <div>
        <h3 className="font-medium mb-4">Recommended videos</h3>
        <div className="space-y-3">
          {recommendedLoading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="flex space-x-2">
                <Skeleton className="h-24 w-40 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : (
            filteredRecommendations.slice(0, 8).map(video => (
              <div key={video.id} className="flex space-x-2">
                <Link href={`/video/${video.id}`} className="flex-shrink-0">
                  <div className="w-40 h-24 bg-muted rounded overflow-hidden">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                
                <div className="flex-1 min-w-0">
                  <Link href={`/video/${video.id}`}>
                    <h4 className="text-sm font-medium line-clamp-2 hover:text-primary">{video.title}</h4>
                  </Link>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatViewCount(video.viewCount)}
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
