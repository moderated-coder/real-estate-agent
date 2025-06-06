import { Article } from "@/src/app/(realestate)/types/realEstate";

interface RealEstateResponse {
  total_count: number;
  real_estate_list: Article[];
  nextPage: string | null;
}

export default async function getRealEstateDatas({
  pageParam,
  queryKey,
}: {
  pageParam: string;
  queryKey: readonly [
    "search",
    {
      readonly gu?: string | string[];
      readonly dong?: string | string[];
      readonly deposit_min?: string | string[];
      readonly deposit_max?: string | string[];
      readonly rent_min?: string | string[];
      readonly rent_max?: string | string[];
    }
  ];
}): Promise<RealEstateResponse> {
  const [, { gu, deposit_min, deposit_max, rent_min, rent_max, dong }] = queryKey;
  const url = new URL("/get_articles", process.env.NEXT_PUBLIC_API_URL);
  console.log(url.toString());
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
    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, v));
    } else {
      url.searchParams.append(key, value);
    }
  });

  url.searchParams.append("cursor", pageParam.toString());
  console.log("Fetching real estate listings from:", url.toString());
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch real estate listings");
  return await response.json();
}
