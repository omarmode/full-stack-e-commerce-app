"use server";

import db from "../db/db";

export async function userOrderExists(email: string, productId: string) {
  return (
    (await db.order.findFirst({
      where: { usr: { email }, productId },
      select: { id: true },
    })) != null
  );
}
