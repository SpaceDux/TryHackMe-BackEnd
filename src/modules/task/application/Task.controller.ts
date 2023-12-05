import { CreateTaskInputDTO, TaskListArgsDTO } from "@/libs/dtos";
import { Controller, Get, Post } from "../../../libs/decorators";
import { TaskService } from "../domain/Task.service";
import { Request, Response } from "express";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError
} from "@prisma/client/runtime/library";

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
      const args: TaskListArgsDTO = req.query;

      const result = await this._taskService.getTaskList({
        page: args.page || "0",
        limit: args.limit || "10",
        archived: args?.archived
      });

      res.json(result).status(200);
      return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("[TaskController] getTaskList error", error);
      if (
        error instanceof PrismaClientValidationError ||
        error instanceof PrismaClientUnknownRequestError ||
        error instanceof PrismaClientKnownRequestError
      ) {
        res
          .json({ error: "Sorry, something went wrong with that request." })
          .status(500);
        return;
      }

      res.json({ error: error?.message as string }).status(500);
      return;
    }
  }

  /**
   * @description Get a single task by id
   * @param id  - The id of the task.
   * @returns Promise<Task>
   */
  @Get("/:id")
  async getTask(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._taskService.getTask(req.params.id);
      res.json(result).status(200);
      return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("[TaskController] getTask error", error);
      if (
        error instanceof PrismaClientValidationError ||
        error instanceof PrismaClientUnknownRequestError ||
        error instanceof PrismaClientKnownRequestError
      ) {
        res
          .json({ error: "Sorry, something went wrong with that request." })
          .status(500);
        return;
      }

      res.json({ error: error?.message as string }).status(500);
      return;
    }
  }

  /**
   * @description Create a new task
   * @param args  - The arguments of the request.
   * @returns Promise<Task>
   * @todo Validate args
   */
  @Post("/create")
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const args: CreateTaskInputDTO = req?.body;

      const result = await this._taskService.createTask(args);

      res.json(result).status(201);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("[TaskController] createTask error", error);
      if (
        error instanceof PrismaClientValidationError ||
        error instanceof PrismaClientUnknownRequestError ||
        error instanceof PrismaClientKnownRequestError
      ) {
        res
          .json({ error: "Sorry, something went wrong with that request." })
          .status(500);
        return;
      }

      res.json({ error: error?.message as string }).status(500);
    }
  }
}
