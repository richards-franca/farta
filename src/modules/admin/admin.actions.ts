"use server";

import { callApi } from "@/lib/backend/client";
import type { Operations } from "@farta/contracts";
export type { AdminCompanyPrice, AdminOrder, CompanyOrderDetails, CompanyDriver, FinalPriceInput, OrderNextStatus, CompanyInput, AdminCategory, AdminProduct, AdminVariant, AdminProductImage } from '@farta/contracts';

export async function getCompany(...args: Parameters<Operations['admin.admin.getCompany']>): ReturnType<Operations['admin.admin.getCompany']> {
  return callApi('admin.admin.getCompany', args);
}

export async function listCompanies(...args: Parameters<Operations['admin.admin.listCompanies']>): ReturnType<Operations['admin.admin.listCompanies']> {
  return callApi('admin.admin.listCompanies', args);
}

export async function listEstablishments(...args: Parameters<Operations['admin.admin.listEstablishments']>): ReturnType<Operations['admin.admin.listEstablishments']> {
  return callApi('admin.admin.listEstablishments', args);
}

export async function listCompanyInvitations(...args: Parameters<Operations['admin.admin.listCompanyInvitations']>): ReturnType<Operations['admin.admin.listCompanyInvitations']> {
  return callApi('admin.admin.listCompanyInvitations', args);
}

export async function revokeCompanyInvitation(...args: Parameters<Operations['admin.admin.revokeCompanyInvitation']>): ReturnType<Operations['admin.admin.revokeCompanyInvitation']> {
  return callApi('admin.admin.revokeCompanyInvitation', args);
}

export async function updateCompany(...args: Parameters<Operations['admin.admin.updateCompany']>): ReturnType<Operations['admin.admin.updateCompany']> {
  return callApi('admin.admin.updateCompany', args);
}

export async function setEstablishmentStatus(...args: Parameters<Operations['admin.admin.setEstablishmentStatus']>): ReturnType<Operations['admin.admin.setEstablishmentStatus']> {
  return callApi('admin.admin.setEstablishmentStatus', args);
}

export async function setCompanyStatus(...args: Parameters<Operations['admin.admin.setCompanyStatus']>): ReturnType<Operations['admin.admin.setCompanyStatus']> {
  return callApi('admin.admin.setCompanyStatus', args);
}

export async function listAdminCompanyPrices(...args: Parameters<Operations['admin.admin.listAdminCompanyPrices']>): ReturnType<Operations['admin.admin.listAdminCompanyPrices']> {
  return callApi('admin.admin.listAdminCompanyPrices', args);
}

export async function upsertAdminCompanyPrice(...args: Parameters<Operations['admin.admin.upsertAdminCompanyPrice']>): ReturnType<Operations['admin.admin.upsertAdminCompanyPrice']> {
  return callApi('admin.admin.upsertAdminCompanyPrice', args);
}

export async function upsertAdminCompanyPrices(...args: Parameters<Operations['admin.admin.upsertAdminCompanyPrices']>): ReturnType<Operations['admin.admin.upsertAdminCompanyPrices']> {
  return callApi('admin.admin.upsertAdminCompanyPrices', args);
}

export async function getCompanyOrderDetails(...args: Parameters<Operations['admin.admin.getCompanyOrderDetails']>): ReturnType<Operations['admin.admin.getCompanyOrderDetails']> {
  return callApi('admin.admin.getCompanyOrderDetails', args);
}

export async function listAdminOrders(...args: Parameters<Operations['admin.admin.listAdminOrders']>): ReturnType<Operations['admin.admin.listAdminOrders']> {
  return callApi('admin.admin.listAdminOrders', args);
}

export async function startOrderPicking(...args: Parameters<Operations['admin.admin.startOrderPicking']>): ReturnType<Operations['admin.admin.startOrderPicking']> {
  return callApi('admin.admin.startOrderPicking', args);
}

export async function listCompanyOrders(...args: Parameters<Operations['admin.admin.listCompanyOrders']>): ReturnType<Operations['admin.admin.listCompanyOrders']> {
  return callApi('admin.admin.listCompanyOrders', args);
}

export async function listCompanyDrivers(...args: Parameters<Operations['admin.admin.listCompanyDrivers']>): ReturnType<Operations['admin.admin.listCompanyDrivers']> {
  return callApi('admin.admin.listCompanyDrivers', args);
}

