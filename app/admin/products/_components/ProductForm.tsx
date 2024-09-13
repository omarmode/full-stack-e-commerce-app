"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useState } from "react";
import { addProduct, updateProduct } from "../../_actions/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceIncants
  );

  return (
    <form
      action={action}
      className="space-y-8 p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto border border-gray-200"
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-lg font-medium text-gray-700">
          Name
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
          className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {error.name && (
          <div className="text-destructive text-red-500">{error.name}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="priceInCents"
          className="text-lg font-medium text-gray-700"
        >
          Price In Cents
        </Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
          className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="text-muted-foreground text-gray-500">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
        {error.priceInCents && (
          <div className="text-destructive text-red-500">
            {error.priceInCents}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="text-lg font-medium text-gray-700"
        >
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description}
          className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {error.description && (
          <div className="text-destructive text-red-500">
            {error.description}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file" className="text-lg font-medium text-gray-700">
          File
        </Label>
        <Input
          type="file"
          id="file"
          name="file"
          required={product == null}
          className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {product != null && (
          <div className="text-muted-foreground text-gray-500">
            {product.filePath}
          </div>
        )}
        {error.file && (
          <div className="text-destructive text-red-500">{error.file}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image" className="text-lg font-medium text-gray-700">
          Image
        </Label>
        <Input
          type="file"
          id="image"
          name="image"
          required={product == null}
          className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {product != null && (
          <div className="mt-4">
            <Image
              src={product.imagePath}
              height="400"
              width="400"
              alt="Product Image"
              className="rounded-lg shadow-md"
            />
          </div>
        )}
        {error.image && (
          <div className="text-destructive text-red-500">{error.image}</div>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={`w-full py-3 px-4 font-semibold text-white transition-colors duration-200 ${
        pending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
      }`}
    >
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
