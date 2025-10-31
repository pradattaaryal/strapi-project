import { factories } from '@strapi/strapi';

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

    const toStringSafe = (v: unknown): string | undefined =>
      typeof v === 'string' && v.trim() !== '' ? v : undefined;
    const toBoolSafe = (v: unknown): boolean | undefined =>
      typeof v === 'string' ? (v.toLowerCase() === 'true' ? true : v.toLowerCase() === 'false' ? false : undefined) :
        typeof v === 'boolean' ? v : undefined;
    const toNumSafe = (v: unknown): number | undefined => {
      if (typeof v === 'number') return Number.isFinite(v) ? v : undefined;
      if (typeof v === 'string' && v.trim() !== '') {
        const n = Number(v);
        return Number.isFinite(n) ? n : undefined;
      }
      return undefined;
    };
    const toStringArray = (v: unknown): string[] | undefined => {
      if (Array.isArray(v)) return v.map(x => String(x)).filter(Boolean);
      const s = toStringSafe(v);
      return s ? s.split(',').map(x => x.trim()).filter(Boolean) : undefined;
    };

    const search = toStringSafe(query.search);
    const type = toStringSafe(query.type);
    const categoryIds = toStringArray(query.category);
    const isNew = toBoolSafe(query.isNew);
    const minPrice = toNumSafe(query.minPrice);
    const maxPrice = toNumSafe(query.maxPrice);
    const sortBy = toStringSafe(query.sortBy);

    const pageNum = toNumSafe(query.page) ?? DEFAULT_PAGINATION.page;
    const pageSize = toNumSafe(query.pageSize) ?? DEFAULT_PAGINATION.pageSize;
    const start = (pageNum - 1) * pageSize;

    const filterConditions: any[] = [
      ...(search ? [{ $or: [{ title: { $containsi: search } }, { desc: { $containsi: search } }] }] : []),
      ...(type ? [{ type: { $eq: type } }] : []),
      ...(typeof isNew === 'boolean' ? [{ isNew: { $eq: isNew } }] : []),
      ...(categoryIds && categoryIds.length ? [{ product_categories: { id: { $in: categoryIds } } }] : []),
      ...((minPrice != null || maxPrice != null)
        ? [{ price: { ...(minPrice != null ? { $gte: minPrice } : {}), ...(maxPrice != null ? { $lte: maxPrice } : {}) } }]
        : []),
    ];

    const filters = filterConditions.length ? { $and: filterConditions } : {};

    const [sortField, sortDirection = 'asc'] = sortBy ? sortBy.split(':') : [] as string[];
    const sort = sortField ? `${sortField}:${sortDirection}` : 'createdAt:desc';

    const findOptions: any = {
      filters,
      populate: {
        img: { fields: ['url', 'name'] },
        img2: { fields: ['url', 'name'] },
        product_categories: { fields: ['title'] },
      },
      sort,
      start,
      limit: pageSize,
    };

    const [products, totalFiltered] = await Promise.all([
      strapi.entityService.findMany('api::product.product', findOptions),
      strapi.entityService.count('api::product.product', { filters }),
    ]);

    const totalPages = Math.ceil(totalFiltered / pageSize);

    return {
      data: products,
      meta: {
        pagination: {
          page: pageNum,
          pageSize,
          pageCount: totalPages,
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
