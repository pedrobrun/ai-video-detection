'use client'

import { api } from '@/api'
import { cn } from '@/lib/utils'
import { Detection, Paginated } from '@/types'
import { useEffect, useState } from 'react'

export function Detections({

}: {
}) {
  const [data, setData] = useState<
    (Paginated & { detections: Detection[] }) | undefined
  >()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get(`/detections?page=${currentPage}`)
        setData(response.data)
      } catch (error) {
        console.error('Error fetching videos:', error)
      }
    }

    fetchVideos()
  }, [currentPage])

  return (
    <div>
      <div className="w-[300px] p-1 flex flex-col gap-4 bg-opacity-20 max-h-[300px] overflow-y-auto h-[300px]">
        {data &&
          data.detections &&
          data.detections.length > 0 &&
          data.detections.map((detection) => (
            <div
              key={detection.id}
              className={cn(
                "flex transition hover:scale-[1.02] hover:cursor-pointer bg-white flex-col items-start justify-start p-2 rounded-[2px] border-2 border-darkPurple",
              )}
            >
              <div className="w-full flex items-start justify-between">
                <div>
                  <p className="text-sm w-full">
                    <span className='opacity-50'>ID</span>: <strong>{detection.id}</strong>
                  </p>
                  <p className="text-sm w-full">
                    <span className='opacity-50'>IoU</span>: <strong>{detection.iou}</strong>
                  </p>
                  <p className="text-sm w-full">
                    <span className='opacity-50'>Confidence</span>: <strong>{detection.confidence}</strong>
                  </p>
                  <p className="text-sm w-full">
                    <span className='opacity-50'>Model</span>: <strong>{detection.model_name}</strong>
                  </p>
                  {/* <p className="text-sm truncate overflow-hidden w-full">
                    Status: {detection.detection}
                  </p> */}
                </div>
                <div className={cn('h-3 w-3 mt-1 rounded-full', detection.status === 'SUCCESS' ? 'bg-green-500' : detection.status === 'PROCESSING' ? 'bg-yellow-500' : 'bg-red-500')} />
              </div>
            </div>
          ))}
      </div>
      {/* TODO: add pagination controls here */}
    </div>
  )
}
