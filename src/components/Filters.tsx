"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FilterParams,
  FILTER_OPTIONS,
  addFilter,
  removeFilter,
  clearFilters,
  isFilterActive,
} from "@/lib/utils/query";

interface FiltersProps {
  initialFilters: FilterParams;
}

export default function Filters({ initialFilters }: FiltersProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      gender: true,
      size: true,
      color: true,
      price: true,
      category: true,
    }
  );

  // Update filters when URL changes
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const updateURL = (newFilters: FilterParams) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (key === "sort" || key === "page") return;
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((v) => params.append(key, v));
      }
    });

    const queryString = params.toString();
    const newURL = queryString ? `/products?${queryString}` : "/products";

    router.push(newURL, { scroll: false });
  };

  const handleFilterToggle = (
    filterType: keyof Omit<FilterParams, "sort" | "page">,
    value: string
  ) => {
    const isActive = isFilterActive(filters, filterType, value);
    const newFilters = isActive
      ? removeFilter(filters, filterType, value)
      : addFilter(filters, filterType, value);

    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleClearFilters = () => {
    const newFilters = clearFilters();
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "sort" || key === "page") return;
      if (Array.isArray(value) && value.length > 0) count += value.length;
    });
    return count;
  };

  const FilterGroup = ({
    title,
    filterType,
    options,
    isExpanded,
  }: {
    title: string;
    filterType: keyof Omit<FilterParams, "sort" | "page">;
    options: Array<{ value: string; label: string }>;
    isExpanded: boolean;
  }) => (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0">
      <button
        onClick={() => toggleGroup(filterType)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        aria-expanded={isExpanded}
        aria-controls={`filter-group-${filterType}`}
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        id={`filter-group-${filterType}`}
        className={`transition-all duration-200 ${isExpanded ? "block" : "hidden"}`}
      >
        <div className="space-y-2">
          {options.map((option) => {
            const isActive = isFilterActive(filters, filterType, option.value);
            return (
              <label
                key={option.value}
                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => handleFilterToggle(filterType, option.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  aria-describedby={`${filterType}-${option.value}-label`}
                />
                <span
                  id={`${filterType}-${option.value}-label`}
                  className="ml-3 text-sm text-gray-700"
                >
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
            />
          </svg>
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close filters"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile Filter Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <FilterGroup
                  title="Gender"
                  filterType="gender"
                  options={FILTER_OPTIONS.gender}
                  isExpanded={expandedGroups.gender}
                />
                <FilterGroup
                  title="Size"
                  filterType="size"
                  options={FILTER_OPTIONS.size}
                  isExpanded={expandedGroups.size}
                />
                <FilterGroup
                  title="Color"
                  filterType="color"
                  options={FILTER_OPTIONS.color}
                  isExpanded={expandedGroups.color}
                />
                <FilterGroup
                  title="Price"
                  filterType="price"
                  options={FILTER_OPTIONS.price}
                  isExpanded={expandedGroups.price}
                />
                <FilterGroup
                  title="Category"
                  filterType="category"
                  options={FILTER_OPTIONS.category}
                  isExpanded={expandedGroups.category}
                />
              </div>

              {/* Mobile Footer */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleClearFilters}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {getActiveFilterCount() > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Clear all
              </button>
            )}
          </div>

          <FilterGroup
            title="Gender"
            filterType="gender"
            options={FILTER_OPTIONS.gender}
            isExpanded={expandedGroups.gender}
          />
          <FilterGroup
            title="Size"
            filterType="size"
            options={FILTER_OPTIONS.size}
            isExpanded={expandedGroups.size}
          />
          <FilterGroup
            title="Color"
            filterType="color"
            options={FILTER_OPTIONS.color}
            isExpanded={expandedGroups.color}
          />
          <FilterGroup
            title="Price"
            filterType="price"
            options={FILTER_OPTIONS.price}
            isExpanded={expandedGroups.price}
          />
          <FilterGroup
            title="Category"
            filterType="category"
            options={FILTER_OPTIONS.category}
            isExpanded={expandedGroups.category}
          />
        </div>
      </div>
    </>
  );
}
