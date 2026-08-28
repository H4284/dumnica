import { defineField, defineType } from "sanity";

export default defineType({
  name: "localeText",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({
      name: "sq",
      title: "Shqip",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "de",
      title: "Deutsch",
      type: "text",
      rows: 5,
    }),
  ],
});
