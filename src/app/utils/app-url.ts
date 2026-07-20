export function getAppUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return new URL(normalizedPath, document.baseURI).href;
}

export function getAssetUrl(path: string): string {
    const normalizedPath = path.replace(/^\//, '');
    const assetPath = normalizedPath.startsWith('assets/') ? normalizedPath : `assets/${normalizedPath}`;
    return new URL(assetPath, document.baseURI).href;
}
