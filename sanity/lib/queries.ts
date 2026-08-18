import { groq } from "next-sanity";

export const allProjectsQuery = groq`
  *[_type == "project"] | order(title asc) {
    title,
    slug,
    city,
    status,
    mainPhoto,
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
    mainPhoto,
    video,
    description,
    specifications,
    amenities,
    location,
    brochure,
    gallery,
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
    defaultShareImage
  }
`;

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    title,
    slug,
    body,
    seoTitle,
    seoDescription,
    seoImage
  }
`;