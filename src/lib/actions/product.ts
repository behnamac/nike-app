"use server";

import { getDb } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { eq, like, inArray, desc, asc, sql, and } from "drizzle-orm";
import { ProductFilters } from "@/lib/utils/query";

// Type definitions
export interface Review {
  id: string;
  author: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: Date;
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
  try {
    const {
      search,
      categoryId,
      genderId,
      brandId,
      colorId,
      sortBy = "created_at_desc",
      page = 1,
      limit = 24,
    } = filters;

    // Note: Variant conditions (price, color, size) are not implemented in this version
    // They would require additional joins and filtering logic

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
    const db = getDb();

    // Build count query with proper conditions
    const whereConditions = [eq(products.isPublished, true)];

    if (search) {
      whereConditions.push(like(products.name, `%${search}%`));
    }
    if (categoryId && categoryId.length > 0) {
      whereConditions.push(inArray(products.categoryId, categoryId));
    }
    if (genderId && genderId.length > 0) {
      whereConditions.push(inArray(products.genderId, genderId));
    }
    if (brandId && brandId.length > 0) {
      whereConditions.push(inArray(products.brandId, brandId));
    }

    const totalCountResult = await db
      .select({ count: sql<number>`count(distinct ${products.id})` })
      .from(products)
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .where(and(...whereConditions));

    const totalCount = Number(totalCountResult[0]?.count || 0);

    // Get products with aggregated data
    const offset = (page - 1) * limit;

    // Build products query with proper conditions
    const productsWhereConditions = [eq(products.isPublished, true)];

    if (search) {
      productsWhereConditions.push(like(products.name, `%${search}%`));
    }
    if (categoryId && categoryId.length > 0) {
      productsWhereConditions.push(inArray(products.categoryId, categoryId));
    }
    if (genderId && genderId.length > 0) {
      productsWhereConditions.push(inArray(products.genderId, genderId));
    }
    if (brandId && brandId.length > 0) {
      productsWhereConditions.push(inArray(products.brandId, brandId));
    }

    const productsResult = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        categoryId: products.categoryId,
        genderId: products.genderId,
        brandId: products.brandId,
        isPublished: products.isPublished,
        defaultVariantId: products.defaultVariantId,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        minPrice: sql<number>`MIN(${productVariants.price})`,
        maxPrice: sql<number>`MAX(${productVariants.price})`,
        categoryRelId: sql<string>`c.id`,
        categoryName: sql<string>`c.name`,
        categorySlug: sql<string>`c.slug`,
        genderRelId: sql<string>`g.id`,
        genderLabel: sql<string>`g.label`,
        genderSlug: sql<string>`g.slug`,
        brandRelId: sql<string>`b.id`,
        brandName: sql<string>`b.name`,
        brandSlug: sql<string>`b.slug`,
        primaryImage: sql<string>`(
          SELECT pi.url
          FROM product_images pi
          WHERE pi.product_id = ${products.id}
          AND pi.is_primary = true
          LIMIT 1
        )`,
      })
      .from(products)
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .leftJoin(sql`categories c`, eq(products.categoryId, sql`c.id`))
      .leftJoin(sql`genders g`, eq(products.genderId, sql`g.id`))
      .leftJoin(sql`brands b`, eq(products.brandId, sql`b.id`))
      .where(and(...productsWhereConditions))
      .groupBy(products.id, sql`c.id`, sql`g.id`, sql`b.id`)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get images for each product
    const productIds = productsResult.map((row) => row.id);
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
    WHERE pi.product_id IN ${productIds}
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
    const result: ProductWithDetails[] = productsResult.map((row) => {
      const productImages = imagesByProduct.get(row.id) || [];

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
        id: row.id,
        name: row.name,
        description: row.description,
        categoryId: row.categoryId,
        genderId: row.genderId,
        brandId: row.brandId,
        isPublished: row.isPublished,
        defaultVariantId: row.defaultVariantId,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        minPrice: Number(row.minPrice),
        maxPrice: Number(row.maxPrice),
        primaryImage: row.primaryImage,
        category: {
          id: row.categoryRelId,
          name: row.categoryName,
          slug: row.categorySlug,
        },
        gender: {
          id: row.genderRelId,
          label: row.genderLabel,
          slug: row.genderSlug,
        },
        brand: {
          id: row.brandRelId,
          name: row.brandName,
          slug: row.brandSlug,
        },
        images: topImages.slice(0, 5).map((img) => ({
          id: img.id as string,
          url: img.url as string,
          isPrimary: img.is_primary as boolean,
          sortOrder: img.sort_order as number,
        })),
      };
    });

    return {
      products: result,
      totalCount,
      hasMore: offset + limit < totalCount,
    };
  } catch (_error) {
    return { products: [], totalCount: 0, hasMore: false };
  }
}

