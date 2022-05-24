import { ZodiosEnpointDescriptions } from "./zodios.types";
import z, { ZodObject } from "zod";
import { capitalize } from "./utils";

/**
 * Helper to split your api definitions into multiple files
 * By just providing autocompletions for the endpoint descriptions
 * @param api - api definitions
 * @returns the api definitions
 */
export function asApi<T extends ZodiosEnpointDescriptions>(api: T): T {
  return api;
}

/**
 * Helper to generate a basic CRUD api for a given resource
 * @param resource - the resource to generate the api for
 * @param schema - the schema of the resource
 * @returns - the api definitions
 */
export function asCrudApi<T extends string, S extends z.Schema>(
  resource: T,
  schema: S
) {
  type Schema = z.infer<S>;
  return asApi([
    {
      method: "get",
      path: `/${resource}s`,
      alias: `get${capitalize(resource)}s`,
      description: `Get all ${resource}s`,
      response: z.array(schema),
    },
    {
      method: "get",
      path: `/${resource}s/:id`,
      alias: `get${capitalize(resource)}`,
      description: `Get a ${resource}`,
      response: schema,
    },
    {
      method: "post",
      path: `/${resource}s`,
      alias: `create${capitalize(resource)}`,
      description: `Create a ${resource}`,
      parameters: [
        {
          name: "body",
          type: "Body",
          description: "The object to create",
          schema: (
            schema as unknown as z.AnyZodObject
          ).partial() as unknown as z.Schema<Partial<Schema>>,
        },
      ],
      response: schema,
    },
    {
      method: "put",
      path: `/${resource}s/:id`,
      alias: `update${capitalize(resource)}`,
      description: `Update a ${resource}`,
      parameters: [
        {
          name: "body",
          type: "Body",
          description: "The object to update",
          schema: schema,
        },
      ],
      response: schema,
    },
    {
      method: "patch",
      path: `/${resource}s/:id`,
      alias: `patch${capitalize(resource)}`,
      description: `Patch a ${resource}`,
      parameters: [
        {
          name: "body",
          type: "Body",
          description: "The object to patch",
          schema: (
            schema as unknown as z.AnyZodObject
          ).partial() as unknown as z.Schema<Partial<Schema>>,
        },
      ],
      response: schema,
    },
    {
      method: "delete",
      path: `/${resource}s/:id`,
      alias: `delete${capitalize(resource)}`,
      description: `Delete a ${resource}`,
      response: schema,
    },
  ] as const);
}
