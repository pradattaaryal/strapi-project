export default {
  routes: [
    {
      method: 'GET',
      path: '/product/:documentId',
      handler: 'product.findOne',
      config: {
        auth: false,
      },
    },
  
  ],
};
