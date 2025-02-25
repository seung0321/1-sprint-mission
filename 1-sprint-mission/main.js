import productAPI from "./ProductService.js";
productAPI.getProductList(1, 10, "전자");
productAPI.getProduct(105);
productAPI.createProduct();
productAPI.patchProduct(160);
productAPI.deleteProduct(160);

import articleAPI from "./ArticleService.js";
articleAPI.getArticleList(1, 10, "제목");
articleAPI.getArticle(1);
articleAPI.createArticle();
articleAPI.patchArticle(1);
articleAPI.deleteArticle(1);
