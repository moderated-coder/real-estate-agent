import { create } from "zustand";

interface FilterTag {
  categoryName: string;
  subcategoryName: string;
}

interface SearchState {
  filterTags: FilterTag[];
  toggleFilterTag: (categoryName: string, subcategoryName: string) => void;
  resetFilterTag: () => void;
}

const useFilterTagsStore = create<SearchState>((set) => ({
  filterTags: [],
  toggleFilterTag: (categoryName, subcategoryName) =>
    set((state) => {
      // 누른 필터가 지금 filterTags에 존재하는지 확인
      const exists = state.filterTags.some(
        (filter) => filter.categoryName === categoryName && filter.subcategoryName === subcategoryName
      );
      // exists 결과에 따라 선택을 하거나 선택을 해지함
      return {
        filterTags: exists
          ? state.filterTags.filter(
              (filterTag) => !(filterTag.categoryName === categoryName && filterTag.subcategoryName === subcategoryName)
            )
          : [...state.filterTags, { categoryName, subcategoryName }],
      };
    }),
  resetFilterTag: () => set(() => ({ filterTags: [] })),
}));

export default useFilterTagsStore;
