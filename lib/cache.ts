import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

// تحديد نوع دالة كـ Callback التي تأخذ معلمات من أي نوع وتعيد Promise
type Callback<T = string | number, R = unknown> = (...args: T[]) => Promise<R>;

export function cache<T extends Callback>(
  cb: T,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {}
) {
  return nextCache(reactCache(cb), keyParts, options);
}
