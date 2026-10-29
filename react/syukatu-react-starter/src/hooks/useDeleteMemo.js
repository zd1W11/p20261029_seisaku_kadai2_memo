import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMemo } from "../api/memoApi";
export default function useDeleteMemo() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (memoId) => deleteMemo(memoId),
    onSuccess: (_data, memoId) => {
      queryClient.removeQueries({ queryKey: ["memo", String(memoId)] });
      queryClient.invalidateQueries({ queryKey: ["memos"] });
    }
  });
  const deleteById = async (memoId) => {
    await mutateAsync(memoId);
  };
  return { deleteById, isDeleting: isPending };
}
