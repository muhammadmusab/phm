import { sequelize } from "../config/db";
import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  UUIDV4,
} from "sequelize";
interface ProductImageModel
  extends Model<
    InferAttributes<ProductImageModel>,
    InferCreationAttributes<ProductImageModel>
  > {
  id?: CreationOptional<number>;
  uuid: CreationOptional<string>;
  imageUrl: string|null;
  imageAlt?: CreationOptional<string>;
  ProductVariantId?: CreationOptional<number | null>;
  ProductId: number;
}
export const ProductImage = sequelize.define<ProductImageModel>(
  "ProductImage",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      unique: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageAlt: {
      type: DataTypes.STRING,
    },
    ProductVariantId: {
      type: DataTypes.INTEGER,
      references: {
        model: "ProductVariant",
        key: "id",
      },
    },
    ProductId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Products",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    defaultScope: {
      attributes: { exclude: ["id", "ProductVariantId", "ProductId"] },
    },
    scopes: {
      withId: {
        attributes: {
          exclude: [],
        },
      },
    },
  }
);
