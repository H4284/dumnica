import {defineType, defineField} from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titulli",
      type: "localeString",
      description: "Shkruani emrin e projektit.",
      validation: (Rule) => Rule.required().error("Titulli është i detyrueshëm."),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Adresa e faqes, p.sh. dumnica-residence.",
      options: { source: "title.sq" },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "city",
      title: "Qyteti",
      type: "localeString",
      description:
        "Emri i qytetit sipas gjuhës. Filtri në website përdor versionin shqip si vlerë të qëndrueshme.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "status",
      title: "Statusi",
      type: "string",
      description: "Zgjidhni statusin aktual të projektit.",
      options: {
        list: [
          {title: "Në ndërtim", value: "construction"},
          {title: "I përfunduar", value: "finished"},
          {title: "Së shpejti", value: "coming-soon"},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "mainPhoto",
      title: "Foto kryesore",
      type: "image",
      description: "Ngarkoni fotografinë kryesore të projektit.",
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "video",
      title: "Video",
      type: "url",
      description: "Vendosni linkun e videos (YouTube ose Vimeo).",
    }),

    defineField({
      name: "description",
      title: "Përshkrimi",
      type: "localeText",
      description: "Shkruani një përshkrim të shkurtër të projektit.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "specifications",
      title: "Specifikimet",
      type: "array",
      of: [{ type: "localeString" }],
      description: "Shtoni specifikimet një nga një.",
    }),

    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      of: [{ type: "localeString" }],
      description: "Shtoni lehtësirat një nga një.",
    }),

    defineField({
      name: "location",
      title: "Lokacioni në hartë",
      type: "geopoint",
      description: "Zgjidhni vendndodhjen në hartë.",
    }),

    defineField({
      name: "brochure",
      title: "Broshura PDF",
      type: "file",
      description: "Ngarkoni broshurën në format PDF.",
      options: {accept: ".pdf"},
    }),

    defineField({
      name: "gallery",
      title: "Galeria",
      type: "array",
      of: [{type: "image", options: {hotspot: true}}],
      description: "Ngarkoni fotografitë e galerisë.",
    }),

    defineField({
      name: "finishDate",
      title: "Data e përfundimit",
      type: "date",
      description: "Zgjidhni datën e përfundimit të projektit.",
    }),

    defineField({
      name: "featured",
      title: "Projekt i veçuar",
      type: "boolean",
      description: "Aktivizoni nëse projekti duhet të shfaqet si featured.",
      initialValue: false,
    }),
    
    defineField({
      name: "paymentPlan",
      title: "Plani i pagesës",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Përshkrimi",
              type: "localeString",
            }),
            defineField({
              name: "percentage",
              title: "Përqindja",
              type: "number",
            }),
          ],
        },
      ],
    }),
  ],

  preview: {
    select: {
      titleSq: "title.sq",
      title: "title",
      citySq: "city.sq",
      city: "city",
      media: "mainPhoto",
    },
    prepare({ titleSq, title, citySq, city, media }) {
      const resolvedTitle =
        titleSq || (typeof title === "string" ? title : "Untitled");
      const resolvedCity =
        citySq || (typeof city === "string" ? city : "");

      return {
        title: resolvedTitle,
        subtitle: resolvedCity,
        media,
      };
    },
  },
  
});
