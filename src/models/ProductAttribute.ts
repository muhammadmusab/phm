import { sequelize } from "../config/db";
import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  UUIDV4,
} from "sequelize";
interface ProductAttributeModel
  extends Model<
    InferAttributes<ProductAttributeModel>,
    InferCreationAttributes<ProductAttributeModel>
  > {
  id?: CreationOptional<number>;
  uuid: CreationOptional<string>;
  name: string; // 'weight' | 'Display Type' 
  value: string|number; // '10gram' | 'Qled' 
  ProductId: number | null;
}
export const ProductAttribute = sequelize.define<ProductAttributeModel>(
  "ProductAttribute",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      unique: true,
    },
    name: {
      // 'weight' | 'Display Type' 
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      // '10gram' | 'Qled' 
      type: DataTypes.STRING,
      allowNull: false,
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
