import Link from "next/link";
import Image from "next/image";

export default function CollectionsPage() {
  const collections = [
    {
      id: "air-max",
      name: "Air Max",
      description: "The future of air is here",
      image: "/shoes/shoe-1.jpg",
      href: "/products?category=air-max",
      featured: true,
    },
    {
      id: "dunk",
      name: "Dunk",
      description: "Classic basketball heritage",
      image: "/shoes/shoe-2.webp",
      href: "/products?category=dunk",
      featured: true,
    },
    {
      id: "react",
      name: "React",
      description: "Revolutionary cushioning technology",
      image: "/shoes/shoe-3.webp",
      href: "/products?category=react",
      featured: true,
    },
    {
      id: "jordan",
      name: "Jordan",
      description: "The legacy continues",
      image: "/shoes/shoe-4.webp",
      href: "/products?category=jordan",
      featured: false,
    },
    {
      id: "blazer",
      name: "Blazer",
      description: "Timeless court style",
      image: "/shoes/shoe-5.avif",
      href: "/products?category=blazer",
      featured: false,
    },
    {
      id: "air-force",
      name: "Air Force 1",
      description: "The shoe that started it all",
      image: "/shoes/shoe-6.avif",
      href: "/products?category=air-force",
      featured: false,
    },
  ];

  const featuredCollections = collections.filter((c) => c.featured);
  const otherCollections = collections.filter((c) => !c.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Collections
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collections of Nike footwear, each with its own
            unique story and purpose.
          </p>
        </div>

        {/* Featured Collections */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCollections.map((collection) => (
              <Link
                key={collection.id}
                href={collection.href}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                </div>
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
                      {collection.name}
                    </h3>
                    <p className="text-sm opacity-90 drop-shadow-md">
                      {collection.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Other Collections */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            All Collections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCollections.map((collection) => (
              <Link
                key={collection.id}
                href={collection.href}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-square relative">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {collection.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Explore our full product catalog with advanced filtering options
              to find the perfect pair of shoes.
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300"
            >
              Browse All Products
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
