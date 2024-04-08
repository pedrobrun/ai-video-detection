'use client'

import React, { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import { Button } from './ui/button'
import { api } from '@/api'
import { useRouter } from 'next/navigation'
import { Spinner } from './Spinner'

const fileTypes = ['mp4', 'avi', 'mov']

export function VideoUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)

  const handleChange = (file: File) => {
    setFile(file)
  }

  const uploadVideo = async () => {
    if (!file) return alert('No video loaded to upload.')
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
        alert('Uploaded successfully')
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
        <FileUploader
          multiple={false}
          name="file"
          types={fileTypes}
          hoverTitle=" "
          disabled={isUploadingVideo}
          handleChange={handleChange}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            {
              isUploadingVideo ?
              <Spinner /> :
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
            }
          </div>
        </FileUploader>
      </div>
      <Button disabled={isUploadingVideo} onClick={uploadVideo}>Upload Video</Button>
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
