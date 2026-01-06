import { PAGINATION } from "@/config/constants";
import { useEffect, useState } from "react";

interface useEnitySearchPops<T> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<T extends { search?: string; page?: number }>({
  params,
  setParams,
  debounceMs = 500
}: useEnitySearchPops<T>) {
  const [localSearch, setLocalSearch] = useState(params.search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = params.search || "";
      
      if (localSearch !== currentSearch) {
        const newParams = { ...params, page: PAGINATION.DEFAULT_PAGE };
        
        if (!localSearch) {
          // Remove search param completely when empty
          const { search, ...rest } = newParams;
          setParams(rest as T);
        } else {
          // Add search param when not empty
          setParams({ ...newParams, search: localSearch });
        }
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, params, setParams, debounceMs]);

  useEffect(() => {
    setLocalSearch(params.search || "");
  }, [params.search]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
}