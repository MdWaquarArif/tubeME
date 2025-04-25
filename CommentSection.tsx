import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { type User, type Comment } from "@shared/schema";

interface CommentSectionProps {
  videoId: number;
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();

  // Get comments for this video
  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: [`/api/videos/${videoId}/comments`],
  });

  // Get all users (for displaying comment author info)
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  // Find user by ID
  const findUser = (userId: number) => {
    return users.find(user => user.id === userId);
  };

  // Post new comment
  const commentMutation = useMutation({
    mutationFn: (newComment: { content: string; userId: number }) => {
      return apiRequest('POST', `/api/videos/${videoId}/comments`, newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}/comments`] });
      setCommentText("");
    }
  });

  const handleCommentSubmit = () => {
    if (commentText.trim() === "") return;
    
    // Using first user for demo purposes, in a real app this would be the logged in user
    const userId = users[0]?.id || 1;
    
    commentMutation.mutate({
      content: commentText,
      userId
    });
  };

  const formatCommentCount = (count: number): string => {
    return count === 1 ? "1 comment" : `${count} comments`;
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">{formatCommentCount(comments.length)}</h3>

      {/* Comment input */}
      <div className="flex gap-4 mb-6">
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" alt="Your avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <Textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="border-b border-border resize-none min-h-[40px] focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          />
          
          <div className="flex justify-end mt-2">
            <Button 
              variant="outline" 
              size="sm"
              className="mr-2"
              onClick={() => setCommentText("")}
            >
              Cancel
            </Button>
            
            <Button 
              size="sm"
              onClick={handleCommentSubmit}
              disabled={commentText.trim() === "" || commentMutation.isPending}
            >
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => {
            const user = findUser(comment.userId);
            
            return (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatarUrl} alt={user?.displayName} />
                  <AvatarFallback>{user?.displayName.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{user?.displayName}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="mt-1 text-sm">{comment.content}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ThumbsUp size={16} />
                    </Button>
                    
                    <span className="text-xs">{comment.likeCount}</span>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ThumbsDown size={16} />
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-xs">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
