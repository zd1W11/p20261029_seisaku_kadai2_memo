import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addSystem, deleteSystem, getSystems, updateSystem } from "../api/memoApi";
/**
 * システム設定（アプリ種別）の取得・追加・編集・削除フック
 */
export function useGetSystems() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["systems"],
    queryFn: getSystems
  });
  return { systems: data, isLoading, isError };
}
export function useAddSystem() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (system) => addSystem(system),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["systems"] })
  });
  return { addSystem: mutateAsync, isAdding: isPending };
}
export function useUpdateSystem() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (system) => updateSystem(system),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["systems"] })
  });
  return { updateSystem: mutateAsync, isUpdating: isPending };
}
export function useDeleteSystem() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id) => deleteSystem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["systems"] });
      queryClient.invalidateQueries({ queryKey: ["memos"] });
      queryClient.invalidateQueries({ queryKey: ["itemSettings"] });
    }
  });
  return { deleteSystem: mutateAsync, isDeleting: isPending };
}
