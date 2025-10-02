import Image from "next/image";

interface CardProps {
  title: string;
  category?: string;
  colors?: string;
  price: string;
  image?: string;
  badge?: string;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  title,
  category,
  colors,
  price,
  image,
  badge,
  className = "",
  onClick,
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="aspect-square relative bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {badge}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {title}
        </h3>

        {/* Category */}
        {category && <p className="text-sm text-gray-600 mb-2">{category}</p>}

        {/* Colors */}
        {colors && <p className="text-sm text-gray-600 mb-3">{colors}</p>}

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">{price}</span>
        </div>
      </div>
    </div>
  );
}
