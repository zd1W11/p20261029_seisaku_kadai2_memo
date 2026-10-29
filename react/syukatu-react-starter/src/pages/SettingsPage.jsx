import { useEffect } from "react";
import ItemSettingTable from "../components/ItemSettingTable";
import { useGetItemSettings } from "../hooks/useGetItemSettings";
import { useGetCodeMasters } from "../hooks/useCodeMasters";
import { useGetSystems } from "../hooks/useSystems";
import { useAtomValue } from "jotai";
import currentSystemAtom from "../atoms/currentSystemAtom";
import { Alert, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
/**
 * 設定ページ（項目設定）
 * 使用システム（システム一覧で選択中）の設定を編集する
 * 「項目設定」見出しの右の「共通設定」ボタンで、共通項目設定画面へ遷移する
 * （共通の設定はコードマスタのシステムID=0 で管理する）。
 * コードマスタは別画面（コードマスタ画面）で編集する。
 */
const SECTION_IDS = {
  items: "item-settings-section"
};
function scrollToSection(section) {
  const id = SECTION_IDS[section];
  if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
export default function SettingsPage() {
  const systemId = useAtomValue(currentSystemAtom);
  const { systems } = useGetSystems();
  const { itemSettings, isError, isLoading } = useGetItemSettings();
  const { codeMasters, isLoading: isCodeLoading } = useGetCodeMasters();
  const location = useLocation();
  const navigate = useNavigate();
  const section = location.state?.section;
  useEffect(() => {
    if (!isLoading && !isCodeLoading && section) {
      scrollToSection(section);
    }
  }, [isLoading, isCodeLoading, section]);
  if (isError) {
    return <Alert variant="danger">サーバーエラーが発生しました</Alert>;
  }
  if (isLoading || isCodeLoading) {
    return <Alert variant="secondary">Loading...</Alert>;
  }
  const systemName = systems?.find((s) => s.id === systemId)?.systemName || "";
  return (
    <div>
      <p className="my-3">
        編集中のシステム: <strong>{systemName}</strong>
        <span className="text-muted">（切り替えは「システム一覧」画面の各行のボタンから行います）</span>
      </p>
      <div id="item-settings-section">
        <ItemSettingTable
          key={`items-${systemId}`}
          itemSettings={itemSettings}
          codeMasters={codeMasters}
          headerExtra={
            <Button size="sm" variant="outline-secondary" onClick={() => navigate("/common-settings")}>
              共通設定
            </Button>
          }
        />
      </div>
    </div>
  );
}
