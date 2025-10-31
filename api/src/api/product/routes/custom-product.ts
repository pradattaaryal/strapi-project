export default {
    routes: [
    {
      method: "GET",
      path: "/products/filter",
      handler: "product.getFilteredProductList",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/products/:id",
      handler: "product.findOne",
      config: {
        auth: false,  
      },
    },
  ],
};
