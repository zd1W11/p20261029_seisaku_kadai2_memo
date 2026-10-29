import { Table } from "react-bootstrap";
import MemoTableRow from "./MemoTableRow";

/**
 * メモテーブルコンポーネント（列は項目設定の表示項目から生成）
 * 列順: 操作（編集・削除）, No., 表示項目..., 登録日時, 登録ユーザー, 更新日時, 更新ユーザー
 * No. は DB の ID ではなく、表示中の一覧の先頭からの行番号。
 * 登録日時・更新日時の列名と列幅は、共通設定（item_settings の system_id=0）に従う。
 *
 * プロップス:
 * memoList - メモオブジェクトの配列
 * itemSettings - 項目設定の配列
 * audit - { registered: {name, width, format}, updated: {name, width, format} }
 */
export default function MemoTable({ memoList, itemSettings, codeMasters, audit }) {
  const visible = (itemSettings || [])
    .filter((s) => s.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const registeredAtMinWidth = (audit?.registered.width ?? 22) * 8;
  const updatedAtMinWidth = (audit?.updated.width ?? 22) * 8;
  return (
    <div className="table-responsive">
      <Table bordered>
        <thead className="table-dark">
          <tr>
            <th>操作</th>
            <th>No.</th>
            {visible.map((s) => (
              <th key={s.columnNo} style={{ minWidth: (s.displayWidth || 12) * 8 }}>
                {s.displayName}
              </th>
            ))}
            <th style={{ minWidth: registeredAtMinWidth }}>{audit?.registered.name || "登録日時"}</th>
            <th>登録ユーザー</th>
            <th style={{ minWidth: updatedAtMinWidth }}>{audit?.updated.name || "更新日時"}</th>
            <th>更新ユーザー</th>
          </tr>
        </thead>
        <tbody>
          {memoList.map((memo, index) => (
            <MemoTableRow
              key={memo.id}
              memo={memo}
              rowNo={index + 1}
              visibleSettings={visible}
              codeMasters={codeMasters}
              audit={audit}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}
