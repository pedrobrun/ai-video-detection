'use client'

import React, { useEffect, useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import { Button } from './ui/button'
import { api } from '@/api'
import { Spinner } from './Spinner'
import { toast } from 'react-toastify'

const fileTypes = ['mp4', 'avi', 'mov']

export function VideoUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [isLoadingUploadComponent, setIsLoadingUploadComponent] = useState(true)

  /** Forcing a 0.5s loading time to prevent react-drag-drop-files UI flickering */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingUploadComponent(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleChange = (file: File) => {
    setFile(file)
  }

  const uploadVideo = async () => {
    if (!file) return toast('No video loaded to upload.', { position: "top-center", theme: "dark" })
    try {
      setIsUploadingVideo(true)
      const form = new FormData()
      form.set('video', file)

      const response = await api.post(`/upload_video`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.status === 201 || response.status === 200) {
        toast('Uploaded successfully.', { position: "top-center", theme: "dark" })
        // force reload to re-fetch videos
        location.reload()
      }
    } catch (error) {
      console.error('Error uploading video:', error)
    } finally {
      setIsUploadingVideo(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
      <div className="cursor-pointer w-[250px] h-[50px] flex-row rounded-sm border-2 border-midPurple bg-lightPurple bg-opacity-20 flex justify-center items-center focus:outline-none">
        {isLoadingUploadComponent ? (
          <Spinner />
        ) : (
          <FileUploader
            multiple={false}
            name="file"
            types={fileTypes}
            hoverTitle=" "
            disabled={isUploadingVideo}
            handleChange={handleChange}
          >
            <div className="w-full h-full flex flex-col items-center justify-center">
              {isUploadingVideo ? (
                <Spinner />
              ) : (
                <div className="text-center cursor-pointer w-full flex-col p-4 flex justify-center items-center">
                  {file ? (
                    <p className="text-sm">File loaded successfully!</p>
                  ) : (
                    <>
                      <p className="text-sm">Upload or drop a video here</p>
                      <p className="text-xs">mp4, avi, mov</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </FileUploader>
        )}
      </div>
      <Button disabled={isUploadingVideo} onClick={uploadVideo}>
        Upload Video
      </Button>
      {file && (
        <div
          onClick={() => setFile(null)}
          className="text-xs underline hover:cursor-pointer"
        >
          Remove file
        </div>
      )}
    </div>
  )
}
