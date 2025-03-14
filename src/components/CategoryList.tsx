import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/serviceCategoryApi";
import DeleteCategory from "./DeleteCategory";
import UpdateCategory from "./UpdateCategory";

// Define Category Type
interface Category {
  id: string;
  name: string;
}

const CategoryList = () => {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p>Error loading categories</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">Category List</h2>
      <ul className="space-y-2">
        {categories?.map((category) => (
          <li
            key={category.id}
            className="border p-2 flex justify-between items-center"
          >
            {category.name}
            <div>
              <UpdateCategory id={category.id} />
              <DeleteCategory id={category.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
