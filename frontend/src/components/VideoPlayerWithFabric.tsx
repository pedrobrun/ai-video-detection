// import React, { useEffect, useRef, useState } from 'react'
// import { fabric } from 'fabric'
// import { Prediction } from '@/types'

// export const VideoPlayerWithFabric = ({
//   videoUrl,
//   predictions,
// }: {
//   videoUrl: string
//   predictions: Prediction[]
// }) => {
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null)

//   useEffect(() => {
//     if (canvasRef.current && videoRef.current) {
//       const canvas = new fabric.Canvas(canvasRef.current, {
//         hoverCursor: 'pointer',
//         selection: false,
//       })
//       setFabricCanvas(canvas)

//       const handleMetadataLoaded = () => {
//         if (videoRef.current) {
//           canvas.setHeight(videoRef.current.videoHeight)
//           canvas.setWidth(videoRef.current.videoWidth)
//         }
//       }

//       videoRef.current.addEventListener('loadedmetadata', handleMetadataLoaded)

//       return () => {
//         videoRef.current?.removeEventListener(
//           'loadedmetadata',
//           handleMetadataLoaded
//         )
//       }
//     }
//   }, [])

//   useEffect(() => {
//     const videoElement = videoRef.current
//     if (!fabricCanvas || !videoElement) return

//     const handleTimeUpdate = () => {
//       const currentTime = videoElement.currentTime
//       const relevantPredictions = predictions.filter(
//         (prediction) => Math.abs(prediction.timestamp - currentTime) < 0.2
//       )

//       fabricCanvas.clear()

//       relevantPredictions.forEach((prediction) => {
//         const rect = new fabric.Rect({
//           left: prediction.box_left,
//           top: prediction.box_top,
//           width: prediction.box_width,
//           height: prediction.box_height,
//           stroke: 'red',
//           strokeWidth: 2,
//           fill: 'transparent',
//         })

//         fabricCanvas.add(rect)
//       })

//       fabricCanvas.renderAll()
//     }

//     videoElement.addEventListener('timeupdate', handleTimeUpdate)

//     return () =>
//       videoElement.removeEventListener('timeupdate', handleTimeUpdate)
//   }, [predictions, fabricCanvas])

//   return (
//     <div className="relative flex flex-col items-center justify-center w-full h-full">
//       <video
//         ref={videoRef}
//         src={videoUrl}
//         controls
//         className="absolute top-0 z-10"
//       />
//       <canvas ref={canvasRef} className="-translate-x-[20%] absolute top-0 left-0 z-20" />
//     </div>
//   )
// }

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
        prediction => Math.abs(prediction.timestamp - currentTime) < 0.2
      );

      fabricCanvas.clear();

      relevantPredictions.forEach(prediction => {
        const rect = new fabric.Rect({
          left: prediction.box_left,
          top: prediction.box_top,
          width: prediction.box_width,
          height: prediction.box_height,
          stroke: 'red',
          strokeWidth: 2,
          fill: 'transparent',
        });

        fabricCanvas.add(rect);
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
    <div className="relative flex items-center justify-center w-full h-full">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="absolute top-0 z-10"
      />
      <canvas
        ref={canvasRef}
        className="-translate-x-[20%] absolute top-0 left-0 z-20"
        style={{ pointerEvents: 'none' }} // Allows click through canvas
      />
    </div>
  );
};
