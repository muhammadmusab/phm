-- Active: 1703704184946@@127.0.0.1@5432@phm@public
SELECT "SkuVariations"."ProductSkuId",
    json_agg(
        json_build_object(
            'uuid',
            ps."uuid",
            'oldPrice',
            ps."oldPrice",
            'currentPrice',
            ps."currentPrice",
            'quantity',
            ps."quantity",
            'sku',
            ps."sku",
            'ProductVariantValue',
            json_build_object(
                'uuid',
                pvv."uuid",
                'value',
                pvv."value"
            ),
            'variations',
            json_build_object(
                'uuid',
                sv."uuid"
            )
        )
    )
FROM "SkuVariations" as sv
    JOIN "ProductSkus" as ps ON sv."ProductSkuId" = ps."id"
    JOIN "ProductVariantValues" as pvv ON sv."ProductVariantValueId" = pvv."id"
WHERE sv."ProductId" = 2
GROUP BY sv."ProductSkuId";

-- 
SELECT ps.sku,ps."oldPrice",ps."currentPrice",ps.quantity,array_agg(json_build_object('uuid',pvv.uuid,'value',pvv."value",'skuVariantUniqueId',sv.uuid,'skuUniqueId',ps.uuid)) as "variantValues"
from "SkuVariations" as sv
    JOIN "ProductSkus" as ps ON sv."ProductSkuId" = ps."id"
    JOIN "ProductVariantValues" as pvv ON sv."ProductVariantValueId" = pvv."id"
WHERE sv."ProductId" = 2
GROUP BY "ProductSkuId",ps.sku,ps."oldPrice",ps."currentPrice",ps.quantity,ps.uuid;
-- 

