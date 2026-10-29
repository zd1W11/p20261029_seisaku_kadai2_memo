// 項目キー（item01〜item50）の生成
export const keyOf = (n) => `item${String(n).padStart(2, "0")}`;

// コードマスタから、指定コードIDの選択肢を表示順で取得する
export function codeOptionsFor(codeMasters, codeId) {
  if (!codeId) return [];
  return (codeMasters || [])
    .filter((c) => c.codeId === codeId)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

// コード項目の表示ラベル（設定コード → 文字列1。無ければ設定コードそのもの）
export function codeLabel(codeMasters, codeId, value) {
  if (value == null || value === "") return value;
  const hit = codeOptionsFor(codeMasters, codeId).find((c) => c.settingCode === value);
  return hit?.text1 || value;
}

// 一覧表示用: 値を指定したバイト数（表示桁数、UTF-8）でカットする。
// 文字の泣き別れを避けるため、バイト境界で文字を分割せず、
// 書記素クラスタ（サロゲートペアや結合文字を1文字として扱う）単位で、
// バイト数が表示桁数に収まる文字までを表示する。
const graphemeSegmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter("ja", { granularity: "grapheme" })
    : null;
const utf8Encoder = new TextEncoder();
export function truncateByWidth(value, width) {
  if (value == null || !width || width <= 0) return value;
  const text = String(value);
  if (utf8Encoder.encode(text).length <= width) return text;
  const chars = graphemeSegmenter
    ? [...graphemeSegmenter.segment(text)].map((s) => s.segment)
    : Array.from(text);
  let bytes = 0;
  let out = "";
  for (const ch of chars) {
    const b = utf8Encoder.encode(ch).length;
    if (bytes + b > width) break;
    bytes += b;
    out += ch;
  }
  return out;
}

/** 数値型の値をカンマ区切りで表示する（数値として解釈できない場合はそのまま返す） */
export function formatNumeric(value) {
  if (value === "" || value == null) return "";
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return n.toLocaleString("ja-JP", { maximumFractionDigits: 20 });
}
