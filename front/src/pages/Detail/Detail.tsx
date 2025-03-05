import { useParams } from "react-router-dom";

const Detail = () => {
  const { id } = useParams(); // URL에서 매물 ID 가져오기

  // 더미 데이터 (실제 서비스에서는 API에서 가져와야 함)
  const property = {
    id,
    title: "서울 관악구 신림동 원룸",
    price: "월세 50만원 / 보증금 1000만원",
    description: "신림역 도보 5분 거리, 올수리, 채광 좋음",
    images: [
      "https://via.placeholder.com/800x400", // 대표 이미지
      "https://via.placeholder.com/800x400",
      "https://via.placeholder.com/800x400",
    ],
    details: {
      area: "23㎡ (약 7평)",
      floor: "3층 / 5층",
      direction: "남향",
      moveInDate: "즉시 입주 가능",
    },
    location: {
      address: "서울특별시 관악구 신림동 123-45",
      mapUrl: "https://maps.google.com", // 실제 지도 API 연동 필요
    },
  };

  return (
    <div className="detail-container">
      {/* 매물 이미지 */}
      <div className="detail-image-wrapper">
        <img src={"/image/sampleRoom.jpg"} alt="매물 이미지" className="detail-image" />
      </div>

      {/* 매물 기본 정보 */}
      <div className="detail-info">
        <h1 className="detail-title">{property.title}</h1>
        <p className="detail-price">{property.price}</p>
        <p className="detail-description">{property.description}</p>
      </div>

      {/* 상세 정보 */}
      <div className="detail-section">
        <h2 className="detail-heading">상세 정보</h2>
        <ul className="detail-list">
          <li>
            <span>면적:</span> {property.details.area}
          </li>
          <li>
            <span>층수:</span> {property.details.floor}
          </li>
          <li>
            <span>방향:</span> {property.details.direction}
          </li>
          <li>
            <span>입주 가능일:</span> {property.details.moveInDate}
          </li>
        </ul>
      </div>

      {/* 위치 정보 */}
      <div className="detail-section">
        <h2 className="detail-heading">위치</h2>
        <p className="detail-location">{property.location.address}</p>
        <a href={property.location.mapUrl} target="_blank" rel="noopener noreferrer" className="detail-map-link">
          지도에서 보기
        </a>
      </div>

      {/* 하단 버튼 */}
      <div className="detail-footer">
        <button className="detail-button contact">문의하기</button>
        <button className="detail-button back">목록으로 돌아가기</button>
      </div>
    </div>
  );
};

export default Detail;
