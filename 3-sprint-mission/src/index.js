import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import ProductRouter from "./route/product.js";
import ArticleRouter from "./route/article.js";
import CommentRouter from "./route/comment.js";
import multer from "multer";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/products", ProductRouter);
app.use("/articles", ArticleRouter);
app.use("/comments", CommentRouter);

//이미지 업로드
const upload = multer({ dest: "./image" });
app.use("/uploads", express.static("image"));

app.post("/uploads", upload.single("attachment"), (req, res) => {
  try {
    const filename = req.file.filename;
    const path = `/uploads/${filename}`;
    res.json({ path });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//서버
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on ${process.env.PORT || 3000}`);
});
