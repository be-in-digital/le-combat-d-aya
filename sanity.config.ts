import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { structure, singletonActions, singletonTypes } from "./sanity/structure";
import { SendNewsletterAction } from "./sanity/actions/send-newsletter";
import { apiVersion, dataset, projectId } from "./sanity/env";

export default defineConfig({
  name: "default",
  title: "Le Combat d'Alya",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) => {
      if (singletonTypes.has(context.schemaType)) {
        return input.filter(
          ({ action }) => action && singletonActions.has(action),
        );
      }
      if (context.schemaType === "newsletterIssue") {
        return [...input, SendNewsletterAction];
      }
      return input;
    },
  },
  plugins: [
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
