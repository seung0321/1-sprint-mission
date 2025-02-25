const baseUrl = "https://panda-market-api-crud.vercel.app";

const articleAPI = {
  getArticleList(page, pageSize, keyword) {
    fetch(
      `${baseUrl}/articles?page=${page}&pageSize=${pageSize}&orderBy=recent&keyword=${keyword}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(`${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        console.log(`end`);
      });
  },

  getArticle(id) {
    fetch(`${baseUrl}/articles/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(`${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
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

    fetch(`${baseUrl}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(`${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
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

    fetch(`${baseUrl}/articles/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patchData),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(`${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        console.log("end");
      });
  },

  deleteArticle(id) {
    fetch(`${baseUrl}/articles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(`${response.status}`);
        }
        console.log("삭제되었습니다.");
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        console.log("end");
      });
  },
};

export default articleAPI;
