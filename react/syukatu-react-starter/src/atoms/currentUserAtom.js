import { atomWithStorage } from "jotai/utils";
// ログイン中のユーザーID（ログイン画面で認証したユーザーの username）
// メモ保存時に登録ユーザー / 更新ユーザーとして記録される。未ログイン時は空文字
const currentUserAtom = atomWithStorage("currentUser", "");
export default currentUserAtom;
