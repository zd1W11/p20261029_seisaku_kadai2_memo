import { keyOf, codeOptionsFor } from "../utils/memoCalc";
/**
 * 項目設定に応じた入力欄1つ分（編集モード用）
 * - チェックボックス項目: チェックボックス入力（チェック時 "1"、外すと "0" を保存）
 * - コードIDが指定された項目: コードマスタのドロップダウン（保存値は設定コード、表示は文字列1）
 * - メモ型: テキストエリア / 文字列型: テキスト入力
 *
 * プロップス:
 * setting - 項目設定1件
 * register - React Hook Form の register
 * setValue - React Hook Form の setValue（チェックボックス項目の値 "1"/"0" の切り替え用）
 * watched - プレビュー計算・チェック状態表示用の現在入力値
 * codeMasters - コードマスタリスト
 * textboxWidth - テキストボックスの幅（px、共通設定・項目3の表示桁数から換算）
 */
export default function MemoItemField({ setting, register, setValue, watched, codeMasters, textboxWidth }) {
  const k = keyOf(setting.columnNo);
  const textStyle = textboxWidth ? { width: textboxWidth, maxWidth: "100%" } : undefined;
  if (setting.dataType === "CHECKBOX") {
    const checked = watched?.[k] === "1" || watched?.[k] === true;
    return (
      <>
        <input type="hidden" {...register(k)} />
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setValue(k, e.target.checked ? "1" : "0")}
        />
      </>
    );
  }
  const options = codeOptionsFor(codeMasters, setting.codeId);
  if (setting.codeId && options.length > 0) {
    return (
      <select {...register(k)}>
        <option value="">（未選択）</option>
        {options.map((o) => (
          <option key={o.settingCode} value={o.settingCode}>
            {o.text1 || o.settingCode}
          </option>
        ))}
      </select>
    );
  }
  if (setting.dataType === "MEMO") {
    return <textarea cols={80} {...register(k)} />;
  }
  return <input type="text" {...register(k)} style={textStyle} />;
}
