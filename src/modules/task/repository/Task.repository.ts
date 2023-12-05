import { TaskListArgs } from "../../../libs/types/TaskListArgs.type";
import { PrismaClient, type Tasks } from "@prisma/client";

export class TaskRepository {
  protected _prismaClient: PrismaClient = new PrismaClient();

  /**
   * @description Fetch a list of tasks
   * @param args
   * @returns
   */
  async list(args: TaskListArgs): Promise<Tasks[]> {
    throw new Error("Method not implemented.");
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
}