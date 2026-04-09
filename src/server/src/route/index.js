// Main route file that aggregates all individual route modules

import userRoutes from "./UserRoutes.js";
import projectRoutes from "./ProjectRoutes.js";

export default function routes(app) {
  app.use("/users", userRoutes);
  app.use("/projects", projectRoutes);
}