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
    // Ensure we have a clean slate on hot-reload
    if (poseRef.current) {
      poseRef.current.close();
      poseRef.current = null;
    }

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
            if (!canvasRef.current) return; // Component might have unmounted
            canvas.width = modelImage.width;
            canvas.height = modelImage.height;
            // Initial pose detection
            if (poseRef.current) {
                poseRef.current.send({ image: modelImage });
            }
        };
    }

    return () => {
      if (poseRef.current) {
        poseRef.current.close();
        poseRef.current = null;
      }
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
        const leftAnkle = landmarks[27];
        const rightAnkle = landmarks[28];

        const imageAspectRatio = clothingImage.naturalWidth / clothingImage.naturalHeight;

        if (category === 'top' && leftShoulder && rightShoulder && leftHip && rightHip) {
            const torsoWidth = Math.abs(rightShoulder.x - leftShoulder.x) * canvas.width;
            const torsoHeight = Math.abs(leftHip.y - leftShoulder.y) * canvas.height;
            const centerX = ((leftShoulder.x + rightShoulder.x) / 2) * canvas.width;
            const topY = leftShoulder.y * canvas.height;

            const scaleFactor = 1.5; 
            const finalWidth = torsoWidth * scaleFactor;
            const finalHeight = finalWidth / imageAspectRatio;
            const yOffset = torsoHeight * 0.1; // Adjust vertical position

            ctx.drawImage(clothingImage, centerX - finalWidth / 2, topY - yOffset, finalWidth, finalHeight);

        } else if (category === 'bottom' && leftHip && rightHip && leftAnkle && rightAnkle) {
            const legHeight = Math.abs(leftAnkle.y - leftHip.y) * canvas.height;
            const centerX = ((leftHip.x + rightHip.x) / 2) * canvas.width;
            const topY = leftHip.y * canvas.height;
            
            const scaleFactor = 1.1;
            const finalHeight = legHeight * scaleFactor;
            const finalWidth = finalHeight * imageAspectRatio;

            ctx.drawImage(clothingImage, centerX - finalWidth / 2, topY, finalWidth, finalHeight);

        } else if (category === 'onePiece' && leftShoulder && rightShoulder && leftAnkle && rightAnkle) {
            const bodyHeight = Math.abs(leftAnkle.y - leftShoulder.y) * canvas.height;
            const centerX = ((leftShoulder.x + rightShoulder.x) / 2) * canvas.width;
            const topY = leftShoulder.y * canvas.height;
            
            const scaleFactor = 1.05;
            const finalHeight = bodyHeight * scaleFactor;
            const finalWidth = finalHeight * imageAspectRatio;

            ctx.drawImage(clothingImage, centerX - finalWidth / 2, topY, finalWidth, finalHeight);
        }
      };

      // Preload and draw images
      const imagesToLoad = [];
      if (top) imagesToLoad.push({ src: top, category: 'top' });
      if (bottom) imagesToLoad.push({ src: bottom, category: 'bottom' });
      if (onePiece) imagesToLoad.push({ src: onePiece, category: 'onePiece' });

      if (imagesToLoad.length === 0) {
        // If no clothes are selected, just draw the model
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(modelImage, 0, 0, canvas.width, canvas.height);
        return;
      }

      let loadedCount = 0;
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