import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",

  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
    }),

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "heroButtonText",
      title: "Hero Button Text",
      type: "string",
    }),

    defineField({
      name: "heroButtonLink",
      title: "Hero Button Link",
      type: "string",
    }),

    defineField({
      name: "yearsOfExperience",
      title: "Years of Experience",
      type: "number",
    }),

    defineField({
      name: "finishedProjects",
      title: "Finished Projects",
      type: "number",
    }),

    defineField({
      name: "apartmentsDelivered",
      title: "Apartments Delivered",
      type: "number",
    }),

    defineField({
      name: "aboutTitle",
      title: "About Title",
      type: "string",
    }),

    defineField({
      name: "aboutText",
      title: "About Text",
      type: "text",
      rows: 5,
    }),

    defineField({
      name: "aboutImage",
      title: "About Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "afarizmiIntro",
      title: "Afarizmi Intro",
      type: "text",
      rows: 3,
      description: "Teksti i shkurtër që shfaqet mbi listën e ndërtesave.",
    }),
  ],
});