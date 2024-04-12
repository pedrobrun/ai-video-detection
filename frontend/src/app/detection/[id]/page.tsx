'use client'

import { api } from '@/api'
import { Spinner } from '@/components/Spinner'
import { VideoPlayerWithFabric } from '@/components/VideoPlayerWithFabric'
import { Detection } from '@/types'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { useEffect, useState } from 'react'

export default function Detection({ params }: Params) {
  const id = params.id
  const [data, setData] = useState<Detection | undefined>()
  const [videoUrl, setVideoUrl] = useState('')
  const [isLoadingVideo, setIsLoadingVideo] = useState(true)

  useEffect(() => {
    const fetchDetection = async () => {
      setIsLoadingVideo(true)
      try {
        const response = await api.get(`/detections/${id}`)
        console.log('response.data', response.data)
        setData(response.data)
        if (response.data.video && response.data.video.video_data) {
          const videoBlob = base64ToBlob(response.data.video.video_data)
          const url = URL.createObjectURL(videoBlob)
          setVideoUrl(url)
        }
      } catch (error) {
        console.error('Error fetching detection:', error)
      } finally {
        setIsLoadingVideo(false)
      }
    }

    fetchDetection()
  }, [id])

  const base64ToBlob = (base64: string) => {
    const byteString = atob(base64)
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const int8Array = new Uint8Array(arrayBuffer)
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i)
    }
    return new Blob([arrayBuffer], { type: 'video/mp4' })
  }

  return (
    <div className="flex flex-col items-center mt-20 w-full justify-center">
      <div>
        <span className="opacity-50">ID:</span> {id}
      </div>
      {isLoadingVideo ? (
        <div className="mt-12">
          <Spinner />
        </div>
      ) : data && data.video ? (
        <>
          <div className="text-start max-w-[500px]">
            <div>
              <span className="opacity-50">Model:</span>{' '}
              <strong>{data.model_name}</strong>
            </div>
            <div>
              <span className="opacity-50">IoU:</span>{' '}
              <strong>{data.iou}</strong>
            </div>
            <div>
              <span className="opacity-50">Confidence:</span>{' '}
              <strong>{data.confidence}</strong>
            </div>
            <div>
              <span className="opacity-50">Status:</span>{' '}
              <strong>{data.status}</strong>
            </div>
            <div className="w-full overflow-hidden">
              <div>
                <span className="opacity-50">Video Name:</span>{' '}
                <strong>{data.video.name}</strong>
              </div>
            </div>
          </div>
          {videoUrl && (!data.predictions || data.predictions.length === 0) && (
            <div className="flex flex-col mt-10 items-center justify-center w-full h-full">
              <div>No predictions have been computed yet.</div>
              <video src={videoUrl} controls />
            </div>
          )}
          {videoUrl && data.predictions && data.predictions.length > 0 && (
            <VideoPlayerWithFabric
              predictions={data.predictions}
              videoUrl={videoUrl}
            />
          )}
        </>
      ) : (
        <div>Detection not found with id {id}</div>
      )}
    </div>
  )
}
