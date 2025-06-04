"use client";

import Script from "next/script";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("./_components/Map"), { ssr: false });

export default function MapPage() {
  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`}
        strategy="beforeInteractive"
      />

      <Map />
    </>
  );
}
