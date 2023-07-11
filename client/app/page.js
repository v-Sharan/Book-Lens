"use client";

import { useState } from "react";
import { VideoCard, NoResults } from "@components";

export default function Home() {
  const [videos, setVideos] = useState([]);
  return (
    <div className="flex flex-col gap-10 videos h-full">
      {videos.length ? (
        videos?.map((video) => (
          <VideoCard post={video} isShowingOnHome key={video._id} />
        ))
      ) : (
        <NoResults text={`No Videos`} />
      )}
    </div>
  );
}
