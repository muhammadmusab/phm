import { Category } from "../../models/Category";
import { Product } from "../../models/Product";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/api-errors";
import { getValidUpdates } from "../../utils/validate-updates";
import { getPaginated } from "../../utils/paginate";
import { ProductData } from "../../models/ProductData";
import { ProductVariant } from "../../models/ProductVariant";
import { VariantValue } from "../../models/VariantValue";
import { ProductAttribute } from "../../models/ProductAttribute";
import { ProductImage } from "../../models/ProductImage";
export const Create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      sku, //model number (following noon.com)
      title, //brand
      totalQuantity,
      description,
      oldPrice = null,
      currentPrice,
      categoryUniqueId,
      attributes,
      specifications,
      overview,
      highlights,
    } = req.body;

    const body = {
      sku,
      title,
      slug: description
        .replaceAll(" ", "-")
        .replaceAll("/", "-")
        .replaceAll(",", "-"),
      totalQuantity,
      description,
      oldPrice,
      currentPrice,
    };

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
      body["CategoryId"] = category.id as string;
    }

    const product = await Product.create(body);

    let productAttributes: any = null;
    if (attributes && attributes.length) {
      const productAttributeValues = attributes.map((item: any) => ({
        name: item.name,
        value: item.value,
        ProductId: product.id,
      }));

      productAttributes = await ProductAttribute.bulkCreate(
        productAttributeValues
      );

      productAttributes = await ProductAttribute.findAll({
        where: {
          ProductId: product?.id,
        },
      });
    }

    const productData = await ProductData.create({
      ProductId: product?.id,
      highlights: highlights,
      overview: overview,
      specifications: specifications,
    });

    const { data } = getData(product);

    const { data: productDetail } = getDetailData(productData);

    res.status(201).send({
      message: "Success",
      data: { ...data, productDetail, productAttributes },
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
    const validUpdates = [
      "sku",
      "title",
      "slug",
      "totalQuantity",
      "description",
      "oldPrice",
      "currentPrice",
      "categoryUniqueId",
    ];
    const validBody = getValidUpdates(validUpdates, req.body);
    const { uid } = req.params;
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
  } catch (error:any) {

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
            exclude: ["id","parentId"],
          },
        },
        {
          model: ProductData,
          attributes: {
            exclude: ["id", "ProductId"],
          },
        },
        {
          model: ProductImage,
          attributes: {
            exclude: ["id", "ProductId"],
          },
        },
        {
          model: ProductVariant,

          attributes: {
            exclude: ["id", "ProductId"],
          },
          include: [
            {
              model: VariantValue,

              attributes: {
                exclude: ["id", "ProductVariantId"],
              },
            },
          ],
        },
        {
          model: ProductAttribute,
          attributes: {
            exclude: ["id", "ProductId"],
          },
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
      // attributes: {
      //   exclude: ["CategoryId", "id"],
      // },
      include: [
        {
          model: Category,
          attributes: {
            exclude: ["id","parentId"],
          },
        },
        {
          model: ProductImage,
          attributes: {
            exclude: ["id","ProductId"],
          },
        },
        {
          model: ProductVariant,
          attributes: {
            exclude: ["id", "ProductId"],
          },
          include: [
            {
              model: VariantValue,
              attributes: {
                exclude: ["id", "ProductVariantId"],
              },
            },
          ],
        },
        {
          model: ProductData,
          attributes: {
            exclude: ["id", "ProductId"],
          },
        },
        {
          model: ProductAttribute,
          attributes: {
            exclude: ["id", "ProductId"],
          },
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
const getDetailData = (instance: any) => {
  delete instance.dataValues.id;
  delete instance.dataValues.ProductId;
  return { data: instance };
};
