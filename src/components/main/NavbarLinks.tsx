import Link from "next/link";

type TLinks = {
  id: number;
  title: string;
  url: string;
};

const links: TLinks[] = [
  { id: 1, title: "Home", url: "/" },
  { id: 2, title: "Products", url: "/products" },
  { id: 3, title: "Categories", url: "/categories" },
  { id: 4, title: "Sales", url: "/sales" },
  { id: 5, title: "Cart", url: "/cart" },
];

const NavbarLinks = ({
  pathname,
  visibility,
}: {
  pathname: string;
  visibility: string;
}) => {
  console.log(pathname === links[1].url);
  return (
    <div
      className={`h-18 w-full md:w-max ${visibility} items-center justify-center gap-4 sm:gap-6 grow`}
    >
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.url}
          className={`
            relative h-full leading-18 overflow-hidden
            text-lg md:text-base lg:text-lg
            ${pathname == link.url ? "font-semibold" : ""}
            
            // Before pseudo-element styles
            before:absolute before:bottom-3 before:w-full before:h-0.5 
            before:bg-black before:content-[''] 
            before:transition-all before:duration-300
            
            // Position states
            ${pathname == link.url ? "before:left-0" : "before:-left-full"}
            hover:before:left-0
          `}
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
};
export default NavbarLinks;
