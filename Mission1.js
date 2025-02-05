class Product {
  constructor(name, description, price, tags, images, favoriteCount) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this._favoriteCount = favoriteCount;
  }
  get favoriteCount() {
    return this._favoriteCount;
  }

  set favoriteCount(value) {
    if (value >= 0) {
      this._favoriteCount = value;
    } else {
      throw new Error("favoriteCount는 0보다 작을 수 없습니다.");
    }
  }

  favorite() {
    this._favoriteCount += 1;
  }
}

class ElectronicProduct extends Product {
  constructor(
    name,
    description,
    price,
    tags,
    images,
    favoriteCount,
    manufacturer
  ) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }
}

class Article {
  constructor(title, content, writer, likeCount) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this._likeCount = likeCount;
    this.createdAt = new Date(); //심화요구사항
  }

  get likeCount() {
    return this._likeCount;
  }
  set likeCount(value) {
    if (value >= 0) {
      this._likeCount = value;
    } else {
      throw new Error("likeCount 0보다 작을 수 없습니다.");
    }
  }
  like() {
    this._likeCount += 1;
  }
}

const callProduct = new ElectronicProduct(
  "apple",
  "red",
  "1$",
  "fruit",
  "apple.jpg",
  0,
  "seung"
);

const callArticle = new Article("배고프다", "치킨먹고싶다", "seung", 0);

callProduct.favorite();
callArticle.like();
callProduct.favorite();
//callProduct.favoriteCount = -10;
console.log(callProduct);
console.log(callArticle);
