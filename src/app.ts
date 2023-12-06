import express, { Application as ExpressApplication, Handler } from "express";
import cors from "cors";
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
    this._instance.use(cors()); // Wildcard as this is a demo app
    this.registerRouters();
  }
  private registerRouters() {
    this._instance.get("/", (req, res) => {
      res.json({ message: "Hello World!" });
    });

    // Register routers
    [TaskController].forEach(provider => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const instance: { [handleName: string]: Handler } = new provider() as any;

      const basePath: string = Reflect.getMetadata("base_path", provider);
      const routers: IRouter[] = Reflect.getMetadata("routers", provider);

      const expressRouter = express.Router();

      routers.forEach(({ method, path, handlerName }) => {
        expressRouter[method](
          path,
          instance[String(handlerName)].bind(instance)
        );
      });

      this._instance.use("/api" + basePath, expressRouter);
    });
  }
}

export default new Application();
