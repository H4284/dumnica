import { groq } from "next-sanity";

const imageWithMetadataProjection = `{
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
}`;

export const allProjectsQuery = groq`
  *[_type == "project"] | order(title asc) {
    id,
    _createdAt,
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
    paymentPlan,
    location,
    brochure {
  asset->{
    _id,
    url,
    originalFilename,
    mimeType
  }
},
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
 *[
    _type == "page" &&
    slug.current == $slug &&
    language == $language
  ][0] {
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
    afarizmiIntro,
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

export const allBuildingsQuery = groq `*[_type == "building"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  facadeImage ${imageWithMetadataProjection},
  "total": count(*[_type == "unit" && building._ref == ^._id]),
  "free": count(*[_type == "unit" && building._ref == ^._id && status == "i_lire"])
}`;

export const buildingBySlugQuery = groq`
  *[_type == "building" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    order,
    facadeImage ${imageWithMetadataProjection},
    facadeViewBox,
    floorsCount
  }
`;

export const unitsByBuildingQuery = groq`
  *[_type == "unit" && building._ref == $buildingId] {
    _id,
    code,
    floor,
    unitType,
    rooms,
    areaNet,
    areaGross,
    orientation,
    status,
    svgPath,
    floorPlanImage,
    price
  }
`;
