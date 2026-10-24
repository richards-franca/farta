"use server";

import { callApi } from "@/lib/backend/client";
import type { Operations } from "@farta/contracts";

export async function changeEstablishmentStatus(...args: Parameters<Operations['admin.admin-status.changeEstablishmentStatus']>): ReturnType<Operations['admin.admin-status.changeEstablishmentStatus']> {
  return callApi('admin.admin-status.changeEstablishmentStatus', args);
}
