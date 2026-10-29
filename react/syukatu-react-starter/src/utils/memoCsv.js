import { keyOf, codeLabel } from "./memoCalc";
/**
 * メモ一覧のCSV（カンマ区切り）エクスポート用ユーティリティ
 * 形式: 先頭にBOM付きUTF-8、1行目はヘッダー（ID＋表示項目の表示名）。
 * 値は、コード項目はコード名称（コードマスタの文字列1）、それ以外の項目は保存値そのまま
 * （チェックボックス項目は "1" / "0"）。
 * カンマ・引用符・改行を含む値は引用符で囲み、引用符は二重化する。
 */
function escapeCsvCell(value) {
  const s = value == null ? "" : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// 表示項目（表示=ON、項目表示順）をエクスポート対象にする
export function visibleSettingsOf(itemSettings) {
  return [...(itemSettings || [])]
    .filter((s) => s.isVisible)
    .sort((a, b) => (a.displayOrder ?? a.columnNo) - (b.displayOrder ?? b.columnNo) || a.columnNo - b.columnNo);
}

export function buildMemoCsv(itemSettings, memos, codeMasters) {
  const visible = visibleSettingsOf(itemSettings);
  const header = ["ID", ...visible.map((s) => s.displayName || `項目${s.columnNo}`)];
  const lines = [header.map(escapeCsvCell).join(",")];
  for (const memo of memos || []) {
    const row = [
      memo.id ?? "",
      ...visible.map((s) => {
        const v = memo[keyOf(s.columnNo)] ?? "";
        // コード項目はコード値（設定コード）ではなくコード名称（文字列1）を出力する
        return s.codeId && v ? codeLabel(codeMasters, s.codeId, v) : v;
      })
    ];
    lines.push(row.map(escapeCsvCell).join(","));
  }
  return "\uFEFF" + lines.join("\r\n");
}

export function downloadCsv(filename, csvText) {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
