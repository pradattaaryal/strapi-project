import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const products = await strapi.db.query('api::product.product').findMany({
      ...query,
      populate: {
        img: { select: ['url', 'name'] },
        img2: { select: ['url', 'name'] },
        product_categories: {
          select: ['id', 'desc', 'title',],
          populate: {
            img: { select: ['url', 'name'] },
            sub_product_categories: true,
          },
        },
        sub_product_categories: {
          populate: {
            img: { select: ['url', 'name'] },
          }
        },
      },
      select: ['id', 'title', 'price', 'desc', 'isNew'],
    });

    return products;
  },


  async findOne(ctx) {
    const { query } = ctx;

    const { documentId }:{documentId: string} = ctx.params;

    const entity = await strapi.db.query('api::product.product').findOne(
      {
        ...query,
        populate: {
          img: { select: ['url', 'name'] },
          img2: { select: ['url', 'name'] },
          product_categories: {
            select: ['id', 'desc', 'title',],
            populate: {
              img: { select: ['url', 'name'] },
              sub_product_categories: true,
            },
          },
          sub_product_categories: {
            populate: {
              img: { select: ['url', 'name'] },
            }
          },
        },
       // select: ['id', 'title', 'price', 'desc', 'isNew'],
      }
    );

    if (!entity) {
      return ctx.notFound('Product not found');
    }

    return entity;
  },
}));
