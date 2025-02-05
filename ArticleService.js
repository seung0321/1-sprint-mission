const articleAPI = {
  getArticleList(page, pageSize, keyword) {
    fetch(
      `https://panda-market-api-crud.vercel.app/articles?page=${page}&pageSize=${pageSize}&orderBy=recent&keyword=${keyword}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          return Promise.reject("실패");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("에러", error);
      })
      .finally(() => {
        console.log(`end`);
      });
  },

  getArticle(id) {
    fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject("실패");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("에러", error);
      })
      .finally(() => {
        console.log("end");
      });
  },

  createArticle() {
    const jsonData = {
      image: "https://example.com/...",
      content: "테스트 입니다.",
      title: "테스트 입니다.",
    };

    fetch(`https://panda-market-api-crud.vercel.app/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject("실패");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("에러", error);
      })
      .finally(() => {
        console.log("end");
      });
  },

  patchArticle(id) {
    const patchData = {
      image: "https://example.com/...",
      content: "수정 테스트 입니다.",
      title: "수정 테스트 입니다.",
    };

    fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patchData),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject("실패");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("에러", error);
      })
      .finally(() => {
        console.log("end");
      });
  },

  deleteArticle(id) {
    fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject("실패");
        }
        console.log("삭제되었습니다.");
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("에러", error);
      })
      .finally(() => {
        console.log("end");
      });
  },
};

export default articleAPI;
