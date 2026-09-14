const INTERVAL_MS = 1000 * 60;

async function backgroundJob() {
  console.log("1 daqiqa o'tdi");
  try {
    // 1. query
    // 2. cancel
  } catch (error) {
    console.log(error)
  }
}

setInterval(backgroundJob, INTERVAL_MS);
