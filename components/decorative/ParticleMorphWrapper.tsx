"use client";

import dynamic from 'next/dynamic';

const ParticleMorphThree = dynamic(
  () => import('./ParticleMorphThree').then((mod) => mod.ParticleMorphThree),
  { ssr: false }
);

export default function ParticleMorphWrapper(props: any) {
  return <ParticleMorphThree {...props} />;
}
