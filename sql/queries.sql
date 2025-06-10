/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE users SET nickname ='test' WHERE id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT * FROM products p
WHERE user_id =1
ORDER BY p.create_date DESC
LIMIT 10
OFFSET 20;

/*
  3. 내가 생성한 상품의 총 개수
*/
SELECT u.id, COUNT(p.user_id) AS count_product
FROM products p
JOIN users u ON u.id = p.user_id
GROUP BY u.id;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT p.* FROM product_likes pl
JOIN products p ON p.id = pl.product_id
WHERE pl.user_id = 1
ORDER BY p.create_date DESC
LIMIT 10
OFFSET 20;
/*
  5. 내가 좋아요 누른 상품의 총 개수
*/
SELECT u.id, COUNT(pl.user_id) AS count_likes
FROM product_likes pl
JOIN users u ON u.id = pl.user_id
GROUP BY u.id;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO products (
  user_id, name, description, price, tags, image, create_date, update_date
)
VALUES(
  1, '새 상품', '새 상품 내용입니다.', 10000, ARRAY['티셔츠', '의류'], ARRAY['image.jpg'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

/*
  7. 상품 목록 조회
  - "test" 로 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT p.*, COUNT(pl.product_id) AS count_likes
FROM products p
LEFT JOIN product_likes pl ON p.id = pl.product_id
WHERE p.name = 'test'
GROUP BY p.id
ORDER BY p.create_date DESC
LIMIT 10
OFFSET 0;

/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT * FROM products p
WHERE p.id = 1;

/*
  9. 상품 수정
  - 1번 상품 수정
*/
UPDATE products SET 
name = '핸드폰', 
description = '겔럭시 s 22',
price = 990000,
tags = ARRAY['전자제품'],
image = ARRAY['image2.jpg']
WHERE id = 1;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products WHERE id = 1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO product_likes (
  user_id, 
  product_id, 
  create_date, 
  update_date
) VALUES (
  1, 
  2, 
  NOW(), 
  NOW()
);

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM product_likes
WHERE user_id = 1 AND product_id = 2;

/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO comments(
  product_id,
  user_id,
  content,
  create_date,
  update_date
) VALUES(
  2,
  1,
  '이 상품 좋아보여요',
  NOW(),
  NOW()
);

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준으로 커서 페이지네이션
  - 10개씩 페이지네이션
*/
SELECT * FROM comments c
WHERE c.product_id = 1 AND c.update_date < '2025-03-25'
ORDER BY c.create_date DESC
LIMIT 10;


