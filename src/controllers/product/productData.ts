import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/api-errors";
import { getValidUpdates } from "../../utils/validate-updates";

import { ProductData } from "../../models/ProductData";

export const Update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validUpdates = ["specifications", "highlights", "overview"];
    const validBody = getValidUpdates(validUpdates, req.body);
    const { uid } = req.params;
    const result = await ProductData.update(
      { ...validBody },
      {
        where: {
          uuid: uid,
        },
      }
    );
    if (!result[0]) {
      const err = new BadRequestError(
        "Could not update the product details data"
      );
      res.status(err.status).send({ message: err.message });
      return;
    }
    res.send({ message: "Success", data: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
const getData = (instance: any) => {
  delete instance.dataValues.id;
  delete instance.dataValues.ProductId;
  return { data: instance };
};
