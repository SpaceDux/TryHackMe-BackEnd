import { TaskListArgs } from "../../../libs/types/TaskListArgs.type";
import { TaskRepository } from "../repository/Task.repository";

export class TaskService {
  private readonly _taskRepository: TaskRepository = new TaskRepository();
  constructor() {}

  public async getTaskList(args: TaskListArgs) {
    return this._taskRepository.list(args);
  }
}
