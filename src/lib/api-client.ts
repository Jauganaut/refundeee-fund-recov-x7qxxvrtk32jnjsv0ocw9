import { ApiResponse } from "../../shared/types"
import { useAuth } from "@/hooks/useAuth";
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const user = useAuth.getState().user;
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (user?.email) {
    headers.set('X-User-Email', user.email);
  }
  const res = await fetch(path, { ...init, headers });
  const json = (await res.json()) as ApiResponse<T>
  if (!res.ok || !json.success || json.data === undefined) throw new Error(json.error || 'Request failed')
  return json.data
}