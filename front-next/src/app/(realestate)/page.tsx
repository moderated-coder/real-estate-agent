import { Suspense } from "react";
import RealEstateClient from "./_components/RealEstateClient";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import getRealEstateDatas from "./_lib/getRealEstateDatas";
import { SearchParams } from "next/dist/server/request/search-params";
export default async function RealEstatePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const gu = resolvedSearchParams.gu ? resolvedSearchParams.gu : undefined;
  const deposit_min = resolvedSearchParams.deposit_min ? resolvedSearchParams.deposit_min : undefined;
  const deposit_max = resolvedSearchParams.deposit_max ? resolvedSearchParams.deposit_max : undefined;
  const rent_min = resolvedSearchParams.rent_min ? resolvedSearchParams.rent_min : undefined;
  const rent_max = resolvedSearchParams.rent_max ? resolvedSearchParams.rent_max : undefined;
  const dongParam = resolvedSearchParams.dong;
  const dong = dongParam ? (Array.isArray(dongParam) ? dongParam : [dongParam]) : undefined;
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["search", { gu, deposit_min, deposit_max, rent_min, rent_max, dong }],
    queryFn: ({ pageParam = "1" }) =>
      getRealEstateDatas({
        pageParam,
        queryKey: ["search", { gu, deposit_min, deposit_max, rent_min, rent_max, dong }],
      }),
    initialPageParam: "1",
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <HydrationBoundary state={dehydratedState}>
        <main className="max-w-6xl mx-auto px-4 pt-4 pb-10">
          <RealEstateClient
            gu={gu}
            dong={dong}
            deposit_min={deposit_min}
            deposit_max={deposit_max}
            rent_min={rent_min}
            rent_max={rent_max}
          />
        </main>
      </HydrationBoundary>
    </Suspense>
  );
}
