import * as yup from "yup";

export const createProductSchema = yup.object({
  body: yup
    .object({
      sku: yup.string().required(),
      title: yup.string().required(),
      slug: yup.string(),
      totalQuantity: yup.number().required(),
      description: yup.string(),
      oldPrice: yup.number(),
      currentPrice: yup.number().required(),
      categoryUniqueId: yup.string().uuid().required(),
      specifications: yup.array(yup.object()).required(),
      attributes: yup.array(yup.object()),
      highlights: yup.array(yup.string()).required(),
      overview: yup.string().required(),
    })
    .required(),
});
export const updateProductSchema = yup.object({
  body: yup
    .object({
      sku: yup.string(),
      title: yup.string(),
      slug: yup.string(),
      totalQuantity: yup.number(),
      description: yup.string(),
      oldPrice: yup.number(),
      currentPrice: yup.number(),
      categoryUniqueId: yup.string().uuid(),
    })
    .required(),
  params: yup.object({
    uid: yup.string().uuid().required(), //uuid of the product
  }),
});

export const deleteProductSchema = yup.object({
  params: yup.object({
    uid: yup.string().uuid().required(),
  }),
});
export const getProductSchema = yup.object({
  params: yup.object({
    uid: yup.string().uuid().required(),
  }),
});

export const listProductSchema = yup.object({
  query: yup.object({
    page: yup.number().required(),
    limit: yup.number().required(),
    sortBy: yup.string(),
    sortAs: yup.string().oneOf(["DESC", "ASC"]),
    categoryUniqueId: yup.string().required(),
  }),
});
