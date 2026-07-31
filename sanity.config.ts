"use client"

import {defineConfig} from "sanity"
import {structureTool} from "sanity/structure"
import {visionTool} from "@sanity/vision"
import {schemaTypes} from "./sanity/schemaTypes"

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  "0fzde33q"

export default defineConfig({
  name: "glassiv-deco",
  title: "Glassiv Deco - prezentacje",
  basePath: "/studio",
  projectId,
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_STUDIO_DATASET ||
    "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
