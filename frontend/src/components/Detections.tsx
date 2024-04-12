'use client'

import { api } from '@/api'
import { cn, getStatusColor } from '@/lib/utils'
import { Detection, DetectionStatus, Paginated } from '@/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Spinner } from './Spinner'
import { Button } from './ui/button'

const statusDescriptions = {
  PROCESSING: 'Currently generating the predictions.',
  FAILED: 'Detection failed due to an error.',
  SUCCESS: 'All frames processed successfully.',
  IDLE: 'No activity detected for 60 minutes, may be incomplete because of a system outage which prevented all predictions from finishing.'
};

export function Detections({ }: {}) {
  const [data, setData] = useState<
    (Paginated & { detections: Detection[] }) | undefined
  >()
  const [currentPage, setCurrentPage] = useState(1)
  // start as true to prevent flickering
  const [isLoading, setIsLoading] = useState(true)

  const fetchDetections = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/detections?page=${currentPage}`)
      setData(response.data)
    } catch (error) {
      console.error('Error fetching detections:', error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {

    fetchDetections()
  }, [currentPage])

  return (
    <div className='flex flex-col items-center'>
      <div className="flex flex-col max-w-[300px] justify-center items-center gap-2 mb-4">
        <div>Status Meanings:</div>
        <div className='flex flex-col items-start'>
          {Object.entries(statusDescriptions).map(([status, description]) => (
            <div key={status} className="flex items-baseline gap-1">
              <span className={cn('min-h-3 min-w-3 rounded-full', getStatusColor(status as DetectionStatus, 'bg'))} />
              <span className="text-sm">{`${status}: ${description}`}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[300px] p-1 flex flex-col gap-4 bg-opacity-20 overflow-y-auto">
        {data &&
          data.detections &&
          data.detections.length > 0 &&
          <div className='flex justify-center w-full'>
            <Button disabled={isLoading} onClick={fetchDetections} className='mt-2'>Refresh</Button>
          </div>
        }
        {isLoading ? (
          <div className="flex w-full justify-center">
            <Spinner />
          </div>
        ) : data && data.detections && data.detections.length > 0 ? (
          data.detections.map((detection) => (
            <Link
              key={detection.id}
              target="_blank"
              href={`detection/${detection.id}`}
              className={cn(
                'flex transition hover:scale-[1.02] hover:cursor-pointer bg-white flex-col items-start justify-start p-2 rounded-[2px] border-2 border-darkPurple'
              )}
            >
              <div className="w-full flex items-start justify-between">
                <div>
                  <p className="text-sm w-full">
                    <span className="opacity-50">ID</span>:{' '}
                    <strong>{detection.id}</strong>
                  </p>
                  <p className="text-sm w-full">
                    <span className="opacity-50">IoU</span>:{' '}
                    <strong>{detection.iou}</strong>
                  </p>
                  <p className="text-sm w-full">
                    <span className="opacity-50">Confidence</span>:{' '}
                    <strong>{detection.confidence}</strong>
                  </p>
                  <p className="text-sm w-full">
                    <span className="opacity-50">Model</span>:{' '}
                    <strong>{detection.model_name}</strong>
                  </p>
                  <p className="text-sm truncate overflow-hidden w-full">
                    <span className="opacity-50">Status</span>:{' '}
                    <strong>{detection.status}</strong>
                  </p>
                </div>
                <div
                  className={cn(
                    'h-3 w-3 mt-1 rounded-full',
                    getStatusColor(detection.status, 'bg')
                  )}
                />
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center">No detections yet.</div>
        )}
      </div>
      {/* TODO: add pagination controls here */}
    </div>
  )
}
