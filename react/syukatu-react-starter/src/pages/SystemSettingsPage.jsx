import { useState } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { useAddSystem, useDeleteSystem, useGetSystems, useUpdateSystem } from "../hooks/useSystems";
import currentSystemAtom from "../atoms/currentSystemAtom";
/**
 * システム一覧ページ
 * システム（アプリ種別）の一覧を表示し、追加・編集・削除を行う。
 * 一覧は表示順の昇順で表示し、先頭の番号は一覧内での連番（IDではない）。
 * 操作列は「保存」「削除」。メモ列の「メモ入力」を押すとその行のシステムを使用システムにしてメモ一覧へ、
 * 「項目設定」を押すと項目設定画面へ、「コードマスタ」を押すとコードマスタ画面へ遷移する（いずれも使用システムを切り替える）。
 * システムを追加すると、そのシステム専用の項目設定（項目1〜50、初期は名称なし・非表示）が用意される。
 * 項目名などの設定は「項目設定」画面で、使用システムを切り替えてから行う。
 */
export default function SystemSettingsPage() {
  const { systems, isLoading, isError } = useGetSystems();
  const { addSystem, isAdding } = useAddSystem();
  const { updateSystem } = useUpdateSystem();
  const { deleteSystem } = useDeleteSystem();
  const setCurrentSystemId = useSetAtom(currentSystemAtom);
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [order, setOrder] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // 一覧が更新されたら編集用 rows を同期する（表示順の昇順。描画中の調整パターン）
  const [prevSystems, setPrevSystems] = useState(null);
  if (systems && systems !== prevSystems) {
    setPrevSystems(systems);
    setRows([...systems].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
  }

  const patch = (id, field, value) => setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const addHandler = async () => {
    setErr("");
    setMsg("");
    if (!/^[a-z0-9][a-z0-9_-]*$/.test(code)) {
      setErr("システムコードは半角英小文字・数字・ハイフンで入力してください");
      return;
    }
    if (!name.trim()) {
      setErr("システム名を入力してください");
      return;
    }
    try {
      await addSystem({
        systemCode: code,
        systemName: name,
        displayOrder: Number(order) || rows.length + 1
      });
      setCode("");
      setName("");
      setOrder("");
      setShowForm(false);
      setMsg(`システム「${name}」を追加しました。項目設定画面で項目名などを設定してください`);
    } catch (e) {
      setErr(e.response?.status === 400 ? "入力に問題があるか、同じシステムコードが既に使われています" : "サーバーエラーが発生しました");
    }
  };

  const saveHandler = async (row) => {
    setErr("");
    setMsg("");
    try {
      await updateSystem({ ...row });
      setMsg(`システム「${row.systemName}」を保存しました`);
    } catch {
      setErr("保存に失敗しました");
    }
  };

  const deleteHandler = async (row) => {
    setErr("");
    setMsg("");
    if (!window.confirm(`システム「${row.systemName}」を削除しますか？\nそのシステムの項目設定・コードマスタも削除されます。`)) {
      return;
    }
    try {
      await deleteSystem(row.id);
      setMsg(`システム「${row.systemName}」を削除しました`);
    } catch (e) {
      setErr(e.response?.data?.message || "削除に失敗しました");
    }
  };

  // 「メモ入力」ボタン: その行のシステムを使用システムにしてメモ一覧へ遷移する
  const inputHandler = (row) => {
    setCurrentSystemId(row.id);
    navigate("/");
  };

  // 「項目設定」ボタン: 使用システムを切り替えて設定画面（項目設定セクション）へ遷移する
  const itemSettingsHandler = (row) => {
    setCurrentSystemId(row.id);
    navigate("/settings", { state: { section: "items" } });
  };

  // 「コードマスタ」ボタン: 使用システムを切り替えてコードマスタ画面へ遷移する
  const codeMasterHandler = (row) => {
    setCurrentSystemId(row.id);
    navigate("/code-masters");
  };

  if (isError) {
    return <Alert variant="danger">サーバーエラーが発生しました</Alert>;
  }
  if (isLoading) {
    return <Alert variant="secondary">Loading...</Alert>;
  }
  return (
    <div>
      <h2 className="h4 my-3">システム一覧</h2>
      <p className="text-muted">
        システムを追加すると、そのシステム専用の項目1〜50の項目設定が用意されます（初期状態は名称なし・非表示）。
        各行の「メモ入力」でメモ一覧へ、「項目設定」で項目設定画面へ、「コードマスタ」でコードマスタ画面へ移動します。
      </p>
      {msg && <Alert variant="success">{msg}</Alert>}
      {err && <Alert variant="danger">{err}</Alert>}
      <div className="my-3">
        <Button variant="success" onClick={() => setShowForm((v) => !v)}>
          新規作成
        </Button>
        <Button variant="outline-secondary" className="ms-2" onClick={() => navigate("/common-settings")}>
          共通項目設定
        </Button>
      </div>
      {showForm && (
        <div className="border rounded p-3 mb-3">
          <h3 className="h5">システムの新規作成</h3>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <label>
              システムコード:
              <input
                className="ms-2"
                type="text"
                placeholder="例: syukatu-memo"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </label>
            <label>
              システム名:
              <input className="ms-2" type="text" placeholder="例: 就職活動メモシステム" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              表示順:
              <input
                className="ms-2"
                type="number"
                style={{ width: 80 }}
                placeholder={String(rows.length + 1)}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              />
            </label>
            <Button variant="success" disabled={isAdding} onClick={addHandler}>
              追加
            </Button>
          </div>
        </div>
      )}
      <div className="table-responsive" style={{ maxWidth: 1150 }}>
        <Table bordered size="sm" className="align-middle">
          <thead className="table-dark">
            <tr>
              <th style={{ width: 170, whiteSpace: "nowrap" }}>操作</th>
              <th style={{ width: 310, whiteSpace: "nowrap" }}>メモ</th>
              <th>No.</th>
              <th style={{ width: 200 }}>システムコード</th>
              <th>システム名</th>
              <th>表示順</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, index) => (
              <tr key={r.id}>
                <td style={{ whiteSpace: "nowrap" }}>
                  <Button size="sm" className="me-2" onClick={() => saveHandler(r)}>
                    保存
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => deleteHandler(r)}>
                    削除
                  </Button>
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <Button size="sm" variant="primary" className="me-2" onClick={() => inputHandler(r)}>
                    メモ入力
                  </Button>
                  <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => itemSettingsHandler(r)}>
                    項目設定
                  </Button>
                  <Button size="sm" variant="outline-secondary" onClick={() => codeMasterHandler(r)}>
                    コードマスタ
                  </Button>
                </td>
                <td>{index + 1}</td>
                <td>{r.systemCode}</td>
                <td>
                  <input style={{ width: 260 }} value={r.systemName ?? ""} onChange={(e) => patch(r.id, "systemName", e.target.value)} />
                </td>
                <td>
                  <input
                    type="number"
                    style={{ width: 80 }}
                    value={r.displayOrder ?? ""}
                    onChange={(e) => patch(r.id, "displayOrder", Number(e.target.value))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
