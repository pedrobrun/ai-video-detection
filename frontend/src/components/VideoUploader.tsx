'use client'

import React, { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'

const fileTypes = ['mp4', 'avi', 'mov']

export function VideoUploader() {
  const [file, setFile] = useState<File | undefined>()
  const handleChange = (file: File) => {
    setFile(file)
  }
  return (
    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
  )
}

