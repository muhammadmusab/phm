import { Category } from "../../models/Category";
import { Product } from "../../models/Product";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/api-errors";
import { getValidUpdates } from "../../utils/validate-updates";
import { getPaginated } from "../../utils/paginate";
import { ProductVariant } from "../../models/ProductVariant";
import { VariantValue } from "../../models/VariantValue";
import { sequelize } from "../../config/db";

export const Create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      productUniqueId,
      type,
      value,
      variantSku,
      variantPrice,
      variantQuantity,
    } = req.body;

    const product = await Product.scope("withId").findOne({
      where: {
        uuid: productUniqueId,
      },
      include: {
        attributes: ["id"],
      },
    });

    if (product?.id) {
      // SOME variants DONT have any price , so we set the current price of product as variant price, like the color of the shirt will follow same price as of the base or current price of the product.
      if (!variantPrice) {
        variantPrice = product.currentPrice as number;
      }
      if (product.totalQuantity < variantQuantity) {
        return res.status(403).send({
          message:
            "Variant quantity should be less than total quantity of the product",
        });
      }
      //FIND ALL VARIANTS OF A PRODUCT
      const productVariants = await ProductVariant.findAll({
        where: {
          ProductId: product.id,
        },
        include: ["id"],
      });

      const productVariantIds = productVariants.map((item) => item.id);

      const variantValues:any = await VariantValue.findAll({
        where: {
          ProductVariantId: productVariantIds as number[],
        },
        attributes: [
          [
            sequelize.fn("sum", sequelize.col("variantQuantity")),
            "totalVariantQuantity",
          ],
        ],
      });
      //   if any of the variant value has greater quantity than the product total quantity
      //@ts-ignore
      if (
        variantValues.length &&
        variantValues[0].totalVariantQuantity > product.totalQuantity
      ) {
        return res.status(403).send({
          message:
            "Variant quantity should be less than total quantity of the product",
        });
      }

      const productVariantType = await ProductVariant.create({
        type,
        ProductId: product.id,
      });
      const productVariantValue = await VariantValue.create({
        value,
        variantPrice,
        variantQuantity,
        variantSku,
        ProductVariantId: productVariantType.id,
      });
      res.status(201).send({
        message: "Success",
        data: {
          type: productVariantType.type,
          productUniqueId,
          variantPrice: productVariantValue.variantPrice,
          variantQuantity: productVariantValue.variantQuantity,
          variantSku: productVariantValue.variantSku,
        },
      });
    } else {
      res.status(403).send({ message: "Error, Bad Request" });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: error });
  }
};
export const Update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validUpdates = [
      "type",
      "value",
      "variantSku",
      "variantPrice",
      "variantQuantity",
      "variantValueUniqueId",
    ];
    const validBody = getValidUpdates(validUpdates, req.body);
    const productUniqueId = req.body.productUniqueId; // product unique id is must to verify totalQuantity with the variant quantity
    const { uid } = req.params; // uid of the ProductVariant and not the VariantValue

    const product = await Product.scope("withId").findOne({
      where: {
        uuid: productUniqueId,
      },
      include: {
        attributes: ["id", "totalQuantity"],
      },
    });

    if (validBody.variantQuantity) {
      if (product && product.totalQuantity < validBody.variantQuantity) {
        return res.status(403).send({
          message:
            "Variant quantity should be less than total quantity of the product",
        });
      }

      //FIND ALL VARIANTS OF A PRODUCT
      const productVariants = await ProductVariant.findAll({
        where: {
          ProductId: product?.id,
        },
        include: ["id"],
      });

      const productVariantIds = productVariants.map((item) => item.id);

      const variantValues:any = await VariantValue.findAll({
        where: {
          ProductVariantId: productVariantIds as number[],
        },
        attributes: [
          [
            sequelize.fn("sum", sequelize.col("variantQuantity")),
            "totalVariantQuantity",
          ],
        ],
      });

      //   if any of the variant value has greater quantity than the product total quantity
      //@ts-ignore
      if (
        variantValues.length && product && 
        variantValues[0].totalVariantQuantity > product?.totalQuantity
      ) {
        return res.status(403).send({
          message:
            "Variant quantity should be less than total quantity of the product",
        });
      }
    }

    if (validBody.type) {
      const productVariant = await ProductVariant.update(
        {
          type: validBody.type,
        },
        {
          where: {
            uuid: uid, // uid of productVariant
          },
        }
      );
      if (!productVariant[0]) {
        const err = new BadRequestError("Could not update the product variant");
        res.status(err.status).send({ message: err.message });
        return;
      }
    }

    const variantValue = await VariantValue.findOne({
      where: {
        uuid: validBody.variantValueUniqueId,
      },
      include: {
        attributes: ["id"],
      },
    });

    delete validBody.variantValueUniqueId;

    const result = await VariantValue.update(
      { ...validBody },
      {
        where: {
          ProductVariantId: variantValue?.id,
        },
      }
    );
    if (!result[0]) {
      const err = new BadRequestError(
        "Could not update the product variant value"
      );
      res.status(err.status).send({ message: err.message });
      return;
    }
    res.send({ message: "Success", data: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
export const Delete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uid } = req.params; // uid of the product variant which will delete its value along with it.

    const result = await ProductVariant.destroy({
      where: {
        uuid: uid,
      },
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
export const Get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req.params; // uuid of the product variant NOT the variant values

    const productVariant = await ProductVariant.scope("withId").findOne({
      where: {
        uuid: uid,
      },
    });

    const productVariantValues = await VariantValue.findAll({
      where: {
        ProductVariantId: productVariant?.id,
      },
    });

    if (productVariant?.uuid && productVariant.uuid) {
      res.send({
        message: "Success",
        data: {
          type: productVariant?.type,
          values: productVariantValues,
        },
      });
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

    const productVariant = await ProductVariant.scope("withId").findOne({
      where: {
        uuid: req.query.productUniqueId as string,
      },
    });

    const { count: total, rows: products } = await VariantValue.findAndCountAll(
      {
        where: {
          ProductVariantId: productVariant?.id,
        },
        attributes: {
          exclude: ["ProductVariantId", "id"],
        },
        offset: offset,
        limit: limit,
        order: [[sortBy as string, sortAs]],
      }
    );

    res.send({ message: "Success", data: products, total });
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
