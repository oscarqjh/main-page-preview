"use client";

import dynamic from 'next/dynamic';

interface ParticleMorphWrapperProps {
  onStateChange?: (state: string) => void;
}

const ParticleMorphThree = dynamic(
  () => import('./ParticleMorphThree').then((mod) => mod.ParticleMorphThree),
  { ssr: false }
);

export default function ParticleMorphWrapper(props: ParticleMorphWrapperProps) {
  return <ParticleMorphThree {...props} />;
}
