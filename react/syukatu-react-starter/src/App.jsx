import { useEffect } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router";
import { useAtom } from "jotai";
import currentUserAtom from "./atoms/currentUserAtom";
import currentSystemAtom from "./atoms/currentSystemAtom";
import { useGetSystems } from "./hooks/useSystems";

/**
 * アプリ全体のレイアウト（ヘッダー）
 * ログイン後に表示される画面で、ヘッダーにはタイトル（対象システム名）、
 * ログイン中のユーザーID、ログアウト、「システム一覧」ボタンを表示し、
 * その下段に「メモ入力」「項目設定」「コードマスタ」ボタンも表示する。
 * 未ログインの場合はログイン画面へ遷移する。
 * 使用システムの切り替えは、システム一覧画面の各行のボタンで行う。
 * 選択したシステムに応じて、全画面のメモ・項目設定が切り替わる。
 */
export default function App() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [currentSystemId, setCurrentSystemId] = useAtom(currentSystemAtom);
  const { systems, isLoading, isError } = useGetSystems();
  const navigate = useNavigate();

  // 未ログインの場合はログイン画面へ
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // システム未選択、または選択中システムが削除された場合は、表示順の先頭を選択する
  useEffect(() => {
    if (systems && systems.length > 0) {
      if (currentSystemId == null || !systems.some((s) => s.id === currentSystemId)) {
        setCurrentSystemId(systems[0].id);
      }
    }
  }, [systems, currentSystemId, setCurrentSystemId]);

  const logoutHandler = () => {
    setCurrentUser("");
    navigate("/login");
  };

  const currentSystem = systems?.find((s) => s.id === currentSystemId);

  let content;
  if (!currentUser) {
    content = <Alert variant="secondary">ログイン画面へ移動します...</Alert>;
  } else if (isError) {
    content = <Alert variant="danger">サーバーエラーが発生しました</Alert>;
  } else if (isLoading || !currentSystem) {
    content = <Alert variant="secondary">Loading...</Alert>;
  } else {
    content = <Outlet />;
  }

  return (
    <Container fluid className="my-4">
      <div className="d-flex align-items-center justify-content-between my-4">
        <h1 className="display-5 mb-0">{currentSystem?.systemName ?? ""}</h1>
        <div className="d-flex flex-column align-items-end gap-2">
          <div className="d-flex align-items-center gap-2">
            <span>
              ログイン中: <strong>{currentUser}</strong>
            </span>
            <Button size="sm" variant="outline-danger" onClick={logoutHandler}>
              ログアウト
            </Button>
            <Link to="/systems" className="btn btn-outline-dark">
              システム一覧
            </Link>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Link to="/" className="btn btn-outline-dark">
              メモ入力
            </Link>
            <Link to="/settings" className="btn btn-outline-dark">
              項目設定
            </Link>
            <Link to="/code-masters" className="btn btn-outline-dark">
              コードマスタ
            </Link>
          </div>
        </div>
      </div>
      {content}
    </Container>
  );
}
