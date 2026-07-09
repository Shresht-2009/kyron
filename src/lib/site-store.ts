const sites = new Map<string, { files: Record<string, string>; name: string; date: string }>();

export function storeSite(id: string, name: string, files: Record<string, string>) {
  sites.set(id, { files, name, date: new Date().toISOString() });
}

export function getSite(id: string) {
  return sites.get(id);
}

export function getAllSites(): { id: string; name: string; date: string }[] {
  return Array.from(sites.entries()).map(([id, s]) => ({ id, name: s.name, date: s.date }));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
