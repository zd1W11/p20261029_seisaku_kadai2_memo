import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { getDistinctValues } from "../api/memoApi";
import { codeOptionsFor } from "../utils/memoCalc";
import currentSystemAtom from "../atoms/currentSystemAtom";

// テキスト検索の一致方法を項目名に併記する対象
const MATCH_LABELS = {
  TEXT_PREFIX: "前方一致",
  TEXT_SUFFIX: "後方一致",
  TEXT_PARTIAL: "部分一致",
};

/**
 * 検索部のドロップダウン（コードマスタの選択肢）
 * 値 = 設定コード、表示 = 文字列1。先頭の空選択肢が「（指定なし）」。
 */
function CodeOptionsSelect({ codeMasters, codeId, value, onChange, style }) {
  const options = codeOptionsFor(codeMasters, codeId);
  return (
    <Form.Select value={value} onChange={(e) => onChange(e.target.value)} style={style}>
      <option value="">（指定なし）</option>
      {options.map((o) => (
        <option key={o.settingCode} value={o.settingCode}>
          {o.text1 || o.settingCode}
        </option>
      ))}
    </Form.Select>
  );
}

/**
 * 検索部のドロップダウン（登録済みの値の一覧）
 * GET /api/memos/distinct-values の結果を選択肢にする。先頭の空選択肢が「（指定なし）」。
 */
function DistinctOptionsSelect({ systemId, columnNo, value, onChange, style }) {
  const { data } = useQuery({
    queryKey: ["distinctValues", systemId, columnNo],
    queryFn: () => getDistinctValues(systemId, columnNo),
    enabled: systemId != null
  });
  const values = data || [];
  return (
    <Form.Select value={value} onChange={(e) => onChange(e.target.value)} style={style}>
      <option value="">（指定なし）</option>
      {values.map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </Form.Select>
  );
}

/**
 * メモ一覧上部の検索部
 * 「開く」ボタンで開き、「閉じる」ボタンで閉じる。
 * 項目設定で検索項目（searchType）が設定された項目を、表示順に並べて入力欄を表示する。
 * 「検索」ボタンで条件を適用し、「クリア」ボタンで条件を全てリセットする。
 *
 * プロップス:
 * itemSettings - 項目設定の配列
 * codeMasters - コードマスタの配列
 * onSearch - 検索条件オブジェクトを受け取るコールバック
 * onClear - 条件リセット時のコールバック
 */
export default function MemoSearch({ itemSettings, codeMasters, onSearch, onClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState({});
  const systemId = useAtomValue(currentSystemAtom);
  const fields = (itemSettings || [])
    .filter((s) => s.searchType)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const patchDraft = (columnNo, patch) =>
    setDraft((prev) => ({ ...prev, [columnNo]: { ...prev[columnNo], ...patch } }));

  // 入力中の内容から検索条件オブジェクトを組み立てる（空の条件は含めない）
  const buildConditions = () => {
    const conditions = {};
    fields.forEach((s) => {
      const d = draft[s.columnNo] || {};
      switch (s.searchType) {
        case "TEXT_EXACT":
        case "TEXT_PREFIX":
        case "TEXT_SUFFIX":
        case "TEXT_PARTIAL":
        case "SELECT":
          if (d.value) {
            conditions[s.columnNo] = { value: d.value };
          }
          break;
        case "TEXT_FROMTO":
        case "SELECT_FROMTO": {
          const cond = {};
          if (d.from) cond.from = d.from;
          if (d.to) cond.to = d.to;
          if (Object.keys(cond).length > 0) {
            conditions[s.columnNo] = cond;
          }
          break;
        }
        case "CHECKBOX":
          if (d.checked) {
            conditions[s.columnNo] = { value: "1" };
          }
          break;
        default:
          break;
      }
    });
    return conditions;
  };

  const searchHandler = () => {
    onSearch(buildConditions());
  };

  const clearHandler = () => {
    setDraft({});
    onClear();
  };

  // 入力欄の幅は、項目設定の表示桁数に合わせる（一覧の列幅と同じ換算＋入力欄の余白分）
  const widthStyleOf = (s) => ({ width: (s.displayWidth || 12) * 8 + 22, maxWidth: "100%" });

  // ドロップダウン1つ分（コードIDがあればコードマスタ、なければ登録済みの値）
  const renderSelect = (s, value, onChange) =>
    s.codeId ? (
      <CodeOptionsSelect codeMasters={codeMasters} codeId={s.codeId} value={value} onChange={onChange} style={widthStyleOf(s)} />
    ) : (
      <DistinctOptionsSelect systemId={systemId} columnNo={s.columnNo} value={value} onChange={onChange} style={widthStyleOf(s)} />
    );

  const renderField = (s) => {
    const d = draft[s.columnNo] || {};
    switch (s.searchType) {
      case "TEXT_EXACT":
      case "TEXT_PREFIX":
      case "TEXT_SUFFIX":
      case "TEXT_PARTIAL":
        return (
          <Form.Control
            type="text"
            value={d.value ?? ""}
            onChange={(e) => patchDraft(s.columnNo, { value: e.target.value })}
            style={widthStyleOf(s)}
          />
        );
      case "TEXT_FROMTO":
        return (
          <div className="d-flex align-items-center gap-2">
            <Form.Control
              type="text"
              value={d.from ?? ""}
              onChange={(e) => patchDraft(s.columnNo, { from: e.target.value })}
              style={widthStyleOf(s)}
            />
            <span>〜</span>
            <Form.Control
              type="text"
              value={d.to ?? ""}
              onChange={(e) => patchDraft(s.columnNo, { to: e.target.value })}
              style={widthStyleOf(s)}
            />
          </div>
        );
      case "SELECT":
        return renderSelect(s, d.value ?? "", (v) => patchDraft(s.columnNo, { value: v }));
      case "SELECT_FROMTO":
        return (
          <div className="d-flex align-items-center gap-2">
            {renderSelect(s, d.from ?? "", (v) => patchDraft(s.columnNo, { from: v }))}
            <span>〜</span>
            {renderSelect(s, d.to ?? "", (v) => patchDraft(s.columnNo, { to: v }))}
          </div>
        );
      case "CHECKBOX":
        return (
          <Form.Check
            type="checkbox"
            checked={!!d.checked}
            onChange={(e) => patchDraft(s.columnNo, { checked: e.target.checked })}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <div className="my-3">
        <Button variant="outline-secondary" onClick={() => setIsOpen(true)}>
          開く
        </Button>
        <span className="ms-2 text-muted">検索条件を指定する場合は「開く」を押してください</span>
      </div>
    );
  }

  return (
    <div className="my-3 border rounded p-3">
      {fields.length === 0 ? (
        <p className="text-muted mb-3">検索項目が設定されていません（項目設定画面で設定できます）</p>
      ) : (
        <Table bordered size="sm" className="align-middle">
          <tbody>
            {fields.map((s) => (
              <tr key={s.columnNo}>
                <th style={{ width: 200 }}>
                  {s.displayName || `項目${s.columnNo}`}
                  {MATCH_LABELS[s.searchType] && (
                    <span className="text-muted fw-normal">（{MATCH_LABELS[s.searchType]}）</span>
                  )}
                </th>
                <td>{renderField(s)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <div className="d-flex gap-2">
        <Button variant="primary" onClick={searchHandler}>
          検索
        </Button>
        <Button variant="outline-secondary" onClick={clearHandler}>
          クリア
        </Button>
        <Button variant="secondary" onClick={() => setIsOpen(false)}>
          閉じる
        </Button>
      </div>
    </div>
  );
}
