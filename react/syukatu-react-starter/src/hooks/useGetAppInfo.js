import { useQuery } from "@tanstack/react-query";
import { getAppInfo } from "../api/memoApi";
export function useGetAppInfo() {
  const { data } = useQuery({
    queryKey: ["appInfo"],
    queryFn: getAppInfo,
    staleTime: Infinity
  });
  return { appInfo: data };
}
