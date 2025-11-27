export function sanitizeInput(raw: string): string {
  return raw
    .replace(/<.*?>/g, "")           // remove HTML tags
    .replace(/script/gi, "")         // remove script
    .replace(/[^\x20-\x7E]/g, "")    // remove non-ASCII
    .trim();
}
