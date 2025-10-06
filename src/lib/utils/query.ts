import queryString from "query-string";
import { getDb } from "@/lib/db";
import { genders } from "@/lib/db/schema";

export interface FilterParams {
  search?: string;
  gender?: string[];
  size?: string[];
  color?: string[];
  price?: string[];
  category?: string[];
  brand?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string[];
  genderId?: string[];
  brandId?: string[];
  colorId?: string[];
  sizeId?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface SortOption {
  value: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: "created_at_desc", label: "Featured" },
  { value: "created_at_desc", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
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
  const params = queryString.parse(searchParams.toString(), {
    arrayFormat: "bracket",
    parseNumbers: true,
  });

  return {
    gender: Array.isArray(params.gender)
      ? params.gender.filter((v): v is string => typeof v === "string")
      : params.gender && typeof params.gender === "string"
        ? [params.gender]
        : undefined,
    size: Array.isArray(params.size)
      ? params.size.filter((v): v is string => typeof v === "string")
      : params.size && typeof params.size === "string"
        ? [params.size]
        : undefined,
    color: Array.isArray(params.color)
      ? params.color.filter((v): v is string => typeof v === "string")
      : params.color && typeof params.color === "string"
        ? [params.color]
        : undefined,
    price: Array.isArray(params.price)
      ? params.price.filter((v): v is string => typeof v === "string")
      : params.price && typeof params.price === "string"
        ? [params.price]
        : undefined,
    category: Array.isArray(params.category)
      ? params.category.filter((v): v is string => typeof v === "string")
      : params.category && typeof params.category === "string"
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
    Object.entries(filters).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== "";
    })
  );

  return queryString.stringify(cleanFilters, {
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

/**
 * Get gender mapping from database
 * This function fetches the actual gender IDs from the database
 */
async function getGenderMapping(): Promise<Record<string, string>> {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL not found, using fallback gender mapping");
      return getFallbackGenderMapping();
    }

    const db = getDb();
    const genderRecords = await db.select().from(genders);
    const mapping: Record<string, string> = {};

    genderRecords.forEach((gender) => {
      mapping[gender.slug] = gender.id;
    });

    return mapping;
  } catch (error) {
    console.warn("Could not fetch gender mapping from database:", error);
    return getFallbackGenderMapping();
  }
}

/**
 * Fallback gender mapping for when database is not available
 */
function getFallbackGenderMapping(): Record<string, string> {
  return {
    men: "men-gender-id",
    women: "women-gender-id",
    kids: "kids-gender-id",
    unisex: "unisex-gender-id",
  };
}

/**
 * Convert gender slugs to gender IDs
 * This function maps gender slugs from URL parameters to actual database IDs
 */
async function convertGenderSlugsToIds(
  genderSlugs: string[]
): Promise<string[]> {
  const mapping = await getGenderMapping();
  return genderSlugs
    .map((slug) => mapping[slug])
    .filter((id): id is string => id !== undefined);
}

/**
 * Parse URL search params into ProductFilters for database queries
 */
export async function parseProductFilters(
  searchParams: URLSearchParams
): Promise<ProductFilters> {
  const params = queryString.parse(searchParams.toString(), {
    arrayFormat: "bracket",
    parseNumbers: true,
  });

  // Handle gender parameter - convert slugs to IDs
  const genderSlugs = Array.isArray(params.gender)
    ? params.gender.filter((v): v is string => typeof v === "string")
    : params.gender && typeof params.gender === "string"
      ? [params.gender]
      : undefined;

  const genderIds = genderSlugs
    ? await convertGenderSlugsToIds(genderSlugs)
    : undefined;

  return {
    search: typeof params.search === "string" ? params.search : undefined,
    categoryId: Array.isArray(params.category)
      ? params.category.filter((v): v is string => typeof v === "string")
      : params.category && typeof params.category === "string"
        ? [params.category]
        : undefined,
    genderId: genderIds,
    brandId: Array.isArray(params.brand)
      ? params.brand.filter((v): v is string => typeof v === "string")
      : params.brand && typeof params.brand === "string"
        ? [params.brand]
        : undefined,
    colorId: Array.isArray(params.color)
      ? params.color.filter((v): v is string => typeof v === "string")
      : params.color && typeof params.color === "string"
        ? [params.color]
        : undefined,
    sizeId: Array.isArray(params.size)
      ? params.size.filter((v): v is string => typeof v === "string")
      : params.size && typeof params.size === "string"
        ? [params.size]
        : undefined,
    priceMin: typeof params.priceMin === "number" ? params.priceMin : undefined,
    priceMax: typeof params.priceMax === "number" ? params.priceMax : undefined,
    sortBy: typeof params.sort === "string" ? params.sort : "created_at_desc",
    page: typeof params.page === "number" ? params.page : 1,
    limit: typeof params.limit === "number" ? params.limit : 24,
  };
}

/**
 * Convert FilterParams to ProductFilters
 */
export function convertToProductFilters(filters: FilterParams): ProductFilters {
  return {
    search: filters.search,
    categoryId: filters.category,
    genderId: filters.gender,
    brandId: filters.brand,
    colorId: filters.color,
    sizeId: filters.size,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    sortBy: filters.sort || "created_at_desc",
    page: filters.page || 1,
    limit: filters.limit || 24,
  };
}

/**
 * Convert ProductFilters to FilterParams for sidebar display
 */
export async function convertToFilterParams(
  filters: ProductFilters
): Promise<FilterParams> {
  // Convert gender IDs back to slugs
  let genderSlugs: string[] | undefined;
  if (filters.genderId && filters.genderId.length > 0) {
    try {
      const mapping = await getGenderMapping();
      const reverseMapping: Record<string, string> = {};
      Object.entries(mapping).forEach(([slug, id]) => {
        reverseMapping[id] = slug;
      });

      genderSlugs = filters.genderId
        .map((id) => reverseMapping[id])
        .filter((slug): slug is string => slug !== undefined);
    } catch (error) {
      console.warn("Could not convert gender IDs to slugs:", error);
      // Fallback: try to match against known fallback IDs
      const fallbackMapping: Record<string, string> = {
        "men-gender-id": "men",
        "women-gender-id": "women",
        "kids-gender-id": "kids",
        "unisex-gender-id": "unisex",
      };

      genderSlugs = filters.genderId
        .map((id) => fallbackMapping[id])
        .filter((slug): slug is string => slug !== undefined);
    }
  }

  return {
    search: filters.search,
    gender: genderSlugs,
    size: filters.sizeId,
    color: filters.colorId,
    price:
      filters.priceMin && filters.priceMax
        ? [`${filters.priceMin}-${filters.priceMax}`]
        : undefined,
    category: filters.categoryId,
    brand: filters.brandId,
    sort: filters.sortBy,
    page: filters.page,
  };
}
