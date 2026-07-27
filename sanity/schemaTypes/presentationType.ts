import {defineArrayMember, defineField, defineType} from "sanity"

export const presentationType = defineType({
  name: "presentation",
  title: "Prezentacja",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nazwa prezentacji",
      type: "string",
      description: "Nazwa widoczna w panelu, np. Prezentacja dla marki X.",
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "slug",
      title: "Adres prezentacji",
      type: "slug",
      description: "Unikalny adres generowany na podstawie nazwy prezentacji.",
      options: {source: "title", maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "clientName",
      title: "Nazwa klienta",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "presentationDate",
      title: "Data prezentacji",
      type: "date",
      options: {dateFormat: "DD.MM.YYYY"},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "finalSlide",
      title: "Edytowalny slajd końcowy",
      type: "object",
      description:
        "Treść jednego z końcowych slajdów. Podepniemy ją po ustaleniu jego wyglądu.",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Mały nagłówek",
          type: "string",
        }),
        defineField({
          name: "title",
          title: "Nagłówek",
          type: "string",
        }),
        defineField({
          name: "body",
          title: "Treść",
          type: "array",
          of: [defineArrayMember({type: "block"})],
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Najnowsze prezentacje",
      name: "presentationDateDesc",
      by: [{field: "presentationDate", direction: "desc"}],
    },
  ],
  preview: {
    select: {
      title: "clientName",
      date: "presentationDate",
      subtitle: "title",
    },
    prepare({title, date, subtitle}) {
      return {
        title: title || "Prezentacja bez klienta",
        subtitle: [date, subtitle].filter(Boolean).join(" - "),
      }
    },
  },
})
