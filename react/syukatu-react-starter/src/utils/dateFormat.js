/**
 * 日時書式ユーティリティ
 * 書式は MySQL の DATE_FORMAT と同じ文字を使う:
 * %Y = 年（4桁）、%m = 月（2桁）、%d = 日（2桁）、
 * %H = 時（2桁・24時間）、%i = 分（2桁）、%s = 秒（2桁）
 */

const pad2 = (n) => String(n).padStart(2, "0");

/** Date を書式文字列（%Y など）で文字列化する。書式内の他の文字はそのまま残る */
export function formatByPattern(date, pattern) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime()) || pattern == null) {
    return "";
  }
  const parts = {
    "%Y": String(date.getFullYear()),
    "%m": pad2(date.getMonth() + 1),
    "%d": pad2(date.getDate()),
    "%H": pad2(date.getHours()),
    "%i": pad2(date.getMinutes()),
    "%s": pad2(date.getSeconds())
  };
  return String(pattern).replace(/%[YmdHis]/g, (token) => parts[token] ?? token);
}

/**
 * 項目設定の初期値（default_value）に含まれる日時トークンをシステム日時で置換する
 * 例: "%Y/%m/%d" → "2026/10/28"、"%Y%m" → "202610"
 * null / 空文字は空文字を返す
 */
export function applyDateTokens(text, date = new Date()) {
  if (text == null || text === "") return "";
  return formatByPattern(date, text);
}

/**
 * APIから受け取った日時文字列（"yyyy-MM-dd HH:mm:ss"）を、
 * 共通設定（item_settings の system_id=0）の初期値に指定された書式で表示する
 * 書式が未指定の場合は "%Y/%m/%d %H:%i:%s" を使う。解釈できない値はそのまま返す
 */
/**
 * 日付型項目の保存値から8桁の数字（yyyyMMdd）を取り出す。
 * 保存値は数字のみだが、区切り文字付き（"2026-10-31" など）の値も数字だけを取り出して解釈する。
 * 8桁の数字として解釈できない場合は null を返す。
 */
function dateDigitsOf(value) {
  if (value == null || value === "") return null;
  const digits = String(value).replace(/\D/g, "");
  return digits.length === 8 ? digits : null;
}

/**
 * 日付型項目の表示用文字列（"yyyy/mm/dd"）を返す。
 * 8桁の数字として解釈できない値はそのまま返す。
 */
export function formatDateValue(value) {
  if (value == null || value === "") return "";
  const d = dateDigitsOf(value);
  if (!d) return value;
  return `${d.slice(0, 4)}/${d.slice(4, 6)}/${d.slice(6, 8)}`;
}

/**
 * 日付型項目の保存値を、カレンダー入力（input type="date"）の値（"yyyy-mm-dd"）に変換する。
 * 解釈できない場合は空文字を返す。
 */
export function toDateInputValue(value) {
  const d = dateDigitsOf(value);
  if (!d) return "";
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
}

/**
 * カレンダー入力（input type="date"）の値（"yyyy-mm-dd"）を、保存値（数字のみ "yyyyMMdd"）に変換する。
 * 未入力の場合は空文字を返す。
 */
export function fromDateInputValue(value) {
  if (!value) return "";
  return String(value).replace(/\D/g, "");
}

export function formatAuditDateTime(value, pattern) {
  if (!value) return "";
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (!m) {
    return value;
  }
  const date = new Date(
    Number(m[1]),
    Number(m[2]) - 1,
    Number(m[3]),
    Number(m[4]),
    Number(m[5]),
    Number(m[6])
  );
  return formatByPattern(date, pattern || "%Y/%m/%d %H:%i:%s");
}
