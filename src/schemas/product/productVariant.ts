import * as yup from "yup";

export const createProductVariantSchema = yup.object({
  body: yup
    .object({
      productUniqueId: yup.string().uuid().required(),
      type: yup.string().required(),
      value: yup.mixed().required(),
      variantSku: yup.string().required(),
      variantPrice: yup.number(),
      variantQuantity: yup.number().required(),
    })
    .required(),
});
export const updateProductVariantSchema = yup.object({
  body: yup
    .object({
        productUniqueId: yup.string().uuid().required(),
        type: yup.string(),
        value: yup.mixed(),
        variantSku: yup.string(),
        variantPrice: yup.number(),
        variantQuantity: yup.number(),
    })
    .required(),
  params: yup.object({
    uid: yup.string().uuid().required(), //uuid of the ProductVariant
  }),
});

export const deleteProductVariantSchema = yup.object({
  params: yup.object({
    uid: yup.string().uuid().required(), //uuid of the ProductVariant
  }),
});
export const getProductVariantSchema = yup.object({
  params: yup.object({
    uid: yup.string().uuid().required(),
  }),
});

export const listProductVariantSchema = yup.object({
  query: yup.object({
    page: yup.number().required(),
    limit: yup.number().required(),
    sortBy: yup.string(),
    sortAs: yup.string().oneOf(["DESC", "ASC"]),
    productUniqueId: yup.string().required(),
  }),
});
