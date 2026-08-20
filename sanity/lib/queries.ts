import { groq } from "next-sanity";

const imageWithMetadataProjection = `{
  ...,
  asset->{
    _id,
    metadata {
      lqip,
      dimensions {
        width,
        height,
        aspectRatio
      }
    }
  }
}`;

export const allProjectsQuery = groq`
  *[_type == "project"] | order(title asc) {
    title,
    slug,
    city,
    status,
    mainPhoto ${imageWithMetadataProjection},
    description,
    featured
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    title,
    slug,
    city,
    status,
    mainPhoto ${imageWithMetadataProjection},
    video,
    description,
    specifications,
    amenities,
    location,
    brochure,
    gallery[] ${imageWithMetadataProjection},
    finishDate,
    featured
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    phone,
    whatsapp,
    email,
    address,
    socialLinks,
    defaultShareImage ${imageWithMetadataProjection}
  }
`;

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    title,
    slug,
    body,
    seoTitle,
    seoDescription,
    seoImage ${imageWithMetadataProjection}
  }
`;

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    heroTitle,
    heroImage {
      ...,
      asset->{
  _id,
  url,
  metadata {
    lqip,
    dimensions {
      width,
      height,
      aspectRatio
    }
  }
}
    },
    heroButtonText,
    heroButtonLink,
    yearsOfExperience,
    finishedProjects,
    apartmentsDelivered,
    aboutTitle,
    aboutText,
    aboutImage {
      ...,
      asset->{
  _id,
  url,
  metadata {
    lqip,
    dimensions {
      width,
      height,
      aspectRatio
    }
  }
}
    }
  }
`;
