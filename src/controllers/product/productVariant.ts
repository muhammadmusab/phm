import { Category } from "../../models/Category";
import { Product } from "../../models/Product";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/api-errors";
import { getValidUpdates } from "../../utils/validate-updates";
import { getPaginated } from "../../utils/paginate";
import { ProductVariantType } from "../../models/ProductVariantType";
import { ProductVariantValues } from "../../models/ProductVariantValue";
import { SkuVariations } from "../../models/SkuVariation";
import { ProductSkus } from "../../models/ProductSku";
import { ProductImage } from "../../models/ProductImage";
import { QueryTypes, Sequelize } from "sequelize";
import { ProductTypes } from "../../models/ProductType";
import { sequelize } from "../../config/db";

export const Create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { productVariantTypeUniqueId, value } = req.body;

    const productVariantType = await ProductVariantType.scope("withId").findOne(
      {
        where: {
          uuid: productVariantTypeUniqueId,
        },
      }
    );
    if (!productVariantType) {
      return res.status(403).send({ message: "Variant Type not found" });
    }

    //3. Create Variant Value
    const productVariantValue = await ProductVariantValues.create({
      value,
      ProductVariantTypeId: productVariantType.id,
    });

    delete productVariantType.dataValues.id;
    delete productVariantType.dataValues.ProductTypeId;
    delete productVariantValue.dataValues.id;
    delete productVariantValue.dataValues.ProductVariantTypeId;

    res.send({
      message: "Success",
      data: {
        productVariantType,
        productVariantValue,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: error });
  }
};
export const AssignVariants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { productVariantValueUniqueId, productSkuUniqueId, productUniqueId } =
      req.body;

    //continue after this

    const productVariantValue = await ProductVariantValues.scope(
      "withId"
    ).findOne({
      where: {
        uuid: productVariantValueUniqueId,
      },
    });
    if (!productVariantValue) {
      return res.status(403).send({ message: "Variant Value not found" });
    }
    const productSku = await ProductSkus.scope("withId").findOne({
      where: {
        uuid: productSkuUniqueId,
      },
    });
    if (!productSku) {
      return res.status(403).send({ message: "Product Sku not found" });
    }
    const product = await Product.scope("withId").findOne({
      where: {
        uuid: productUniqueId,
      },
    });
    if (!product) {
      return res.status(403).send({ message: "Product not found" });
    }

    const skuVariantion = await SkuVariations.create({
      ProductVariantValueId: productVariantValue.id,
      ProductSkuId: productSku.id,
      ProductId: product.id,
    });

    delete skuVariantion.dataValues.id;
    delete skuVariantion.dataValues.ProductId;
    delete skuVariantion.dataValues.ProductVariantValueId;
    delete skuVariantion.dataValues.ProductSkuId;
    res.send({
      message: "Success",
      data: skuVariantion,
    });
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
    const validUpdates = ["value"];
    const validBody = getValidUpdates(validUpdates, req.body);
    const { uid } = req.params;

    const productVariantValue = await ProductVariantValues.update(
      {
        ...validBody,
      },
      {
        where: {
          uuid: uid, // uid of the productVariant table
        },
      }
    );
    if (!productVariantValue[0]) {
      const err = new BadRequestError(
        "Could not update the product variant value"
      );
      res.status(err.status).send({ message: err.message });
      return;
    }
    res.send({ message: "Success", data: productVariantValue });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
export const Get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req.params;

    const productVariantValue = await ProductVariantValues.findOne({
      where: {
        uuid: uid, // uid of the productSkus table
      },
    });

    res.send({ message: "Success", data: productVariantValue });
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
    const { uid } = req.params;

    const result = await ProductVariantValues.destroy({
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

export const List = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // sortBy
    const sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
    const sortAs = req.query.sortAs ? (req.query.sortAs as string) : "DESC";

    const { uid } = req.params; // uid

    const productVariantType = await ProductVariantType.scope("withId").findOne(
      {
        where: {
          uuid: uid as string,
        },
      }
    );

    const productVariantvalues = await ProductVariantValues.findAll({
      where: {
        ProductVariantTypeId: productVariantType?.id,
      },
      order: [[sortBy as string, sortAs]],
    });

    res.send({ message: "Success", data: productVariantvalues });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: error });
  }
};

export const AssignedList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // sortBy
    const sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
    const sortAs = req.query.sortAs ? (req.query.sortAs as string) : "DESC";

    const { uid } = req.params; // uid

    const product = await Product.scope("withId").findOne({
      where: {
        uuid: uid as string,
      },
      attributes: ["uuid", "id"],
    });

    let data = null;
    if (req.query.separate==='true') {
      data = await SkuVariations.findAll({
        where: {
          ProductId: product?.id,
        },
        include: [
          {
            model: ProductSkus,
            attributes: {
              exclude: ["id","ProductId"],
            },
          },
          {
            model: ProductVariantValues,
            attributes: {
              exclude: ["id","ProductVariantTypeId"],
            },
          },
        ],
      });
    } else {
      const query = `
                SELECT ps.sku,ps."oldPrice",ps."currentPrice",ps.quantity,array_agg(json_build_object('uuid',pvv.uuid,'value',pvv."value",'skuVariantUniqueId',sv.uuid,'skuUniqueId',ps.uuid)) as "variantValues"
                from "SkuVariations" as sv
                    JOIN "ProductSkus" as ps ON sv."ProductSkuId" = ps."id"
                    JOIN "ProductVariantValues" as pvv ON sv."ProductVariantValueId" = pvv."id"
                WHERE sv."ProductId" = ${product?.id}
                GROUP BY "ProductSkuId",ps.sku,ps."oldPrice",ps."currentPrice",ps.quantity,ps.uuid;
                `;

      const [results, metadata] = await sequelize.query(query, {
        type: QueryTypes.RAW,
      });

      data = results;
    }

    res.send({ message: "Success", data });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
