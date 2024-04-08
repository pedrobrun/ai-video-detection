"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { VideoList } from "./VideoList"
import { Video } from "@/types"
import { useState } from "react"

const formSchema = z.object({
  confidence: z.coerce.number().min(0).max(1),
  iou: z.coerce.number().min(0).max(1),
})

export function ProcessVideoForm() {
  const [selectedVideo, setSelectedVideo] = useState<undefined | Video>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confidence: 0,
      iou: 0,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedVideo) {
      alert('Please select a video.');
      return;
    }
    
    const dataToSend = { ...values, selectedVideoId: selectedVideo.id };
    console.log(dataToSend);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[250px]">
        <VideoList selectedVideo={selectedVideo} setSelectedVideo={setSelectedVideo} />

        <FormField
          control={form.control}
          name="iou"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IoU</FormLabel>
              <FormControl>
                <Input type="number" placeholder="shadcn" {...field} />
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
                <Input type="number" placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                {/** TODO: add something here */}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
