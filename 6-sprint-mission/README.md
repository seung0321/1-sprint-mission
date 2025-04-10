# 코드잇 스프린트 미션 6

## 목표

- 기본 SQL 문법 연습
- 백엔드 서버에서 ORM으로 사용하던 것을 직접 SQL로 작성해 보기

## 미션 소개

이번 미션에서는 판다마켓 프로젝트와는 별개로 SQL 연습 문제를 풀어 보겠습니다.
PostgreSQL에서 psql로 진행을 권장합니다. psql 또는 다른 데이터베이스 접속 프로그램을 활용해서 진행해 주세요.
주어진 데이터와 SQL 연습 문제에 대해서 psql에 접속해 쿼리를 실행해 보면서 알맞은 쿼리를 만들 건데요, 이렇게 완성한 쿼리를 파일에 작성해 제출하게 됩니다.

### 미션 준비하기

PostgreSQL 설치
내 컴퓨터에 PostgreSQL을 설치해 주세요. 아래 가이드 문서를 참고하셔도 좋습니다.
이미 PostgreSQL을 설치했다면 다음 단계로 넘어갑니다.

- PostgreSQL 설치하기

### 데이터베이스와 데이터 세팅하기

미션 수행에 필요한 데이터베이스를 만들고, SQL 파일을 다운 받아서 실행해 데이터를 채워 넣어 볼게요.

PostgreSQL 접속
우선 터미널에서 psql를 사용해 로컬 PostgreSQL에 접속합니다.

- psql -h localhost -p 5432 -U postgres

데이터베이스 생성

- 실습을 위해 데이터베이스를 만들겠습니다.
- psql 콘솔에서 아래 코드로 pizza_place라는 데이터베이스를 만들어 주세요. (pizza_place 대신 다른 이름을 사용해도 됩니다.)

CREATE DATABASE pizza_place;
잘 생성되었다면 아래와 같은 메시지가 뜹니다.

CREATE DATABASE
\l 명령어로 데이터베이스가 생성되었는지 확인할 수도 있어요.

데이터베이스 접속
그리고 \c 명령어를 써서 만든 데이터베이스로 접속합니다.

\c pizza_place
성공적으로 데이터베이스에 접속했다면 아래와 같은 메시지가 나옵니다.

You are now connected to database "pizza_place" as user "postgres".

### 미션용 데이터 추가

우선 아래 파일을 다운로드 받습니다.

- pizza_place_sales.sql

### 데이터 설명

- pizza_types, pizzas, order_details, orders 총 네 개의 테이블로 구성되어 있습니다.
- pizza_category 타입: 피자의 분류를 표현하는 값입니다. Chicken, Classic, Supreme, Veggie 라는 값을 가지는 Enum 타입입니다.
- pizza_size 타입: 피자의 크기를 표현하는 값입니다. S, M, L, XL, XXL라는 값을 가지는 Enum 타입입니다.
- pizza_types 테이블: 판매 중인 피자의 타입입니다. 피자 이름과, 피자 분류, 피자의 구성 요소에 대해 저장하고 있습니다.
- pizzas 테이블: 판매 중인 피자입니다. type_id는 pizza_types.id 를 참조합니다.
- orders 테이블: 주문 데이터를 저장합니다. 주문한 날짜(YYYY-MM-dd)와 시간(HH:mm:ss)을 저장하고 있습니다.
- order_details 테이블: 세부 주문 내역을 저장합니다. 하나의 주문에 여러 피자를 시킬 수 있기 때문에, order_details에서는 피자 메뉴에 해당하는 pizza_id 컬럼으로 pizzas.id 를 참조하고, order_id 컬럼으로 orders.id를 참조합니다.

### 문제

진행 중인 프로젝트에 SQL 연습을 위한 새로운 브랜치를 만들고, sprint-mission-6.sql이라는 파일을 만들어 주세요.
