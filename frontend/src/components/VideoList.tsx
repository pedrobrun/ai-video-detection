'use client'

import { api } from '@/api'
import { cn } from '@/lib/utils'
import { Paginated, Video } from '@/types'
import { useEffect, useState } from 'react'
import { Spinner } from './Spinner'
import { Button } from './ui/button'

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
  // start as true to prevent flickering
  const [isLoading, setIsLoading] = useState(true)

  const fetchVideos = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/videos?page=${currentPage}`)
      setData(response.data)
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchVideos()
  }, [currentPage])

  return (
    <div>
      {isLoading ? null : data && data.videos && data.videos.length > 0 ? (
        <h2 className="text-sm text-center pt-2">Select a video:</h2>
      ) : (
        <h2 className="text-sm text-center pt-2">No videos uploaded yet.</h2>
      )}

      <div className="w-[250px] border border-solid border-darkPurple p-1 flex flex-col gap-2 bg-lightPurple bg-opacity-20 max-h-[300px] overflow-y-auto h-[300px]">
        {isLoading ? (
          <div className="flex w-full justify-center pt-10">
            <Spinner />
          </div>
        ) : (
          data &&
          data.videos &&
          data.videos.length > 0 &&
          data.videos.map((video) => (
            <div
              onClick={() => {
                setSelectedVideo(video)
              }}
              key={video.id}
              className={cn(
                'flex transition hover:scale-[1.02] border hover:cursor-pointer bg-white flex-col items-start justify-start p-2 rounded-[2px]',
                selectedVideo?.id === video.id
                  ? 'border-darkPurple'
                  : 'border-white'
              )}
            >
              <div className="w-full">
                <p className="text-sm truncate overflow-hidden w-full">
                  {video.id} - {video.name}
                </p>
                <div className="text-xs opacity-60">
                  {(new Date(video.created_at)).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center w-full">
        <Button disabled={isLoading} onClick={fetchVideos} className="mt-2">
          Refresh
        </Button>
      </div>
      {/* TODO: add pagination controls here */}
    </div>
  )
}
