import "reflect-metadata";
import application from "./app";
import * as http from "http";

const PORT = process.env.PORT || 3000;
const server = http.createServer(application.instance);
server.listen(PORT, () => {
  console.log(`[SERVER]: Server is listening on port: ${PORT}`);
});
