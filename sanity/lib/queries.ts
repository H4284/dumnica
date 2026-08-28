import { groq } from "next-sanity";

import { loc, locList, locBlock } from "./localize";

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
  *[_type == "project"] | order(${loc("title")} asc) {
    id,
    _createdAt,
    "title": ${loc("title")},
    slug,
    "city": ${loc("city")},
    "cityKey": coalesce(city.sq, city.en, city.de),
    status,
    mainPhoto ${imageWithMetadataProjection},
    "description": ${loc("description")},
    featured
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    "title": ${loc("title")},
    slug,
    "city": ${loc("city")},
    "cityKey": coalesce(city.sq, city.en, city.de),
    status,
    mainPhoto ${imageWithMetadataProjection},
    video,
    "description": ${loc("description")},
    "specifications": ${locList("specifications")},
    "amenities": ${locList("amenities")},
    paymentPlan[] {
      percentage,
      "label": ${loc("label")}
    },
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
    slug.current == $slug
  ][0] {
    "title": ${loc("title")},
    slug,
    "body": ${locBlock("body")},
    "seoTitle": ${loc("seoTitle")},
    "seoDescription": ${loc("seoDescription")},
    seoImage ${imageWithMetadataProjection}
  }
`;

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    "heroTitle": ${loc("heroTitle")},
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
    "heroButtonText": ${loc("heroButtonText")},
    heroButtonLink,
    yearsOfExperience,
    finishedProjects,
    apartmentsDelivered,
    "aboutTitle": ${loc("aboutTitle")},
    "aboutText": ${loc("aboutText")},
    "afarizmiIntro": ${loc("afarizmiIntro")},
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

export const allBuildingsQuery = groq`*[_type == "building"] | order(order asc) {
  _id,
  "title": ${loc("title")},
  "slug": slug.current,
  facadeImage ${imageWithMetadataProjection},
  "total": count(*[_type == "unit" && building._ref == ^._id]),
  "free": count(*[_type == "unit" && building._ref == ^._id && status == "i_lire"])
}`;

export const buildingBySlugQuery = groq`
  *[_type == "building" && slug.current == $slug][0] {
    _id,
    "title": ${loc("title")},
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
    floorPlanImage ${imageWithMetadataProjection},
    floorPlanPdf {
  asset->{
    _id,
    url,
    originalFilename,
    mimeType
  }
},
    price
  }
`;

export const unitByBuildingAndCodeQuery = groq`
  *[
    _type == "unit" &&
    building->slug.current == $buildingSlug &&
    code == $unitCode
  ][0] {
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
    floorPlanImage ${imageWithMetadataProjection},
    floorPlanPdf {
      asset->{
        _id,
        url,
        originalFilename,
        mimeType
      }
    },
    price,
    "building": building->{
      _id,
      "title": ${loc("title")},
      "slug": slug.current,
      floorsCount
    }
  }
`;

export const allUnitsQuery = groq`
  *[_type == "unit"] {
    _id,
    code,
    "buildingSlug": building->slug.current
  }
`;
