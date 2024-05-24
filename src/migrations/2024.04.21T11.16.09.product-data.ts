import type { Migration } from "../umguz";
import { DataTypes, Sequelize, UUIDV4 } from "sequelize";

export const up: Migration = async ({ context }: { context: Sequelize }) => {
  await context.getQueryInterface().createTable("ProductData", {
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
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  });

  await context.getQueryInterface().addConstraint('ProductData', {
    fields: ['ProductId'],
    type: 'foreign key',
    name: 'ProductData_ProductId_fkey',
    references: {
      table: 'Products',
      field: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
};

export const down: Migration = async ({ context }: { context: Sequelize }) => {
  await context.getQueryInterface().dropTable("Tokens");
};
