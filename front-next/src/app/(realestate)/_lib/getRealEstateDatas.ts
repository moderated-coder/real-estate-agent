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
    article_class?: string;
  };
}): Promise<RealEstateResponse> {
  const { gu, deposit_min, deposit_max, rent_min, rent_max, dong, article_class } = filters;

  let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/get_articles`;

  const params = new URLSearchParams();
  const multiValueParams = {
    gu,
    dong,
    deposit_min,
    deposit_max,
    rent_min,
    rent_max,
    article_class,
  };

  Object.entries(multiValueParams).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    params.set(key, Array.isArray(value) ? value.join(",") : value);
  });
  params.set("cursor", pageParam.toString());
  apiUrl = `${apiUrl}?${params.toString()}`;
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch real estate listings");
  const response = await res.json();
  return response;
}
