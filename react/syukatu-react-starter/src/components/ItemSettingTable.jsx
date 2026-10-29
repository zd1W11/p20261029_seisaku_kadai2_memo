import { useState } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import { useUpdateItemSetting } from "../hooks/useUpdateSettings";
// 検索項目の種別（値と表示名）
const SEARCH_TYPE_OPTIONS = [
  { value: "", label: "（なし）" },
  { value: "TEXT_EXACT", label: "テキストボックス完全一致" },
  { value: "TEXT_PREFIX", label: "テキストボックス前方一致" },
  { value: "TEXT_SUFFIX", label: "テキストボックス後方一致" },
  { value: "TEXT_PARTIAL", label: "テキストボックス部分一致" },
  { value: "TEXT_FROMTO", label: "テキストボックスFromTo" },
  { value: "SELECT", label: "ドロップダウンリスト" },
  { value: "SELECT_FROMTO", label: "ドロップダウンリストFromTo" },
  { value: "CHECKBOX", label: "チェックボックス" }
];
/**
 * 項目設定の編集テーブル
 * 列順: 操作（保存）・項目・表示名・表示・必須・型・表示桁数・URL・項目表示順・コードID・チェックボックス・初期値・検索項目
 * 項目表示順を変更すると、一覧・編集画面での項目の並び順が変わる。
 * コードIDを指定すると、その項目は編集画面でコードマスタのドロップダウンになる。
 * 必須にすると、編集画面で項目名に赤い「*」が付き、未入力では保存できない。
 * チェックボックスにすると、その項目は編集画面でチェックボックス入力（ON="1" / OFF="0"）になる。
 * 初期値は新規登録時の初期値。%Y・%m・%d・%H・%i・%s はシステム日時で置き換わる（複合指定可）。
 * 検索項目を設定すると、その項目がメモ一覧上部の検索部に表示される。
 * 共通設定（system_id=0）でも同じテーブルを使う。その場合の項目1・項目2は登録日時・更新日時で、
 * 表示桁数はメモ一覧の列幅、初期値は表示書式（例: "%Y/%m/%d %H:%i:%s"）として使われる。
 */
export default function ItemSettingTable({ itemSettings, codeMasters, title = "項目設定", headerExtra = null }) {
  const [rows, setRows] = useState(() => itemSettings || []);
  const [msg, setMsg] = useState("");
  const { updateItemSetting } = useUpdateItemSetting();
  const codeIds = [...new Set((codeMasters || []).map((c) => c.codeId))];
  const patch = (no, field, value) => setRows(rows.map((r) => (r.columnNo === no ? { ...r, [field]: value } : r)));
  const save = async (row) => {
    await updateItemSetting({
      ...row,
      codeId: row.codeId?.trim() ? row.codeId.trim() : null,
      searchType: row.searchType ? row.searchType : null
    });
    setMsg(`項目${row.columnNo}の設定を保存しました`);
  };
  return (
    <div className="my-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <h2 className="h4 mb-0">{title}</h2>
        {headerExtra}
      </div>
      {msg && <Alert variant="success">{msg}</Alert>}
      <div className="table-responsive">
        <Table bordered size="sm" className="align-middle">
          <thead className="table-dark">
            <tr>
              <th>操作</th>
              <th>項目</th>
              <th>表示名</th>
              <th>表示</th>
              <th>必須</th>
              <th>表示型</th>
              <th>表示桁数</th>
              <th>URL</th>
              <th>項目表示順</th>
              <th>コードID</th>
              <th>初期値</th>
              <th>検索項目</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.columnNo}>
                <td>
                  <Button size="sm" onClick={() => save(r)}>
                    保存
                  </Button>
                </td>
                <td>項目{r.columnNo}</td>
                <td>
                  <input value={r.displayName ?? ""} onChange={(e) => patch(r.columnNo, "displayName", e.target.value)} />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={!!r.isVisible}
                    onChange={(e) => patch(r.columnNo, "isVisible", e.target.checked)}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={!!r.isRequired}
                    onChange={(e) => patch(r.columnNo, "isRequired", e.target.checked)}
                  />
                </td>
                <td>
                  <select value={r.dataType} onChange={(e) => patch(r.columnNo, "dataType", e.target.value)}>
                    <option value="STRING">文字列型</option>
                    <option value="NUMERIC">数値型</option>
                    <option value="MEMO">メモ型</option>
                    <option value="CHECKBOX">チェックボックス</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    style={{ width: 80 }}
                    value={r.displayWidth ?? ""}
                    onChange={(e) => patch(r.columnNo, "displayWidth", Number(e.target.value))}
                  />
                </td>
                <td>
                  <input type="checkbox" checked={!!r.isUrl} onChange={(e) => patch(r.columnNo, "isUrl", e.target.checked)} />
                </td>
                <td>
                  <input
                    type="number"
                    style={{ width: 80 }}
                    value={r.displayOrder ?? ""}
                    onChange={(e) => patch(r.columnNo, "displayOrder", Number(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    style={{ width: 130 }}
                    list="code-id-list"
                    placeholder="（なし）"
                    value={r.codeId ?? ""}
                    onChange={(e) => patch(r.columnNo, "codeId", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    style={{ width: 130 }}
                    placeholder="（なし）"
                    value={r.defaultValue ?? ""}
                    onChange={(e) => patch(r.columnNo, "defaultValue", e.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={r.searchType ?? ""}
                    onChange={(e) => patch(r.columnNo, "searchType", e.target.value)}
                  >
                    {SEARCH_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <datalist id="code-id-list">
          {codeIds.map((id) => (
            <option key={id} value={id} />
          ))}
        </datalist>
      </div>
    </div>
  );
}
