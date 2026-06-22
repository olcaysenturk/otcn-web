"use client";

import { getIcrypexWsUrl } from "@/lib/api/getIcrypexApiBase";
import { useGlobalMarketStore } from "@/stores/useGlobalMarketStore";
import { useTickerStore } from "@/stores/useTickerStore";
import type { IcrypexMarketAsset, IcrypexTicker } from "@/types/icrypex";

const RECONNECT_INTERVAL_MS = 2500;

type SocketMessage = {
  type: string;
  data: unknown;
};

let socket: WebSocket | null = null;
let connecting = false;
let started = false;

function send(messageType: string, model: unknown) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(`${messageType}|${JSON.stringify(model)}`);
}

function handleMessage(event: MessageEvent) {
  const raw = String(event.data);
  const separatorIndex = raw.indexOf("|");
  if (separatorIndex < 0) return;

  const type = raw.substring(0, separatorIndex);
  const json = raw.substring(separatorIndex + 1);

  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return;
  }

  const message: SocketMessage = { type, data };

  if (message.type === "tickers") {
    const list = (message.data as { t: IcrypexTicker[] })?.t;
    if (Array.isArray(list)) useTickerStore.getState().upsertTickers(list);
  } else if (message.type === "market") {
    const list = (message.data as { a: IcrypexMarketAsset[] })?.a;
    if (Array.isArray(list)) useGlobalMarketStore.getState().upsertAssets(list);
  }
}

function connect() {
  if (connecting || (socket && socket.readyState === WebSocket.OPEN)) return;

  connecting = true;
  socket = new WebSocket(getIcrypexWsUrl());

  socket.onopen = () => {
    connecting = false;
    send("subscribe", { c: "tickers", s: true });
    send("subscribe", { c: "market", s: true });
  };

  socket.onclose = () => {
    connecting = false;
    socket = null;
  };

  socket.onerror = () => {
    connecting = false;
  };

  socket.onmessage = handleMessage;
}

/** Starts the singleton Icrypex market-data websocket connection (idempotent). */
export function startIcrypexSocket() {
  if (started || typeof window === "undefined") return;
  started = true;

  connect();
  setInterval(() => {
    if (!socket || socket.readyState === WebSocket.CLOSED) connect();
  }, RECONNECT_INTERVAL_MS);
}
