import { Alert, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router";
import MemoItemField from "./MemoItemField";
import useAddMemo from "../hooks/useAddMemo";
import useUpdateMemo from "../hooks/useUpdateMemo";
import useMemoForm from "../hooks/useMemoForm";
import { keyOf } from "../utils/memoCalc";
import { formatAuditDateTime } from "../utils/dateFormat";

/**
 * メモ編集画面（一覧から直接この画面へ遷移する。参照モードはない）
 * - テキストボックス／テキストエリアで入力する。
 *   コードIDが指定された項目はコードマスタのドロップダウンに、チェックボックス項目はチェックボックスになる。
 *   必須項目は項目名ラベルに赤い「*」を表示し、未入力では保存できない。
 * - 保存成功後・キャンセル時は一覧へ戻る。削除ボタンは置かない（削除は一覧から）。
 * - 監査項目（登録日時・登録ユーザー・更新日時・更新ユーザー）はラベル表示する。
 * 新規登録もこの画面（memo なし）を使う。新規登録時は項目設定の初期値が入る。
 *
 * プロップス:
 * memo - 対象メモ（新規登録時は undefined）
 * itemSettings / codeMasters - 使用システムの設定リスト
 * audit - 共通設定（system_id=0）に基づく監査項目の表示名・書式
 * textboxWidth - 共通設定・項目3（テキストボックス幅）に基づくテキストボックスの幅（px）
 */
export default function MemoDetailEdit({ memo, itemSettings, codeMasters, audit, textboxWidth }) {
  const isExisting = !!memo;
  const { add, isSaving } = useAddMemo();
  const { update, isUpdating } = useUpdateMemo();
  const navigate = useNavigate();
  const { methods } = useMemoForm(memo, itemSettings);
  const {
    handleSubmit,
    setError,
    clearErrors,
    register,
    setValue,
    watch,
    formState: { errors }
  } = methods;
  const watched = watch();

  const visible = (itemSettings || [])
    .filter((s) => s.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // 項目名ラベル（必須項目には赤い「*」を付ける）
  const labelOf = (s) => (
    <>
      {s.displayName}
      {s.isRequired && <span className="text-danger ms-1">*</span>}
    </>
  );

  const submitHandler = async (data) => {
    clearErrors("root.server");
    // 必須チェック（項目設定で必須に指定された項目）
    const missing = visible.filter(
      (s) => s.isRequired && !String(data[keyOf(s.columnNo)] ?? "").trim()
    );
    if (missing.length > 0) {
      missing.forEach((s) => setError(keyOf(s.columnNo), { type: "required", message: "必須項目です" }));
      setError("root.server", {
        message: `「${missing[0].displayName || `項目${missing[0].columnNo}`}」は必須項目です`
      });
      return;
    }
    try {
      if (isExisting) {
        await update(data, memo.id, memo.systemId, memo.version);
      } else {
        await add(data);
      }
      navigate("/");
    } catch (e) {
      if (e.response?.status === 400 || e.response?.status === 409) {
        // 400: 必須チェックなどの業務エラー / 409: 排他制御（他のユーザーが先に更新）
        setError("root.server", {
          message: e.response?.data?.message || "入力に問題があり、サーバーで処理できませんでした"
        });
      } else {
        setError("root.server", { message: "サーバーエラーが発生しました" });
      }
    }
  };

  // キャンセル時の遷移先（既存・新規とも一覧）
  const cancelHandler = () => {
    navigate("/");
  };

  const errorMessage = errors.root?.server?.message;

  const auditRows = isExisting && (
    <>
      <tr>
        <th className="bg-dark text-white">{audit?.registered.name || "登録日時"}</th>
        <td>{formatAuditDateTime(memo.registeredAt, audit?.registered.format)}</td>
      </tr>
      <tr>
        <th className="bg-dark text-white">登録ユーザー</th>
        <td>{memo.registeredBy}</td>
      </tr>
      <tr>
        <th className="bg-dark text-white">{audit?.updated.name || "更新日時"}</th>
        <td>{formatAuditDateTime(memo.updatedAt, audit?.updated.format)}</td>
      </tr>
      <tr>
        <th className="bg-dark text-white">更新ユーザー</th>
        <td>{memo.updatedBy}</td>
      </tr>
    </>
  );

  const title = !isExisting ? "新規登録" : `メモ編集（No.${memo.id}）`;

  const table = (
    <Table bordered>
      <tbody>
        {isExisting && (
          <tr>
            <th className="bg-dark text-white" style={{ width: 180 }}>
              No.
            </th>
            <td>{memo.id}</td>
          </tr>
        )}
        {visible.map((s) => (
          <tr key={s.columnNo}>
            <th className="bg-dark text-white">{labelOf(s)}</th>
            <td>
              <MemoItemField
                setting={s}
                register={register}
                setValue={setValue}
                watched={watched}
                codeMasters={codeMasters}
                textboxWidth={textboxWidth}
              />
              {errors[keyOf(s.columnNo)] && (
                <div className="text-danger" style={{ fontSize: "0.85em" }}>
                  {errors[keyOf(s.columnNo)].message}
                </div>
              )}
            </td>
          </tr>
        ))}
        {auditRows}
      </tbody>
    </Table>
  );

  return (
    <div>
      <h2 className="h4 my-3">{title}</h2>
      <form onSubmit={handleSubmit(submitHandler)}>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {table}
        <div className="my-3">
          <Button
            type="submit"
            variant={isExisting ? "warning" : "success"}
            className="me-2"
            disabled={isExisting ? isUpdating : isSaving}
          >
            {isExisting ? "変更を確定" : "登録"}
          </Button>
          <Button type="button" variant="secondary" onClick={cancelHandler}>
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  );
}
