import { TaskResponseDTO } from "@/libs/dtos/Task.dto";
import { TaskListArgs } from "../../../libs/types/TaskListArgs.type";
import { TaskRepository } from "../repository/Task.repository";

export class TaskService {
  private readonly _taskRepository: TaskRepository = new TaskRepository();
  constructor() {}

  /**
   * @description Get task list
   * @param args
   * @returns
   */
  public async getTaskList(args: TaskListArgs): Promise<TaskResponseDTO[]> {
    return this._taskRepository.list(args);
  }
}
