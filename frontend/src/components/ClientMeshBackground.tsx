"use client";

import dynamic from "next/dynamic";

const MeshBackground = dynamic(() => import("@/components/MeshBackground"), {
  ssr: false,
});

export default function ClientMeshBackground() {
  return <MeshBackground />;
}
