"use server";

import { callApi } from "@/lib/backend/client";
import type { Operations } from "@farta/contracts";
export type { CustomerContextResult, AddressOption, NewAddress } from '@farta/contracts';

export async function getCustomerContext(...args: Parameters<Operations['customer.customer.getCustomerContext']>): ReturnType<Operations['customer.customer.getCustomerContext']> {
  return callApi('customer.customer.getCustomerContext', args);
}

export async function selectCustomerEstablishment(...args: Parameters<Operations['customer.customer.selectCustomerEstablishment']>): ReturnType<Operations['customer.customer.selectCustomerEstablishment']> {
  return callApi('customer.customer.selectCustomerEstablishment', args);
}

export async function listActiveAddresses(...args: Parameters<Operations['customer.customer.listActiveAddresses']>): ReturnType<Operations['customer.customer.listActiveAddresses']> {
  return callApi('customer.customer.listActiveAddresses', args);
}

export async function createAddress(...args: Parameters<Operations['customer.customer.createAddress']>): ReturnType<Operations['customer.customer.createAddress']> {
  return callApi('customer.customer.createAddress', args);
}
