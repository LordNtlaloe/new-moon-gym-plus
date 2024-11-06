import { getAllProducts } from "@/app/_actions/_productsActions";
import { ProductsTable } from "@/components/products/ProductsTable/ProductsTable";
import { columns } from "@/components/products/ProductsTable/colums";


const getProducts = async () => {
  const data = await getAllProducts();
  return data;
};

const ProductsPage = async () => {
  const products = await getProducts();
  return (
    <section className="mx-1">
      <div className="">
        <div className="flex item-center justify-between mb-2">
          <h1 className="mb-3 md:text-3xl font-bold">Products</h1>
        </div>
        <div>
          <ProductsTable columns={columns} data={products} />
        </div>

      </div>

    </section>
  );
};

export default ProductsPage;