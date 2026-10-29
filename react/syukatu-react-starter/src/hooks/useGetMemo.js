import { useQuery } from "@tanstack/react-query";
import { getMemoById } from "../api/memoApi";
export default function useGetMemo(memoId) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["memo", String(memoId)],
    queryFn: () => getMemoById(memoId),
    enabled: memoId !== undefined && memoId !== null && memoId !== ""
  });
  return { memo: data, isLoading, isError };
}
