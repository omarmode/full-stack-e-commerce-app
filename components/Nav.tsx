"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {children}
      </div>
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "relative p-4 transition-all duration-300 ease-in-out rounded-md hover:bg-white hover:bg-opacity-20 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white",
        pathname === props.href && "bg-white bg-opacity-25 text-gray-900"
      )}
    >
      <span className="relative z-10">{props.children}</span>
      {pathname === props.href && (
        <span className="absolute inset-0 rounded-md border-2 border-white opacity-75"></span>
      )}
    </Link>
  );
}
