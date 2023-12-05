import { $Enums, Tasks } from "@prisma/client";

export class UpdateTaskInputDTO implements Partial<Tasks> {
  title?: string;
  body?: string | null;
  status?: $Enums.TASK_STATUS;
  archived?: boolean;
  relatedTo?: string[];
}
