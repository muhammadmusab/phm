import * as yup from "yup";

export const updateProductDataSchema = yup.object({
  body: yup
    .object({
      specifications: yup.array(yup.object()),
      highlights: yup.array(yup.string()),
      overview: yup.string(),
    })
    .required(),
  params: yup.object({
    uid: yup.string().uuid().required(), //uuid of the product
  }),
});
