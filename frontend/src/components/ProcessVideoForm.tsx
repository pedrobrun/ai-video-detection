'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { VideoList } from './VideoList'
import { Video } from '@/types'
import { useState } from 'react'
import { api } from '@/api'
import { toast } from 'react-toastify'

const formSchema = z.object({
  confidence: z.coerce.number().min(0.1).max(1),
  iou: z.coerce.number().min(0.1).max(1),
})

export function ProcessVideoForm() {
  const [selectedVideo, setSelectedVideo] = useState<undefined | Video>()
  const [isLoadingRequest, setIsLoadingRequest] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confidence: 0,
      iou: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedVideo) {
      toast('Please select a video', { position: "top-center", theme: "dark" })
      return
    }

    setIsLoadingRequest(true)

    try {
      const res = await api.post(`/process_video/${selectedVideo.id}`, {
        confidence: values.confidence,
        iou: values.iou,
      })
      if (res.data.message === 'Detection is already processing or has been processed successfully.') {
        return toast("A detection with this config for this video already exists. Check the detections section.", { position: "top-center", theme: "dark" })
      } 
      return toast("Video processing started", { position: "top-center", theme: "dark" })
    } catch (e: any) {
      toast(e.message || "Error", { position: "top-center", theme: "dark" })
    } finally {
      setIsLoadingRequest(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-[250px]"
      >
        <VideoList
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
        />

        <FormField
          control={form.control}
          disabled={isLoadingRequest}
          name="iou"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IoU</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormDescription>
                {/** TODO: add something here */}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confidence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confidence</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormDescription>
                {/** TODO: add something here */}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isLoadingRequest}
          className="flex items-center justify-center w-full"
          type="submit"
        >
          Process Video
        </Button>
      </form>
    </Form>
  )
}
