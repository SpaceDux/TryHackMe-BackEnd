import { CreateTaskInputDTO, TaskListArgsDTO } from "@/libs/dtos";
import { PrismaClient, type Tasks } from "@prisma/client";

export class TaskRepository {
  protected _prismaClient: PrismaClient = new PrismaClient();

  /**
   * @description Fetch a list of tasks
   * @param args
   * @returns Promise<Tasks[]>
   */
  async getAll(args: TaskListArgsDTO): Promise<Tasks[]> {
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
    return this._prismaClient.$transaction(async trx => {
      const { relatedTo, ...rest } = args;

      // Create the task.
      const task = await trx.tasks.create({
        data: {
          ...rest,
          relatedTo: [...(relatedTo || [])]
        }
      });

      // Check if related tasks exist.
      if (relatedTo?.length) {
        const relatedTasks = await trx.tasks.findMany({
          where: {
            id: {
              in: relatedTo
            }
          }
        });

        // Check if all related tasks exist.
        if (relatedTasks.length !== relatedTo.length) {
          throw new Error("Related tasks not found");
        }

        // Add the task id to the related tasks.
        for (const relatedTask of relatedTasks) {
          await trx.tasks.update({
            where: {
              id: relatedTask.id
            },
            data: {
              relatedTo: {
                set: [...relatedTask.relatedTo, task.id]
              }
            }
          });
        }
      }

      return task;
    });
  }

  /**
   * @description Update a task
   * @param args
   * @returns Promise<Tasks>
   */
  async update(args: Partial<Tasks>): Promise<Tasks> {
    return this._prismaClient.$transaction(async trx => {
      const { id, relatedTo, ...rest } = args;
      // Fetch the task.
      const fetchTask = await trx.tasks.findUnique({
        where: {
          id: id
        }
      });

      // Check if related tasks exist. else exit
      if (!fetchTask) {
        throw new Error("Task not found");
      }

      // Check if related tasks exist.
      if (
        relatedTo?.length ||
        fetchTask.relatedTo?.length !== relatedTo?.length
      ) {
        const relatedTasks = await trx.tasks.findMany({
          where: {
            id: {
              in: fetchTask.relatedTo
            }
          }
        });

        // check if relation exists in record but not in args
        const relatedTasksToDelete = relatedTasks.filter(
          item => !(relatedTo || []).includes(item.id)
        );

        console.log("relatedTasksToDelete", relatedTasksToDelete);

        // Remove this task id from relations.
        for (const relation of relatedTasksToDelete) {
          console.log("relation", relation);
          await trx.tasks.update({
            where: {
              id: relation.id
            },
            data: {
              relatedTo: {
                set: relation.relatedTo.filter(item => item !== id)
              }
            }
          });
        }

        // check if relation exists in args but not in record
        const relatedTasksToAdd = (relatedTo || []).filter(
          item => !fetchTask.relatedTo.includes(item)
        );

        // Add the task id to the related tasks.
        for (const relatedTaskId of relatedTasksToAdd) {
          const relatedTask = await trx.tasks.findUnique({
            where: {
              id: relatedTaskId
            }
          });

          // Check if related task exist. else exit
          if (!relatedTask) {
            throw new Error("Related task not found");
          }

          await trx.tasks.update({
            where: {
              id: relatedTask.id
            },
            data: {
              relatedTo: {
                set: [...relatedTask.relatedTo, fetchTask.id]
              }
            }
          });
        }
      }

      // Update the task.
      return trx.tasks.update({
        where: {
          id: id
        },
        data: {
          ...rest,
          relatedTo,
          ...(args?.archived === true && {
            archivedAt: new Date()
          }),
          ...(args?.archived === false && {
            archivedAt: null
          })
        }
      });
    });
  }

  /**
   * @description Delete a task
   * @param id
   * @returns Promise<Tasks>
   */
  async delete(id: string): Promise<boolean> {
    return this._prismaClient.$transaction(async trx => {
      // Fetch the task.
      const fetchTask = await trx.tasks.findUnique({
        where: {
          id
        }
      });

      if (!fetchTask) {
        throw new Error("Task not found");
      }

      // Fetch all tasks that have a relation to this task.
      if (fetchTask?.relatedTo?.length) {
        const relations = await trx.tasks.findMany({
          where: {
            id: {
              in: fetchTask.relatedTo
            }
          }
        });

        // Remove this task id from relations.
        relations.forEach(async relation => {
          await trx.tasks.update({
            where: {
              id: relation.id
            },
            data: {
              relatedTo: {
                set: relation.relatedTo.filter(item => item !== id)
              }
            }
          });
        });
      }

      // Delete all comments that have a relation to this task.
      await trx.comments.deleteMany({
        where: {
          taskId: id
        }
      });

      // Delete the task.
      await trx.tasks.delete({
        where: {
          id
        }
      });

      return true;
    });
  }
}
