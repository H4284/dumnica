import { defineField, defineType } from "sanity";

export default defineType({
  name: "building",
  title: "Building",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titulli",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("Titulli është i detyrueshëm."),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule) =>
        Rule.required().error("Slug është i detyrueshëm."),
    }),

    defineField({
      name: "project",
      title: "Projekti",
      type: "reference",
      to: [{ type: "project" }],
      validation: (Rule) =>
        Rule.required().error("Projekti është i detyrueshëm."),
    }),

    defineField({
      name: "facadeImage",
      title: "Facade Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) =>
        Rule.required().error("Facade image është i detyrueshëm."),
    }),

    defineField({
      name: "facadeViewBox",
      title: "Facade ViewBox",
      type: "string",
      description: 'P.sh. "0 0 1600 900".',
      validation: (Rule) =>
        Rule.required().error("Facade ViewBox është i detyrueshëm."),
    }),

    defineField({
      name: "floorsCount",
      title: "Numri i kateve",
      type: "number",
      validation: (Rule) =>
        Rule.required()
          .integer()
          .positive()
          .error("Numri i kateve duhet të jetë pozitiv."),
    }),

    defineField({
      name: "order",
      title: "Renditja",
      type: "number",
      description: "Përdoret për renditjen e lamelave.",
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "project.title",
      media: "facadeImage",
    },
  },
});