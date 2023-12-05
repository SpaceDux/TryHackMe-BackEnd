import express, { Application as ExpressApplication, Handler } from "express";
import { IRouter } from "./libs/decorators";

// Controllers
import { TaskController } from "./modules/task/application/Task.controller";

class Application {
  private readonly _instance: ExpressApplication;

  get instance(): ExpressApplication {
    return this._instance;
  }

  constructor() {
    this._instance = express();
    this._instance.use(express.json());
    this.registerRouters();
  }
  private registerRouters() {
    this._instance.get("/", (req, res) => {
      res.json({ message: "Hello World!" });
    });

    const info: Array<{ api: string; handler: string }> = [];

    // Register routers
    [TaskController].forEach(provider => {
      const controllerInstance: { [handleName: string]: Handler } =
        new TaskController() as unknown as { [handleName: string]: Handler };

      const basePath: string = Reflect.getMetadata("base_path", provider);
      const routers: IRouter[] = Reflect.getMetadata("routers", provider);

      const expressRouter = express.Router();

      routers.forEach(({ method, path, handlerName }) => {
        expressRouter[method](
          path,
          controllerInstance[String(handlerName)].bind(controllerInstance)
        );

        info.push({
          api: `${method.toLocaleUpperCase()} ${basePath + path}`,
          handler: `${controllerInstance.name}.${String(handlerName)}`
        });
      });

      this._instance.use(basePath, expressRouter);
    });

    // Print API Controller info
    console.table(info);
  }
}

export default new Application();
