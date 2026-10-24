"use server";

import { callApi } from "@/lib/backend/client";
import type { Operations } from "@farta/contracts";
export type { InvitationResult, CreateInvitationResult } from '@farta/contracts';

export async function acceptCompanyInvitation(...args: Parameters<Operations['invitations.invitation.acceptCompanyInvitation']>): ReturnType<Operations['invitations.invitation.acceptCompanyInvitation']> {
  return callApi('invitations.invitation.acceptCompanyInvitation', args);
}

export async function createCompanyInvitation(...args: Parameters<Operations['invitations.invitation.createCompanyInvitation']>): ReturnType<Operations['invitations.invitation.createCompanyInvitation']> {
  return callApi('invitations.invitation.createCompanyInvitation', args);
}
