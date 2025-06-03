const SavedPage = () => {
  return (
    <div className="flex w-full">
      {/* Main Content */}
      <div className="flex-1 bg-white p-5 rounded-xl shadow-md">
        <div className="text-2xl font-bold mb-5">부동산 리스트업</div>

        {/* Listing Item */}
        {[1, 2].map((_, i) => (
          <div key={i} className="border border-gray-300 rounded-lg p-4 mb-5 flex gap-4 items-start">
            <input type="checkbox" />
            <img
              src={
                i === 0
                  ? "https://landthumb-phinf.pstatic.net/20250523_3/1747961631674SUKwc_JPEG/eumsub_16410021299_2.jpg?type=m1024"
                  : "https://landthumb-phinf.pstatic.net/20250522_66/1747889702104wBCzD_JPEG/1746667168832827.jpg?type=m1024"
              }
              alt="listing"
              className="w-[90px] h-[90px] object-cover rounded-md"
            />
            <div className="flex-1">
              <h2 className="text-base font-semibold mb-1">
                {i === 0 ? "서울시 강남구 삼성동 1-1 201호 (다세대)" : "서울시 서초구 잠원동 1-1 202호 (다가구)"}
              </h2>
              <p className="text-sm text-gray-700 mb-1">{i === 0 ? "월세 보증금 1000 / 월세 80" : "전세 4억"}</p>
              <p className="text-sm text-gray-700 mb-1">
                {i === 0 ? "특이사항: 공실 (비밀번호)" : "특이사항: 세입자 연락처 있음"}
              </p>
              {i === 1 && <p className="text-sm text-gray-700 mb-1">비고: 위법건축물</p>}
              <input
                type="text"
                placeholder="메모 입력…"
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm mt-2"
              />
              <div className="mt-3 flex gap-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">매물 상세</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">삭제</button>
              </div>
            </div>
          </div>
        ))}

        {/* Summary */}
        <div className="border-t pt-4 flex justify-between items-center">
          <p className="text-sm">
            선택한 매물 <strong>2개</strong>
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">엑셀로 내보내기</button>
        </div>
      </div>
    </div>
  );
};

export default SavedPage;
