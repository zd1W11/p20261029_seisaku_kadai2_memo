import { useEffect, useState } from "react";
import { Alert, Button, Container, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useAtom } from "jotai";
import currentUserAtom from "../atoms/currentUserAtom";
import { login } from "../api/memoApi";
/**
 * ログイン画面
 * ユーザーIDとパスワードを照合し、成功するとログイン中のユーザーIDを保持してシステム一覧へ遷移する。
 * このユーザーIDが、メモの登録ユーザー／更新ユーザーとして記録される。
 * ログイン後に、ヘッダーの使用システムドロップダウンなどが表示される。
 */
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const navigate = useNavigate();

  // ログイン済みの場合はシステム一覧へ
  useEffect(() => {
    if (currentUser) {
      navigate("/systems");
    }
  }, [currentUser, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErr("");
    setIsSubmitting(true);
    try {
      const user = await login(username.trim(), password);
      setCurrentUser(user.username);
      navigate("/systems");
    } catch (error) {
      setErr(error.response?.data?.message || "ログインに失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: 480 }}>
      <h1 className="display-6 my-4">ログイン</h1>
      {err && <Alert variant="danger">{err}</Alert>}
      <Form onSubmit={submitHandler}>
        <Table bordered>
          <tbody>
            <tr>
              <th className="bg-dark text-white" style={{ width: 140 }}>
                ユーザーID
              </th>
              <td>
                <Form.Control
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th className="bg-dark text-white">パスワード</th>
              <td>
                <Form.Control
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </Table>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          ログイン
        </Button>
      </Form>
    </Container>
  );
}
