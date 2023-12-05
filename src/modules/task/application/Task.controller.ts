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
   */
  @Get("/list/:page/:limit")
  async getTaskList(req: Request, res: Response): Promise<void> {
    const args: TaskListArgs = req.params;

    const result = await this._taskService.getTaskList({
      page: parseInt(args?.page?.toString() || "1"),
      limit: parseInt(args?.limit?.toString() || "10"),
      archived: args?.archived
    });

    res.json(result);
  }
}
