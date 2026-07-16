export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const level = match[1].length as 2 | 3;
      const text = match[2].trim();
      items.push({ id: slugify(text), text, level });
    }
  }
  return items;
}

export function removeLeadingTitle(markdown: string, title: string): string {
  const lines = markdown.split("\n");
  const firstContentLine = lines.findIndex((line) => line.trim().length > 0);

  if (firstContentLine === -1 || lines[firstContentLine].trim() !== title.trim()) {
    return markdown;
  }

  return lines.slice(firstContentLine + 1).join("\n").replace(/^\n+/, "");
}
