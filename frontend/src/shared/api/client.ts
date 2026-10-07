// Responsável por conversar com o backend.

import { Platform } from 'react-native';
import { File } from 'expo-file-system';
import type { Transaction } from '../domain/finance';
import type { UsuarioLogado } from '../domain/User';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');
const READ_TIMEOUT_MS = 15_000;
const CHAT_TIMEOUT_MS = 120_000;
const TRANSCRIPTION_TIMEOUT_MS = 120_000;

type ApiErrorBody = { message?: string };

type BackendTransaction = {
  id: number;
  descricao: string;
  valor: number | string;
  tipo: 'DESPESA' | 'RECEITA';
  categoria: string;
  dataOcorrencia: string;
};

export type FinancialSummary = {
  saldoGeral: number;
  totalReceitas: number;
  totalDespesas: number;
};

export type ChatResult = { message: string };
type TranscriptionResult = { text: string };
const categoryLabels: Record<string, string> = {
  alimentacao: 'Alimentação',
  transporte: 'Transporte',
  moradia: 'Moradia',
  lazer: 'Lazer',
};

async function request<T>(path: string, init?: RequestInit, timeoutMs = READ_TIMEOUT_MS): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('Configure EXPO_PUBLIC_API_URL para conectar ao backend.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { Accept: 'application/json', ...init?.headers },
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as ApiErrorBody;
      throw new Error(body.message || `A API respondeu com erro ${response.status}.`);
    }

    return await response.json() as T;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(path === '/chat'
        ? 'O registro demorou demais para responder. Verifique se o Spring Boot e o Ollama estão ativos.'
        : 'A API demorou demais para responder. Verifique o backend e tente novamente.');
    }
    if (error instanceof Error && error.name !== 'TypeError' && error.name !== 'AbortError') {
      throw error;
    }
    throw new Error(`Não foi possível acessar a API em ${API_BASE_URL}.`);
  } finally {
    clearTimeout(timeout);
  }
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCategory(value: string): string {
  const key = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return categoryLabels[key] || value;
}

export async function getTransactions(): Promise<Transaction[]> {
  const rows = await request<BackendTransaction[]>('/lancamentos');
  return rows.map((row) => {
    const amount = Number(row.valor) || 0;
    return {
      id: String(row.id),
      title: row.descricao,
      category: formatCategory(row.categoria),
      date: formatDate(row.dataOcorrencia),
      value: row.tipo === 'RECEITA' ? Math.abs(amount) : -Math.abs(amount),
      icon: '',
      occurredAt: row.dataOcorrencia,
    };
  });
}

export async function getFinancialSummary(): Promise<FinancialSummary> {
  const summary = await request<Record<keyof FinancialSummary, number | string>>('/resumo');
  return {
    saldoGeral: Number(summary.saldoGeral) || 0,
    totalReceitas: Number(summary.totalReceitas) || 0,
    totalDespesas: Number(summary.totalDespesas) || 0,
  };
}

export function sendChatMessage(message: string): Promise<ChatResult> {
  return request<ChatResult>('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  }, CHAT_TIMEOUT_MS);
}

export async function transcribeAudio(uri: string): Promise<TranscriptionResult> {
  const formData = new FormData();

  if (Platform.OS === 'web') {
    const audioBlob = await (await fetch(uri)).blob();
    formData.append('audioMessage', audioBlob, 'gravacao.webm');
  } else {
    formData.append('audioMessage', new File(uri));
  }

  return await request<TranscriptionResult>('/transcriptions', {
    method: 'POST',
    body: formData,
  }, TRANSCRIPTION_TIMEOUT_MS);
}

export async function getPerfilUsuario(): Promise<UsuarioLogado> {
  return await request<UsuarioLogado>('/usuario/perfil');
}
