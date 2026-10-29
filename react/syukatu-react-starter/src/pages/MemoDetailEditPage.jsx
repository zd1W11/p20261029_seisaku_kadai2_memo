import MemoDetailEdit from "../components/MemoDetailEdit";
import { useParams } from "react-router";
import useGetMemo from "../hooks/useGetMemo";
import { useGetItemSettings } from "../hooks/useGetItemSettings";
import { useGetCodeMasters } from "../hooks/useCodeMasters";
import { useGetCommonCodeMasters, auditDisplayOf, textboxWidthOf } from "../hooks/useGetCommonCodeMasters";
import { Alert } from "react-bootstrap";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import currentSystemAtom from "../atoms/currentSystemAtom";
/**
 * メモ編集ページ（参照モードはなく、常に編集画面を表示する）
 * - /memo/new: 新規登録
 * - /memo/:memoId, /memo/:memoId/edit: 既存メモの編集
 */
export default function MemoDetailEditPage() {
  const { memoId } = useParams();
  const isExisting = memoId !== undefined;
  // 既存メモの場合のみ対象メモを取得（新規登録時は取得しない）
  const { isError, isLoading, memo } = useGetMemo(isExisting ? memoId : undefined);
  const { itemSettings } = useGetItemSettings();
  const { codeMasters } = useGetCodeMasters();
  const { commonCodes } = useGetCommonCodeMasters();
  // 編集対象メモのシステムに、使用システムの選択を合わせる
  const setCurrentSystemId = useSetAtom(currentSystemAtom);
  useEffect(() => {
    if (memo && memo.systemId != null) {
      setCurrentSystemId(memo.systemId);
    }
  }, [memo, setCurrentSystemId]);
  if (isExisting) {
    if (isError) {
      return <Alert variant="danger">サーバーエラーが発生しました</Alert>;
    }
    if (isLoading || !memo) {
      return <Alert variant="secondary">Loading...</Alert>;
    }
  }
  return (
    <MemoDetailEdit
      memo={isExisting ? memo : undefined}
      itemSettings={itemSettings}
      codeMasters={codeMasters}
      audit={auditDisplayOf(commonCodes)}
      textboxWidth={textboxWidthOf(commonCodes)}
    />
  );
}
