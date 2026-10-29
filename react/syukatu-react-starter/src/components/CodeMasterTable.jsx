import { useState } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import { useAtomValue } from "jotai";
import currentSystemAtom from "../atoms/currentSystemAtom";
import { useAddCodeMaster, useDeleteCodeMaster, useUpdateCodeMaster } from "../hooks/useCodeMasters";
/**
 * コードマスタの編集テーブル
 * コードID配下の設定コードごとに、文字列1〜3・数値1〜3・表示順を管理する。
 * 項目設定で項目にコードIDを指定すると、編集画面でそのコードのドロップダウンになる
 * （保存される値は設定コード、表示は文字列1）。
 * systemId プロパティを指定するとそのシステムの分を編集する（共通は systemId=0）。
 * 未指定の場合は使用システムの分。
 */
export default function CodeMasterTable({ codeMasters, systemId: systemIdProp, title = "コードマスタ", description }) {
  const currentSystemId = useAtomValue(currentSystemAtom);
  const systemId = systemIdProp ?? currentSystemId;
  const [rows, setRows] = useState(() => codeMasters || []);
  const [prevCodes, setPrevCodes] = useState(null);
  if (codeMasters && codeMasters !== prevCodes) {
    setPrevCodes(codeMasters);
    setRows(codeMasters);
  }
  const [form, setForm] = useState({
    codeId: "",
    settingCode: "",
    text1: "",
    text2: "",
    text3: "",
    num1: "",
    num2: "",
    num3: "",
    displayOrder: ""
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const { addCodeMaster, isAdding } = useAddCodeMaster();
  const { updateCodeMaster } = useUpdateCodeMaster();
  const { deleteCodeMaster } = useDeleteCodeMaster();

  const keyOfRow = (r) => `${r.codeId}:${r.settingCode}`;
  const patch = (key, field, value) =>
    setRows(rows.map((r) => (keyOfRow(r) === key ? { ...r, [field]: value } : r)));
  const numOrNull = (v) => (v === "" || v == null ? null : Number(v));

  const addHandler = async () => {
    setErr("");
    setMsg("");
    if (!form.codeId.trim() || !form.settingCode.trim()) {
      setErr("コードIDと設定コードを入力してください");
      return;
    }
    try {
      await addCodeMaster({
        systemId,
        codeId: form.codeId.trim(),
        settingCode: form.settingCode.trim(),
        text1: form.text1 || null,
        text2: form.text2 || null,
        text3: form.text3 || null,
        num1: numOrNull(form.num1),
        num2: numOrNull(form.num2),
        num3: numOrNull(form.num3),
        displayOrder: Number(form.displayOrder) || rows.filter((r) => r.codeId === form.codeId.trim()).length + 1
      });
      setForm({ codeId: "", settingCode: "", text1: "", text2: "", text3: "", num1: "", num2: "", num3: "", displayOrder: "" });
      setMsg("コードを追加しました");
    } catch (e) {
      setErr(e.response?.status === 400 ? "入力に問題があるか、同じコードID・設定コードが既に使われています" : "サーバーエラーが発生しました");
    }
  };

  const saveHandler = async (row) => {
    setErr("");
    setMsg("");
    try {
      await updateCodeMaster({
        ...row,
        num1: numOrNull(row.num1),
        num2: numOrNull(row.num2),
        num3: numOrNull(row.num3)
      });
      setMsg(`コード「${row.codeId} / ${row.settingCode}」を保存しました`);
    } catch {
      setErr("保存に失敗しました");
    }
  };

  const deleteHandler = async (row) => {
    setErr("");
    setMsg("");
    if (!window.confirm(`コード「${row.codeId} / ${row.settingCode}」を削除しますか？`)) {
      return;
    }
    try {
      await deleteCodeMaster(row);
      setMsg(`コード「${row.codeId} / ${row.settingCode}」を削除しました`);
    } catch {
      setErr("削除に失敗しました");
    }
  };

  const textInput = (row, field, width = 110) => (
    <input
      style={{ width }}
      value={row[field] ?? ""}
      onChange={(e) => patch(keyOfRow(row), field, e.target.value)}
    />
  );
  const numInput = (row, field) => (
    <input
      type="number"
      step="any"
      style={{ width: 90 }}
      value={row[field] ?? ""}
      onChange={(e) => patch(keyOfRow(row), field, e.target.value === "" ? "" : Number(e.target.value))}
    />
  );

  return (
    <div className="my-4">
      <h2 className="h4">{title}</h2>
      <p className="text-muted">
        {description ??
          "項目設定で項目にコードIDを指定すると、編集画面でそのコードのドロップダウンリストになります（保存される値は設定コード、表示は文字列1）。"}
      </p>
      {msg && <Alert variant="success">{msg}</Alert>}
      {err && <Alert variant="danger">{err}</Alert>}
      <div className="table-responsive">
        <Table bordered size="sm" className="align-middle">
          <thead className="table-dark">
            <tr>
              <th>操作</th>
              <th>コードID</th>
              <th>設定コード</th>
              <th>文字列1（表示名）</th>
              <th>文字列2</th>
              <th>文字列3</th>
              <th>数値1</th>
              <th>数値2</th>
              <th>数値3</th>
              <th>表示順</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={keyOfRow(r)}>
                <td style={{ whiteSpace: "nowrap" }}>
                  <Button size="sm" className="me-2" onClick={() => saveHandler(r)}>
                    保存
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => deleteHandler(r)}>
                    削除
                  </Button>
                </td>
                <td>{r.codeId}</td>
                <td>{r.settingCode}</td>
                <td>{textInput(r, "text1")}</td>
                <td>{textInput(r, "text2")}</td>
                <td>{textInput(r, "text3")}</td>
                <td>{numInput(r, "num1")}</td>
                <td>{numInput(r, "num2")}</td>
                <td>{numInput(r, "num3")}</td>
                <td>
                  <input
                    type="number"
                    style={{ width: 70 }}
                    value={r.displayOrder ?? ""}
                    onChange={(e) => patch(keyOfRow(r), "displayOrder", Number(e.target.value))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <h3 className="h5 mt-3">コードの追加</h3>
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <label>
          コードID:
          <input
            className="ms-2"
            type="text"
            placeholder="例: employment_type"
            value={form.codeId}
            onChange={(e) => setForm({ ...form, codeId: e.target.value })}
          />
        </label>
        <label>
          設定コード:
          <input
            className="ms-2"
            type="text"
            placeholder="例: 正社員"
            value={form.settingCode}
            onChange={(e) => setForm({ ...form, settingCode: e.target.value })}
          />
        </label>
        <label>
          文字列1:
          <input
            className="ms-2"
            type="text"
            placeholder="表示名"
            value={form.text1}
            onChange={(e) => setForm({ ...form, text1: e.target.value })}
          />
        </label>
        <label>
          表示順:
          <input
            className="ms-2"
            type="number"
            style={{ width: 80 }}
            value={form.displayOrder}
            onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
          />
        </label>
        <Button variant="success" disabled={isAdding} onClick={addHandler}>
          追加
        </Button>
      </div>
      <p className="text-muted mt-2" style={{ fontSize: "0.9em" }}>
        ※ 追加時は文字列1まで入力できます。文字列2・3、数値1〜3は追加後に行の保存で設定してください。
      </p>
    </div>
  );
}
