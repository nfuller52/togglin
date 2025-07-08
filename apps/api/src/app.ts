import express, { Router } from "express";

export async function createApp() {
  const app = express();

  // Middlware
  app.use(express.json());

  // Routes
  const helloWorld = Router();
  helloWorld.get("/", (req, res) => {
    res.send({ hello: "world" });
  });
  app.use("/api", helloWorld);

  return app;
}
