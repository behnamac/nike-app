export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  salePrice?: number;
  color: string;
  size: string;
  inStock: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ProductImage {
  id: string;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  gender: string;
  brand: string;
  isPublished: boolean;
  defaultVariantId: string;
  createdAt: Date;
  updatedAt: Date;
  variants: ProductVariant[];
  images: ProductImage[];
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Nike Air Force 1 Mid '07",
    description:
      "The radiance lives on in the Air Force 1 '07, the basketball original that puts a fresh spin on what you know best.",
    category: "sneakers",
    gender: "men",
    brand: "Nike",
    isPublished: true,
    defaultVariantId: "1-1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    variants: [
      {
        id: "1-1",
        sku: "NIKE-AF1-MID-WHITE-10",
        price: 98.3,
        color: "white",
        size: "10",
        inStock: 25,
        weight: 0.6,
        dimensions: { length: 32, width: 22, height: 12 },
      },
      {
        id: "1-2",
        sku: "NIKE-AF1-MID-BLACK-10",
        price: 98.3,
        color: "black",
        size: "10",
        inStock: 18,
        weight: 0.6,
        dimensions: { length: 32, width: 22, height: 12 },
      },
    ],
    images: [
      {
        id: "1-1",
        url: "/shoes/shoe-1.jpg",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: "2",
    name: "Nike Court Vision Low Next Nature",
    description:
      "The Nike Court Vision Low Next Nature delivers a classic basketball look with sustainable materials.",
    category: "sneakers",
    gender: "men",
    brand: "Nike",
    isPublished: true,
    defaultVariantId: "2-1",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    variants: [
      {
        id: "2-1",
        sku: "NIKE-CV-LOW-BLACK-10",
        price: 78.3,
        salePrice: 62.64,
        color: "black",
        size: "10",
        inStock: 30,
        weight: 0.5,
        dimensions: { length: 31, width: 21, height: 11 },
      },
    ],
    images: [
      {
        id: "2-1",
        url: "/shoes/shoe-2.webp",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: "3",
    name: "Nike Air Force 1 PLATFORM",
    description:
      "The Nike Air Force 1 PLATFORM delivers a bold, elevated look with sustainable materials.",
    category: "sneakers",
    gender: "men",
    brand: "Nike",
    isPublished: true,
    defaultVariantId: "3-1",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
    variants: [
      {
        id: "3-1",
        sku: "NIKE-AF1-PLAT-GREY-10",
        price: 98.3,
        color: "silver",
        size: "10",
        inStock: 15,
        weight: 0.7,
        dimensions: { length: 33, width: 23, height: 14 },
      },
    ],
    images: [
      {
        id: "3-1",
        url: "/shoes/shoe-3.webp",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: "4",
    name: "Nike Dunk Low Retro",
    description:
      "The Nike Dunk Low Retro delivers a classic basketball design that's been reimagined for everyday wear.",
    category: "sneakers",
    gender: "men",
    brand: "Nike",
    isPublished: true,
    defaultVariantId: "4-1",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    variants: [
      {
        id: "4-1",
        sku: "NIKE-DUNK-LOW-YELLOW-10",
        price: 98.3,
        color: "green",
        size: "10",
        inStock: 22,
        weight: 0.6,
        dimensions: { length: 31, width: 21, height: 11 },
      },
    ],
    images: [
      {
        id: "4-1",
        url: "/shoes/shoe-4.webp",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: "5",
    name: "Nike Air Max SYSTM",
    description:
      "The Nike Air Max SYSTM delivers visible cushioning with a modern design.",
    category: "running",
    gender: "men",
    brand: "Nike",
    isPublished: true,
    defaultVariantId: "5-1",
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
    variants: [
      {
        id: "5-1",
        sku: "NIKE-AM-SYSTM-WHITE-10",
        price: 78.3,
        salePrice: 62.64,
        color: "white",
        size: "10",
        inStock: 28,
        weight: 0.8,
        dimensions: { length: 33, width: 23, height: 13 },
      },
    ],
    images: [
      {
        id: "5-1",
        url: "/shoes/shoe-5.avif",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: "6",
    name: "Nike Air Force 1 PLATFORM",
    description:
      "The Nike Air Force 1 PLATFORM delivers a bold, elevated look with sustainable materials.",
    category: "sneakers",
    gender: "women",
    brand: "Nike",
    isPublished: true,
    defaultVariantId: "6-1",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
    variants: [
      {
        id: "6-1",
        sku: "NIKE-AF1-PLAT-WHITE-8",
        price: 98.3,
        color: "white",
        size: "8",
        inStock: 20,
        weight: 0.7,
        dimensions: { length: 30, width: 20, height: 13 },
      },
    ],
    images: [
      {
        id: "6-1",
        url: "/shoes/shoe-6.avif",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: "7",
    name: "Nike Dunk Low Retro SE",
    description:
      "The Nike Dunk Low Retro SE delivers a classic basketball design with special edition details.",
    category: "sneakers",
    gender: "men",
    brand: "Nike",
    isPublished: true,
    defaultVariantId: "7-1",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
    variants: [
      {
        id: "7-1",
        sku: "NIKE-DUNK-LOW-SE-CREAM-10",
        price: 78.3,
        salePrice: 62.64,
        color: "white",
        size: "10",
        inStock: 12,
        weight: 0.6,
        dimensions: { length: 31, width: 21, height: 11 },
      },
    ],
    images: [
      {
        id: "7-1",
        url: "/shoes/shoe-7.avif",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: "8",
    name: "Nike Air Max 90 SE",
    description:
      "The Nike Air Max 90 SE delivers the iconic design with special edition colorways.",
    category: "sneakers",
    gender: "men",
    brand: "Nike",
    isPublished: true,
    defaultVariantId: "8-1",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20"),
    variants: [
      {
        id: "8-1",
        sku: "NIKE-AM90-SE-MULTI-10",
        price: 98.3,
        color: "white",
        size: "10",
        inStock: 25,
        weight: 0.7,
        dimensions: { length: 32, width: 22, height: 12 },
      },
    ],
    images: [
      {
        id: "8-1",
        url: "/shoes/shoe-8.avif",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: "9",
    name: "Nike Legend Essential 3 Next Nature",
    description:
      "The Nike Legend Essential 3 Next Nature delivers sustainable performance for everyday training.",
    category: "running",
    gender: "men",
    brand: "Nike",
    isPublished: true,
    defaultVariantId: "9-1",
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-02-25"),
    variants: [
      {
        id: "9-1",
        sku: "NIKE-LEGEND-3-BLUE-10",
        price: 78.3,
        salePrice: 70.47,
        color: "blue",
        size: "10",
        inStock: 18,
        weight: 0.6,
        dimensions: { length: 32, width: 22, height: 12 },
      },
    ],
    images: [
      {
        id: "9-1",
        url: "/shoes/shoe-9.avif",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: "10",
    name: "Nike SB Zoom Janoski OG+",
    description:
      "The Nike SB Zoom Janoski OG+ delivers skateboarding performance with classic style.",
    category: "sneakers",
    gender: "men",
    brand: "Nike",
    isPublished: true,
    defaultVariantId: "10-1",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
    variants: [
      {
        id: "10-1",
        sku: "NIKE-SB-JANOSKI-BLUE-10",
        price: 98.3,
        color: "blue",
        size: "10",
        inStock: 16,
        weight: 0.5,
        dimensions: { length: 31, width: 21, height: 10 },
      },
    ],
    images: [
      {
        id: "10-1",
        url: "/shoes/shoe-10.avif",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: "11",
    name: "Jordan Series ES",
    description:
      "The Jordan Series ES delivers Jordan heritage with modern performance.",
    category: "basketball",
    gender: "men",
    brand: "Nike",
    isPublished: true,
    defaultVariantId: "11-1",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
    variants: [
      {
        id: "11-1",
        sku: "JORDAN-ES-GREEN-10",
        price: 98.3,
        color: "green",
        size: "10",
        inStock: 14,
        weight: 0.7,
        dimensions: { length: 32, width: 22, height: 12 },
      },
    ],
    images: [
      {
        id: "11-1",
        url: "/shoes/shoe-11.avif",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: "12",
    name: "Nike Blazer Low '77 Jumbo",
    description:
      "The Nike Blazer Low '77 Jumbo delivers a bold, oversized design with classic basketball heritage.",
    category: "sneakers",
    gender: "women",
    brand: "Nike",
    isPublished: true,
    defaultVariantId: "12-1",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
    variants: [
      {
        id: "12-1",
        sku: "NIKE-BLAZER-JUMBO-WHITE-8",
        price: 78.3,
        salePrice: 62.64,
        color: "white",
        size: "8",
        inStock: 22,
        weight: 0.6,
        dimensions: { length: 30, width: 20, height: 11 },
      },
    ],
    images: [
      {
        id: "12-1",
        url: "/shoes/shoe-12.avif",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
];

export function filterProducts(products: Product[], filters: any) {
  return products.filter((product) => {
    // Gender filter
    if (filters.gender && filters.gender.length > 0) {
      if (!filters.gender.includes(product.gender)) return false;
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(product.category)) return false;
    }

    // Color filter
    if (filters.color && filters.color.length > 0) {
      const productColors = product.variants.map((v) => v.color);
      if (!filters.color.some((color: string) => productColors.includes(color)))
        return false;
    }

    // Size filter
    if (filters.size && filters.size.length > 0) {
      const productSizes = product.variants.map((v) => v.size);
      if (!filters.size.some((size: string) => productSizes.includes(size)))
        return false;
    }

    // Price filter
    if (filters.price && filters.price.length > 0) {
      const productPrices = product.variants.map((v) => v.salePrice || v.price);
      const hasMatchingPrice = filters.price.some((priceRange: string) => {
        const [min, max] = priceRange.split("-").map(Number);
        if (priceRange === "200+") {
          return productPrices.some((price) => price >= 200);
        }
        return productPrices.some((price) => price >= min && price <= max);
      });
      if (!hasMatchingPrice) return false;
    }

    return true;
  });
}

export function sortProducts(products: Product[], sortBy: string) {
  const sorted = [...products];

  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

    case "price_asc":
      return sorted.sort((a, b) => {
        const aPrice = Math.min(
          ...a.variants.map((v) => v.salePrice || v.price)
        );
        const bPrice = Math.min(
          ...b.variants.map((v) => v.salePrice || v.price)
        );
        return aPrice - bPrice;
      });

    case "price_desc":
      return sorted.sort((a, b) => {
        const aPrice = Math.max(
          ...a.variants.map((v) => v.salePrice || v.price)
        );
        const bPrice = Math.max(
          ...b.variants.map((v) => v.salePrice || v.price)
        );
        return bPrice - aPrice;
      });

    case "featured":
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}
