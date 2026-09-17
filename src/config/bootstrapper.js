const { PORT, NODE_ENV } = require("./env");
const { ordersRoutes } = require("../routes/orders.route");
const { productsRoutes } = require("../routes/products.route");
const { errorHandler } = require("./error-handler");
const { seedTables } = require("./seeding");
const { usersRoute } = require("../routes/users.route");
const { backgroundJob } = require("./background");
const { connectRedis } = require("./redis-connect");

module.exports.appBootstrapper = async (app) => {
  await connectRedis()
  await seedTables();
  await backgroundJob();

  app.use("/api/v1/users", usersRoute);
  app.use("/api/v1/products", productsRoutes);
  app.use("/api/v1/orders", ordersRoutes);
  app.get("/api/v1/health", (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Trust me bro your backend is running1"
    })
  });
  app.use(errorHandler);
  app.listen(PORT, () => { console.log(`Bro your app is running in ${NODE_ENV} and listening the port: ${PORT}`) });
}
