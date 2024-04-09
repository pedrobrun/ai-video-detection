'use client'

import { api } from '@/api'
import { cn } from '@/lib/utils'
import { Paginated, Video } from '@/types'
import { useEffect, useState } from 'react'

export function VideoList({
  setSelectedVideo,
  selectedVideo,
}: {
  setSelectedVideo: (video: Video) => void
  selectedVideo?: Video
}) {
  const [data, setData] = useState<
    (Paginated & { videos: Video[] }) | undefined
  >()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get(`/videos?page=${currentPage}`)
        setData(response.data)
      } catch (error) {
        console.error('Error fetching videos:', error)
      }
    }

    fetchVideos()
  }, [currentPage])

  return (
    <div>
      <h2 className='text-sm text-center pt-2'>Select a video</h2>
      <div className="w-[250px] border border-solid border-darkPurple p-1 flex flex-col gap-2 bg-lightPurple bg-opacity-20 max-h-[300px] overflow-y-auto h-[300px]">
        {data &&
          data.videos &&
          data.videos.length > 0 &&
          data.videos.map((video) => (
            <div
              onClick={() => {
                setSelectedVideo(video)
              }}
              key={video.id}
              className={cn(
                "flex transition hover:scale-[1.02] border hover:cursor-pointer bg-white flex-col items-start justify-start p-2 rounded-[2px]",
                selectedVideo?.id === video.id ? "border-darkPurple" : "border-white"
              )}
            >
              <div className="w-full">
                <p className="text-sm truncate overflow-hidden w-full">
                  {video.id} - {video.name}
                </p>
                <div className="text-xs opacity-60">
                  {video.created_at.split('T')[0].replaceAll('-', '/')}
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* TODO: add pagination controls here */}
    </div>
  )
}
