import {
  CreateTaskInputDTO,
  TaskListArgsDTO,
  UpdateTaskInputDTO
} from "@/libs/dtos";
import { Controller, Delete, Get, Post, Put } from "../../../libs/decorators";
import { TaskService } from "../domain/Task.service";
import { Request, Response } from "express";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError
} from "@prisma/client/runtime/library";

/**
 * @description Task controller - Handles all the task related routes
 */
@Controller("/task")
export class TaskController {
  private readonly _taskService: TaskService = new TaskService();

  /**
   * @description Get task list
   * @param args  - The arguments of the request.
   * @returns Promise<TaskResponseDTO[]>
   * @todo Validate args
   */
  @Get("/list")
  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Validate args
      const args: TaskListArgsDTO = req.query;

      const result = await this._taskService.getTasks({
        page: args.page || "0",
        limit: args.limit || "10",
        archived:
          (args?.archived as unknown as string) === "true" ? true : false
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
   * @returns Promise<TaskResponseDTO>
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

  /**
   * @description Update a task
   * @param args  - The arguments of the request.
   * @returns Promise<TaskResponseDTO>
   * @todo Validate args
   */
  @Put("/update/:id")
  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      // Early exit if no id is provided
      if (!id) throw new Error("Missing id");
      const args: UpdateTaskInputDTO = req.body;

      const result = await this._taskService.updateTask(id, args);

      res.json(result).status(200);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("[TaskController] updateTask error", error);
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

  /**
   * @description Delete a task
   * @param id  - The id of the task.
   * @returns Promise<BooleanResponseDTO>
   */
  @Delete("/:id")
  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      // Early exit if no id is provided
      if (!id) throw new Error("Missing id");

      const result = await this._taskService.deleteTask(id);
      res.json(result).status(200);
      return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("[TaskController] deleteTask error", error);
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
}
