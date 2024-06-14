import { Category } from "../../models/Category";
import { Product } from "../../models/Product";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/api-errors";
import { getValidUpdates } from "../../utils/validate-updates";
import { getPaginated } from "../../utils/paginate";

import { ProductSkus } from "../../models/ProductSku";
import { ProductImage } from "../../models/ProductImage";
import { SkuVariations } from "../../models/SkuVariation";

export const Create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      status,
      baseQuantity = null,
      basePrice = null,
      oldPrice = null,
      sku = null, //model number (following noon.com)
      brand, //brand
      categoryUniqueId,
      overview,
      highlights,
      multipart,
      specifications,
    } = req.body;

    const body: {
      title: string;
      status?: string;
      baseQuantity?: number;
      basePrice?: number;
      oldPrice?: number;
      sku?: string;
      slug: string;
      brand: string;
      CategoryId?: number | null;
      overview: string;
      highlights: string[];
      multipart: any;
      specifications: Record<string, any>[];
    } = {
      specifications,
      highlights,
      overview,
      multipart: req.body.multipart === true ? true : false,
      brand,
      slug: title
        .replaceAll(" ", "-")
        .replaceAll("/", "-")
        .replaceAll(",", "-"),
      title,
    };
    if (status) {
      body["status"] = status;
    }
    if (!body.multipart) {
      body.basePrice = basePrice;
      body.oldPrice = oldPrice;
      body.baseQuantity = baseQuantity;
      body.sku = sku;
    } else if (
      body.multipart &&
      (body.basePrice || body.oldPrice || body.baseQuantity || body.sku)
    ) {
      return res.status(403).send({
        message:
          "You can't set base price and base quantity for product with variant",
        data: null,
      });
    }

    const category = await Category.scope("withId").findOne({
      where: {
        uuid: categoryUniqueId,
      },
      attributes: {
        include: ["id"],
      },
    });

    if (category?.id) {
      //@ts-ignore
      body.CategoryId = category.id as string;
    }
    const product = await Product.create({ ...body });

    const { data } = getData(product);

    res.status(201).send({
      message: "Success",
      data: { ...data },
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};
export const Update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uid } = req.params;
    const product = await Product.findOne({
      where: {
        uuid: uid,
      },
    });
    if (!product) {
      return res.status(404).send({
        message: "Product Not Found",
        data: null,
      });
    } else if (
      product.multipart &&
      (req.body.basePrice ||
        req.body.oldPrice ||
        req.body.baseQuantity ||
        req.body.sku)
    ) {
      return res.status(403).send({
        message:
          "You can't set base price and base quantity for product with variant",
        data: null,
      });
    }
    const validUpdates = [
      "title",
      "status",
      "baseQuantity",
      "basePrice",
      "oldPrice",
      "sku",
      "brand",
      "categoryUniqueId",
      "overview",
      "highlights",
    ];
    const validBody = getValidUpdates(validUpdates, req.body);

    // if we want to change the parent of the current category
    if (req.body.categoryUniqueId) {
      const category = await Category.scope("withId").findOne({
        where: {
          uuid: req.body.categoryUniqueId,
        },
        include: ["id"],
      });
      validBody.CategoryId = category?.id;
    }
    const result = await Product.update(
      { ...validBody },
      {
        where: {
          uuid: uid,
        },
      }
    );
    if (!result[0]) {
      const err = new BadRequestError("Could not update the product data");
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
    const { uid } = req.params;

    const result = await Product.destroy({
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
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};
export const Get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req.params;

    const product = await Product.scope("withId").findOne({
      where: {
        uuid: uid,
      },
      include: [
        {
          model: Category,
          // as: "parent",
          attributes: {
            exclude: ["id", "parentId"],
          },
        },
        {
          model: ProductImage,
          attributes: {
            exclude: ["id", "ProductId", "ProductVariantValueId"],
          },
        },
        {
          model: ProductSkus,

          attributes: {
            exclude: ["id", "ProductId"],
          },
          include: [
            {
              model: SkuVariations,

              attributes: {
                exclude: ["id", "ProductVariantValueId", "ProductSkuId"],
              },
            },
          ],
        },
      ],
    });
    if (!product) {
      const err = new BadRequestError("Data Not Found");
      res.status(err.status).send({ message: err.message });
      return;
    }

    const { data } = getData(product);
    if (data?.uuid) {
      res.send({ message: "Success", data });
    } else {
      const err = new BadRequestError("Bad Request");
      res.status(err.status).send({ message: err.message });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
export const List = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset } = getPaginated(req.query);
    // sortBy
    const sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
    const sortAs = req.query.sortAs ? (req.query.sortAs as string) : "DESC";

    const category = await Category.scope("withId").findOne({
      where: {
        uuid: req.query.categoryUniqueId as string,
      },
    });

    const { count: total, rows: products } = await Product.findAndCountAll({
      where: {
        CategoryId: category?.id,
      },
      include: [
        {
          model: Category,
          // as: "parent",
          attributes: {
            exclude: ["id", "parentId"],
          },
        },
        {
          model: ProductImage,
          attributes: {
            exclude: ["id", "ProductId", "ProductVariantValueId"],
          },
        },
        {
          model: ProductSkus,

          attributes: {
            exclude: ["id", "ProductId"],
          },
          include: [
            {
              model: SkuVariations,

              attributes: {
                exclude: ["id", "ProductVariantValueId", "ProductSkuId","ProductId"],
              },
            },
          ],
        },
      ],
      offset: offset,
      limit: limit,
      order: [[sortBy as string, sortAs]],
    });

    res.send({ message: "Success", data: products, total });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: error });
  }
};

const getData = (instance: any) => {
  delete instance.dataValues.id;
  delete instance.dataValues.CategoryId;
  return { data: instance.dataValues };
};
