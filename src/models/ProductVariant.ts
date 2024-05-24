import { sequelize } from "../config/db";
import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  UUIDV4,
} from "sequelize";
interface ProductVariantModel
  extends Model<
    InferAttributes<ProductVariantModel>,
    InferCreationAttributes<ProductVariantModel>
  > {
  id?: CreationOptional<number>;
  uuid: CreationOptional<string>;
  type: string; // 'ssd' | 'ram' | 'color' | 'size'
  ProductId: number | null;
}
export const ProductVariant = sequelize.define<ProductVariantModel>(
  "ProductVariant",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      unique: true,
    },
    type: {
      // 'ssd' | 'ram' | 'color' | 'size'
      type: DataTypes.STRING,
      allowNull: false,
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull:false,
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
