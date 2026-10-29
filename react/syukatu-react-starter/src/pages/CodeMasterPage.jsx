import CodeMasterTable from "../components/CodeMasterTable";
import { useGetCodeMasters } from "../hooks/useCodeMasters";
import { useGetSystems } from "../hooks/useSystems";
import { useAtomValue } from "jotai";
import currentSystemAtom from "../atoms/currentSystemAtom";
import { Alert } from "react-bootstrap";
/**
 * コードマスタ画面
 * 使用システムのコードマスタ（コードID・設定コード・文字列1〜3・数値1〜3・表示順）を編集する。
 * システム一覧画面の各行の「コードマスタ」ボタンから遷移する。
 * 共通の設定（システムID=0）は、共通項目設定画面で編集する。
 */
export default function CodeMasterPage() {
  const systemId = useAtomValue(currentSystemAtom);
  const { systems } = useGetSystems();
  const { codeMasters, isLoading } = useGetCodeMasters();
  if (isLoading) {
    return <Alert variant="secondary">Loading...</Alert>;
  }
  const systemName = systems?.find((s) => s.id === systemId)?.systemName || "";
  return (
    <div>
      <p className="my-3">
        編集中のシステム: <strong>{systemName}</strong>
        <span className="text-muted">（切り替えは「システム一覧」画面の各行のボタンから行います）</span>
      </p>
      <CodeMasterTable key={`codes-${systemId}`} codeMasters={codeMasters} />
    </div>
  );
}
