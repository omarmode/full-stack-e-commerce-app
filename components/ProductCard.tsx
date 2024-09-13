import { formatCurrency } from "@/lib/formatters";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  id: string;
  name: string;
  priceIncants: number;
  description: string;
  imagePath: string;
};

export function ProductCard({
  id,
  name,
  priceIncants,
  description,
  imagePath,
}: ProductCardProps) {
  return (
    <Card className="flex overflow-hidden flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-auto aspect-video overflow-hidden rounded-lg">
        <Image
          src={imagePath}
          fill
          alt={name}
          className="object-cover transition-transform duration-300 transform hover:scale-105"
        />
      </div>
      <CardHeader className=" p-4 ">
        <CardTitle className="text-xl font-semibold ">{name}</CardTitle>
        <CardDescription className="text-lg  ">
          {formatCurrency(priceIncants / 100)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <p className="line-clamp-4 text-gray-700 dark:text-white">
          {description}
        </p>
      </CardContent>
      <CardFooter className="p-4">
        <Button
          asChild
          size="lg"
          className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg transition-colors duration-300"
        >
          <Link href={`/products/${id}/purchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col shadow-md animate-pulse">
      <div className="w-full aspect-video bg-gray-300 rounded-lg" />
      <CardHeader className="bg-gray-100 p-4">
        <div className="w-3/4 h-6 rounded-full bg-gray-300 mb-2" />
        <div className="w-1/2 h-4 rounded-full bg-gray-300" />
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-3/4 h-4 rounded-full bg-gray-300" />
      </CardContent>
      <CardFooter className="p-4">
        <Button
          className="w-full bg-gray-300 text-gray-700 cursor-not-allowed"
          disabled
          size="lg"
        ></Button>
      </CardFooter>
    </Card>
  );
}
