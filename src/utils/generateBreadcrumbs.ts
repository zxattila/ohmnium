const labelOverrides: Record<string, string> = {
  "ev-charging": "EV Charging",
  about: "About Us",
  contact: "Contact",
  // Add more overrides as needed
};

export function generateBreadcrumbs(
  pathname: string,
  overrides: { [key: string]: string } = {},
) {
  const pathParts = pathname.split("/").filter((part) => part);
  let currentPath = "";
  const breadcrumbs = [{ name: "Home", url: "/" }];

  for (const part of pathParts) {
    currentPath += `/${part}`;
    const name =
      overrides[part] ||
      part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
    breadcrumbs.push({ name, url: currentPath });
  }

  return breadcrumbs;
}
