import Image, { type ImageProps } from "next/image";
import {
  getImageDimensions,
  getImageLqip,
  urlFor,
  type SanityImageWithMetadata,
} from "@/sanity/lib/image";

type SanityImageProps = Omit<
  ImageProps,
  "src" | "alt" | "width" | "height" | "fill" | "sizes"
> & {
  image: SanityImageWithMetadata | null | undefined;
  alt: string;
  sizes: string;
  width?: number;
  height?: number;
  fill?: boolean;
  /** Max width passed to Sanity CDN when using `fill`. Defaults to 1920. */
  maxWidth?: number;
};

export function SanityImage({
  image,
  alt,
  sizes,
  width,
  height,
  fill,
  maxWidth = 1920,
  className,
  priority,
  ...rest
}: SanityImageProps) {
  if (!image?.asset) {
    return null;
  }

  const dimensions = getImageDimensions(image);
  const lqip = getImageLqip(image);
  const placeholderProps = lqip
    ? ({ placeholder: "blur" as const, blurDataURL: lqip } satisfies Pick<
        ImageProps,
        "placeholder" | "blurDataURL"
      >)
    : {};

  if (fill) {
    return (
      <Image
        src={urlFor(image).width(maxWidth).url()}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        priority={priority}
        {...placeholderProps}
        {...rest}
      />
    );
  }

  const resolvedWidth = width ?? dimensions?.width;
  const resolvedHeight = height ?? dimensions?.height;

  if (!resolvedWidth || !resolvedHeight) {
    return null;
  }

  return (
    <Image
      src={urlFor(image).width(resolvedWidth).height(resolvedHeight).url()}
      alt={alt}
      width={resolvedWidth}
      height={resolvedHeight}
      sizes={sizes}
      className={className}
      priority={priority}
      {...placeholderProps}
      {...rest}
    />
  );
}
