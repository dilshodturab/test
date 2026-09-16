const INTERVAL_MS = 1000 * 60;
const ordersService = require("../services/orders.service");

async function backgroundRunner() {
  try {
   await ordersService.autoCancelOrders();
  } catch (error) {
    console.error("Background job error:", error.message);
  }
}

module.exports.backgroundJob = () => {
  console.log("Background job started");

  const loop = async () => {
    await backgroundRunner();
    setTimeout(loop, INTERVAL_MS);
  };

  loop();
};
