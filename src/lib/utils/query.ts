import { stringify, parse } from "query-string";

export interface FilterParams {
  gender?: string[];
  size?: string[];
  color?: string[];
  price?: string[];
  category?: string[];
  sort?: string;
  page?: number;
}

export interface SortOption {
  value: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export const FILTER_OPTIONS = {
  gender: [
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "kids", label: "Kids" },
    { value: "unisex", label: "Unisex" },
  ],
  size: [
    { value: "8", label: "8" },
    { value: "8.5", label: "8.5" },
    { value: "9", label: "9" },
    { value: "9.5", label: "9.5" },
    { value: "10", label: "10" },
    { value: "10.5", label: "10.5" },
    { value: "11", label: "11" },
    { value: "11.5", label: "11.5" },
    { value: "12", label: "12" },
  ],
  color: [
    { value: "black", label: "Black" },
    { value: "white", label: "White" },
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "silver", label: "Silver" },
  ],
  price: [
    { value: "0-50", label: "$0 - $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-150", label: "$100 - $150" },
    { value: "150-200", label: "$150 - $200" },
    { value: "200+", label: "$200+" },
  ],
  category: [
    { value: "sneakers", label: "Sneakers" },
    { value: "running", label: "Running" },
    { value: "basketball", label: "Basketball" },
    { value: "lifestyle", label: "Lifestyle" },
  ],
};

/**
 * Parse URL search params into filter object
 */
export function parseFilters(searchParams: URLSearchParams): FilterParams {
  const params = parse(searchParams.toString(), {
    arrayFormat: "bracket",
    parseNumbers: true,
  });

  return {
    gender: Array.isArray(params.gender)
      ? params.gender
      : params.gender
        ? [params.gender]
        : undefined,
    size: Array.isArray(params.size)
      ? params.size
      : params.size
        ? [params.size]
        : undefined,
    color: Array.isArray(params.color)
      ? params.color
      : params.color
        ? [params.color]
        : undefined,
    price: Array.isArray(params.price)
      ? params.price
      : params.price
        ? [params.price]
        : undefined,
    category: Array.isArray(params.category)
      ? params.category
      : params.category
        ? [params.category]
        : undefined,
    sort: typeof params.sort === "string" ? params.sort : undefined,
    page: typeof params.page === "number" ? params.page : 1,
  };
}

/**
 * Create URL search params from filter object
 */
export function createSearchParams(filters: FilterParams): string {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== "";
    })
  );

  return stringify(cleanFilters, {
    arrayFormat: "bracket",
    skipNull: true,
    skipEmptyString: true,
  });
}

/**
 * Add a filter value to existing filters
 */
export function addFilter(
  currentFilters: FilterParams,
  filterType: keyof Omit<FilterParams, "sort" | "page">,
  value: string
): FilterParams {
  const currentValues = currentFilters[filterType] || [];
  const newValues = Array.isArray(currentValues)
    ? [...currentValues, value]
    : [value];

  return {
    ...currentFilters,
    [filterType]: [...new Set(newValues)], // Remove duplicates
    page: 1, // Reset to first page when filters change
  };
}

/**
 * Remove a filter value from existing filters
 */
export function removeFilter(
  currentFilters: FilterParams,
  filterType: keyof Omit<FilterParams, "sort" | "page">,
  value: string
): FilterParams {
  const currentValues = currentFilters[filterType] || [];
  const newValues = Array.isArray(currentValues)
    ? currentValues.filter((v) => v !== value)
    : [];

  const updatedFilters = {
    ...currentFilters,
    [filterType]: newValues.length > 0 ? newValues : undefined,
  };

  // Remove the filter type entirely if no values remain
  if (newValues.length === 0) {
    delete updatedFilters[filterType];
  }

  return updatedFilters;
}

/**
 * Set sort option
 */
export function setSort(
  currentFilters: FilterParams,
  sortValue: string
): FilterParams {
  return {
    ...currentFilters,
    sort: sortValue,
    page: 1, // Reset to first page when sort changes
  };
}

/**
 * Clear all filters
 */
export function clearFilters(): FilterParams {
  return {
    page: 1,
  };
}

/**
 * Get active filter count
 */
export function getActiveFilterCount(filters: FilterParams): number {
  let count = 0;

  Object.entries(filters).forEach(([key, value]) => {
    if (key === "sort" || key === "page") return;
    if (Array.isArray(value) && value.length > 0) count += value.length;
  });

  return count;
}

/**
 * Check if a filter value is active
 */
export function isFilterActive(
  filters: FilterParams,
  filterType: keyof Omit<FilterParams, "sort" | "page">,
  value: string
): boolean {
  const currentValues = filters[filterType];
  return Array.isArray(currentValues) && currentValues.includes(value);
}
