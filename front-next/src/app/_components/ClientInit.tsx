"use client";

import { useEffect } from "react";

export default function ClientInit() {
  useEffect(() => {
    const initWorker = async () => {
      if (process.env.NODE_ENV === "development") {
        const { worker } = await import("../../msw/browser");
        await worker.start({
          onUnhandledRequest: "bypass", // 외부 요청 무시
        });
      }
    };
    initWorker();
  }, []);

  return null;
}
