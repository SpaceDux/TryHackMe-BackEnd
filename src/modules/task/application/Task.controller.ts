import { Controller, Get } from "../../../libs/decorators";
import { TaskListArgs } from "../../../libs/types";
import { TaskService } from "../domain/Task.service";
import { Request, Response } from "express";

@Controller("/task")
export class TaskController {
  private readonly _taskService: TaskService = new TaskService();

  /**
   * @description Get task list
   * @param args  - The arguments of the request.
   * @returns Promise<Task[]>
   * @todo Validate args
   */
  @Get("/list")
  async getTaskList(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Validate args
      const args: TaskListArgs = req.query;

      const result = await this._taskService.getTaskList({
        page: args.page || "0",
        limit: args.limit || "10",
        archived: args?.archived
      });

      res.json(result).status(200);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      res.json({ error: error?.message as string }).status(500);
    }
  }
}
