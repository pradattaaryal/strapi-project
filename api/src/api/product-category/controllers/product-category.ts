// path: src/api/product-category/controllers/product-category.ts

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::product-category.product-category', ({ strapi }) => ({
  
  async customQuery(ctx) {
    ctx.body = { message: 'This is a custom query response' };
  },

  async key(ctx) {
    ctx.body = { key: 'product-category-key' };
  },

  async moreStuff(ctx) {
    ctx.body = { message: 'More stuff for product categories' };
  },

}));
