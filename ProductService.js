const productAPI = {
  async getProductList(page, pageSize, keyword) {
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
        throw new Error(`실패`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("에러: ", error);
    } finally {
      console.log("end");
    }
  },

  async getProduct(id) {
    try {
      const response = await fetch(
        `https://panda-market-api-crud.vercel.app/products/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`실패`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("에러: ", error);
    } finally {
      console.log(`end`);
    }
  },

  async createProduct() {
    const jsonData = {
      images: ["https://example.com/..."],
      tags: ["전자제품"],
      price: 0,
      description: "string",
      name: "상품 이름",
    };

    try {
      const response = await fetch(
        `https://panda-market-api-crud.vercel.app/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        }
      );
      if (!response.ok) {
        throw new Error(`실패`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("에러: ", error);
    } finally {
      console.log(`end`);
    }
  },

  async patchProduct(id) {
    const patchData = {
      images: ["https://example.com/..."],
      tags: ["전자제품"],
      price: 0,
      description: "string",
      name: "수정 상품",
    };

    try {
      const response = await fetch(
        `https://panda-market-api-crud.vercel.app/products/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patchData),
        }
      );
      if (!response.ok) {
        throw new Error(`실패`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("에러: ", error);
    } finally {
      console.log(`end`);
    }
  },

  async deleteProduct(id) {
    try {
      const response = await fetch(
        `https://panda-market-api-crud.vercel.app/products/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`실패`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("에러: ", error);
    } finally {
      console.log(`삭제되었습니다.`);
    }
  },
};

export default productAPI;
