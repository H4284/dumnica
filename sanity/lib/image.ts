import {
  createImageUrlBuilder,
  type ImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import type { SanityImageCrop, SanityImageHotspot } from "../../sanity.types";
import { client } from "./client";

const imageBuilder = createImageUrlBuilder(client);

/** Sanity image field with dereferenced asset metadata (from GROQ queries). */
export type SanityImageWithMetadata = {
  _type?: "image";
  asset?: {
    _id?: string;
    metadata?: {
      lqip?: string | null;
      dimensions?: {
        width?: number | null;
        height?: number | null;
        aspectRatio?: number | null;
      } | null;
    } | null;
  } | null;
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
};

export function urlFor(source: SanityImageSource): ImageUrlBuilder {
  return imageBuilder.image(source).auto("format");
}

export function getImageLqip(
  image: SanityImageWithMetadata | null | undefined,
): string | undefined {
  const lqip = image?.asset?.metadata?.lqip;
  return lqip ?? undefined;
}

export function getImageDimensions(
  image: SanityImageWithMetadata | null | undefined,
): { width: number; height: number; aspectRatio: number } | undefined {
  const dimensions = image?.asset?.metadata?.dimensions;
  if (!dimensions?.width || !dimensions?.height) {
    return undefined;
  }

  return {
    width: dimensions.width,
    height: dimensions.height,
    aspectRatio:
      dimensions.aspectRatio ?? dimensions.width / dimensions.height,
  };
}
