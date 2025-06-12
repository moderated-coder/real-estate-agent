import { Article } from "@/src/app/(realestate)/types/realEstate";

interface RealEstateResponse {
  total_count: number;
  real_estate_list: Article[];
  nextPage: string | null;
}

export default async function getRealEstateDatas({
  pageParam,
  filters,
}: {
  pageParam: string;
  filters: {
    gu?: string;
    dong?: string;
    deposit_min?: string;
    deposit_max?: string;
    rent_min?: string;
    rent_max?: string;
  };
}): Promise<RealEstateResponse> {
  const { gu, deposit_min, deposit_max, rent_min, rent_max, dong } = filters;
  const url = new URL("get_articles", process.env.NEXT_PUBLIC_API_URL);
  const multiValueParams = {
    gu,
    dong,
    deposit_min,
    deposit_max,
    rent_min,
    rent_max,
  };

  Object.entries(multiValueParams).forEach(([key, value]) => {
    if (value === undefined) return;
    url.searchParams.append(key, value);
  });

  url.searchParams.append("cursor", pageParam.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch real estate listings");
  return await response.json();
}
