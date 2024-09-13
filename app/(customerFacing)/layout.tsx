import { ModeToggle } from "@/components/ModeToggle";
import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My Orders</NavLink>
        <div className="ml-auto text-black dark:text-white">
          <ModeToggle />
        </div>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}
