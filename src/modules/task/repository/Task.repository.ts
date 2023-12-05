import { TaskListArgs } from "../../../libs/types/TaskListArgs.type";
import { PrismaClient, type Tasks } from "@prisma/client";

export class TaskRepository {
  protected _prismaClient: PrismaClient = new PrismaClient();

  /**
   * @description Fetch a list of tasks
   * @param args
   * @returns Promise<Tasks[]>
   */
  async list(args: TaskListArgs): Promise<Tasks[]> {
    return this._prismaClient.tasks.findMany({
      ...(args?.archived && {
        where: {
          archived: args.archived
        }
      }),
      take: parseInt(args.limit as string),
      skip: parseInt(args.page as string) * parseInt(args.limit as string)
    });
  }

  /**
   * @description Fetch a single task by id
   * @param id
   * @returns Promise<Tasks>
   */
  async get(id: string): Promise<Tasks> {
    const result = await this._prismaClient.tasks.findFirst({
      where: {
        id
      }
    });

    // When the task is not found, exit with an error
    if (!result) {
      throw new Error("Task not found");
    }

    return result;
  }
}
