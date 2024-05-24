import { sequelize } from "../config/db";
import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  UUIDV4,
} from "sequelize";
interface VariantValueModel
  extends Model<
    InferAttributes<VariantValueModel>,
    InferCreationAttributes<VariantValueModel>
  > {
  id?: CreationOptional<number>;
  uuid: CreationOptional<string>;
  variantPrice: number;
  variantQuantity: number;
  value: string;
  variantSku: string;
  ProductVariantId: number | null;
}
export const VariantValue = sequelize.define<VariantValueModel>(
  "VariantValue",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      unique: true,
    },
    variantSku: {
      type: DataTypes.STRING,
    },
    variantPrice: {
      type: DataTypes.DECIMAL(12, 2), // variantPrice can be null if for some variant value it is same as basePrice (which is in product table)
    },
    variantQuantity: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull:false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    ProductVariantId: {
      type: DataTypes.INTEGER,
      references: {
        model: "ProductVariant",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    defaultScope: {
      attributes: { exclude: ["id", "ProductVariantId"] },
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
