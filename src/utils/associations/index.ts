import { Auth } from "../../models/Auth";
import { User } from "../../models/User";

import { Token } from "../../models/Token";

import { Address } from "../../models/Address";
import { Category } from "../../models/Category";
import { Filter } from "../../models/Filter";
import { Product } from "../../models/Product";
import { ProductAttribute } from "../../models/ProductAttribute";
import { ProductData } from "../../models/ProductData";
import { ProductImage } from "../../models/ProductImage";
import { ProductReview } from "../../models/ProductReview";
import { ProductVariant } from "../../models/ProductVariant";
import { VariantValue } from "../../models/VariantValue";


User.hasMany(Auth);
Auth.belongsTo(User);

Auth.hasMany(Token);
Token.belongsTo(Auth);

// user profile related relations
User.hasMany(Address);
Address.belongsTo(User);

//-------self referencial tables---------

// relate a category to its parent:
Category.belongsTo(Category, {
  as: "parent",
  foreignKey: "parentId",
  targetKey: "id",
  onDelete: "CASCADE",
});

// relate parent to child Category:
Category.hasMany(Category, {
  as: "subCategories",
  foreignKey: "parentId",
  onDelete: "CASCADE",
});

// user profile related relations
Category.hasMany(Filter);
Filter.belongsTo(Category);//categoryId in filter table


// Product relations

Category.hasMany(Product);
Product.belongsTo(Category);//categoryId in Product table

Product.hasMany(ProductAttribute);
ProductAttribute.belongsTo(Product);//productId in ProductAttribute table

Product.hasMany(ProductData,{onDelete:'CASCADE'});
ProductData.belongsTo(Product);//productId in ProductData table

Product.hasMany(ProductReview,{onDelete:'CASCADE'});
ProductReview.belongsTo(Product);//productId in ProductReview table

Product.hasMany(ProductVariant ,{onDelete:'CASCADE'});
ProductVariant.belongsTo(Product);//productId in ProductVariant table

ProductVariant.hasMany(ProductImage,{onDelete:'CASCADE'});
ProductImage.belongsTo(ProductVariant);//productVariantId in ProductImage table


Product.hasMany(ProductImage,{onDelete:'CASCADE'});
ProductImage.belongsTo(Product);//ProductId in ProductImage table

ProductVariant.hasMany(VariantValue,{onDelete:'CASCADE'});
VariantValue.belongsTo(ProductVariant);//productVariantId in VariantValue table




