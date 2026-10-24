"use server";

import { callApi } from "@/lib/backend/client";
import type { Operations } from "@farta/contracts";
export type { ConfirmOrderResult, FinalOrderPriceResult, OrderListItem, OrderNotification, OrderDetails, CatalogListItem, ActiveCartItem, ActiveCart } from '@farta/contracts';

export async function listOrders(...args: Parameters<Operations['orders.order.listOrders']>): ReturnType<Operations['orders.order.listOrders']> {
  return callApi('orders.order.listOrders', args);
}

export async function listOrderNotifications(...args: Parameters<Operations['orders.order.listOrderNotifications']>): ReturnType<Operations['orders.order.listOrderNotifications']> {
  return callApi('orders.order.listOrderNotifications', args);
}

export async function getOrderDetails(...args: Parameters<Operations['orders.order.getOrderDetails']>): ReturnType<Operations['orders.order.getOrderDetails']> {
  return callApi('orders.order.getOrderDetails', args);
}

export async function confirmOrderReceipt(...args: Parameters<Operations['orders.order.confirmOrderReceipt']>): ReturnType<Operations['orders.order.confirmOrderReceipt']> {
  return callApi('orders.order.confirmOrderReceipt', args);
}

export async function cancelOrder(...args: Parameters<Operations['orders.order.cancelOrder']>): ReturnType<Operations['orders.order.cancelOrder']> {
  return callApi('orders.order.cancelOrder', args);
}

export async function setCartItemQuantity(...args: Parameters<Operations['orders.order.setCartItemQuantity']>): ReturnType<Operations['orders.order.setCartItemQuantity']> {
  return callApi('orders.order.setCartItemQuantity', args);
}

export async function getActiveCart(...args: Parameters<Operations['orders.order.getActiveCart']>): ReturnType<Operations['orders.order.getActiveCart']> {
  return callApi('orders.order.getActiveCart', args);
}

export async function listCatalog(...args: Parameters<Operations['orders.order.listCatalog']>): ReturnType<Operations['orders.order.listCatalog']> {
  return callApi('orders.order.listCatalog', args);
}

export async function addCatalogItem(...args: Parameters<Operations['orders.order.addCatalogItem']>): ReturnType<Operations['orders.order.addCatalogItem']> {
  return callApi('orders.order.addCatalogItem', args);
}

export async function confirmActiveCart(...args: Parameters<Operations['orders.order.confirmActiveCart']>): ReturnType<Operations['orders.order.confirmActiveCart']> {
  return callApi('orders.order.confirmActiveCart', args);
}

export async function confirmFinalOrderPrice(...args: Parameters<Operations['orders.order.confirmFinalOrderPrice']>): ReturnType<Operations['orders.order.confirmFinalOrderPrice']> {
  return callApi('orders.order.confirmFinalOrderPrice', args);
}