/**
 * Get a single product with full details
 */
export async function getProduct(productId: string) {
  try {
    const db = getDb();
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
  } catch (_error) {
    return null;
  }
}

/**
 * Get product reviews
 */
export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const db = getDb();
    const reviewsResult = await db.execute(sql`
      SELECT 
        r.id,
        r.product_id,
        r.user_id,
        r.rating,
        r.comment,
        r.created_at,
        'Anonymous' as author_name
      FROM reviews r
      WHERE r.product_id = ${productId}
      ORDER BY r.created_at DESC
      LIMIT 10
    `);

    return reviewsResult.rows.map((review: Record<string, unknown>) => ({
      id: review.id as string,
      author: (review.author_name as string) || "Anonymous",
      rating: review.rating as number,
      title: undefined, // Not in current schema
      content: (review.comment as string) || "",
      createdAt: review.created_at as Date,
    }));
  } catch (_error) {
    return [];
  }
}

/**
 * Get recommended products
 */
export async function getRecommendedProducts(
  productId: string
): Promise<ProductWithDetails[]> {
  try {
    // Get products in the same category/brand/gender, excluding current product
    const db = getDb();
    const recommendedResult = await db.execute(sql`
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
        c.id as category_rel_id,
        c.name as category_name,
        c.slug as category_slug,
        g.id as gender_rel_id,
        g.label as gender_label,
        g.slug as gender_slug,
        b.id as brand_rel_id,
        b.name as brand_name,
        b.slug as brand_slug,
        MIN(pv.price) as min_price,
        MAX(pv.price) as max_price,
        (
          SELECT pi.url
          FROM product_images pi
          WHERE pi.product_id = p.id
          AND pi.is_primary = true
          LIMIT 1
        ) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN genders g ON p.gender_id = g.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      WHERE p.is_published = true 
      AND p.id != ${productId}
      AND (
        p.category_id = (SELECT category_id FROM products WHERE id = ${productId})
        OR p.brand_id = (SELECT brand_id FROM products WHERE id = ${productId})
        OR p.gender_id = (SELECT gender_id FROM products WHERE id = ${productId})
      )
      GROUP BY p.id, c.id, g.id, b.id
      ORDER BY RANDOM()
      LIMIT 6
    `);

    return recommendedResult.rows.map((product: Record<string, unknown>) => ({
      id: product.id as string,
      name: product.name as string,
      description: product.description as string | null,
      categoryId: product.category_id as string,
      genderId: product.gender_id as string,
      brandId: product.brand_id as string,
      isPublished: product.is_published as boolean,
      defaultVariantId: product.default_variant_id as string | null,
      createdAt: product.created_at as Date,
      updatedAt: product.updated_at as Date,
      minPrice: Number(product.min_price),
      maxPrice: Number(product.max_price),
      primaryImage: product.primary_image as string | null,
      category: {
        id: product.category_rel_id as string,
        name: product.category_name as string,
        slug: product.category_slug as string,
      },
      gender: {
        id: product.gender_rel_id as string,
        label: product.gender_label as string,
        slug: product.gender_slug as string,
      },
      brand: {
        id: product.brand_rel_id as string,
        name: product.brand_name as string,
        slug: product.brand_slug as string,
      },
      variants: [], // Not needed for recommendations
      images: [], // Not needed for recommendations
    }));
  } catch (_error) {
    return [];
  }
}
