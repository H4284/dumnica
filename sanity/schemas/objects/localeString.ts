import { defineField, defineType } from "sanity";

const localeFields = [
  defineField({
    name: "sq",
    title: "Shqip",
    type: "string",
  }),
  defineField({
    name: "en",
    title: "English",
    type: "string",
  }),
  defineField({
    name: "de",
    title: "Deutsch",
    type: "string",
  }),
];

export default defineType({
  name: "localeString",
  title: "Localized string",
  type: "object",
  fields: localeFields,
});
