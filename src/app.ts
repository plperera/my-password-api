import { loadEnv, connectDb, disconnectDB } from "@/config";
import cors from "cors";
import express, { Express } from "express";
import "reflect-metadata";
import "express-async-errors";
import { authRouter } from "./routers/auth-router";
import { handleSaveRouter } from "./routers/handleSave-router";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.json";
loadEnv();

const app = express();
app
  .use(cors())
  .use(express.json())
  .use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
  .use("/auth", authRouter)
  .use("/item", handleSaveRouter)
  .get("/health", (_req, res) => res.send("OK!"))

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
