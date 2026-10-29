import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { addCodeMaster, deleteCodeMaster, getCodeMasters, updateCodeMaster } from "../api/memoApi";
import currentSystemAtom from "../atoms/currentSystemAtom";
/**
 * コードマスタリストを取得するカスタムフック（使用システムの分）
 * 項目設定でコードIDが指定された項目のドロップダウン選択肢に使う
 */
export function useGetCodeMasters() {
  const systemId = useAtomValue(currentSystemAtom);
  const {
    data: codeMasters,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["codeMasters", systemId],
    queryFn: () => getCodeMasters(systemId),
    enabled: systemId != null
  });
  return { codeMasters, isLoading, isError };
}
export function useAddCodeMaster() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (c) => addCodeMaster(c),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["codeMasters"] })
  });
  return { addCodeMaster: mutateAsync, isAdding: isPending };
}
export function useUpdateCodeMaster() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (c) => updateCodeMaster(c),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["codeMasters"] })
  });
  return { updateCodeMaster: mutateAsync, isUpdating: isPending };
}
export function useDeleteCodeMaster() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (c) => deleteCodeMaster(c),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["codeMasters"] })
  });
  return { deleteCodeMaster: mutateAsync, isDeleting: isPending };
}
