import {
  BooleanResponseDTO,
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
  async getTasks(args: TaskListArgsDTO): Promise<TaskResponseDTO[]> {
    return this._taskRepository.getAll(args);
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

  /**
   * @description Delete a task
   * @param id
   * @returns
   */
  async deleteTask(id: string): Promise<BooleanResponseDTO> {
    const success = await this._taskRepository.delete(id);

    return {
      success,
      message: success ? "Task deleted" : "Task not deleted"
    };
  }
}
