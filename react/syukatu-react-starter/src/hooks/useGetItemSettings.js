import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { getItemSettings } from "../api/memoApi";
import currentSystemAtom from "../atoms/currentSystemAtom";
/**
 * 項目設定リストを取得するカスタムフック
 * 表示項目名などはこの設定から取得する（staleTime は短め: 設定画面で変更されるため）
 */
export function useGetItemSettings() {
  const systemId = useAtomValue(currentSystemAtom);
  const {
    data: itemSettings,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["itemSettings", systemId],
    queryFn: () => getItemSettings(systemId),
    enabled: systemId != null
  });
  return { itemSettings, isLoading, isError };
}
