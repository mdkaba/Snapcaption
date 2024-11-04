import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  const components: { title: string; href: string }[] = [
    {
      title: "Upload",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
  ];

  return (
    <NavigationMenu className="flex gap-3 items-center border-b border-zinc-500 h-fit p-5 w-full">
      <h1 className="lg:mx-7 text-3xl lg:text-4xl text-center dark:text-zinc-200 text-zinc-700 z-20 font-[family-name:var(--font-libre-baskerville-b)]">
        SnapCaption
      </h1>
      <NavigationMenuList className="flex items-center gap-10">
        {components.map((component, index) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuLink
              href={component.href}
              className="text-xl text-zinc-600 font-[family-name:var(--font-roboto-condensed-regular)]"
            >
              {component.title}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
