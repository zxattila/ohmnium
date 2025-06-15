const labelOverrides: Record<string, string> = {
  "ev-charging": "EV Charging",
  about: "About Us",
  contact: "Contact",
  // Add more overrides as needed
};

export function generateBreadcrumbs(
  pathname: string,
): { name: string; url: string }[] {
  const segments = pathname.replace(/\/$/, "").split("/").filter(Boolean);

  const breadcrumbs = segments.map((slug, index) => {
    const name =
      labelOverrides[slug] ||
      slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const url = "/" + segments.slice(0, index + 1).join("/");
    return { name, url };
  });

  return [{ name: "Home", url: "/" }, ...breadcrumbs];
}
