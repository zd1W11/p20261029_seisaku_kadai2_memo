import { useQuery } from "@tanstack/react-query";
import { getMemos } from "../api/memoApi";
import { useAtomValue } from "jotai";
import currentSystemAtom from "../atoms/currentSystemAtom";
/**
 * メモ一覧を取得する
 * searchConditions - 検索条件オブジェクト（例: { 3: { value: "x" }, 5: { from: "a", to: "b" } }）。
 * 空の場合は絞り込みなし。
 */
export default function useGetMemos(searchConditions) {
  const systemId = useAtomValue(currentSystemAtom);
  const search =
    searchConditions && Object.keys(searchConditions).length > 0 ? JSON.stringify(searchConditions) : null;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["memos", systemId, search],
    queryFn: () => getMemos(systemId, search),
    enabled: systemId != null
  });
  return { memos: data, isLoading, isError };
}
