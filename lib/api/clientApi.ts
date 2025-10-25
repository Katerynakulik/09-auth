import { NewNote, Note, NoteTag } from "@/types/note";
import axios from "axios";
import type { AxiosResponse } from "axios";
import { nextServer } from "./api";
import { User } from "@/types/user";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(params: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search = "", tag } = params;
  const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params: {
      page,
      perPage,
      search: typeof search === "string" ? search : "",
      tag,
    },
  });
  console.log("notes", response.data);

  return response.data;
}

export const createNote = async (data: NewNote): Promise<Note> => {
  const response = await api.post<Note>("/notes", data);
  return response.data;
};
export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

//----------------------------------------------------------------------------

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export interface UpdateMeRequest {
  email: string;
  username: string;
}

type CheckSessionRequest = {
  success: boolean;
};

export const register = async (body: RegisterRequest): Promise<User> => {
  const response = await nextServer.post<User>("/auth/register", body);
  return response.data;
};

export const login = async (body: LoginRequest): Promise<User> => {
  const response = await nextServer.post<User>("/auth/login", body);
  return response.data;
};

export const checkSession = async () => {
  const response = await nextServer.get<CheckSessionRequest>("/auth/session");
  return response.data.success;
};

export const getMe = async (): Promise<User> => {
  const response = await nextServer.get<User>("/users/me");
  return response.data;
};

export const updateMe = async (body: UpdateMeRequest): Promise<User> => {
  const response = await nextServer.patch<User>("/users/me", body);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};
