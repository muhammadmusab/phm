import { Auth } from "../../models/Auth";
import { User } from "../../models/User";
import { Token } from "../../models/Token";
import { Address } from "../../models/Address";
import { Category } from "../../models/Category";
import { Filter } from "../../models/Filter";
import { Product } from "../../models/Product";
import { ProductSkus } from "../../models/ProductSku";

import { ProductImage } from "../../models/ProductImage";
import { ProductReview } from "../../models/ProductReview";
import { ProductVariantType } from "../../models/ProductVariantType";
import { ProductTypes } from "../../models/ProductType";
import { ProductVariantValues } from "../../models/ProductVariantValue";
import { SkuVariations } from "../../models/SkuVariation";

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
Filter.belongsTo(Category); //categoryId in filter table

//-------------------Product relations
Category.hasMany(Product);
Product.belongsTo(Category); //categoryId in Product table

// ----PRODUCT VARIANT TYPE
// product and product variant type relation
Product.hasMany(ProductVariantType, { onDelete: "CASCADE" });
ProductVariantType.belongsTo(Product); //productId in ProductVariantType table


ProductTypes.hasMany(ProductVariantType, { onDelete: "CASCADE" });
ProductVariantType.belongsTo(ProductTypes); //productTypeId in ProductVariantType table

//-----PRODUCT VARIANT VALUE
// product variant type and product variant value relation
ProductVariantType.hasMany(ProductVariantValues, { onDelete: "CASCADE" });
ProductVariantValues.belongsTo(ProductVariantType); //ProductVariantTypeId in ProductVariantValues table

//----IMAGE:  product and product variant value relation with Image
Product.hasMany(ProductImage, { onDelete: "CASCADE" });
ProductImage.belongsTo(Product); //ProductId in ProductImage table
ProductVariantValues.hasMany(ProductImage, { onDelete: "CASCADE" });
ProductImage.belongsTo(ProductVariantValues); //productVariantValueId in ProductImage table

//--- REVIEWS
// review relation with product and ProductSkus.
Product.hasMany(ProductReview, { onDelete: "CASCADE" });
ProductReview.belongsTo(Product); //productId in ProductReview table

//change this relation from ProductSkus to Sku_Variation table later when table is created-------

ProductSkus.hasMany(ProductReview, { onDelete: "CASCADE" });
ProductReview.belongsTo(ProductSkus); //ProductSkuId in ProductReview Table

//---- PRODUCT SKU TABLE
// ProductSkus relation with product
Product.hasMany(ProductSkus, { onDelete: "CASCADE" });
ProductSkus.belongsTo(Product); //productId in ProductSkus table

//---- SKU VARIATION TABLE (ProductId,ProductSkuId,ProductVariantValueId) in variation table
ProductSkus.hasMany(SkuVariations, { onDelete: "CASCADE" });
SkuVariations.belongsTo(ProductSkus); //ProductSkuId in SkuVariations table

ProductVariantValues.hasMany(SkuVariations, { onDelete: "CASCADE" });
SkuVariations.belongsTo(ProductVariantValues); //ProductVariantValueId in SkuVariations table

Product.hasMany(SkuVariations, { onDelete: "CASCADE" });
SkuVariations.belongsTo(Product); //ProductId in SkuVariations table
