import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Get basic product data first
    const allProducts = await db
      .select()
      .from(products)
      .where(eq(products.isPublished, true));

    // Transform to match the old interface for compatibility
    const transformedProducts = allProducts.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: "150.00", // Default price for now
      image: "/shoes/shoe-1.jpg", // Default image for now
      category: "Sneakers", // Default category for now
      brand: "Nike", // Default brand for now
      size: "10", // Default size for now
      color: "Black", // Default color for now
      stock: 25, // Default stock for now
      isActive: product.isPublished,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
