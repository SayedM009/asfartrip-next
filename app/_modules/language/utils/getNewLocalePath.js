export function getNewLocalePath(pathname, searchParams, newLocale) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");

    const params = searchParams?.toString?.();
    return params ? `${newPath}?${params}` : newPath;
}
