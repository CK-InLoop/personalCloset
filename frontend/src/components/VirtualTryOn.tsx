import React, { useRef, useEffect } from 'react';
import { Pose } from '@mediapipe/pose';

// Extend the Window interface to avoid TypeScript errors
declare global {
  interface Window {
    poseInstance?: any;
  }
}

interface VirtualTryOnProps {
  top?: string;
  bottom?: string;
  onePiece?: string;
  className?: string;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ top, bottom, onePiece, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelImageRef = useRef<HTMLImageElement | null>(null);
  const onResultsRef = useRef<any>(null);

  // Effect 1: Update the onResults callback with latest props
  useEffect(() => {
    onResultsRef.current = (results: any) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const modelImage = modelImageRef.current;

      if (!results.poseLandmarks || !canvas || !ctx || !modelImage) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(modelImage, 0, 0, canvas.width, canvas.height);

      const drawClothing = (clothingImage: HTMLImageElement, category: 'top' | 'bottom' | 'onePiece') => {
        const landmarks = results.poseLandmarks;
        if (!landmarks) return;

        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        const leftAnkle = landmarks[27];
        const rightAnkle = landmarks[28];

        const imageAspectRatio = clothingImage.naturalWidth / clothingImage.naturalHeight;

        if (category === 'top' && leftShoulder && rightShoulder && leftHip && rightHip) {
            const torsoWidth = Math.abs(rightShoulder.x - leftShoulder.x) * canvas.width;
            const torsoHeight = Math.abs(leftHip.y - leftShoulder.y) * canvas.height;
            const centerX = ((leftShoulder.x + rightShoulder.x) / 2) * canvas.width;
            const topY = leftShoulder.y * canvas.height;

            const scaleFactor = 1.7;
            const finalWidth = torsoWidth * scaleFactor;
            const finalHeight = finalWidth / imageAspectRatio;
            const yOffset = torsoHeight * 0.15;

            ctx.drawImage(clothingImage, centerX - finalWidth / 2, topY - yOffset, finalWidth, finalHeight);

        } else if (category === 'bottom' && leftHip && rightHip && leftAnkle && rightAnkle) {
            const legHeight = Math.abs(leftAnkle.y - leftHip.y) * canvas.height;
            const centerX = ((leftHip.x + rightHip.x) / 2) * canvas.width;
            const topY = leftHip.y * canvas.height;
            
            const scaleFactor = 1.0;
            const finalHeight = legHeight * scaleFactor;
            const finalWidth = finalHeight * imageAspectRatio;
            const yOffset = legHeight * 0.05;

            ctx.drawImage(clothingImage, centerX - finalWidth / 2, topY - yOffset, finalWidth, finalHeight);

        } else if (category === 'onePiece' && leftShoulder && rightShoulder && leftAnkle && rightAnkle) {
            const bodyHeight = Math.abs(leftAnkle.y - leftShoulder.y) * canvas.height;
            const centerX = ((leftShoulder.x + rightShoulder.x) / 2) * canvas.width;
            const topY = leftShoulder.y * canvas.height;
            
            const scaleFactor = 1.1;
            const finalHeight = bodyHeight * scaleFactor;
            const finalWidth = finalHeight * imageAspectRatio;

            ctx.drawImage(clothingImage, centerX - finalWidth / 2, topY, finalWidth, finalHeight);
        }
      };

      const imagesToLoad = [];
      if (top) imagesToLoad.push({ src: top, category: 'top' });
      if (bottom) imagesToLoad.push({ src: bottom, category: 'bottom' });
      if (onePiece) imagesToLoad.push({ src: onePiece, category: 'onePiece' });

      imagesToLoad.forEach(item => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = item.src;
        img.onload = () => {
          drawClothing(img, item.category as any);
        };
      });
    };
  }, [top, bottom, onePiece]);

  // Effect 2: Initialize Pose singleton, runs only once
  useEffect(() => {
    if (!window.poseInstance) {
        const pose = new Pose({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        window.poseInstance = pose;
    }

    window.poseInstance.onResults((results: any) => {
        if (onResultsRef.current) {
            onResultsRef.current(results);
        }
    });

    const modelImage = new Image();
    modelImage.crossOrigin = 'anonymous';
    modelImage.src = '/model-removebg-preview.png';
    modelImageRef.current = modelImage;

    const canvas = canvasRef.current;
    if (canvas) {
        modelImage.onload = () => {
            if (!canvasRef.current) return;
            canvas.width = modelImage.width;
            canvas.height = modelImage.height;
            if (window.poseInstance) {
                window.poseInstance.send({ image: modelImage });
            }
        };
    }
    // No cleanup function is returned. This is intentional to keep the instance alive.
  }, []);

  // Effect 3: Re-run pose detection when props change
  useEffect(() => {
    const modelImage = modelImageRef.current;
    if (window.poseInstance && modelImage && modelImage.complete) {
        window.poseInstance.send({ image: modelImage });
    }
  }, [top, bottom, onePiece]);

  return <canvas ref={canvasRef} className={className} />;
};

export default VirtualTryOn;