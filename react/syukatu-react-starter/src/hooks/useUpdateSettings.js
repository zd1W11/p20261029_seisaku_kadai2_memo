import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateItemSetting } from "../api/memoApi";
export function useUpdateItemSetting() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (s) => updateItemSetting(s),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["itemSettings"] })
  });
  return { updateItemSetting: mutateAsync, isUpdating: isPending };
}
