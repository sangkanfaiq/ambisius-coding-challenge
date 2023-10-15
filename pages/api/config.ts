const axios = require("axios");

// PRODUCTS
export async function getProducts(params: any) {
  try {
    let config = {
      method: "GET",
      maxBodyLength: Infinity,
      url: `http://localhost:3600/products`,
      headers: {},
      params: params,
    };
    const response = await axios.request(config);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function getProductById(id: any) {
  try {
    let config = {
      method: "GET",
      maxBodyLength: Infinity,
      url: `http://localhost:3600/products/${id}`,
      headers: {},
    };
    const response = await axios.request(config);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function addProduct(data: any) {
  try {
    let config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: `http://localhost:3600/products`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    };
    const response = await axios.request(config);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function editProduct(id: any, body: any) {
  try {
    const config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://localhost:3600/products/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(body),
    };

    const response = await axios.request(config);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteProduct(id: any) {
  try {
    let config = {
      method: "DELETE",
      maxBodyLength: Infinity,
      url: `http://localhost:3600/products/${id}`,
      headers: {},
    };
    const response = await axios.request(config);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadImageBB(body: any) {
  try {
    const formData = new FormData();
    formData.append("image", body);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload/1/upload?key=cdfac3f4ac7d30b593663b2b0762db72`,
      formData
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// ORDER
export async function getOrders(params: any) {
  try {
    let config = {
      method: "GET",
      maxBodyLength: Infinity,
      url: `http://localhost:3600/orders`,
      headers: {},
      params: params,
    };
    const response = await axios.request(config);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function addOrder(data: any) {
  try {
    let config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: `http://localhost:3600/orders`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    };
    const response = await axios.request(config);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteOrders(id: any) {
  try {
    let config = {
      method: "DELETE",
      maxBodyLength: Infinity,
      url: `http://localhost:3600/orders/${id}`,
      headers: {},
    };
    const response = await axios.request(config);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function updateOrders(id: any, body: any) {
  try {
    // Perbarui pesanan
    const config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://localhost:3600/orders/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(body),
    };

    const response = await axios.request(config);
    return response;
  } catch (error) {
    console.log(error);
  }
}