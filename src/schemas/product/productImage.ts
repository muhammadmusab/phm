import * as yup from "yup";

export const createProductImageSchema = yup.object({
  body: yup
    .object({
      productUniqueId: yup.string().uuid().required(),
      variantUniqueId: yup.string().uuid(),
    })
    .required(),
    // files: yup.array().min(1, 'File is required').required('File is required'),
});

export const deleteProductImageSchema = yup.object({
  params: yup.object({
    uid: yup.string().uuid().required(), //uuid of the product to delete the images
  }),
  query: yup.object({
    variantUniqueId: yup.string().uuid(), //uuid of the ProductImage
  }),
});

export const listProductImageSchema = yup.object({
  query: yup.object({
    page: yup.number().required(),
    limit: yup.number().required(),
    sortBy: yup.string(),
    sortAs: yup.string().oneOf(["DESC", "ASC"]),
    productUniqueId: yup.string().uuid().required(),
    variantUniqueId:yup.string().uuid()
  }),
});
