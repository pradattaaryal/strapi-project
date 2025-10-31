import { factories } from '@strapi/strapi';
import { toBoolSafe, toNumSafe, toStringArray, toStringSafe } from '../uiliity';

const DEFAULT_PAGINATION = {
  pageSize: 3,
  page: 1,
}; export default factories.createCoreController('api::product.product', ({ strapi }) => ({
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
      //select: ['id', 'title', 'price', 'desc', 'isNew'],
    });

    return products;
  },



async getFilteredProductList(ctx) {
  const query = ctx.request.query as Record<string, unknown>;

   
  const search = toStringSafe(query.search);
  const type = toStringSafe(query.type);
  const categoryIds = toStringArray(query.category);
  const isNew = toBoolSafe(query.isNew);
  const minPrice = toNumSafe(query.minPrice);
  const maxPrice = toNumSafe(query.maxPrice);
  const sortBy = toStringSafe(query.sortBy);
  const pageNum = toNumSafe(query.page) ?? DEFAULT_PAGINATION.page;
  const pageSize = toNumSafe(query.pageSize) ?? DEFAULT_PAGINATION.pageSize;

  
  const filterConditions: any[] = [];

  if (search) {
    filterConditions.push({
      $or: [
        { title: { $containsi: search } },
        { desc: { $containsi: search } },
      ],
    });
  }

  if (type) {
    filterConditions.push({ type: { $eq: type } });
  }

  if (typeof isNew === 'boolean') {
    filterConditions.push({ isNew: { $eq: isNew } });
  }

  if (categoryIds && categoryIds.length) {
    filterConditions.push({
      product_categories: {
        documentId: { $in: categoryIds },
      },
    });
  }

  if (minPrice != null || maxPrice != null) {
    const priceCondition: any = {};
    if (minPrice != null) priceCondition.$gte = minPrice;
    if (maxPrice != null) priceCondition.$lte = maxPrice;
    filterConditions.push({ price: priceCondition });
  }

  const filters = filterConditions.length ? { $and: filterConditions } : {};

   
  const [sortField, sortDirection = 'asc'] = sortBy
    ? sortBy.split(':')
    : ([] as string[]);
  const sort = sortField ? { [sortField]: sortDirection as 'asc' | 'desc' } : { createdAt: 'desc' as const };

  
  const productDocumentService = strapi.documents('api::product.product');

  const findOptions = {
    filters,
    populate: {
      img: {
        fields: ['url', 'name'],
      },
      img2: {
        fields: ['url', 'name'],
      },
      product_categories: {
        fields: ['title', 'documentId'],
      },
    },
    sort,
    page: pageNum,
    pageSize,
  } as any;  

 
  const [products, totalFiltered] = await Promise.all([
    productDocumentService.findMany(findOptions),
    productDocumentService.count({ filters }),
  ]);

 
  const pageCount = Math.ceil(totalFiltered / pageSize);

  
  return {
    data: products,
    meta: {
      pagination: {
        page: pageNum,
        pageSize,
        pageCount,
        total: totalFiltered,
      },
    },
  };
},

  async findOne(ctx) {
    const { id } = ctx.params;

    if (!id) {
      return ctx.badRequest("Product documentId is required.");
    }

    const product = await strapi.db.query("api::product.product").findOne({
      where: { documentId: id },
      populate: {
        img: { select: ["url", "name"] },
        img2: { select: ["url", "name"] },
        product_categories: {
          //select: ["id", "desc", "title"],
          populate: {
            img: { select: ["url", "name"] },
            sub_product_categories: true,
          },
        },
        sub_product_categories: {
          populate: {
            img: { select: ["url", "name"] },
          },
        },
      },
    });


    if (!product) {
      return ctx.notFound(`Product with documentId ${id} not found.`);
    }

    return product;
  },

}));
