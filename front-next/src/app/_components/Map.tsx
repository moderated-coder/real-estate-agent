"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import MakerClustering from "@/src/lib/naver/MakerClustering";

function isLatLng(obj: unknown): obj is naver.maps.LatLng {
  return typeof (obj as any).lat === "function" && typeof (obj as any).lng === "function";
}

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!window.naver || !mapRef.current) return;

    const mLat = parseFloat(searchParams.get("m_lat") || "37.5665");
    const mLng = parseFloat(searchParams.get("m_lng") || "126.978");
    const mZoom = parseInt(searchParams.get("m_zoom") || "13", 10);

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(mLat, mLng),
      zoom: mZoom,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_LEFT,
        style: naver.maps.ZoomControlStyle.SMALL,
      },
    });

    const HOME_PATH = "/images";

    const clusterIcons = [1, 2, 3, 4, 5].map((num) => ({
      content: ` <div style="background:url(${HOME_PATH}/cluster-marker-${num}.png)"></div>`,
      size: new window.naver.maps.Size(40, 40),
      anchor: new window.naver.maps.Point(20, 20),
    }));

    const markerCluster: any = new (MakerClustering as any)({
      map,
      minClusterSize: 2,
      maxZoom: 30,
      gridSize: 120,
      icons: clusterIcons,
      indexGenerator: [10, 50, 70, 100, 130],
      stylingFunction: (clusterMarker: any, count: any) => {
        const element = clusterMarker.getElement();
        if (element instanceof HTMLElement) {
          // Find the inner div (the styled cluster icon)
          const div = element.querySelector("div");
          if (div) {
            // 배경 이미지 설정
            if (count < 5) {
              div.style.backgroundImage = `url(${HOME_PATH}/cluster-marker-${1}.png)`;
            } else if (count < 10) {
              div.style.backgroundImage = `url(${HOME_PATH}/cluster-marker-${2}.png)`;
            } else if (count < 50) {
              div.style.backgroundImage = `url(${HOME_PATH}/cluster-marker-${3}.png)`;
            } else if (count < 100) {
              div.style.backgroundImage = `url(${HOME_PATH}/cluster-marker-${4}.png)`;
            } else {
              div.style.backgroundImage = `url(${HOME_PATH}/cluster-marker-${5}.png)`;
            }

            // 크기 지정
            div.style.width = "40px";
            div.style.height = "40px";

            // 이미지 크기 조절
            div.style.backgroundSize = "contain"; // div에 맞춰 비율 유지하며 축소/확대
            div.style.backgroundRepeat = "no-repeat"; // 타일 형태 반복 방지
            div.style.backgroundPosition = "center"; // 중앙 정렬

            // 필요하면 줄 높이(line-height)로 텍스트 수직 정렬
            div.style.lineHeight = div.style.height;
            div.textContent = String(count);
          }
        }
      },
      markers: [],
      disableClickZoom: false,
    });

    const fetchAndRenderMarkers = async () => {
      const res = await fetch(`/properties?lat=${mLat}&lng=${mLng}&zoom=${mZoom}`);
      const data = await res.json();

      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      const newMarkers = data.map((item: any) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(item.grd_la, item.grd_lo),
        });

        const infoWindow = new window.naver.maps.InfoWindow({
          content: `
            <div style="padding:10px;">
              <strong>${item.year}</strong><br/>
              ${item.dt_006}
            </div>
          `,
        });

        window.naver.maps.Event.addListener(marker, "click", () => {
          infoWindow.open(map, marker);
        });

        return marker;
      });

      markerCluster.setMarkers(newMarkers);
      markerCluster._redraw?.();
      markersRef.current = newMarkers;
    };

    fetchAndRenderMarkers();

    window.naver.maps.Event.addListener(map, "idle", () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      if (!isLatLng(center)) return;

      const query = new URLSearchParams({
        m_lat: center.lat().toFixed(7),
        m_lng: center.lng().toFixed(7),
        m_zoom: zoom.toString(),
      });

      router.replace(`?${query.toString()}`);
      fetchAndRenderMarkers();
    });
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}
