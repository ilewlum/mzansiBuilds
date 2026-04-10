// Main route file that aggregates all individual route modules

import userRoutes from "./UserRoutes.js";
import projectRoutes from "./ProjectRoutes.js";
import commentRoutes from "./CommentRoute.js"
import collaborationRoutes from "./CollaborationRoute.js"
import milestoneRoutes from "./MilestoneRoute.js"

export default function routes(app) {
  app.use("/users", userRoutes);
  app.use("/projects", projectRoutes);
  app.use("/comments", commentRoutes);
  app.use("/collaborations", collaborationRoutes);
  app.use("/milestones", milestoneRoutes);
}