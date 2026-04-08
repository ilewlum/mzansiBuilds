import userRoutes from "./UserRoutes.js";
import projectRoutes from "./ControllerRoutes.js";

export default function routes(app) {
  app.use("/users", userRoutes);
  app.use("/projects", projectRoutes);
}