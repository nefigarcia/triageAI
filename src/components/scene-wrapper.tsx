'use client';

import dynamic from 'next/dynamic';

const AnimatedScene = dynamic(
  () => import('@/components/animated-scene').then((mod) => mod.AnimatedScene),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-900" />,
  }
);

export function SceneWrapper() {
  return <AnimatedScene />;
}
