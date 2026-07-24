const SIZE_MAP = [
  { max: 150, name: "thumbnail" },
  { max: 600, name: "medium" },
  { max: Infinity, name: "desktop" },
] as const;

export default function r2ImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const publicUrl = process.env.S3_PUBLIC_URL || process.env.R2_PUBLIC_URL;
  if (!publicUrl) return src;

  const targetSize = SIZE_MAP.find((s) => width <= s.max) ?? SIZE_MAP[SIZE_MAP.length - 1];
  const sizeName = targetSize.name;

  const baseUrl = publicUrl.replace(/\/$/, "");
  if (src.startsWith(baseUrl)) {
    const key = src.slice(baseUrl.length + 1);
    const baseKey = key.replace(/__\w+\.\w+$/, "");
    const ext = key.endsWith(".webp") ? "webp" : key.split(".").pop() ?? "jpg";
    return `${baseUrl}/${baseKey}__${sizeName}.${ext}`;
  }

  return src;
}
