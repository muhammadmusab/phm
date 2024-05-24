import { sequelize } from "../config/db";
import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  UUIDV4,
} from "sequelize";
interface ProductDataModel
  extends Model<
    InferAttributes<ProductDataModel>,
    InferCreationAttributes<ProductDataModel>
  > {
  id?: CreationOptional<number>;
  uuid: CreationOptional<string>;
  specifications: object[];
  highlights: string[];
  overview: string;
  ProductId: number | null;
}
export const ProductData = sequelize.define<ProductDataModel>(
  "ProductData",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      unique: true,
    },
    specifications: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    highlights: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
    freezeTableName:true,
    defaultScope: {
      attributes: { exclude: ["id", "ProductId"] },
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
