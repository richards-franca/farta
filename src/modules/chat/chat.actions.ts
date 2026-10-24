"use server";

import { callApi } from "@/lib/backend/client";
import type { Operations } from "@farta/contracts";
export type { ConversationSummary, ChatMessage } from '@farta/contracts';

export async function listDirectConversations(...args: Parameters<Operations['chat.chat.listDirectConversations']>): ReturnType<Operations['chat.chat.listDirectConversations']> {
  return callApi('chat.chat.listDirectConversations', args);
}

export async function listDirectMessages(...args: Parameters<Operations['chat.chat.listDirectMessages']>): ReturnType<Operations['chat.chat.listDirectMessages']> {
  return callApi('chat.chat.listDirectMessages', args);
}

export async function sendDirectMessage(...args: Parameters<Operations['chat.chat.sendDirectMessage']>): ReturnType<Operations['chat.chat.sendDirectMessage']> {
  return callApi('chat.chat.sendDirectMessage', args);
}

export async function createDirectConversation(...args: Parameters<Operations['chat.chat.createDirectConversation']>): ReturnType<Operations['chat.chat.createDirectConversation']> {
  return callApi('chat.chat.createDirectConversation', args);
}
