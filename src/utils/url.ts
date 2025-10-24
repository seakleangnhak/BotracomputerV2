const IMAGEKIT_BASE_URL = "https://ik.imagekit.io/botracomputer/ik-seo";
const FALLBACK_IMAGE_URL = "https://ik.imagekit.io/botracomputer/logo.png";

const sanitizeSlugSegment = (value: string | null | undefined) => {
  if (!value) {
    return "";
  }

  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
};

const appendSeoFolder = (path: string, nameSegment: string) => {
  const safeName = nameSegment || "image";

  if (!path.includes(".")) {
    return `${path}/${safeName}`;
  }

  return path.replace(/\.(?=[^.]+$)/, `/${safeName}.`);
};

const buildTransformQuery = (options?: {
  width?: number;
  height?: number;
  crop?: string;
}) => {
  if (!options) {
    return "";
  }

  const transforms = [
    options.width ? `w-${options.width}` : "",
    options.height ? `h-${options.height}` : "",
    options.crop ? `c-${options.crop}` : "",
  ].filter(Boolean);

  return transforms.length ? `?tr=${transforms.join(",")}` : "";
};

export const buildSlug = (
  ...segments: Array<string | number | null | undefined>
) => {
  return segments
    .map((segment) => {
      if (segment === null || segment === undefined) {
        return "";
      }

      if (typeof segment === "number") {
        return segment.toString();
      }

      return sanitizeSlugSegment(segment);
    })
    .filter(Boolean)
    .join("-");
};

export const buildImageKitSeoUrl = (
  imagePath: string | null | undefined,
  name: string | null | undefined,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
  },
) => {
  const primaryPath = imagePath
    ?.split(",")
    .map((path) => path.trim())
    .find(Boolean);

  if (!primaryPath) {
    return FALLBACK_IMAGE_URL;
  }

  const sanitizedName = sanitizeSlugSegment(name) || "image";
  const formattedPath = appendSeoFolder(primaryPath, sanitizedName);
  const transform = buildTransformQuery(options);

  return `${IMAGEKIT_BASE_URL}/${formattedPath}${transform}`;
};

export const buildImageKitRawUrl = (
  imagePath: string | null | undefined,
  name: string | null | undefined,
) => {
  const primaryPath = imagePath
    ?.split(",")
    .map((path) => path.trim())
    .find(Boolean);

  if (!primaryPath) {
    return FALLBACK_IMAGE_URL;
  }

  const sanitizedName = sanitizeSlugSegment(name) || "image";
  const formattedPath = appendSeoFolder(primaryPath, sanitizedName);

  return `${IMAGEKIT_BASE_URL}/${formattedPath}`;
};
