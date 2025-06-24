import RealEstateClient from "./_components/RealEstateClient";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getFolderList } from "@/src/lib/api";

type SearchParams = {
  gu?: string;
  deposit_min?: string;
  deposit_max?: string;
  rent_min?: string;
  rent_max?: string;
  dong?: string;
  article_class?: string;
};
export default async function RealEstatePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const gu = resolvedSearchParams.gu ? resolvedSearchParams.gu : undefined;
  const deposit_min = resolvedSearchParams.deposit_min ? resolvedSearchParams.deposit_min : undefined;
  const deposit_max = resolvedSearchParams.deposit_max ? resolvedSearchParams.deposit_max : undefined;
  const rent_min = resolvedSearchParams.rent_min ? resolvedSearchParams.rent_min : undefined;
  const rent_max = resolvedSearchParams.rent_max ? resolvedSearchParams.rent_max : undefined;
  const dong = resolvedSearchParams.dong ? resolvedSearchParams.dong : undefined;
  const article_class = resolvedSearchParams.article_class ? resolvedSearchParams.article_class : "SELECT_ALL";
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["folders", "admin"],
    queryFn: getFolderList,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <div>
        <RealEstateClient
          gu={gu}
          dong={dong}
          deposit_min={deposit_min}
          deposit_max={deposit_max}
          rent_min={rent_min}
          rent_max={rent_max}
          article_class={article_class}
        />
      </div>
    </HydrationBoundary>
  );
}
