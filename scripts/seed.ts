import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../src/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { inArray } from "drizzle-orm";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config(); // fall back to .env

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Nike product data
const nikeProducts = [
  {
    name: "Air Max 270",
    description:
      "The Air Max 270 delivers visible cushioning under every step. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
    category: "Sneakers",
    brand: "Nike",
    gender: "unisex",
    colors: ["Black", "White", "Red", "Blue"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 150,
    salePrice: 120,
    images: ["shoe-1.jpg", "shoe-2.webp"],
  },
  {
    name: "Air Force 1 '07",
    description:
      "The radiance lives on in the Air Force 1 '07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
    category: "Sneakers",
    brand: "Nike",
    gender: "unisex",
    colors: ["White", "Black", "Red"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 90,
    salePrice: null,
    images: ["shoe-3.webp", "shoe-4.webp"],
  },
  {
    name: "Air Jordan 1 Retro High OG",
    description:
      "The Air Jordan 1 Retro High OG is a modern take on the classic that started it all. Premium materials and construction meet timeless style.",
    category: "Basketball",
    brand: "Nike",
    gender: "unisex",
    colors: ["Black", "White", "Red"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 170,
    salePrice: null,
    images: ["shoe-5.avif", "shoe-6.avif"],
  },
  {
    name: "React Element 55",
    description:
      "The Nike React Element 55 delivers a bold, futuristic design that's ready for the street. The upper combines synthetic overlays with mesh for a lightweight feel.",
    category: "Running",
    brand: "Nike",
    gender: "unisex",
    colors: ["White", "Black", "Blue", "Green"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 130,
    salePrice: 100,
    images: ["shoe-7.avif", "shoe-8.avif"],
  },
  {
    name: "Blazer Mid '77",
    description:
      "The Nike Blazer Mid '77 delivers a timeless design that's always in style. The classic basketball silhouette gets updated with premium materials.",
    category: "Lifestyle",
    brand: "Nike",
    gender: "unisex",
    colors: ["White", "Black", "Red", "Blue"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 85,
    salePrice: null,
    images: ["shoe-9.avif", "shoe-10.avif"],
  },
  {
    name: "Air Max 90",
    description:
      "The Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU details. Fresh colors give a modern look.",
    category: "Sneakers",
    brand: "Nike",
    gender: "unisex",
    colors: ["White", "Black", "Red", "Blue", "Green"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 120,
    salePrice: 95,
    images: ["shoe-11.avif", "shoe-12.avif"],
  },
  {
    name: "Dunk Low",
    description:
      "The Nike Dunk Low delivers a classic basketball design that's always in style. Premium materials and construction meet timeless appeal.",
    category: "Basketball",
    brand: "Nike",
    gender: "unisex",
    colors: ["White", "Black", "Red", "Blue"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 110,
    salePrice: null,
    images: ["shoe-13.avif", "shoe-14.avif"],
  },
  {
    name: "Air Max 97",
    description:
      "The Air Max 97 keeps the sleek, futuristic design that made it famous. The full-length Max Air unit delivers lightweight cushioning.",
    category: "Sneakers",
    brand: "Nike",
    gender: "unisex",
    colors: ["White", "Black", "Silver", "Red"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 170,
    salePrice: 140,
    images: ["shoe-15.avif"],
  },
  {
    name: "Pegasus 40",
    description:
      "The Nike Air Zoom Pegasus 40 delivers a smooth ride for everyday training. Responsive Zoom Air cushioning and a breathable upper keep you comfortable.",
    category: "Running",
    brand: "Nike",
    gender: "unisex",
    colors: ["White", "Black", "Blue", "Red"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 130,
    salePrice: null,
    images: ["shoe-1.jpg", "shoe-2.webp"],
  },
  {
    name: "VaporMax 2023",
    description:
      "The Nike Air VaporMax 2023 delivers a bold, futuristic design with full-length Max Air cushioning. The upper is made from at least 20% recycled materials.",
    category: "Running",
    brand: "Nike",
    gender: "unisex",
    colors: ["White", "Black", "Blue", "Red"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 200,
    salePrice: 170,
    images: ["shoe-3.webp", "shoe-4.webp"],
  },
  {
    name: "Air Max 2090",
    description:
      "The Nike Air Max 2090 delivers a bold, futuristic design inspired by the Air Max 90. The full-length Max Air unit provides lightweight cushioning.",
    category: "Sneakers",
    brand: "Nike",
    gender: "unisex",
    colors: ["White", "Black", "Blue", "Red"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 150,
    salePrice: null,
    images: ["shoe-5.avif", "shoe-6.avif"],
  },
  {
    name: "React Infinity Run Flyknit 3",
    description:
      "The Nike React Infinity Run Flyknit 3 delivers a smooth, stable ride for everyday training. The Flyknit upper provides a secure, comfortable fit.",
    category: "Running",
    brand: "Nike",
    gender: "unisex",
    colors: ["White", "Black", "Blue", "Red"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 180,
    salePrice: 150,
    images: ["shoe-7.avif", "shoe-8.avif"],
  },
  {
    name: "Air Max 720",
    description:
      "The Nike Air Max 720 delivers the tallest Max Air unit yet for maximum cushioning. The futuristic design is inspired by the human body.",
    category: "Sneakers",
    brand: "Nike",
    gender: "unisex",
    colors: ["White", "Black", "Blue", "Red"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 190,
    salePrice: null,
    images: ["shoe-9.avif", "shoe-10.avif"],
  },
  {
    name: "Air Max 270 React",
    description:
      "The Nike Air Max 270 React delivers visible cushioning under every step. The design draws inspiration from Air Max icons with a fresh array of colors.",
    category: "Sneakers",
    brand: "Nike",
    gender: "unisex",
    colors: ["White", "Black", "Blue", "Red"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 160,
    salePrice: 130,
    images: ["shoe-11.avif", "shoe-12.avif"],
  },
  {
    name: "Air Max 95",
    description:
      "The Nike Air Max 95 delivers the iconic design that started it all. The visible Max Air unit provides lightweight cushioning and the classic silhouette stays true to the original.",
    category: "Sneakers",
    brand: "Nike",
    gender: "unisex",
    colors: ["White", "Black", "Blue", "Red"],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    price: 140,
    salePrice: null,
    images: ["shoe-13.avif", "shoe-14.avif"],
  },
];

// Gender-specific products. Images live in public/shoes/men and public/shoes/women.
const menSizes = ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"];
const womenSizes = ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"];

const menProducts = [
  {
    name: "Nike Air Max Plus",
    description:
      "The Air Max Plus brings back the wavy lines and Tuned Air cushioning of the '98 original, with a bold upper that stands out from the crowd.",
    category: "Sneakers",
    colors: ["Black", "Blue", "Red"],
    price: 180,
    salePrice: null,
    images: ["men/AIR+MAX+PLUS.avif"],
  },
  {
    name: "Hyperboot by Nike x Hyperice",
    description:
      "A recovery boot built with Hyperice, combining heat and dynamic air compression to help your feet recover before and after training.",
    category: "Lifestyle",
    colors: ["Black", "Silver"],
    price: 899,
    salePrice: null,
    images: ["men/HYPERBOOT+BY+NIKE+X+HYPERICE.avif"],
  },
  {
    name: "Nike Hybrid RN",
    description:
      "A lightweight everyday runner with a breathable upper and soft foam cushioning for easy miles.",
    category: "Running",
    colors: ["Black", "White", "Blue"],
    price: 110,
    salePrice: 90,
    images: ["men/M+NIKE+HYBRID+RN.avif"],
  },
  {
    name: "Nike Metcon 10",
    description:
      "A stable, durable training shoe made for lifting, rope climbs and high-intensity workouts.",
    category: "Running",
    colors: ["Black", "White", "Red"],
    price: 150,
    salePrice: null,
    images: ["men/M+NIKE+METCON+10.avif"],
  },
  {
    name: "Nike Air Liquid Max",
    description:
      "Visible Air cushioning meets a sculpted, futuristic upper for a statement look with all-day comfort.",
    category: "Sneakers",
    colors: ["Silver", "Black", "Blue"],
    price: 190,
    salePrice: 160,
    images: ["men/NIKE+AIR+LIQUID+MAX+AW.avif"],
  },
  {
    name: "Nike Flex Train",
    description:
      "A flexible, low-profile trainer that moves with you through gym sessions and everyday wear.",
    category: "Running",
    colors: ["Black", "White"],
    price: 75,
    salePrice: null,
    images: ["men/NIKE+FLEX+TRAIN.avif"],
  },
  {
    name: "Nike P-6000",
    description:
      "Inspired by early-2000s running, the P-6000 mixes layered mesh and leather with a cushioned sole for a retro look.",
    category: "Sneakers",
    colors: ["White", "Silver", "Red"],
    price: 115,
    salePrice: null,
    images: ["men/NIKE+P-6000.avif"],
  },
];

const womenProducts = [
  {
    name: "Nike Air Force 1 Shadow",
    description:
      "A playful take on the AF1 with doubled-up details and a stacked midsole for extra height.",
    category: "Sneakers",
    colors: ["White", "Red", "Blue"],
    price: 130,
    salePrice: null,
    images: ["women/W+AF1+SHADOW.avif"],
  },
  {
    name: "Nike Air Max Moto 2K SE",
    description:
      "Y2K-inspired lines and Max Air cushioning come together in a chunky, head-turning silhouette.",
    category: "Sneakers",
    colors: ["Silver", "White", "Black"],
    price: 140,
    salePrice: 115,
    images: ["women/W+NIKE+AIR+MAX+MOTO+2K+SE.avif"],
  },
  {
    name: "Nike Court Vision Low",
    description:
      "Classic basketball style for everyday wear, with a clean low-top upper and a grippy rubber outsole.",
    category: "Lifestyle",
    colors: ["White", "Black", "Green"],
    price: 80,
    salePrice: null,
    images: ["women/W+NIKE+COURT+VISION+LO+P+NBK.avif"],
  },
  {
    name: "Nike Metcon 10",
    description:
      "A stable, durable training shoe made for lifting, rope climbs and high-intensity workouts.",
    category: "Running",
    colors: ["White", "Black", "Blue"],
    price: 150,
    salePrice: 125,
    images: ["women/W+NIKE+METCON+10.avif"],
  },
  {
    name: "Nike P-6000",
    description:
      "Inspired by early-2000s running, the P-6000 mixes layered mesh and leather with a cushioned sole for a retro look.",
    category: "Sneakers",
    colors: ["White", "Silver", "Blue"],
    price: 115,
    salePrice: null,
    // This file sits in the men folder, but "WMNS" marks it as the women's model.
    images: ["men/WMNS+NIKE+P-6000.avif"],
  },
  {
    name: "Nike P-6000 SE",
    description:
      "A special edition of the P-6000 with fresh materials and colors on the retro running silhouette.",
    category: "Sneakers",
    colors: ["White", "Red", "Silver"],
    price: 120,
    salePrice: null,
    images: ["women/W+NIKE+P-6000+SE.avif"],
  },
  {
    name: "Nike Shox TL",
    description:
      "Full-length Shox columns deliver a springy ride and an unmistakable early-2000s look.",
    category: "Sneakers",
    colors: ["Black", "Silver", "White"],
    price: 180,
    salePrice: 150,
    images: ["women/W+NIKE+SHOX+TL.avif"],
  },
  {
    name: "Nike V5 RNR",
    description:
      "A retro-running style with layered textures and a comfortable foam midsole for everyday wear.",
    category: "Lifestyle",
    colors: ["White", "Silver", "Green"],
    price: 100,
    salePrice: null,
    images: ["women/W+NIKE+V5+RNR.avif"],
  },
  {
    name: "Nike Vomero Plus",
    description:
      "Maximum cushioning for long runs, with a soft, bouncy foam stack and a breathable upper.",
    category: "Running",
    colors: ["White", "Blue", "Black"],
    price: 180,
    salePrice: null,
    images: ["women/W+NIKE+VOMERO+PLUS.avif"],
  },
  {
    name: "Nike Initiator",
    description:
      "A throwback runner with a mesh-and-leather upper and a cushioned sole for all-day comfort.",
    category: "Running",
    colors: ["White", "Silver", "Red"],
    price: 100,
    salePrice: 80,
    images: ["women/WMNS+NIKE+INITIATOR.avif"],
  },
];

// Every product belongs to exactly one gender, so the Men and Women lists don't overlap.
const allProducts = [
  ...nikeProducts.map((p) => ({ ...p, gender: "unisex" })),
  ...menProducts.map((p) => ({
    ...p,
    gender: "men",
    brand: "Nike",
    sizes: menSizes,
  })),
  ...womenProducts.map((p) => ({
    ...p,
    gender: "women",
    brand: "Nike",
    sizes: womenSizes,
  })),
];

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Wipe existing catalog data so the seed can be re-run
    console.log("🧹 Clearing existing catalog data...");
    await db.delete(schema.cartItems);
    await db.delete(schema.reviews);
    await db.delete(schema.coupons);
    await db
      .delete(schema.user)
      .where(
        inArray(schema.user.email, [
          "john@example.com",
          "jane@example.com",
          "mike@example.com",
        ]),
      );
    await db.delete(schema.productCollections);
    await db.delete(schema.productImages);
    await db.delete(schema.productVariants);
    await db.delete(schema.products);
    await db.delete(schema.collections);
    await db.delete(schema.brands);
    await db.delete(schema.categories);
    await db.delete(schema.sizes);
    await db.delete(schema.colors);
    await db.delete(schema.genders);

    // Create static uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "static", "uploads");
    // Old images belong to product ids that were just wiped
    fs.rmSync(uploadsDir, { recursive: true, force: true });
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log("📁 Created public/static/uploads directory");
    }

    // Seed genders
    console.log("👥 Seeding genders...");
    const menGender = await db
      .insert(schema.genders)
      .values({
        label: "Men",
        slug: "men",
      })
      .returning();

    const womenGender = await db
      .insert(schema.genders)
      .values({
        label: "Women",
        slug: "women",
      })
      .returning();

    const kidsGender = await db
      .insert(schema.genders)
      .values({
        label: "Kids",
        slug: "kids",
      })
      .returning();

    const unisexGender = await db
      .insert(schema.genders)
      .values({
        label: "Unisex",
        slug: "unisex",
      })
      .returning();

    // Seed colors
    console.log("🎨 Seeding colors...");
    const colorData = [
      { name: "Black", slug: "black", hexCode: "#000000" },
      { name: "White", slug: "white", hexCode: "#FFFFFF" },
      { name: "Red", slug: "red", hexCode: "#FF0000" },
      { name: "Blue", slug: "blue", hexCode: "#0000FF" },
      { name: "Green", slug: "green", hexCode: "#00FF00" },
      { name: "Silver", slug: "silver", hexCode: "#C0C0C0" },
    ];

    const colors = await db.insert(schema.colors).values(colorData).returning();

    // Seed sizes
    console.log("📏 Seeding sizes...");
    const sizeData = [
      "6",
      "6.5",
      "7",
      "7.5",
      "8",
      "8.5",
      "9",
      "9.5",
      "10",
      "10.5",
      "11",
      "11.5",
      "12",
    ].map((name, i) => ({
      name,
      slug: name.replace(".", "-"),
      sortOrder: i + 1,
    }));

    const sizes = await db.insert(schema.sizes).values(sizeData).returning();

    // Seed categories
    console.log("📂 Seeding categories...");
    const categoryData = [
      { name: "Sneakers", slug: "sneakers" },
      { name: "Running", slug: "running" },
      { name: "Basketball", slug: "basketball" },
      { name: "Lifestyle", slug: "lifestyle" },
    ];

    const categories = await db
      .insert(schema.categories)
      .values(categoryData)
      .returning();

    // Seed brand
    console.log("🏷️ Seeding brand...");
    const nikeBrand = await db
      .insert(schema.brands)
      .values({
        name: "Nike",
        slug: "nike",
        logoUrl: "https://logo.clearbit.com/nike.com",
      })
      .returning();

    // Seed collections
    console.log("📦 Seeding collections...");
    const collectionData = [
      { name: "Summer '25", slug: "summer-25" },
      { name: "New Arrivals", slug: "new-arrivals" },
      { name: "Best Sellers", slug: "best-sellers" },
      { name: "Sale", slug: "sale" },
    ];

    const collections = await db
      .insert(schema.collections)
      .values(collectionData)
      .returning();

    // Seed products and variants
    console.log("👟 Seeding products and variants...");

    const gendersBySlug = {
      men: menGender[0],
      women: womenGender[0],
      kids: kidsGender[0],
      unisex: unisexGender[0],
    } as const;

    for (const productData of allProducts) {
      const gender =
        gendersBySlug[productData.gender as keyof typeof gendersBySlug];

      // Find category
      const category = categories.find(
        (c) => c.slug === productData.category.toLowerCase(),
      );
      if (!category) continue;

      // Create product
      const product = await db
        .insert(schema.products)
        .values({
          name: productData.name,
          description: productData.description,
          categoryId: category.id,
          genderId: gender.id,
          brandId: nikeBrand[0].id,
          isPublished: true,
        })
        .returning();

      console.log(`  ✅ Created ${gender.label} product: ${product[0].name}`);

      // Create variants for each color and size combination
      for (const colorName of productData.colors) {
        const color = colors.find((c) => c.name === colorName);
        if (!color) continue;

        for (const sizeName of productData.sizes) {
          const size = sizes.find((s) => s.name === sizeName);
          if (!size) continue;

          const sku = `NIKE-${product[0].name.replace(/\s+/g, "").toUpperCase()}-${gender.slug}-${color.slug}-${size.slug}`;

          await db.insert(schema.productVariants).values({
            productId: product[0].id,
            sku,
            price: productData.price.toString(),
            salePrice: productData.salePrice?.toString() || null,
            colorId: color.id,
            sizeId: size.id,
            inStock: Math.floor(Math.random() * 50) + 10, // Random stock 10-60
            weight: 0.5 + Math.random() * 0.3, // Random weight 0.5-0.8 kg
            dimensions: {
              length: 30 + Math.random() * 5,
              width: 20 + Math.random() * 3,
              height: 10 + Math.random() * 2,
            },
          });
        }
      }

      // Create product images
      for (let i = 0; i < productData.images.length; i++) {
        const imageName = productData.images[i];
        const sourcePath = path.join(
          process.cwd(),
          "public",
          "shoes",
          imageName,
        );
        // Images can sit in subfolders (men/, women/) and contain "+"; flatten to a URL-safe name
        const fileName = path
          .basename(imageName)
          .toLowerCase()
          .replace(/[^a-z0-9.]+/g, "-");
        const destPath = path.join(
          uploadsDir,
          `${product[0].id}-${i + 1}-${fileName}`,
        );

        // Copy image to uploads directory
        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, destPath);
        }

        await db.insert(schema.productImages).values({
          productId: product[0].id,
          url: `/static/uploads/${product[0].id}-${i + 1}-${fileName}`,
          sortOrder: i,
          isPrimary: i === 0,
        });
      }

      // Add product to random collections
      const randomCollections = collections
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);
      for (const collection of randomCollections) {
        await db.insert(schema.productCollections).values({
          productId: product[0].id,
          collectionId: collection.id,
        });
      }
    }

    // Seed some sample reviews
    console.log("⭐ Seeding reviews...");
    const products = await db.select().from(schema.products).limit(5);
    const sampleUsers = [
      { id: uuidv4(), name: "John Doe", email: "john@example.com" },
      { id: uuidv4(), name: "Jane Smith", email: "jane@example.com" },
      { id: uuidv4(), name: "Mike Johnson", email: "mike@example.com" },
    ];

    for (const user of sampleUsers) {
      await db.insert(schema.user).values({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: true,
      });

      // Create reviews for random products
      const randomProducts = products
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);
      for (const product of randomProducts) {
        await db.insert(schema.reviews).values({
          productId: product.id,
          userId: user.id,
          rating: Math.floor(Math.random() * 5) + 1,
          comment: `Great product! ${product.name} is exactly what I was looking for.`,
        });
      }
    }

    // Seed some coupons
    console.log("🎫 Seeding coupons...");
    await db.insert(schema.coupons).values([
      {
        code: "WELCOME10",
        discountType: "percentage",
        discountValue: "10",
        maxUsage: 100,
        usedCount: 0,
      },
      {
        code: "SAVE20",
        discountType: "percentage",
        discountValue: "20",
        maxUsage: 50,
        usedCount: 0,
      },
      {
        code: "FREESHIP",
        discountType: "fixed",
        discountValue: "15",
        maxUsage: 200,
        usedCount: 0,
      },
    ]);

    console.log("✅ Database seed completed successfully!");
    console.log(`📊 Seeded:`);
    console.log(
      `  - ${allProducts.length} products (${menProducts.length} men, ${womenProducts.length} women, ${nikeProducts.length} unisex)`,
    );
    console.log(`  - ${colorData.length} colors`);
    console.log(`  - ${sizeData.length} sizes`);
    console.log(`  - ${categoryData.length} categories`);
    console.log(`  - ${collectionData.length} collections`);
    console.log(`  - 3 sample users with reviews`);
    console.log(`  - 3 coupons`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
