import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings
} from "lucide-react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
}

export default function VideoPlayer({ videoUrl, thumbnailUrl }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "00:00";
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // Handle playback controls
  const handlePlayPause = () => setPlaying(!playing);
  const handleVolumeChange = (value: number[]) => setVolume(value[0]);
  const handleToggleMute = () => setMuted(!muted);
  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0]);
    setSeeking(true);
  };
  
  const handleSeekMouseUp = () => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(played);
    }
  };

  const handleProgress = (state: { played: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSkipBack = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(Math.max(0, playerRef.current.getCurrentTime() - 10));
    }
  };

  const handleSkipForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(Math.min(duration, playerRef.current.getCurrentTime() + 10));
    }
  };

  const handleFullScreen = () => {
    if (playerContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerContainerRef.current.requestFullscreen();
      }
    }
  };

  // Show controls on mouse move and hide after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Card 
      className="relative overflow-hidden bg-black"
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={handleDuration}
        className="react-player"
        light={!playing && thumbnailUrl}
        playIcon={
          <Button 
            size="icon" 
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-white"
          >
            <Play size={32} />
          </Button>
        }
      />

      {/* Custom Video Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress bar */}
        <div className="mb-2">
          <Slider
            value={[played * 100]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={(value) => handleSeekChange([value[0] / 100])}
            onValueCommit={handleSeekMouseUp}
            className="h-1"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handlePlayPause}
              className="text-white hover:text-white hover:bg-white/20"
            >
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSkipBack}
              className="text-white hover:text-white hover:bg-white/20"
            >
              <SkipBack size={20} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSkipForward}
              className="text-white hover:text-white hover:bg-white/20"
            >
              <SkipForward size={20} />
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleToggleMute}
                className="text-white hover:text-white hover:bg-white/20"
              >
                {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
              
              <div className="w-20 hidden sm:block">
                <Slider
                  value={[muted ? 0 : volume * 100]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                  className="h-1"
                />
              </div>
            </div>
            
            <span className="text-white text-xs hidden sm:inline-block">
              {formatTime(played * duration)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:text-white hover:bg-white/20"
            >
              <Settings size={20} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleFullScreen}
              className="text-white hover:text-white hover:bg-white/20"
            >
              <Maximize size={20} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
