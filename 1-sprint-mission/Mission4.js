class Product {
  constructor(
    id,
    name,
    description,
    price,
    tags,
    images,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  printInfo() {
    console.log(products);
  }
}

class ElectronicProduct extends Product {
  constructor(
    id,
    name,
    description,
    price,
    tags,
    images,
    createdAt,
    updatedAt
  ) {
    super(id, name, description, price, tags, images, createdAt, updatedAt);
  }
  printInfo() {
    console.log(products);
  }
}

let products = [];

async function getProductList(page, pageSize, keyword) {
  try {
    const response = await fetch(
      `https://panda-market-api-crud.vercel.app/products?page=${page}&pageSize=${pageSize}&orderBy=recent&keyword=${keyword}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("실패");
    }

    const data = await response.json();

    data.list.forEach((item) => {
      if (item.tags.includes("전자제품")) {
        const electronicProduct = new ElectronicProduct(
          item.id,
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.createdAt,
          item.updatedAt
        );
        products.push(electronicProduct);
      } else {
        const product = new Product(
          item.id,
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.createdAt,
          item.updatedAt
        );
        products.push(product);
      }
    });

    products.forEach((product) => product.printInfo());
  } catch (error) {
    console.error("에러: ", error);
  } finally {
    console.log("end");
  }
}

//-----------------------------------------------------------------------------

class Article {
  constructor(id, title, image, createdAt, updatedAt, content) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.content = content;
  }
  printInfo() {
    console.log(articlesArray);
  }
}
let articlesArray = [];
async function getArticleList(page, pageSize, keyword) {
  try {
    const response = await fetch(
      `https://panda-market-api-crud.vercel.app/articles?page=${page}&pageSize=${pageSize}&orderBy=recent&keyword=${keyword}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("실패");
    }
    const data = await response.json();
    data.list.forEach((item) => {
      const articles = new Article(
        item.id,
        item.title,
        item.image,
        item.createdAt,
        item.updatedAt,
        item.content
      );
      articlesArray.push(articles);
    });
    articlesArray.forEach((articles) => articles.printInfo());
  } catch (error) {
    console.error("에러: ", error);
  } finally {
    console.log("end");
  }
}

getProductList(2, 10, "");
getArticleList(1, 10, "제목");
