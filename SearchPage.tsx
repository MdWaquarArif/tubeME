import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Video } from "@shared/schema";
import VideoCard from "@/components/VideoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Extract query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q') || "";
    setSearchQuery(q);
  }, [location]);
  
  // Get search results
  const { data: searchResults = [], isLoading } = useQuery<Video[]>({
    queryKey: ['/api/search', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('Failed to search videos');
      return res.json();
    },
    enabled: !!searchQuery
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <div className="container p-4 mx-auto">
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <Input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
      
      {/* Search results */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">
          {searchQuery ? `Search results for "${searchQuery}"` : "Search videos"}
        </h1>
        {searchQuery && !isLoading && (
          <p className="text-muted-foreground">
            Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
          </p>
        )}
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
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
      )}
      
      {/* Results grid */}
      {!isLoading && searchQuery && (
        <>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
              {searchResults.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No videos found</h3>
              <p className="text-muted-foreground">
                Try different keywords or check your spelling
              </p>
            </div>
          )}
        </>
      )}
      
      {/* Empty initial state */}
      {!isLoading && !searchQuery && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-medium mb-2">Search for videos</h2>
          <p className="text-muted-foreground">
            Enter keywords to find videos by title, description or category
          </p>
        </div>
      )}
    </div>
  );
}