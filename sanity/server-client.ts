import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, readToken } from "./env";

if (!readToken) {
  console.warn("SANITY_API_READ_TOKEN is missing — writes will fail at runtime");
}

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: readToken,
});
