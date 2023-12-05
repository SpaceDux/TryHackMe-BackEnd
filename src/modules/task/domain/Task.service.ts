import {
  CreateTaskInputDTO,
  TaskResponseDTO,
  UpdateTaskInputDTO
} from "@/libs/dtos";
import { TaskRepository } from "../repository/Task.repository";
import { TaskListArgsDTO } from "@/libs/dtos";

export class TaskService {
  private readonly _taskRepository: TaskRepository = new TaskRepository();
  constructor() {}

  /**
   * @description Get task list
   * @param args
   * @returns
   */
  async getTaskList(args: TaskListArgsDTO): Promise<TaskResponseDTO[]> {
    console.log("args", args);
    return this._taskRepository.list(args);
  }

  /**
   * @description Get a single task by id
   * @param id
   * @returns
   */
  async getTask(id: string): Promise<TaskResponseDTO> {
    return this._taskRepository.get(id);
  }

  /**
   * @description Create a new task
   * @param args
   * @returns
   */
  async createTask(args: CreateTaskInputDTO): Promise<TaskResponseDTO> {
    return this._taskRepository.create(args);
  }

  /**
   * @description Update a task
   * @param args
   * @returns
   */
  async updateTask(
    id: string,
    args: UpdateTaskInputDTO
  ): Promise<TaskResponseDTO> {
    return this._taskRepository.update({ id, ...args });
  }
}
