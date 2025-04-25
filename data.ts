import { Video } from "@shared/schema";

// Function to format views count
export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  } else {
    return `${count} views`;
  }
}

// Function to format duration
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Get video categories
export function getVideoCategories(videos: Video[]): string[] {
  const categoriesSet = new Set(videos.map(video => video.category));
  return Array.from(categoriesSet);
}

// Filter videos by category
export function filterVideosByCategory(videos: Video[], category: string | null): Video[] {
  if (!category) return videos;
  return videos.filter(video => video.category === category);
}

// Sort videos by latest
export function sortVideosByLatest(videos: Video[]): Video[] {
  return [...videos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Sort videos by popularity (view count)
export function sortVideosByPopularity(videos: Video[]): Video[] {
  return [...videos].sort((a, b) => b.viewCount - a.viewCount);
}

// Sort videos by duration (shortest to longest)
export function sortVideosByDuration(videos: Video[]): Video[] {
  return [...videos].sort((a, b) => a.duration - b.duration);
}
