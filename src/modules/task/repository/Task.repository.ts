import { CreateTaskInputDTO, TaskListArgsDTO } from "@/libs/dtos";
import { PrismaClient, type Tasks } from "@prisma/client";

export class TaskRepository {
  protected _prismaClient: PrismaClient = new PrismaClient();

  /**
   * @description Fetch a list of tasks
   * @param args
   * @returns Promise<Tasks[]>
   */
  async list(args: TaskListArgsDTO): Promise<Tasks[]> {
    console.log("args", args);
    return this._prismaClient.tasks.findMany({
      where: {
        archived: args.archived
      },
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

  /**
   * @description Create a new task
   * @param args
   * @returns Promise<Tasks>
   */
  async create(args: CreateTaskInputDTO): Promise<Tasks> {
    return this._prismaClient.tasks.create({
      data: args
    });
  }

  /**
   * @description Update a task
   * @param args
   * @returns Promise<Tasks>
   */
  async update(args: Partial<Tasks>): Promise<Tasks> {
    const { id, ...rest } = args;
    return this._prismaClient.tasks.update({
      where: {
        id: id
      },
      data: {
        ...rest,
        ...(args?.archived === true && {
          archivedAt: new Date()
        }),
        ...(args?.archived === false && {
          archivedAt: null
        })
      }
    });
  }
}
