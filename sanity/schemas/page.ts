import {defineType, defineField} from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Titulli",
      type: "string",
      description: "Shkruani titullin e faqes, p.sh. Rreth Nesh.",
      validation: (Rule) =>
        Rule.required().error("Titulli është i detyrueshëm."),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Adresa e faqes, p.sh. rreth-nesh.",
      options: {
        source: "title",
      },
      validation: (Rule) =>
        Rule.required().error("Slug është i detyrueshëm."),
    }),

    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "Shqip", value: "sq" },
          { title: "English", value: "en" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "body",
      title: "Përmbajtja",
      type: "array",
      description: "Shkruani përmbajtjen kryesore të faqes.",
      of: [
        {
          type: "block",
        },
      ],
      validation: (Rule) =>
        Rule.required().error("Përmbajtja është e detyrueshme."),
    }),

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Titulli që mund të shfaqet në rezultatet e Google.",
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description:
        "Përshkrim i shkurtër që mund të shfaqet në rezultatet e Google.",
      validation: (Rule) => Rule.max(160),
    }),

    defineField({
      name: "seoImage",
      title: "SEO Image",
      type: "image",
      description:
        "Foto që përdoret kur faqja shpërndahet në rrjete sociale.",
      options: {
        hotspot: true,
      },
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
  },
});