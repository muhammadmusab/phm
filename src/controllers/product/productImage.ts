import { Product } from "../../models/Product";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/api-errors";
import { getPaginated } from "../../utils/paginate";
import { ProductVariant } from "../../models/ProductVariant";
import { ProductImage } from "../../models/ProductImage";

export const Create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productUniqueId, variantUniqueId } = req.body;
  try {
    let product: any = null;
    let productVariant: any = null;

    product = await Product.scope("withId").findOne({
      where: {
        uuid: productUniqueId,
      },
      attributes: {
        include: ["id"],
      },
    });

    if (variantUniqueId) {
      productVariant = await ProductVariant.scope("withId").findOne({
        where: {
          uuid: variantUniqueId,
        },

        attributes: {
          include: ["id"],
        },
      });
    }
    if (!product) {
      res.status(403).send({
        message: "Product not found",
      });
      return;
    }

    let productImages: {
      imageUrl: string;
      imageAlt?: string;
      ProductVariantId?: number | null;
      ProductId: number;
    }[] = [];
    if (req.files && req.files?.length) {
      let filesArray = req.files as any[];
      filesArray.forEach((file) => {
        let imageObject: {
          imageUrl: string;
          ProductId: number;
          ProductVariantId?: number;
        } = {
          imageUrl: `${process.env.API_URL}media/${file.filename}`,
          ProductId: product.id,
        };
        if (productVariant && productVariant.id) {
          imageObject.ProductVariantId = productVariant.id;
        }
        productImages.push(imageObject);
      });
    }
    let where: { ProductId: string; ProductVariantId?: number } = {
      ProductId: product.id,
    };
    if (productVariant) {
      where["ProductVariantId"] = productVariant.id;
    }
    let images = await ProductImage.bulkCreate(productImages);
    images = await ProductImage.findAll({
      where,
    });

    if (images.length) {
      res.send(images);
    } else {
      res.status(403).send({ message: "Error, Bad Request" });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: error });
  }
};

export const Delete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { variantUniqueId } = req.query; // variant unique id if we want to narrow down image deleting to specific variant of the product and not all images of the product.
    const { uid } = req.params; // uid of the product which will all images related to it
    const productVariant = await ProductVariant.scope("withId").findOne({
      where: {
        uuid: variantUniqueId as string,
      },
      attributes: {
        include: ["id"],
      },
    });

    const product = await Product.scope("withId").findOne({
      where: {
        uuid: uid,
      },
      attributes: {
        include: ["id"],
      },
    });
    if (!product) {
      res.status(403).send({
        message: "Product not found",
      });
      return;
    }

    let where: { ProductId: number; ProductVariantId?: number } = {
      ProductId: product?.id as number,
    };
    if (productVariant) {
      where["ProductVariantId"] = productVariant.id;
    }

    const result = await ProductImage.destroy({
      where,
    });
    if (result === 1) {
      res.send({ message: "Success" });
    } else {
      const err = new BadRequestError("Bad Request");
      res.status(err.status).send({ message: err.message });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
export const List = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset } = getPaginated(req.query);
    // sortBy
    const sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
    const sortAs = req.query.sortAs ? (req.query.sortAs as string) : "DESC";

    const { productUniqueId, variantUniqueId } = req.query;

    const productVariant = await ProductVariant.scope("withId").findOne({
      where: {
        uuid: variantUniqueId as string,
      },
    });
    const product = await Product.scope("withId").findOne({
      where: {
        uuid: productUniqueId as string,
      },
    });
    const where: {
      ProductId?: number;
      ProductVariantId?: number;
    } = {};
    if (product?.id) {
      where.ProductId = product.id;
    }
    if (productVariant?.id) {
      where.ProductVariantId = productVariant.id;
    }

    const { count: total, rows: images } = await ProductImage.findAndCountAll({
      where,
      attributes: {
        exclude: ["ProductVariantId", "id", "ProductId"],
      },
      offset: offset,
      limit: limit,
      order: [[sortBy as string, sortAs]],
    });

    res.send({ message: "Success", data: images, total });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: error });
  }
};

const getData = (instance: any) => {
  delete instance.dataValues.id;
  delete instance.dataValues.CategoryId;
  return { data: instance };
};
const getDetailData = (instance: any) => {
  delete instance.dataValues.id;
  delete instance.dataValues.ProductId;
  return { data: instance };
};
