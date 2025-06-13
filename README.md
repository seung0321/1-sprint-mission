# 코드잇 스프린트 미션 11

## 목표

- Github Actions로 테스트, 배포 자동화
- Docker 이미지 만들기

## 미션 소개

1. Github Actions 활용

- 브랜치에 pull request가 발생하면 테스트를 실행하는 액션을 구현해 주세요.
- main 브랜치에 push가 발생하면 AWS 배포를 진행하는 액션을 구현해 주세요.
- 개인 Github 리포지터리에서 Actions 동작을 확인해 보세요.

2. Docker 이미지 만들기

다음을 만족하는 Dockerfile과 docker-compose.yaml을 작성해 주세요.

- Express 서버를 실행하는 Dockerfile을 작성해 주세요.
- Express 서버가 파일 업로드를 처리하는 폴더는 Docker의 Volume을 활용하도록 구현해 주세요.
- 데이터베이스는 Postgres 이미지를 사용해 연결하도록 구현해 주세요.
- 실행된 Express 서버 컨테이너는 호스트 머신에서 3000번 포트로 접근 가능하도록 구현해 주세요.
