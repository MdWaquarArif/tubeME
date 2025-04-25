import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Video } from "@shared/schema";
import VideoCard from "@/components/VideoCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getVideoCategories } from "@/lib/data";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ['/api/videos'],
  });

  // Get all unique categories from videos
  const categories = getVideoCategories(videos);

  // Filter videos by category
  const filteredVideos = activeCategory
    ? videos.filter(video => video.category === activeCategory)
    : videos;

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
  };

  // Render skeletons while loading
  if (isLoading) {
    return (
      <div className="container p-4 mx-auto">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="flex overflow-x-auto pb-2 gap-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-40 w-full rounded-xl" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto">
      {/* Category filters */}
      <div className="mb-6">
        <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            className="rounded-full whitespace-nowrap"
            onClick={() => handleCategoryChange(null)}
          >
            All
          </Button>
          
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="rounded-full whitespace-nowrap"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Easy Shorts Promotion Banner */}
      <div className="mb-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <span className="text-primary mr-1">Easy</span> 
            <span>Shorts</span>
          </h2>
          <p className="text-sm text-muted-foreground">Watch short, catchy videos in vertical format</p>
        </div>
        <Link href="/easy">
          <Button>Watch Now</Button>
        </Link>
      </div>

      {/* Video Grid */}
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
            {filteredVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trending" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
            {filteredVideos
              .sort((a, b) => b.viewCount - a.viewCount)
              .slice(0, 8)
              .map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="new" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
            {filteredVideos
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 8)
              .map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
