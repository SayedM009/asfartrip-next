export function resolveAssetPath(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return path;
    return `/${path}`;
}
