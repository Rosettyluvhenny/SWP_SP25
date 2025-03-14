import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../api/serviceCategoryApi";

interface DeleteCategoryProps {
  id: string;
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({ id }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate(id)}
      className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
    >
      Delete
    </button>
  );
};

export default DeleteCategory;
