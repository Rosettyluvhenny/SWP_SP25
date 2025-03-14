import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../api/serviceCategoryApi";

interface UpdateCategoryProps {
  id: string;
}

const UpdateCategory: React.FC<UpdateCategoryProps> = ({ id }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleUpdate = () => {
    const newName = prompt("Enter new category name:");
    if (newName) {
      mutation.mutate({ id, name: newName });
    }
  };

  return (
    <button
      onClick={handleUpdate}
      className="ml-2 px-3 py-1 bg-yellow-500 text-white rounded"
    >
      Update
    </button>
  );
};

export default UpdateCategory;
