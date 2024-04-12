import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Prediction } from '@/types';

export const VideoPlayerWithFabric = ({
  videoUrl,
  predictions,
}: {
  videoUrl: string;
  predictions: Prediction[];
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current && videoRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        hoverCursor: 'pointer',
        selection: false,
      });
      setFabricCanvas(canvas);

      // Set canvas size to match video upon metadata load
      const handleMetadataLoaded = () => {
        if (videoRef.current) {
          canvas.setHeight(videoRef.current.videoHeight);
          canvas.setWidth(videoRef.current.videoWidth);
        }
      };

      videoRef.current.addEventListener('loadedmetadata', handleMetadataLoaded);

      // Cleanup
      return () => {
        videoRef.current?.removeEventListener('loadedmetadata', handleMetadataLoaded);
      };
    }
  }, []);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (!fabricCanvas || !videoRef.current) return;

      const currentTime = videoRef.current.currentTime;
      const relevantPredictions = predictions.filter(
        /** it's never 0 here, so we try to be as precise as possible */
        prediction => Math.abs(prediction.timestamp - currentTime) < 0.025
      );

      fabricCanvas.clear();

      relevantPredictions.forEach(prediction => {
        const rect = new fabric.Rect({
          left: prediction.box_left,
          top: prediction.box_top,
          width: prediction.box_width,
          height: prediction.box_height,
          name: prediction.class_name,
          stroke: 'red',
          strokeWidth: 2,
          fill: 'transparent',
        });

        const text = new fabric.Text(prediction.class_name, {
          left: prediction.box_left,
          top: prediction.box_top - 20,
          fontSize: 18,
          fill: 'white',
          backgroundColor: 'black',
        });

        fabricCanvas.add(rect, text);
      });

      fabricCanvas.renderAll();
    };

    videoRef.current?.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [predictions, fabricCanvas]);

  // Handling clicks on the canvas to trigger video play/pause
  useEffect(() => {
    const handleClick = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    };

    canvasRef.current?.addEventListener('click', handleClick);

    return () => {
      canvasRef.current?.removeEventListener('click', handleClick);
    };
  }, []);

  return (
      <div className="relative flex items-center justify-center h-full mt-10">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="absolute -translate-x-[50%] left-0 right-0 top-0 z-10 min-w-max min-h-max border-darkPurple border-4"
        />
        <div className='absolute left-0 top-0'>
          <canvas
            ref={canvasRef}
            className="pointer-events-none z-20 -translate-x-[50%]"
          />
        </div>
      </div>
  );
};
