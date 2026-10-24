// Application DTOs shared by the web and API. No runtime provider dependency.
export type AdminCompanyPrice = {
  company_id: string; company_name: string; company_status: string; sku_id: string; product_id: string;
  product_name: string; brand: string | null; variant_name: string; sku_code: string; sale_unit: string;
  sku_status: string; product_status: string; minimum_quantity: number; price_id: string | null; amount_minor: number | null;
  currency_code: string | null; price_status: string | null; valid_from: string | null; valid_until: string | null;
};

export type AdminOrder = { id: string; order_number: number; company_id: string; company_name: string; establishment_name: string; created_at: string; status: string; total_minor: number; units: number; delivery_window: string };

export type CompanyOrderDetails = {
  id: string; orderNumber: number; companyId: string; companyName: string; establishmentName: string;
  customer?: { name: string | null; phone: string | null } | null;
  status: string; createdAt: string; confirmedWindow: Record<string, unknown> | null; requestedWindow: Record<string, unknown> | null;
  address: Record<string, unknown>; subtotalMinor: number; deliveryFeeMinor: number; totalMinor: number;
  customerNote: string | null;
  approximateSubtotalMinor: number | null; approximateTotalMinor: number | null; finalSubtotalMinor: number | null; finalTotalMinor: number | null; finalConfirmedAt: string | null;
  items: Array<{ id: string; skuId: string; skuCode: string | null; productName: string; brand: string | null; variantName: string; unit: string; quantity: number; unitPriceMinor: number; subtotalMinor: number; approximateUnitPriceMinor: number | null; approximateSubtotalMinor: number | null; finalUnitPriceMinor: number | null; finalSubtotalMinor: number | null }>;
  history: Array<{ fromStatus: string | null; toStatus: string; changedAt: string; reason: string | null }>;
};

export type CompanyDriver = { id: string; full_name: string };

export type FinalPriceInput = { skuId: string; unitPriceMinor: number };

export type OrderNextStatus = 'PICKING' | 'READY_FOR_DISPATCH' | 'DISPATCHED' | 'DELIVERED' | 'RECEIPT_CONFIRMED';

export type CompanyInput = {
  legalName: string; displayName: string; taxId: string; stateRegistration?: string;
  corporateEmail: string; corporatePhone?: string; fiscalAddressLine: string; fiscalAddressNumber: string;
  fiscalAddressComplement?: string; fiscalDistrict: string; fiscalCity: string; fiscalState: string;
  fiscalPostalCode: string; legalRepresentativeName: string; legalRepresentativeEmail: string;
  legalRepresentativePhone?: string; operationalContactName: string; operationalContactEmail: string;
  operationalContactPhone?: string; paymentTermsDays?: number; creditLimitMinor?: number;
};

export type AdminCategory = { id: string; name: string; sort_order: number; status: string; created_at: string; updated_at: string };

export type AdminProduct = { id: string; category_id: string; category_name: string; name: string; brand: string | null; description: string | null; status: string; created_at: string; updated_at: string };

export type AdminVariant = { id: string; product_id: string; sku_code: string; name: string; attributes: Record<string, unknown>; sale_unit: string; minimum_quantity: number; status: string; created_at: string; updated_at: string };

export type AdminProductImage = { id: string; product_id: string | null; variant_id: string | null; storage_object_path: string; mime_type: string; byte_size: number; alt_text: string; sort_order: number; is_primary: boolean };

export type ConfirmOrderResult =
  | { ok: true; orderId: string; orderNumber: number }
  | { ok: false; message: string };

export type FinalOrderPriceResult = { ok: true } | { ok: false; message: string };

export type OrderListItem = {
  id: string;
  orderNumber: number;
  createdAt: string;
  totalMinor: number;
  units: number;
  status: string;
  delivery: string;
};

export type OrderNotification = { id: string; orderId: string; orderNumber: number; toStatus: string; changedAt: string; reason: string | null };

export type OrderDetails = {
  id: string;
  orderNumber: number;
  status: string;
  createdAt: string;
  totalMinor: number;
  approximateTotalMinor: number | null;
  finalTotalMinor: number | null;
  finalConfirmedAt: string | null;
  customerNote: string | null;
  delivery: string;
  address: string;
  items: Array<{ id: string; name: string; unit: string; quantity: number; unitPriceMinor: number; subtotalMinor: number; approximateUnitPriceMinor: number | null; finalUnitPriceMinor: number | null }>;
  history: Array<{ fromStatus: string | null; toStatus: string; changedAt: string; reason: string | null }>;
};

export type CatalogListItem = { skuId: string; name: string; brand: string; detail: string; saleUnit: string; category: string; priceMinor: number | null; minimumQuantity: number; imageUrl?: string | null; imageAlt?: string };

export type ActiveCartItem = { id: string; skuId: string; name: string; brand: string; detail: string; saleUnit: string; minimumQuantity: number; quantity: number; unitPriceMinor: number; subtotalMinor: number };

export type ActiveCart = { id: string; establishmentId: string; items: ActiveCartItem[]; totalMinor: number; units: number };

export type CustomerContextResult =
  | { ok: true; establishments: EstablishmentOption[]; selected: EstablishmentOption | null }
  | { ok: false; message: string };

export type AddressOption = {
  id: string; label: string; addressLine: string; addressNumber: string; addressComplement: string | null;
  district: string; city: string; state: string; postalCode: string; isDefault: boolean;
};

export type NewAddress = {
  label: string; addressLine: string; addressNumber: string; addressComplement: string;
  district: string; city: string; state: string; postalCode: string;
};

export type InvitationResult =
  | { ok: true; companyId: string; companyName: string }
  | { ok: false; message: string };

export type CreateInvitationResult =
  | { ok: true; invitationId: string; token: string; expiresAt: string }
  | { ok: false; message: string };

export type ConversationSummary = {
  id: string;
  company_id: string;
  status: string;
  peer_profile_id: string;
  peer_name: string;
  peer_role: string;
  last_message: string | null;
  last_message_at: string | null;
};

export type ChatMessage = {
  id: string;
  sender_profile_id: string;
  body: string;
  created_at: string;
};

export type Banner = {
  id: string;
  storage_object_path: string;
  mime_type: string;
  byte_size: number;
  alt_text: string;
  title: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type EstablishmentOption = { id: string; name: string };

export type AuthResult =
  | { ok: true; message?: string; session?: boolean }
  | { ok: false; message: string; field?: 'email' | 'password' };

export type OAuthResult =
  | { ok: true; url: string }
  | { ok: false; message: string };
