"use client"

import React from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animationData: any; // The JSON animation data
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  className,
  style,
}: LottieAnimationProps) {
  return (
    <div className={className} style={style}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }} // Ensure Lottie fills its container
      />
    </div>
  );
}