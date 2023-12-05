import { Tasks } from "@prisma/client";

export class CreateTaskInputDTO implements Partial<Tasks> {
  title!: string;
  body?: string;
  relatedTo?: string[] | undefined;
}
