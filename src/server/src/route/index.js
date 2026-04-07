import userRoutes from "./UserRoutes.js";

export default function routes(app) {
  app.use("/users", userRoutes);
}