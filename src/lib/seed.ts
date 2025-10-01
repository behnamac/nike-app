import { db } from "./db";
import { products } from "./schema";

const sampleProducts = [
  {
    name: "Air Jordan 1 Retro High OG",
    description:
      "The Air Jordan 1 Retro High OG is a classic basketball shoe that combines style and performance.",
    price: "170.00",
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-jordan-1-retro-high-og-shoes-P6bTtD.png",
    category: "Basketball",
    brand: "Nike",
    size: "9",
    color: "White/Black/Red",
    stock: 25,
  },
  {
    name: "Air Max 270",
    description:
      "The Air Max 270 delivers visible cushioning under every step with the largest Air Max unit ever.",
    price: "150.00",
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/bf5d41e4-6b1c-4e7b-9c0d-8c0b8c0b8c0b/air-max-270-shoes-P6bTtD.png",
    category: "Lifestyle",
    brand: "Nike",
    size: "10",
    color: "Black/White",
    stock: 30,
  },
  {
    name: "React Element 55",
    description:
      "The Nike React Element 55 delivers a bold, futuristic design with lightweight, responsive cushioning.",
    price: "130.00",
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c8b8c8b8-c8b8-c8b8-c8b8-c8b8c8b8c8b8/react-element-55-shoes-P6bTtD.png",
    category: "Lifestyle",
    brand: "Nike",
    size: "8.5",
    color: "White/Black",
    stock: 20,
  },
  {
    name: "Air Force 1 Low",
    description:
      "The radiance lives on in the Air Force 1 '07, the basketball original that puts a fresh spin on what you know best.",
    price: "90.00",
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8b8c8b8c-8b8c-8b8c-8b8c-8b8c8b8c8b8c/air-force-1-07-shoes-P6bTtD.png",
    category: "Lifestyle",
    brand: "Nike",
    size: "11",
    color: "White",
    stock: 40,
  },
  {
    name: "Dunk Low",
    description:
      "The Nike Dunk Low delivers a classic basketball design that's been reimagined for everyday wear.",
    price: "110.00",
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9c9d9c9d-9c9d-9c9d-9c9d-9c9d9c9d9c9d/dunk-low-shoes-P6bTtD.png",
    category: "Lifestyle",
    brand: "Nike",
    size: "9.5",
    color: "Black/White",
    stock: 35,
  },
  {
    name: "Blazer Mid '77",
    description:
      "The Nike Blazer Mid '77 delivers a classic basketball look with a modern feel.",
    price: "85.00",
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/7a7b7c7d-7a7b-7c7d-7a7b-7c7d7a7b7c7d/blazer-mid-77-shoes-P6bTtD.png",
    category: "Lifestyle",
    brand: "Nike",
    size: "10.5",
    color: "White/Black",
    stock: 28,
  },
];

export async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Clear existing products
    await db.delete(products);

    // Insert sample products
    await db.insert(products).values(sampleProducts);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
