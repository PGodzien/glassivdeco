import {defineConfig} from "sanity"
import {structureTool} from "sanity/structure"
import {visionTool} from "@sanity/vision"
import {schemaTypes} from "./sanity/schemaTypes"

const projectId = process.env.SANITY_STUDIO_PROJECT_ID

if (!projectId) {
  throw new Error(
    "Brak SANITY_STUDIO_PROJECT_ID. Skopiuj .env.example do .env.local i wpisz identyfikator projektu Sanity.",
  )
}

export default defineConfig({
  name: "glassiv-deco",
  title: "Glassiv Deco - prezentacje",
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
