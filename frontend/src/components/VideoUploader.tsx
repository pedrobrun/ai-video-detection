'use client'

import React, { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import { Button } from './ui/button'

const fileTypes = ['mp4', 'avi', 'mov']

export function VideoUploader() {
  const [file, setFile] = useState<string | ArrayBuffer | null>(null)

  const handleChange = (file: any) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      if (e.target) {
        const binaryData = e.target.result

        setFile(binaryData)
      }
    }

    reader.onerror = (error) => console.log('Error reading file:', error)
    reader.readAsArrayBuffer(file[0])
  }

  return (
    <div className='flex flex-col gap-4 items-center justify-center w-full h-full'>
      <div className="cursor-pointer w-[250px] h-[50px] flex-row rounded-sm border-2 border-midPurple bg-lightPurple bg-opacity-20 flex justify-center items-center focus:outline-none">
        <FileUploader
          multiple={true}
          name="file"
          types={fileTypes}
          hoverTitle=" "
          handleChange={handleChange}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
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
          </div>
        </FileUploader>
      </div>
      <Button>Upload Video</Button>
      <div
        onClick={() => setFile(null)}
        className="text-xs underline hover:cursor-pointer"
      >
        Remove file
      </div>
    </div>
    // <FileUploader style={{ border: '2px solid red', padding: '20px' }} label='Upload or drop a video here' handleChange={handleChange} name="file" types={fileTypes}></FileUploader>
  )
}
