# 練習問題スターターキットを土台にした「就職活動メモ」フロントエンド

- 「npm start」でアプリが起動できるようになっています（ポート3000、スターターと同じ）。
- プロジェクト内に「.prettierrc」が含まれています。好みに合わせて、書き換えてください。

## ライブラリ

- React Bootstrap
- Bootstrap CSS
- React Hook Form
- React Router
- Jotai
- Axios
- TanStack Query

## スターターとの対応

- api/vocabApi.js → api/memoApi.js（/api/memos、/api/settings、/api/app-info）
- atoms: 操作ユーザー（currentUserAtom、localStorage保存）＋ 使用システム（currentSystemAtom）
- hooks: useGetMemos / useGetMemo / useAddMemo / useUpdateMemo / useDeleteMemo など、スターターと同じ命名・構成
- pages: MemoListPage（一覧。「新規登録」ボタンで登録画面へ遷移、各行に確認ダイアログ付き削除ボタン）/ MemoDetailPage（詳細・表示専用。削除ボタンなし）/ MemoFormPage（登録・編集の共用画面）、SystemSettingsPage（システム設定）/ SettingsPage（項目設定・計算設定）
- components: 登録・編集は MemoForm に一本化（旧 MemoAddForm / MemoEditForm は廃止）
- 一覧・詳細の列は項目設定（表示名・型・表示桁数・URL可否）から動的に生成します
- 項目13「月給目安」は計算設定に基づくプレビュー表示で、保存時にサーバー側で計算してDBに保存されます

- ヘッダーに使用システム選択ドロップダウンがあり、選択中のシステムで全画面が動作する（atoms/currentSystemAtom で保持）
