import CodeMasterTable from "../components/CodeMasterTable";
import { useGetCommonCodeMasters } from "../hooks/useGetCommonCodeMasters";
import { Alert } from "react-bootstrap";
/**
 * 共通項目設定画面
 * 全システム共通の設定を、コードマスタ（システムID=0）として編集する専用画面。
 * コードID「registered_at」「updated_at」が登録日時・更新日時の表示
 * （文字列2が「表示桁数」の行の文字列3がメモ一覧の列の幅、「初期値」の行の文字列3が表示書式、
 * 表示名は文字列1）を決め、コードID「width_edit_textbox」がメモ編集画面の
 * テキストボックスの幅（文字列2が「幅」の行の文字列3）を決める。
 * システム一覧画面の「共通項目設定」ボタン、項目設定画面の「共通設定」ボタンから遷移する。
 */
export default function CommonSettingsPage() {
  const { commonCodes, isLoading } = useGetCommonCodeMasters();
  if (isLoading) {
    return <Alert variant="secondary">Loading...</Alert>;
  }
  return (
    <div>
      {commonCodes && (
        <CodeMasterTable
          key="codes-common"
          codeMasters={commonCodes}
          systemId={0}
          title="共通項目設定（登録日時・更新日時・編集テキストボックス幅）"
          description="全システム共通の設定（コードマスタのシステムID=0）です。registered_at／updated_at は、文字列2が「表示桁数」の行の文字列3がメモ一覧の列の幅、「初期値」の行の文字列3が表示書式になります。width_edit_textbox は、文字列2が「幅」の行の文字列3がメモ編集画面のテキストボックスの幅になります。"
        />
      )}
    </div>
  );
}
