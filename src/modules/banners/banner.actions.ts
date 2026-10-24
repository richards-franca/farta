"use server";

import { callApi } from "@/lib/backend/client";
import type { Operations } from "@farta/contracts";
export type { Banner } from '@farta/contracts';

export async function listActiveBanners(...args: Parameters<Operations['banners.banner.listActiveBanners']>): ReturnType<Operations['banners.banner.listActiveBanners']> {
  return callApi('banners.banner.listActiveBanners', args);
}

export async function listAdminBanners(...args: Parameters<Operations['banners.banner.listAdminBanners']>): ReturnType<Operations['banners.banner.listAdminBanners']> {
  return callApi('banners.banner.listAdminBanners', args);
}

export async function createAdminBanner(...args: Parameters<Operations['banners.banner.createAdminBanner']>): ReturnType<Operations['banners.banner.createAdminBanner']> {
  return callApi('banners.banner.createAdminBanner', args);
}

export async function updateAdminBanner(...args: Parameters<Operations['banners.banner.updateAdminBanner']>): ReturnType<Operations['banners.banner.updateAdminBanner']> {
  return callApi('banners.banner.updateAdminBanner', args);
}
