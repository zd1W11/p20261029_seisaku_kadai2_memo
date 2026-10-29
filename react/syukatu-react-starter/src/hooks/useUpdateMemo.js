import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { updateMemo } from "../api/memoApi";
import currentUserAtom from "../atoms/currentUserAtom";
import currentSystemAtom from "../atoms/currentSystemAtom";
export default function useUpdateMemo() {
  const queryClient = useQueryClient();
  const currentUser = useAtomValue(currentUserAtom);
  const currentSystemId = useAtomValue(currentSystemAtom);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (memo) => updateMemo(memo),
    onSuccess: (_data, memo) => {
      queryClient.invalidateQueries({ queryKey: ["memo", String(memo.id)] });
      queryClient.invalidateQueries({ queryKey: ["memos"] });
    }
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
  const update = async (formData, memoId, systemId, version) => {
    const memo = buildMemo(formData);
    memo.id = Number(memoId);
    memo.systemId = systemId ?? currentSystemId;
    memo.updatedBy = currentUser;
    // 排他制御: 編集開始時点のバージョンを送り、サーバー側で一致を確認する
    memo.version = version;
    await mutateAsync(memo);
  };
  return { update, isUpdating: isPending };
}
