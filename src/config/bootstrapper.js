const { ordersRoutes } = require("../routes/orders.route");
const { productsRoutes } = require("../routes/products.route");
const { PORT } = require("./env");

module.exports.appBootstrapper = async (app) => {
  app.use("/api/v1/products", productsRoutes);
  app.use("/api/v1/orders", ordersRoutes);
  app.get("/api/v1/health", (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Trust me bro your backend is running1"
    })
  });
  app.listen(PORT, () => { console.log(`Bro your app is listening the port: ${PORT}`) });
}
