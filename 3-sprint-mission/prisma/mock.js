export const PRODUCTS = [
  {
    id: "f8013040-b076-4dc4-8677-11be9a17162f",
    name: "중고 겔럭시 s23 공기계",
    description: "중고 겔럭시 s23공기계입니다. 2년 사용했습니다.",
    price: 150000,
    tag: "ELECTRONICS",
    createdAt: "2025-01-14T10:00:00Z",
    updatedAt: "2025-01-14T10:00:00Z",
  },
  {
    id: "d2ff3048-83bc-425a-8ad3-d6d9af1c7c6d",
    name: "조던 운동화",
    description: "미개봉 조던 운동화입니다.",
    price: 75000,
    tag: "FASHION",
    createdAt: "2025-01-14T10:30:00Z",
    updatedAt: "2025-01-14T10:30:00Z",
  },
];

export const ARTICLES = [
  {
    id: "39c3fd4a-dbd5-4ab1-8e0b-58ea31b8a2d3",
    title: "IAB STUDIO 후드티 구합니다",
    content: "한정판으로 나온 파란색 구합니다.",
    createdAt: "2025-02-14T10:00:00Z",
    updatedAt: "2025-02-14T10:00:00Z",
  },
  {
    id: "43c62d5b-6e66-4d1c-9f47-14d1a1970fd1",
    title: "아이묭 내한 티켓 구합니다.",
    content: "아이묭 내한 티켓 2장 40만원에 구합니다.",
    createdAt: "2025-02-14T10:30:00Z",
    updatedAt: "2025-02-14T10:30:00Z",
  },
];

export const COMMENT = [
  {
    id: "43c62d5b-6e66-4d1c-9f47-14d1a1970fd2",
    content: "공기계 사고 싶습니다.",
    productId: "f8013040-b076-4dc4-8677-11be9a17162f",
    boardType: "products",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "43c62d5b-6e66-4d1c-9f47-14d1a1970fd3",
    content: "아이묭 내한 티켓 팝니다.",
    articleId: "43c62d5b-6e66-4d1c-9f47-14d1a1970fd1",
    boardType: "article",
    createdAt: "2025-01-15T10:00:00Z",
  },
];
