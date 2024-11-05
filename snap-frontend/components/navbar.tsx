import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

interface TitleTypeProps {
  scrollToUpload: () => void;
}

export function Navbar({ scrollToUpload }: TitleTypeProps) {
  const components: { title: string; href: string }[] = [
    {
      title: "Upload",
      href: `/${scrollToUpload}`,
    },
    {
      title: "About",
      href: "/about",
    },
  ];

  return (
    <NavigationMenu className="flex sm:gap-3 max-sm:justify-between items-center border-b border-zinc-500 h-fit p-5 absolute w-full">
      <h1 className="lg:mx-7 text-2xl lg:text-3xl text-center align-top dark:text-zinc-200 text-zinc-700 z-20 font-[family-name:var(--font-libre-baskerville-b)]">
        SnapCaption
      </h1>
      <NavigationMenuList className="gap-5 lg:gap-10 pt-1">
        {components.map((component, index) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuLink
              href={component.href}
              className="lg:text-xl text-lg text-zinc-600 font-[family-name:var(--font-roboto-condensed-regular)]"
            >
              {component.title}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
