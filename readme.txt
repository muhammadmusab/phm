node migrate --help # show CLI help

node migrate up # apply migrations
node migrate down # revert the last migration
node migrate down --to 0 # revert all migrations
node migrate up --step 2 # run only two migrations

first time:
node migrate create --name my-migration.js --folder ./migrations # create a new folder & migration file

subsequent times:
node migrate create --name my-migration.ts  # create a new migration file OR npm run migrate:create:dev "file-name.ts"

//to pass argument in cmd
//npm run create-migration -- --name my-migration.ts


//to run up migration command for UP or DOWN action for particular file do the following : 
node migrate up --name "migration-file-name.ts"



//
node migrate up --name "2023.01.29T12.23.52.auth.ts"


--------------------------------Seeders-----------------------
# show help for each script
node migrate --help
node seed --help

node seed up # will fail, since tables haven't been created yet

node migrate up # creates tables
node seed up # inserts seed data

node seed down --to 0 # removes all seed data

node seed create --name more-seed-data.ts # create a placeholder migration file for inserting more seed data.






----continue from here

https://www.noon.com/uae-en/omen-gaming-laptop-with-16-1-inch-display-core-i5-13500hx-processor-32gb-ram-2tb-ssd-8gb-nvidia-geforce-rtx-4060-graphics-card-windows-11-english-black/N70064265V/p/?o=b444aed048e79a5e


https://www.noon.com/uae-en/galaxy-s24-ultra-dual-sim-titanium-black-12gb-ram-512gb-5g-middle-east-version/N70035269V/p/?o=abc203442556d71e


https://www.noon.com/uae-en/2-pack-logo-crew-neck-t-shirt/ZC2A72A4E6F29267F7B6AZ/p/?o=zc2a72a4e6f29267f7b6az-1



















You add the values to the attribute_sku pivot table.
So if you have a product with two attributes (size and colour) then you’d store the values for each SKU and attribute combination in the pivot table:

PRODUCT SKU_ID=1
total Quantity=50
red=1 , total Quantity=30
blue=2, total Quantity=20

small=3, total Quantity=10
medium=4, total Quantity=20
large=5 total Quantity=20


PRODUCT SKU_ID=2
total Quantity=60
red=1 , total Quantity=40
blue=2, total Quantity=20

small=3, total Quantity=20
medium=4, total Quantity=20
large=5 total Quantity=20
+--------+---------------+--------+--------+----------+
| sku_id |  attribute_id | value  | price  | Quantity |	
+--------+---------------+--------+--------+----------+
| 1      | 1             | red    | null   |30        |
| 1      | 3             | small  | 10	   |10        |
| 1      | 2             | blue   | null   |20        |
| 1      | 4             | medium | 20	   |20        |
| 1      | 5             | large  | 30     |20        |
| 2      | 1             | red    | null   |40        |
| 2      | 3             | small  | 10	   |20        |
| 2      | 2             | blue   | null   |20        |
| 2      | 4             | medium | 20	   |20        |
| 2      | 5             | large  | 30     |20        |
+--------+---------------+--------+--------+----------+

So if attribute 1 is color, and attribute 2 is size, then:

-SKU 1 is a red, small T-shirt

-SKU 2 is a red, medium T-shirt

-SKU 3 is a red, large T-shirt

-SKU 4 is a blue, small T-shirt
