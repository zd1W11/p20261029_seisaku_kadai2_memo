import { useQuery } from "@tanstack/react-query";
import { getCodeMasters } from "../api/memoApi";
/**
 * 共通のコードマスタ（system_id = 0）を取得するカスタムフック
 * コードID「registered_at」「updated_at」: 設定コード配下に、項目名（文字列2）が
 * 「表示桁数」の行に列の幅（文字列3）、「初期値」の行に表示書式（文字列3）を持つ。
 * コードID「width_edit_textbox」: 項目名（文字列2）が「幅」の行に、
 * メモ編集画面のテキストボックスの幅（文字列3）を持つ。
 * 表示名は文字列1（登録日時／更新日時／編集テキストボックス）。
 */
export function useGetCommonCodeMasters() {
  const { data: commonCodes, isLoading, isError } = useQuery({
    queryKey: ["codeMasters", 0],
    queryFn: () => getCodeMasters(0)
  });
  return { commonCodes, isLoading, isError };
}

// コードIDと項目名（文字列2）から、設定値（文字列3）を取る
function commonValue(commonCodes, codeId, itemName) {
  return (commonCodes || []).find((c) => c.codeId === codeId && c.text2 === itemName)?.text3;
}

// コードIDから、表示名（文字列1）を取る
function commonLabel(commonCodes, codeId) {
  return (commonCodes || []).find((c) => c.codeId === codeId)?.text1;
}

/** 共通コードマスタから、監査項目の表示に使う形 { registered, updated } を作る（未取得時は初期値） */
export function auditDisplayOf(commonCodes) {
  const one = (codeId, fallbackName) => {
    const w = parseInt(commonValue(commonCodes, codeId, "表示桁数"), 10);
    return {
      name: commonLabel(commonCodes, codeId) || fallbackName,
      width: Number.isNaN(w) ? 22 : w,
      format: commonValue(commonCodes, codeId, "初期値") || "%Y/%m/%d %H:%i:%s"
    };
  };
  return {
    registered: one("registered_at", "登録日時"),
    updated: one("updated_at", "更新日時")
  };
}

/** 共通コードマスタ（width_edit_textbox の「幅」）から、メモ編集画面のテキストボックス幅（px）を求める（一覧の列幅と同じ換算） */
export function textboxWidthOf(commonCodes) {
  const w = parseInt(commonValue(commonCodes, "width_edit_textbox", "幅"), 10);
  const digits = Number.isNaN(w) ? 60 : w;
  return digits * 8 + 22;
}
