import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api/serviceCategoryApi";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] }); 
      setName(""); 
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={mutation.status === "pending"}
      >
        {mutation.status === "pending" ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
};

export default CreateCategory;
