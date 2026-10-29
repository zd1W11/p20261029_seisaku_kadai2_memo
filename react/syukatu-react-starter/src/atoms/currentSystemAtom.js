import { atomWithStorage } from "jotai/utils";
// 使用システム（システム設定テーブルのID）。ヘッダーのドロップダウンで切り替える
const currentSystemAtom = atomWithStorage("currentSystemId", null);
export default currentSystemAtom;
