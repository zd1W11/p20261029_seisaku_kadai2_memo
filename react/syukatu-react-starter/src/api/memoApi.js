import axios from "axios";
/**
 * SpringBoot で作成した API と連携するためのモジュール
 */
const memoApi = axios.create({
  baseURL: "http://localhost:8080/api/memos",
  headers: { "Content-Type": "application/json" }
});
const settingApi = axios.create({
  baseURL: "http://localhost:8080/api/settings",
  headers: { "Content-Type": "application/json" }
});
const systemApi = axios.create({
  baseURL: "http://localhost:8080/api/systems",
  headers: { "Content-Type": "application/json" }
});
const authApi = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  headers: { "Content-Type": "application/json" }
});
const codeApi = axios.create({
  baseURL: "http://localhost:8080/api/code-masters",
  headers: { "Content-Type": "application/json" }
});
// ログイン（成功時は { username, displayName } を返す）
export async function login(username, password) {
  const res = await authApi.post("/login", { username, password });
  return res.data;
}
// 全メモデータの取得（システム別、検索条件指定時は絞り込み）
// search は検索条件オブジェクトを JSON 文字列化したもの（例: {"3":{"value":"x"},"5":{"from":"a","to":"b"}}）
export async function getMemos(systemId, search) {
  const params = {};
  if (systemId != null) params.systemId = systemId;
  if (search) params.search = search;
  const res = await memoApi.get("", { params });
  return res.data;
}
// 指定項目に登録されている値の一覧（重複なし）を取得する（検索部のドロップダウン選択肢用）
export async function getDistinctValues(systemId, columnNo) {
  const params = {};
  if (systemId != null) params.systemId = systemId;
  if (columnNo != null) params.columnNo = columnNo;
  const res = await memoApi.get("/distinct-values", { params });
  return res.data;
}
// ID に基づき、メモデータを 1 件取得する
export async function getMemoById(id) {
  const res = await memoApi.get(`/${id}`);
  return res.data;
}
// メモデータの追加
export async function addMemo(memo) {
  await memoApi.post("", memo);
}
// メモデータの編集
export async function updateMemo(memo) {
  await memoApi.put("", memo);
}
// ID に基づき、メモデータを 1 件削除する
export async function deleteMemo(id) {
  await memoApi.delete(`/${id}`);
}
// 項目設定リストの取得（システム別）
export async function getItemSettings(systemId) {
  const res = await settingApi.get("/items", { params: systemId != null ? { systemId } : {} });
  return res.data;
}
// 項目設定の編集
export async function updateItemSetting(itemSetting) {
  await settingApi.put("/items", itemSetting);
}
// コードマスタリストの取得（システム別、コードID指定時はそのコードのみ）
export async function getCodeMasters(systemId, codeId) {
  const params = {};
  if (systemId != null) params.systemId = systemId;
  if (codeId) params.codeId = codeId;
  const res = await codeApi.get("", { params });
  return res.data;
}
// コードマスタの追加
export async function addCodeMaster(codeMaster) {
  await codeApi.post("", codeMaster);
}
// コードマスタの編集
export async function updateCodeMaster(codeMaster) {
  await codeApi.put("", codeMaster);
}
// コードマスタの削除
export async function deleteCodeMaster(codeMaster) {
  await codeApi.delete("", {
    params: {
      systemId: codeMaster.systemId,
      codeId: codeMaster.codeId,
      settingCode: codeMaster.settingCode
    }
  });
}
// システム設定リストの取得（表示順）
export async function getSystems() {
  const res = await systemApi.get("");
  return res.data;
}
// システムの追加（項目設定も初期作成される）
export async function addSystem(system) {
  await systemApi.post("", system);
}
// システムの編集（システム名・表示順）
export async function updateSystem(system) {
  await systemApi.put("", system);
}
// システムの削除
export async function deleteSystem(id) {
  await systemApi.delete(`/${id}`);
}
// アプリ設定（application.properties の app.code / app.name）の取得
export async function getAppInfo() {
  const res = await axios.get("http://localhost:8080/api/app-info");
  return res.data;
}
