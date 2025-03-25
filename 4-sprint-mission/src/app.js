import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import userController from "./controllers/userController.js";
import productController from "./controllers/productController.js";
import boardController from "./controllers/boardController.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("", userController);
app.use("/products", productController);
app.use("/board", boardController);

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
