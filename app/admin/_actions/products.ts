"use server";

import db from "../../db/db";
import { z } from "zod";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import cloudinary from "../../../lib/cloudinary";

// إعدادات Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  // رفع الملف على Cloudinary
  const fileUploadResult = await new Promise<string>(
    async (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "products/files",
            resource_type: "auto",
          },
          (error: unknown, result: unknown) => {
            if (error) {
              reject(error);
            }
            // التحقق من نوع result ووجود secure_url
            if (
              result &&
              typeof result === "object" &&
              result !== null &&
              "secure_url" in result
            ) {
              resolve((result as { secure_url: string }).secure_url);
            } else {
              reject(new Error("Upload result is not valid"));
            }
          }
        )
        .end(Buffer.from(await data.file.arrayBuffer()));
    }
  );

  // رفع الصورة على Cloudinary
  const imageUploadResult = await new Promise<string>(
    async (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "products/images",
            resource_type: "image",
          },
          (error: unknown, result: unknown) => {
            if (error) {
              reject(error);
            }
            // التحقق من نوع result ووجود secure_url
            if (
              result &&
              typeof result === "object" &&
              result !== null &&
              "secure_url" in result
            ) {
              resolve((result as { secure_url: string }).secure_url);
            } else {
              reject(new Error("Upload result is not valid"));
            }
          }
        )
        .end(Buffer.from(await data.image.arrayBuffer()));
    }
  );

  // حفظ البيانات في قاعدة البيانات
  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceIncants: data.priceInCents,
      filePath: fileUploadResult, // مسار الملف من Cloudinary
      imagePath: imageUploadResult, // مسار الصورة من Cloudinary
    },
  });

  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await db.product.findUnique({ where: { id } });

  if (product == null) return notFound();

  let filePath = product.filePath;
  if (data.file && data.file.size > 0) {
    // رفع الملف إلى Cloudinary
    filePath = await new Promise<string>(async (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "products/files",
            resource_type: "auto",
          },
          (error: unknown, result: unknown) => {
            if (error) {
              reject(error);
            }
            if (
              result &&
              typeof result === "object" &&
              result !== null &&
              "secure_url" in result
            ) {
              resolve((result as { secure_url: string }).secure_url);
            } else {
              reject(new Error("Upload result is not valid"));
            }
          }
        )
        .end(Buffer.from(await data.file!.arrayBuffer()));
    });
  }

  let imagePath = product.imagePath;
  if (data.image != null && data.image.size > 0) {
    // حذف الصورة القديمة من Cloudinary
    imagePath = await new Promise<string>(async (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "products/images",
            resource_type: "image",
          },
          (error: unknown, result: unknown) => {
            if (error) {
              reject(error);
            }
            if (
              result &&
              typeof result === "object" &&
              result !== null &&
              "secure_url" in result
            ) {
              resolve((result as { secure_url: string }).secure_url);
            } else {
              reject(new Error("Upload result is not valid"));
            }
          }
        )
        .end(Buffer.from(await data.image!.arrayBuffer()));
    });
  }

  // تحديث البيانات في قاعدة البيانات
  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceIncants: data.priceInCents,
      filePath,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}
export async function deleteProduct(id: string) {
  const product = await db.product.findUnique({ where: { id } });

  if (product == null) return notFound();

  // حذف الملف من Cloudinary إذا كان موجودًا
  if (product.filePath) {
    await cloudinary.uploader.destroy(product.filePath, {
      resource_type: "auto",
    });
  }

  // حذف الصورة من Cloudinary إذا كانت موجودة
  if (product.imagePath) {
    await cloudinary.uploader.destroy(product.imagePath, {
      resource_type: "image",
    });
  }

  // حذف المنتج من قاعدة البيانات
  await db.product.delete({ where: { id } });

  revalidatePath("/products");
  redirect("/admin/products");
}
export async function toggleProductAvailability(id: string) {
  const product = await db.product.findUnique({ where: { id } });

  if (product == null) return notFound();

  await db.product.update({
    where: { id },
    data: {
      isAvailableForPurchase: !product.isAvailableForPurchase,
    },
  });

  revalidatePath("/products");
  redirect("/admin/products");
}
