import { getAllCategories } from "@/app/_actions/_categoryActions";
import { CategoriesTable } from "@/components/category/CategoriesTable/CategoriesTable";
import { columns } from "@/components/category/CategoriesTable/columns";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AddNewCategoryButton from "@/components/category/AddNewCategoryButton";


const getCategories = async () => {
  const data = await getAllCategories();
  return data;
};

const CategoriesPage = async () => {
  const categories = await getCategories();
  return (
    <section className="mx-1">
      <div className="">
        <div className="flex item-center justify-between mb-2">
          <h1 className="mb-3 md:text-3xl font-bold">Categories</h1>
        </div>
        <div>
          <CategoriesTable columns={columns} data={categories} />
        </div>

      </div>

    </section>
  );
};

export default CategoriesPage;