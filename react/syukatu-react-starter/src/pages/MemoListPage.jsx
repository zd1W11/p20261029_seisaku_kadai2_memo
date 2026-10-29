import { useState } from "react";
import MemoTable from "../components/MemoTable";
import MemoSearch from "../components/MemoSearch";
import useGetMemos from "../hooks/useGetMemos";
import { useGetItemSettings } from "../hooks/useGetItemSettings";
import { useGetCodeMasters } from "../hooks/useCodeMasters";
import { useGetCommonCodeMasters, auditDisplayOf } from "../hooks/useGetCommonCodeMasters";
import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router";
import { useAtomValue } from "jotai";
import currentSystemAtom from "../atoms/currentSystemAtom";
import { buildMemoCsv, downloadCsv } from "../utils/memoCsv";
/**
 * メモデータ取得の状態に合わせた表示内容の切り替え
 */
function switchContent({ memos, isLoading, isError }, itemSettings, codeMasters, audit) {
  let content;
  if (isError) {
    content = <Alert variant="danger">サーバーエラーが発生しました</Alert>;
  } else if (isLoading) {
    content = <Alert variant="light">Loading...</Alert>;
  } else if (memos.length === 0) {
    content = <Alert variant="warning">メモ情報が存在しません</Alert>;
  } else {
    content = (
      <MemoTable
        memoList={memos}
        itemSettings={itemSettings}
        codeMasters={codeMasters}
        audit={audit}
      />
    );
  }
  return content;
}
/**
 * メモリストページ
 * 「新規登録」ボタン（登録画面へ遷移）、検索部（開く／閉じる）、メモリストを表示
 * 「エクスポート」ボタンで表示中のメモをCSV（カンマ区切り）ファイルに書き出す
 * （コード項目はコード値ではなくコード名称を出力する）
 * 各行の操作は先頭の「編集」（編集画面へ直接遷移）・「削除」（確認ダイアログで確認後に行う）
 * No. 列は表示中の一覧の先頭からの行番号
 */
export default function MemoListPage() {
  const { itemSettings } = useGetItemSettings();
  const { codeMasters } = useGetCodeMasters();
  const currentSystemId = useAtomValue(currentSystemAtom);
  // 登録日時・更新日時の表示（名前・幅・書式）は共通のコードマスタ（system_id=0）から取る
  const { commonCodes } = useGetCommonCodeMasters();
  const audit = auditDisplayOf(commonCodes);
  // 検索部で適用された検索条件（null は絞り込みなし）
  const [searchConditions, setSearchConditions] = useState(null);
  const memoState = useGetMemos(searchConditions);
  const content = switchContent(memoState, itemSettings, codeMasters, audit);

  // エクスポート: 表示中のメモをCSVファイルに書き出す
  const exportHandler = () => {
    downloadCsv("memo_export.csv", buildMemoCsv(itemSettings, memoState.memos || [], codeMasters));
  };

  return (
    <div>
      <div className="my-3 d-flex gap-2">
        <Link to="/memo/new" className="btn btn-success">
          新規登録
        </Link>
        <Button variant="outline-primary" onClick={exportHandler} disabled={!memoState.memos?.length}>
          エクスポート
        </Button>
      </div>
      <MemoSearch
        key={currentSystemId ?? "none"}
        itemSettings={itemSettings}
        codeMasters={codeMasters}
        onSearch={setSearchConditions}
        onClear={() => setSearchConditions(null)}
      />
      {content}
    </div>
  );
}
