import { $Enums, Tasks } from "@prisma/client";

export class TaskResponseDTO implements Tasks {
  id!: string;
  title!: string;
  body!: string | null;
  status!: $Enums.TASK_STATUS;
  archived!: boolean;
  archivedAt!: Date | null;
  relatedTo!: string[];
  createdAt!: Date;
  updatedAt!: Date;
}
