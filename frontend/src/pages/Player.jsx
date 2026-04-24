import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";

const Player = ({src}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        responsive: true,
        fluid: true,
        techOrder: ["youtube"], // 👈 tell video.js to use YouTube
        sources: [
          {
            src, // e.g. "https://www.youtube.com/watch?v=N7Q_56f39MQ"
            type: "video/youtube",
          },
        ],
      });
    }
      return()=>{
        if(playerRef.current){
          playerRef.current.dispose();
          playerRef.current = null;
          console.log("www");
        }
      };
  },[src]);

  return (
    <div className="bg-[#392211] w-full h-screen flex items-center justify-center">
      <div data-vjs-player className="w-3/4">
        {/* ✅ Add `controls` directly for React safety */}
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          controls
        />
      </div>
    </div>
  )
}

export default Player
