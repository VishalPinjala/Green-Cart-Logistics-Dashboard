import Route from "../models/Route.js";

export const getRoutes = async (req, res) => {
  const routes = await Route.find();
  res.json(routes);
};

export const createRoute = async (req, res) => {
  const route = await Route.create(req.body);
  res.json(route);
};

export const updateRoute = async (req, res) => {
  const updated = await Route.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

export const deleteRoute = async (req, res) => {
  await Route.findByIdAndDelete(req.params.id);
  res.json({ message: "Route deleted" });
};
