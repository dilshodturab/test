const express = require("express");
const { connectDB } = require("./config/db-connect");
const { appBootstrapper } = require("./config/bootstrapper");

const app = express();
app.use(express.json({ limit: "15mb" }));

connectDB()
	.then(() => appBootstrapper(app))
	.catch((e) => console.log(`Time: ${new Date().toLocaleString()} `, e));
