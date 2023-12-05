/**
 * @description Decorator for controllers. This is a helper decorator to make the code more readable.
 * @param {string} path - The path of the controller.
 */
export const Controller = (path: string): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata("base_path", path, target);
  };
};
