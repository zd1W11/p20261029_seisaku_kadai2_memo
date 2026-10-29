import { Button } from "react-bootstrap";
import { Link } from "react-router";
import { keyOf, codeLabel, truncateByWidth, formatNumeric } from "../utils/memoCalc";
import { formatAuditDateTime } from "../utils/dateFormat";
import useDeleteMemo from "../hooks/useDeleteMemo";

/**
 * メモテーブルの行コンポーネント
 * 先頭の操作列: 「編集」ボタン（一覧から直接編集モード画面へ遷移）と
 * 「削除」ボタン（確認ダイアログで確認が取れた場合のみ削除する）
 * セルの文字は上寄せで表示する。各項目の値は表示桁数のバイト数（UTF-8）までを表示し、
 * 超える部分は表示しない（文字の泣き別れが起きないよう、文字を分割せずに切り取る）。
 * 数値型の項目は、カンマ区切りで表示する。
 * チェックボックス項目は disabled のチェックボックス（値 "1" でチェック）で表示する。
 *
 * プロップス:
 * memo - メモオブジェクト
 * rowNo - 表示中の一覧の先頭からの行番号（No. 列の表示用）
 * visibleSettings - 表示する項目設定の配列
 * audit - { registered: {name, width, format}, updated: {name, width, format} } 共通設定（system_id=0）に基づく監査項目の表示
 */
export default function MemoTableRow({ memo, rowNo, visibleSettings, codeMasters, audit }) {
  const { deleteById, isDeleting } = useDeleteMemo();
  // 削除時の処理（確認ダイアログで確認後に削除）。企業名は項目3
  const deleteHandler = async () => {
    const label = memo.item03 ? `No.${rowNo}（${memo.item03}）` : `No.${rowNo}`;
    if (!window.confirm(`${label} のメモを削除しますか？`)) {
      return;
    }
    try {
      await deleteById(memo.id);
    } catch (e) {
      // エラーハンドリングは省略
      console.log(e);
    }
  };
  return (
    <tr className="align-top">
      <td style={{ whiteSpace: "nowrap" }}>
        <div className="d-flex gap-2">
          <Link className="btn btn-warning btn-sm" style={{ minWidth: 56 }} to={`/memo/${memo.id}/edit`}>
            編集
          </Link>
          <Button variant="danger" size="sm" style={{ minWidth: 56 }} disabled={isDeleting} onClick={deleteHandler}>
            削除
          </Button>
        </div>
      </td>
      <td>{rowNo}</td>
      {visibleSettings.map((s) => {
        const v = memo[keyOf(s.columnNo)] ?? "";
        // 数値型の値（ラベル表示）は右寄せにする
        const alignRight = s.dataType === "NUMERIC" && !s.isUrl && !s.codeId;
        return (
          <td
            key={s.columnNo}
            style={{
              whiteSpace: s.dataType === "MEMO" ? "pre-wrap" : "normal",
              ...(alignRight ? { textAlign: "right" } : {})
            }}
          >
            {s.dataType === "CHECKBOX" ? (
              <input type="checkbox" checked={v === "1"} disabled />
            ) : s.isUrl && v ? (
              <a href={v} target="_blank" rel="noreferrer">
                {s.displayName || "サイトURL"}
              </a>
            ) : s.codeId && v ? (
              truncateByWidth(codeLabel(codeMasters, s.codeId, v), s.displayWidth)
            ) : s.dataType === "NUMERIC" ? (
              truncateByWidth(formatNumeric(v), s.displayWidth)
            ) : (
              truncateByWidth(v, s.displayWidth)
            )}
          </td>
        );
      })}
      <td style={{ minWidth: (audit?.registered.width ?? 22) * 8 }}>
        {formatAuditDateTime(memo.registeredAt, audit?.registered.format)}
      </td>
      <td>{memo.registeredBy}</td>
      <td style={{ minWidth: (audit?.updated.width ?? 22) * 8 }}>
        {formatAuditDateTime(memo.updatedAt, audit?.updated.format)}
      </td>
      <td>{memo.updatedBy}</td>
    </tr>
  );
}
