import { useEffect, useRef } from "react";

const Map = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      if (!window.naver || !mapRef.current) return;

      // 1. 지도 생성
      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.978),
        zoom: 13,
      });
      try {
        const response = await fetch("/api/properties");
        const data = await response.json();
        data.forEach((item: any) => {
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(item.lat, item.lng),
            map,
          });

          const infoWindow = new window.naver.maps.InfoWindow({
            content: `
              <div style="padding:10px;">
                <strong>${item.title}</strong><br/>
                ${item.price}
              </div>
            `,
          });

          window.naver.maps.Event.addListener(marker, "click", () => {
            infoWindow.open(map, marker);
          });
        });
      } catch (error) {
        console.error("매물 정보를 불러오는 데 실패했습니다:", error);
      }
    };
    fetchMarkers();
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};

export default Map;
