import type { Migration } from "../umguz";
import { DataTypes, Sequelize, UUIDV4 } from "sequelize";

export const up: Migration = async ({ context }: { context: Sequelize }) => {
  await context.getQueryInterface().createTable("VariantValue", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
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
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  });
};

export const down: Migration = async ({ context }: { context: Sequelize }) => {
  await context.getQueryInterface().dropTable("VariantValue");
};
