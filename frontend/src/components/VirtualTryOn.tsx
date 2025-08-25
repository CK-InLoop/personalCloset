import React, { useRef, useEffect } from 'react';
import { Pose } from '@mediapipe/pose';

interface VirtualTryOnProps {
  top?: string;
  bottom?: string;
  onePiece?: string;
  className?: string;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ top, bottom, onePiece, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<any>(null);
  const modelImageRef = useRef<HTMLImageElement | null>(null);

  // This effect initializes the Pose instance and sets up the model image.
  // It runs only once when the component mounts.
  useEffect(() => {
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

    poseRef.current = pose;

    const modelImage = new Image();
    modelImage.crossOrigin = 'anonymous';
    modelImage.src = '/model-removebg-preview.png';
    modelImageRef.current = modelImage;

    const canvas = canvasRef.current;
    if (canvas) {
        modelImage.onload = () => {
            canvas.width = modelImage.width;
            canvas.height = modelImage.height;
            // Initial pose detection
            pose.send({ image: modelImage });
        };
    }

    return () => {
      pose.close();
    };
  }, []);

  // This effect handles the drawing logic.
  // It runs whenever the clothing props (top, bottom, onePiece) change.
  useEffect(() => {
    const pose = poseRef.current;
    const modelImage = modelImageRef.current;

    if (!pose || !modelImage || !modelImage.complete) {
      return;
    }

    pose.onResults((results: any) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!results.poseLandmarks || !canvas || !ctx) {
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
        const leftKnee = landmarks[25];
        const rightKnee = landmarks[26];

        if (category === 'top' && leftShoulder && rightShoulder && leftHip && rightHip) {
          const torsoWidth = Math.abs(rightShoulder.x - leftShoulder.x) * canvas.width;
          const torsoHeight = Math.abs(leftHip.y - leftShoulder.y) * canvas.height;
          const centerX = ((leftShoulder.x + rightShoulder.x) / 2) * canvas.width;
          const topY = leftShoulder.y * canvas.height;
          const scaleFactor = 1.5;
          const finalWidth = torsoWidth * scaleFactor;
          const finalHeight = torsoHeight * 1.2;
          ctx.drawImage(clothingImage, centerX - finalWidth / 2, topY, finalWidth, finalHeight);
        } else if (category === 'bottom' && leftHip && rightHip && leftKnee && rightKnee) {
          const hipWidth = Math.abs(rightHip.x - leftHip.x) * canvas.width;
          const legHeight = Math.abs(leftKnee.y - leftHip.y) * canvas.height;
          const centerX = ((leftHip.x + rightHip.x) / 2) * canvas.width;
          const topY = leftHip.y * canvas.height;
          const scaleFactor = 1.2;
          const finalWidth = hipWidth * scaleFactor;
          const finalHeight = legHeight * 1.1;
          ctx.drawImage(clothingImage, centerX - finalWidth / 2, topY, finalWidth, finalHeight);
        } else if (category === 'onePiece' && leftShoulder && rightShoulder && leftKnee && rightKnee) {
          const bodyWidth = Math.abs(rightShoulder.x - leftShoulder.x) * canvas.width;
          const bodyHeight = Math.abs(leftKnee.y - leftShoulder.y) * canvas.height;
          const centerX = ((leftShoulder.x + rightShoulder.x) / 2) * canvas.width;
          const topY = leftShoulder.y * canvas.height;
          const scaleFactor = 1.5;
          const finalWidth = bodyWidth * scaleFactor;
          const finalHeight = bodyHeight * 1.05;
          ctx.drawImage(clothingImage, centerX - finalWidth / 2, topY, finalWidth, finalHeight);
        }
      };

      // Preload and draw images
      const imagesToLoad = [];
      if (top) imagesToLoad.push({ src: top, category: 'top' });
      if (bottom) imagesToLoad.push({ src: bottom, category: 'bottom' });
      if (onePiece) imagesToLoad.push({ src: onePiece, category: 'onePiece' });

      let loadedCount = 0;
      if (imagesToLoad.length === 0) {
        return;
      }

      imagesToLoad.forEach(item => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = item.src;
        img.onload = () => {
          drawClothing(img, item.category as any);
          loadedCount++;
        };
      });
    });

    // Trigger a new pose detection whenever clothing changes
    pose.send({ image: modelImage });

  }, [top, bottom, onePiece]);

  return <canvas ref={canvasRef} className={className} />;
};

export default VirtualTryOn;
