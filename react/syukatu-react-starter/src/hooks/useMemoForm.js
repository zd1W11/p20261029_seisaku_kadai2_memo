import { useForm } from "react-hook-form";
import { keyOf } from "../utils/memoCalc";
import { applyDateTokens } from "../utils/dateFormat";
// メモの登録・編集で利用する React Hook Form のセットアップ
// 既存メモの編集時はその値、新規登録時は項目設定の初期値（defaultValue、日付トークン置換済み）を初期値にする
export function buildDefaultValues(record, itemSettings) {
  const defaults = {};
  (itemSettings || []).forEach((s) => {
    defaults[keyOf(s.columnNo)] = applyDateTokens(s.defaultValue);
  });
  const values = {};
  for (let i = 1; i <= 50; i++) {
    const k = keyOf(i);
    values[k] = record ? (record[k] ?? "") : (defaults[k] ?? "");
  }
  return values;
}
export default function useMemoForm(record, itemSettings) {
  const methods = useForm({
    defaultValues: buildDefaultValues(record, itemSettings),
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  });
  return { methods };
}