export async function assignCompanyOrderDriver(...args: Parameters<Operations['admin.admin.assignCompanyOrderDriver']>): ReturnType<Operations['admin.admin.assignCompanyOrderDriver']> {
  return callApi('admin.admin.assignCompanyOrderDriver', args);
}

export async function startCompanyOrderPicking(...args: Parameters<Operations['admin.admin.startCompanyOrderPicking']>): ReturnType<Operations['admin.admin.startCompanyOrderPicking']> {
  return callApi('admin.admin.startCompanyOrderPicking', args);
}

export async function setOrderFinalPrices(...args: Parameters<Operations['admin.admin.setOrderFinalPrices']>): ReturnType<Operations['admin.admin.setOrderFinalPrices']> {
  return callApi('admin.admin.setOrderFinalPrices', args);
}

export async function advanceOrderStatus(...args: Parameters<Operations['admin.admin.advanceOrderStatus']>): ReturnType<Operations['admin.admin.advanceOrderStatus']> {
  return callApi('admin.admin.advanceOrderStatus', args);
}

export async function createCompany(...args: Parameters<Operations['admin.admin.createCompany']>): ReturnType<Operations['admin.admin.createCompany']> {
  return callApi('admin.admin.createCompany', args);
}

export async function createEstablishment(...args: Parameters<Operations['admin.admin.createEstablishment']>): ReturnType<Operations['admin.admin.createEstablishment']> {
  return callApi('admin.admin.createEstablishment', args);
}

export async function listAdminCategories(...args: Parameters<Operations['admin.admin.listAdminCategories']>): ReturnType<Operations['admin.admin.listAdminCategories']> {
  return callApi('admin.admin.listAdminCategories', args);
}

export async function createAdminCategory(...args: Parameters<Operations['admin.admin.createAdminCategory']>): ReturnType<Operations['admin.admin.createAdminCategory']> {
  return callApi('admin.admin.createAdminCategory', args);
}

export async function updateAdminCategory(...args: Parameters<Operations['admin.admin.updateAdminCategory']>): ReturnType<Operations['admin.admin.updateAdminCategory']> {
  return callApi('admin.admin.updateAdminCategory', args);
}

export async function deleteAdminCategory(...args: Parameters<Operations['admin.admin.deleteAdminCategory']>): ReturnType<Operations['admin.admin.deleteAdminCategory']> {
  return callApi('admin.admin.deleteAdminCategory', args);
}

export async function listAdminProducts(...args: Parameters<Operations['admin.admin.listAdminProducts']>): ReturnType<Operations['admin.admin.listAdminProducts']> {
  return callApi('admin.admin.listAdminProducts', args);
}

export async function createAdminProduct(...args: Parameters<Operations['admin.admin.createAdminProduct']>): ReturnType<Operations['admin.admin.createAdminProduct']> {
  return callApi('admin.admin.createAdminProduct', args);
}

export async function updateAdminProduct(...args: Parameters<Operations['admin.admin.updateAdminProduct']>): ReturnType<Operations['admin.admin.updateAdminProduct']> {
  return callApi('admin.admin.updateAdminProduct', args);
}

export async function listAdminVariants(...args: Parameters<Operations['admin.admin.listAdminVariants']>): ReturnType<Operations['admin.admin.listAdminVariants']> {
  return callApi('admin.admin.listAdminVariants', args);
}

export async function createAdminVariant(...args: Parameters<Operations['admin.admin.createAdminVariant']>): ReturnType<Operations['admin.admin.createAdminVariant']> {
  return callApi('admin.admin.createAdminVariant', args);
}

export async function updateAdminVariant(...args: Parameters<Operations['admin.admin.updateAdminVariant']>): ReturnType<Operations['admin.admin.updateAdminVariant']> {
  return callApi('admin.admin.updateAdminVariant', args);
}

export async function listAdminProductImages(...args: Parameters<Operations['admin.admin.listAdminProductImages']>): ReturnType<Operations['admin.admin.listAdminProductImages']> {
  return callApi('admin.admin.listAdminProductImages', args);
}

export async function uploadAdminProductImage(...args: Parameters<Operations['admin.admin.uploadAdminProductImage']>): ReturnType<Operations['admin.admin.uploadAdminProductImage']> {
  return callApi('admin.admin.uploadAdminProductImage', args);
}

export async function getAdminImageUrl(...args: Parameters<Operations['admin.admin.getAdminImageUrl']>): ReturnType<Operations['admin.admin.getAdminImageUrl']> {
  return callApi('admin.admin.getAdminImageUrl', args);
}
