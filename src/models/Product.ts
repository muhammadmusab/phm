import { sequelize } from "../config/db";
import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  UUIDV4,
} from "sequelize";
interface ProductModel
  extends Model<
    InferAttributes<ProductModel>,
    InferCreationAttributes<ProductModel>
  > {
  id?: CreationOptional<number>;
  uuid: CreationOptional<string>;
  sku: CreationOptional<string>;
  title: string;
  slug: string;
  description?: CreationOptional<string>;
  oldPrice?: CreationOptional<number>;
  currentPrice: number;
  totalQuantity: number;
  status?: CreationOptional<string>;
  CategoryId: number | null;
}
export const Product = sequelize.define<ProductModel>(
  "Product",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      unique: true,
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    oldPrice: {
      type: DataTypes.DECIMAL(12, 2),
    },
    currentPrice: { //base_price
      type: DataTypes.DECIMAL(12, 2),
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Categories",
        key: "id",
      },
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ["id", "CategoryId"] },
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
