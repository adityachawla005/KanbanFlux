import {z} from "zod";

export const CreateCardSchema = z
  .object({
    title: z
      .string({
        required_error: "Title is required.",
        invalid_type_error: "Title is required.",
      })
      .min(3, { message: "Title is too short" }),
    listId: z.string(),
    mediaUrl: z.string().url().optional(),
    mediaType: z.enum(["audio", "video"]).optional(),
  })
  .refine(
    (data) =>
      (!data.mediaUrl && !data.mediaType) ||
      (data.mediaUrl && data.mediaType),
    {
      message: "Both mediaUrl and mediaType must be provided together.",
      path: ["mediaType"], // or "mediaUrl"
    }
  );
