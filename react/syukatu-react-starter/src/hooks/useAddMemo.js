import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { addMemo } from "../api/memoApi";
import currentUserAtom from "../atoms/currentUserAtom";
import currentSystemAtom from "../atoms/currentSystemAtom";
export default function useAddMemo() {
  const queryClient = useQueryClient();
  const currentUser = useAtomValue(currentUserAtom);
  const systemId = useAtomValue(currentSystemAtom);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (memo) => addMemo(memo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memos"] })
  });
  const buildMemo = (formData) => {
    // API に送信するデータ形式に変換（項目1〜50）
    const memo = {};
    for (let i = 1; i <= 50; i++) {
      const k = `item${String(i).padStart(2, "0")}`;
      memo[k] = formData[k] ?? "";
    }
    return memo;
  };
  const add = async (formData) => {
    const memo = buildMemo(formData);
    memo.systemId = systemId;
    memo.registeredBy = currentUser;
    memo.updatedBy = currentUser;
    await mutateAsync(memo);
  };
  return { add, isSaving: isPending };
}
