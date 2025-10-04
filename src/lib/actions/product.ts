"use server";

import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { eq, like, inArray, desc, asc, sql } from "drizzle-orm";

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

export interface ProductWithDetails {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  genderId: string;
  brandId: string;
  isPublished: boolean;
  defaultVariantId: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Aggregated data
  minPrice: number;
  maxPrice: number;
  primaryImage: string | null;
  // Relations
  category: {
    id: string;
    name: string;
    slug: string;
  };
  gender: {
    id: string;
    label: string;
    slug: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  // Top images (color-specific if color filter applied, otherwise generic)
  images: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
}

export interface GetAllProductsResult {
  products: ProductWithDetails[];
  totalCount: number;
  hasMore: boolean;
}

/**
 * Get all products with filtering, search, sorting, and pagination
 */
export async function getAllProducts(
  filters: ProductFilters = {}
): Promise<GetAllProductsResult> {
  // Check if database is available, fallback to mock data if not
  try {
    // Test database connection
    await db.execute(sql`SELECT 1`);
  } catch (error) {
    console.warn("Database not available, using mock data:", error);
    return await getMockProducts(filters);
  }
  try {
    const {
      search,
      categoryId,
      genderId,
      brandId,
      colorId,
      sizeId,
      priceMin,
      priceMax,
      sortBy = "created_at_desc",
      page = 1,
      limit = 24,
    } = filters;

    // Build where conditions
    const whereConditions = [eq(products.isPublished, true)];

    // Search filter
    if (search) {
      whereConditions.push(like(products.name, `%${search}%`));
    }

    // Category filter
    if (categoryId && categoryId.length > 0) {
      whereConditions.push(inArray(products.categoryId, categoryId));
    }

    // Gender filter
    if (genderId && genderId.length > 0) {
      whereConditions.push(inArray(products.genderId, genderId));
    }

    // Brand filter
    if (brandId && brandId.length > 0) {
      whereConditions.push(inArray(products.brandId, brandId));
    }

    // Build variant conditions for SQL
    let variantConditionsSQL = sql``;
    const variantConditions: string[] = [];

    if (priceMin !== undefined) {
      variantConditions.push(`pv.price >= ${priceMin}`);
    }
    if (priceMax !== undefined) {
      variantConditions.push(`pv.price <= ${priceMax}`);
    }
    if (colorId && colorId.length > 0) {
      variantConditions.push(
        `pv.color_id = ANY(ARRAY[${colorId.map((id) => `'${id}'`).join(",")}])`
      );
    }
    if (sizeId && sizeId.length > 0) {
      variantConditions.push(
        `pv.size_id = ANY(ARRAY[${sizeId.map((id) => `'${id}'`).join(",")}])`
      );
    }

    if (variantConditions.length > 0) {
      variantConditionsSQL = sql`AND (${sql.raw(variantConditions.join(" AND "))})`;
    }

    // Build sort order
    let orderBy;
    switch (sortBy) {
      case "price_asc":
        orderBy = asc(sql`MIN(${productVariants.price})`);
        break;
      case "price_desc":
        orderBy = desc(sql`MIN(${productVariants.price})`);
        break;
      case "name_asc":
        orderBy = asc(products.name);
        break;
      case "name_desc":
        orderBy = desc(products.name);
        break;
      case "created_at_asc":
        orderBy = asc(products.createdAt);
        break;
      case "created_at_desc":
      default:
        orderBy = desc(products.createdAt);
        break;
    }

    // Get total count for pagination
    const totalCountResult = await db.execute(sql`
    SELECT COUNT(DISTINCT p.id) as count
    FROM products p
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    WHERE p.is_published = true
    ${search ? sql`AND p.name ILIKE ${`%${search}%`}` : sql``}
    ${categoryId && categoryId.length > 0 ? sql`AND p.category_id = ANY(${categoryId})` : sql``}
    ${genderId && genderId.length > 0 ? sql`AND p.gender_id = ANY(${genderId})` : sql``}
    ${brandId && brandId.length > 0 ? sql`AND p.brand_id = ANY(${brandId})` : sql``}
    ${variantConditionsSQL}
  `);

    const totalCount = Number(
      (totalCountResult.rows[0] as { count: string }).count || 0
    );

    // Get products with aggregated data
    const offset = (page - 1) * limit;

    const productsQuery = await db.execute(sql`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.category_id,
      p.gender_id,
      p.brand_id,
      p.is_published,
      p.default_variant_id,
      p.created_at,
      p.updated_at,
      MIN(pv.price) as min_price,
      MAX(pv.price) as max_price,
      c.id as category_rel_id,
      c.name as category_name,
      c.slug as category_slug,
      g.id as gender_rel_id,
      g.label as gender_label,
      g.slug as gender_slug,
      b.id as brand_rel_id,
      b.name as brand_name,
      b.slug as brand_slug,
      (
        SELECT pi.url
        FROM product_images pi
        WHERE pi.product_id = p.id
        AND pi.is_primary = true
        LIMIT 1
      ) as primary_image
    FROM products p
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN genders g ON p.gender_id = g.id
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE p.is_published = true
    ${search ? sql`AND p.name ILIKE ${`%${search}%`}` : sql``}
    ${categoryId && categoryId.length > 0 ? sql`AND p.category_id = ANY(${categoryId})` : sql``}
    ${genderId && genderId.length > 0 ? sql`AND p.gender_id = ANY(${genderId})` : sql``}
    ${brandId && brandId.length > 0 ? sql`AND p.brand_id = ANY(${brandId})` : sql``}
    ${variantConditionsSQL}
    GROUP BY p.id, c.id, g.id, b.id
    ORDER BY ${orderBy}
    LIMIT ${limit} OFFSET ${offset}
  `);

    // Get images for each product
    const productIds = productsQuery.rows.map(
      (row: Record<string, unknown>) => row.id as string
    );
    const imagesQuery =
      productIds.length > 0
        ? await db.execute(sql`
    SELECT 
      pi.id,
      pi.product_id,
      pi.url,
      pi.is_primary,
      pi.sort_order,
      pi.variant_id,
      pv.color_id
    FROM product_images pi
    LEFT JOIN product_variants pv ON pi.variant_id = pv.id
    WHERE pi.product_id = ANY(${productIds})
    ORDER BY pi.product_id, pi.is_primary DESC, pi.sort_order ASC
  `)
        : { rows: [] };

    // Group images by product
    const imagesByProduct = new Map<string, Record<string, unknown>[]>();
    imagesQuery.rows.forEach((image: Record<string, unknown>) => {
      const productId = image.product_id as string;
      if (!imagesByProduct.has(productId)) {
        imagesByProduct.set(productId, []);
      }
      imagesByProduct.get(productId)!.push(image);
    });

    // Build final result
    const result: ProductWithDetails[] = productsQuery.rows.map(
      (row: Record<string, unknown>) => {
        const productImages = imagesByProduct.get(row.id as string) || [];

        // If color filter is applied, prioritize color-specific images
        let topImages = productImages;
        if (colorId && colorId.length > 0) {
          const colorSpecificImages = productImages.filter(
            (img) =>
              img.variant_id &&
              img.color_id &&
              colorId.includes(img.color_id as string)
          );
          if (colorSpecificImages.length > 0) {
            topImages = colorSpecificImages;
          }
        }

        return {
          id: row.id as string,
          name: row.name as string,
          description: row.description as string | null,
          categoryId: row.category_id as string,
          genderId: row.gender_id as string,
          brandId: row.brand_id as string,
          isPublished: row.is_published as boolean,
          defaultVariantId: row.default_variant_id as string | null,
          createdAt: row.created_at as Date,
          updatedAt: row.updated_at as Date,
          minPrice: Number(row.min_price),
          maxPrice: Number(row.max_price),
          primaryImage: row.primary_image as string | null,
          category: {
            id: row.category_rel_id as string,
            name: row.category_name as string,
            slug: row.category_slug as string,
          },
          gender: {
            id: row.gender_rel_id as string,
            label: row.gender_label as string,
            slug: row.gender_slug as string,
          },
          brand: {
            id: row.brand_rel_id as string,
            name: row.brand_name as string,
            slug: row.brand_slug as string,
          },
          images: topImages.slice(0, 5).map((img) => ({
            id: img.id as string,
            url: img.url as string,
            isPrimary: img.is_primary as boolean,
            sortOrder: img.sort_order as number,
          })),
        };
      }
    );

    return {
      products: result,
      totalCount,
      hasMore: offset + limit < totalCount,
    };
  } catch (error) {
    console.warn("Database query failed, using mock data:", error);
    return await getMockProducts(filters);
  }
}

/**
 * Get a single product with full details
 */
export async function getProduct(productId: string) {
  const productQuery = await db.execute(sql`
    SELECT 
      p.*,
      c.name as category_name,
      c.slug as category_slug,
      g.label as gender_label,
      g.slug as gender_slug,
      b.name as brand_name,
      b.slug as brand_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN genders g ON p.gender_id = g.id
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE p.id = ${productId} AND p.is_published = true
  `);

  if (productQuery.rows.length === 0) {
    return null;
  }

  const product = productQuery.rows[0] as Record<string, unknown>;

  // Get variants with color and size details
  const variantsQuery = await db.execute(sql`
    SELECT 
      pv.*,
      c.name as color_name,
      c.slug as color_slug,
      c.hex_code,
      s.name as size_name,
      s.slug as size_slug,
      s.sort_order as size_sort_order
    FROM product_variants pv
    LEFT JOIN colors c ON pv.color_id = c.id
    LEFT JOIN sizes s ON pv.size_id = s.id
    WHERE pv.product_id = ${productId}
    ORDER BY c.name, s.sort_order
  `);

  // Get all images
  const imagesQuery = await db.execute(sql`
    SELECT 
      pi.*,
      pv.color_id
    FROM product_images pi
    LEFT JOIN product_variants pv ON pi.variant_id = pv.id
    WHERE pi.product_id = ${productId}
    ORDER BY pi.is_primary DESC, pi.sort_order ASC
  `);

  return {
    ...product,
    variants: variantsQuery.rows.map((variant: Record<string, unknown>) => ({
      ...variant,
      color: {
        id: variant.color_id as string,
        name: variant.color_name as string,
        slug: variant.color_slug as string,
        hexCode: variant.hex_code as string,
      },
      size: {
        id: variant.size_id as string,
        name: variant.size_name as string,
        slug: variant.size_slug as string,
        sortOrder: variant.size_sort_order as number,
      },
    })),
    images: imagesQuery.rows,
  };
}

/**
 * Fallback function that returns mock data when database is not available
 */
async function getMockProducts(
  filters: ProductFilters
): Promise<GetAllProductsResult> {
  // Import mock data
  const { mockProducts } = await import("@/lib/data/mock-products");

  // Simple filtering logic for mock data
  let filteredProducts = mockProducts;

  if (filters.search) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(filters.search!.toLowerCase())
    );
  }

  if (filters.categoryId && filters.categoryId.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      filters.categoryId!.includes(product.category)
    );
  }

  if (filters.genderId && filters.genderId.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      filters.genderId!.includes(product.gender)
    );
  }

  if (filters.brandId && filters.brandId.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      filters.brandId!.includes(product.brand)
    );
  }

  // Simple sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price_asc":
        filteredProducts.sort((a, b) => {
          const aPrice = Math.min(...a.variants.map((v) => v.price));
          const bPrice = Math.min(...b.variants.map((v) => v.price));
          return aPrice - bPrice;
        });
        break;
      case "price_desc":
        filteredProducts.sort((a, b) => {
          const aPrice = Math.min(...a.variants.map((v) => v.price));
          const bPrice = Math.min(...b.variants.map((v) => v.price));
          return bPrice - aPrice;
        });
        break;
      case "name_asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
  }

  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 24;
  const offset = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(offset, offset + limit);

  // Convert mock products to the expected format
  const products: ProductWithDetails[] = paginatedProducts.map((product) => {
    const minPrice = Math.min(...product.variants.map((v) => v.price));
    const maxPrice = Math.max(...product.variants.map((v) => v.price));
    const primaryImage =
      product.images.find((img) => img.isPrimary)?.url ||
      product.images[0]?.url;

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.category,
      genderId: product.gender,
      brandId: product.brand,
      isPublished: product.isPublished,
      defaultVariantId: product.defaultVariantId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      minPrice,
      maxPrice,
      primaryImage,
      category: {
        id: product.category,
        name:
          product.category.charAt(0).toUpperCase() + product.category.slice(1),
        slug: product.category,
      },
      gender: {
        id: product.gender,
        label: product.gender.charAt(0).toUpperCase() + product.gender.slice(1),
        slug: product.gender,
      },
      brand: {
        id: product.brand,
        name: product.brand.charAt(0).toUpperCase() + product.brand.slice(1),
        slug: product.brand,
      },
      images: product.images.slice(0, 5).map((img) => ({
        id: img.id,
        url: img.url,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      })),
    };
  });

  return {
    products,
    totalCount: filteredProducts.length,
    hasMore: offset + limit < filteredProducts.length,
  };
}
