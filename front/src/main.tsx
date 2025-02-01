import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

// API 모킹을 설정하는 비동기 함수로, MSW(서비스 워커)를 설정해 브라우저에서 네트워크 요청을 모킹
async function enableMocking() {
  // vite의 경우
  // 개발 환경에서만 MSW를 활성화
  if (!import.meta.env.DEV) {
    return;
  }

  // 해당 파일에서 설정한 MSW의 worker 객체를 동적 로딩해 모킹을 설정
  const { worker } = await import("./mocks/browser.ts");

  // 가져온 서비스 워커를 브라우저에서 시작해 API 요청을 가로채고, 정의된 핸들러로 응답 반환
  return worker.start();
}

const rootElement = document.getElementById("root")!;

// enableMocking() 함수가 완성된 후에 앱의 렌더링을 시작 => 모킹이 활성화된 후에만 앱이 렌더링 되도록 보장
enableMocking().then(() => {
  const root = createRoot(rootElement);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});
