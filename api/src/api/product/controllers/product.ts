/**
 * product controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::product.product')
// import { factories } from '@strapi/strapi';

// export default factories.createCoreController('api::product.product', ({ strapi }) => ({
//   async find(ctx) {
//     const queryAny = ctx.query as any;
//     const filtersFromQuery = (queryAny && queryAny.filters) || {};
//     const filters: Record<string, any> = { ...filtersFromQuery };

//     const filterParam = queryAny && queryAny.filter;
//     let normalizedFilter: any = undefined;

//     if (filterParam) {
//       if (typeof filterParam === 'string') {
//         try {
//           normalizedFilter = JSON.parse(filterParam);
//         } catch (e) {
//           normalizedFilter = { q: filterParam };
//         }
//       } else if (typeof filterParam === 'object') {
//         normalizedFilter = filterParam;
//       }
//     }

//     if (normalizedFilter && typeof normalizedFilter === 'object') {
//       for (const [key, rawValue] of Object.entries(normalizedFilter)) {
//         if (rawValue === undefined || rawValue === null || rawValue === '') continue;

//         const ensureArray = (val: any): any[] =>
//           Array.isArray(val) ? val : String(val).split(',').map(v => v.trim()).filter(Boolean);

//         switch (key) {
//           case 'q': {
//             const value = String(rawValue);
//             const like = { $containsi: value };
//             const or = [{ title: like }, { desc: like }];
//             filters.$or = filters.$or && Array.isArray(filters.$or) ? [...filters.$or, ...or] : or;
//             break;
//           }
//           case 'price': { const value: any = rawValue; if (value && typeof value === 'object') { const range: Record<string, number> = {}; if (value.min != null) range.$gte = Number(value.min); if (value.max != null) range.$lte = Number(value.max); if (Object.keys(range).length) filters.price = range; } else { filters.price = { $eq: Number(value) }; } break; }
//           case 'isNew': {
//             filters.isNew = { $eq: rawValue === true || String(rawValue).toLowerCase() === 'true' };
//             break;
//           }
//           case 'type': {
//             filters.type = { $eq: rawValue };
//             break;
//           }
//           case 'category':
//           case 'product_category':
//           case 'product_categories': {
//             const ids = ensureArray(rawValue);
//             if (ids.length) filters.product_categories = { id: { $in: ids } };
//             break;
//           }
//           case 'sub_category':
//           case 'sub_product_categories': {
//             const ids = ensureArray(rawValue);
//             if (ids.length) filters.sub_product_categories = { id: { $in: ids } };
//             break;
//           }
//           default:
//             filters[key] = { $eq: rawValue };
//         }
//       }
//     }

//     ctx.query = { ...ctx.query, filters };

//     // Call super.find only once
//     const { data, meta } = await super.find(ctx);
//     return { data, meta };
//   },
// }));
