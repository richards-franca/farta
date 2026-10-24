export type * from './domain.js';
import type { AdminCompanyPrice, AdminOrder, CompanyOrderDetails, CompanyDriver, FinalPriceInput, OrderNextStatus, CompanyInput, AdminCategory, AdminProduct, AdminVariant, AdminProductImage, ConfirmOrderResult, OrderListItem, OrderNotification, OrderDetails, CatalogListItem, ActiveCart, CustomerContextResult, AddressOption, NewAddress, InvitationResult, CreateInvitationResult, ConversationSummary, ChatMessage, Banner, EstablishmentOption, AuthResult } from './domain.js';
export interface Operations {
  'admin.admin.getCompany': (companyId: string) => Promise<{ ok: false; message: string; company?: undefined; } | { ok: true; company: Record<string, unknown>; message?: undefined; }>;
  'admin.admin.listCompanies': () => Promise<{ ok: false; message: string; companies?: undefined; } | { ok: true; companies: { display_name: string; establishments_count: number; id: string; legal_name: string; status: string; tax_id: string; }[]; message?: undefined; }>;
  'admin.admin.listEstablishments': (companyId: string) => Promise<{ ok: false; message: string; establishments?: undefined; } | { ok: true; establishments: { address_label: string; city: string; id: string; name: string; state: string; status: string; }[]; message?: undefined; }>;
  'admin.admin.listCompanyInvitations': (companyId: string) => Promise<{ ok: false; message: string; invitations?: undefined; } | { ok: true; invitations: { created_at: string; expires_at: string; invitation_id: string; invited_email: string; status: string; }[]; message?: undefined; }>;
  'admin.admin.revokeCompanyInvitation': (invitationId: string) => Promise<{ ok: false; message: string; } | { ok: true; message?: undefined; }>;
  'admin.admin.updateCompany': (companyId: string, data: Record<string, string | number>) => Promise<{ ok: false; message: string; company?: undefined; } | { ok: true; company: { display_name: string; id: string; status: string; }; message?: undefined; }>;
  'admin.admin.setEstablishmentStatus': (establishmentId: string, status: "ACTIVE" | "INACTIVE") => Promise<{ ok: false; message: string; } | { ok: true; message?: undefined; }>;
  'admin.admin.setCompanyStatus': (companyId: string, status: "ACTIVE" | "INACTIVE") => Promise<{ ok: false; message: string; } | { ok: true; message?: undefined; }>;
  'admin.admin.listAdminCompanyPrices': (companyId: string) => Promise<{ ok: false; message: string; prices: AdminCompanyPrice[]; } | { ok: true; prices: AdminCompanyPrice[]; message?: undefined; }>;
  'admin.admin.upsertAdminCompanyPrice': (input: { companyId: string; skuId: string; amountMinor: number; }) => Promise<{ ok: false; message: string; price?: undefined; } | { ok: true; price: { price_id: string; amount_minor: number; }; message?: undefined; }>;
  'admin.admin.upsertAdminCompanyPrices': (input: { companyIds: string[]; skuId: string; amountMinor: number; }) => Promise<{ ok: false; message: string; count?: undefined; } | { ok: true; count: number; message?: undefined; }>;
  'admin.admin.getCompanyOrderDetails': (orderId: string) => Promise<{ ok: false; message: string; order?: undefined; } | { ok: true; order: CompanyOrderDetails; message?: undefined; }>;
  'admin.admin.listAdminOrders': (status?: string | undefined) => Promise<{ ok: false; message: string; orders: AdminOrder[]; } | { ok: true; orders: AdminOrder[]; message?: undefined; }>;
  'admin.admin.startOrderPicking': (orderId: string) => Promise<{ ok: false; message: string; } | { ok: true; message?: undefined; }>;
  'admin.admin.listCompanyOrders': (status?: string | undefined) => Promise<{ ok: false; message: string; orders: AdminOrder[]; } | { ok: true; orders: AdminOrder[]; message?: undefined; }>;
  'admin.admin.listCompanyDrivers': () => Promise<{ ok: false; message: string; drivers: CompanyDriver[]; } | { ok: true; drivers: CompanyDriver[]; message?: undefined; }>;
  'admin.admin.assignCompanyOrderDriver': (orderId: string, driverProfileId: string) => Promise<{ ok: false; message: string; } | { ok: true; message?: undefined; }>;
  'admin.admin.startCompanyOrderPicking': (orderId: string) => Promise<{ ok: false; message: string; } | { ok: true; message?: undefined; }>;
  'admin.admin.setOrderFinalPrices': (orderId: string, items: FinalPriceInput[], reason?: string | undefined) => Promise<{ ok: false; message: string; } | { ok: true; message?: undefined; }>;
  'admin.admin.advanceOrderStatus': (orderId: string, toStatus: OrderNextStatus) => Promise<{ ok: false; message: string; } | { ok: true; message?: undefined; }>;
  'admin.admin.createCompany': (input: CompanyInput) => Promise<{ ok: false; message: string; company?: undefined; } | { ok: true; company: { display_name: string; id: string; }; message?: undefined; }>;
  'admin.admin.createEstablishment': (input: { companyId: string; name: string; address: { label: string; addressLine: string; addressNumber: string; addressComplement?: string; district: string; city: string; state: string; postalCode: string; }; }) => Promise<{ ok: false; message: string; establishment?: undefined; } | { ok: true; establishment: { id: string; name: string; }; message?: undefined; }>;
  'admin.admin.listAdminCategories': (status?: "ACTIVE" | "INACTIVE" | undefined) => Promise<{ ok: false; message: string; categories: AdminCategory[]; } | { ok: true; categories: AdminCategory[]; message?: undefined; }>;
  'admin.admin.createAdminCategory': (input: { name: string; sortOrder?: number; }) => Promise<{ ok: false; message: string; category?: undefined; } | { ok: true; category: AdminCategory; message?: undefined; }>;
  'admin.admin.updateAdminCategory': (input: { id: string; name: string; sortOrder: number; status: "ACTIVE" | "INACTIVE"; confirmReassign?: boolean; }) => Promise<{ ok: false; message: string; } | { ok: true; message?: undefined; }>;
  'admin.admin.deleteAdminCategory': (id: string, confirmReassign?: boolean) => Promise<{ ok: false; message: string; } | { ok: true; message?: undefined; }>;
  'admin.admin.listAdminProducts': (status?: "ACTIVE" | "INACTIVE" | undefined) => Promise<{ ok: false; message: string; products: AdminProduct[]; } | { ok: true; products: AdminProduct[]; message?: undefined; }>;
  'admin.admin.createAdminProduct': (input: { categoryId: string; name: string; brand?: string; description?: string; status?: "ACTIVE" | "INACTIVE"; }) => Promise<{ ok: false; message: string; product?: undefined; } | { ok: true; product: AdminProduct; message?: undefined; }>;
  'admin.admin.updateAdminProduct': (input: { id: string; categoryId: string; name: string; brand?: string; description?: string; status: "ACTIVE" | "INACTIVE"; }) => Promise<{ ok: false; message: string; } | { ok: true; message?: undefined; }>;
  'admin.admin.listAdminVariants': (productId: string) => Promise<{ ok: false; message: string; variants: AdminVariant[]; } | { ok: true; variants: AdminVariant[]; message?: undefined; }>;
  'admin.admin.createAdminVariant': (input: { productId: string; skuCode: string; name: string; saleUnit: string; minimumQuantity: number; status?: "ACTIVE" | "INACTIVE"; }) => Promise<{ ok: false; message: string; variant?: undefined; } | { ok: true; variant: AdminVariant; message?: undefined; }>;
  'admin.admin.updateAdminVariant': (input: { id: string; skuCode: string; name: string; saleUnit: string; minimumQuantity: number; status: "ACTIVE" | "INACTIVE"; }) => Promise<{ ok: false; message: string; } | { ok: true; message?: undefined; }>;
  'admin.admin.listAdminProductImages': (owner: { productId?: string; variantId?: string; }) => Promise<{ ok: false; message: string; images: AdminProductImage[]; } | { ok: true; images: AdminProductImage[]; message?: undefined; }>;
  'admin.admin.uploadAdminProductImage': (input: { productId?: string; variantId?: string; altText: string; file: File; isPrimary?: boolean; }) => Promise<{ ok: false; message: string; image?: undefined; } | { ok: true; image: { alt_text: string; byte_size: number; created_at: string; id: string; is_primary: boolean; mime_type: string; product_id: string | null; sort_order: number; storage_object_path: string; variant_id: string | null; }; message?: undefined; }>;
  'admin.admin.getAdminImageUrl': (path: string) => Promise<{ ok: false; message: string; url?: undefined; } | { ok: true; url: string; message?: undefined; }>;
  'admin.admin-status.changeEstablishmentStatus': (establishmentId: string, status: "ACTIVE" | "INACTIVE") => Promise<{ ok: false; message: string; } | { ok: true; message?: undefined; }>;
  'orders.order.listOrders': () => Promise<{ ok: true; orders: OrderListItem[]; } | { ok: false; orders: []; message: string; }>;
  'orders.order.listOrderNotifications': () => Promise<{ ok: true; notifications: OrderNotification[]; } | { ok: false; notifications: []; message: string; }>;
  'orders.order.getOrderDetails': (orderId: string) => Promise<{ ok: true; order: OrderDetails; } | { ok: false; message: string; }>;
  'orders.order.confirmOrderReceipt': (orderId: string) => Promise<{ ok: true; } | { ok: false; message: string; }>;
  'orders.order.cancelOrder': (orderId: string, reason: string) => Promise<{ ok: true; } | { ok: false; message: string; }>;
  'orders.order.setCartItemQuantity': (input: { cartId: string; skuId: string; quantity: number; }) => Promise<{ ok: true; } | { ok: false; message: string; }>;
  'orders.order.getActiveCart': () => Promise<{ ok: true; cart: ActiveCart | null; } | { ok: false; cart: null; message: string; }>;
  'orders.order.listCatalog': () => Promise<{ ok: true; products: CatalogListItem[]; } | { ok: false; products: []; message: string; }>;
  'orders.order.addCatalogItem': (skuId: string, quantity?: number) => Promise<{ ok: true; quantity: number; } | { ok: false; message: string; }>;
  'orders.order.confirmActiveCart': (input: { cartId: string; addressId: string; deliveryWindow: "Hoje" | "Amanh\u00E3"; customerNote?: string; }) => Promise<ConfirmOrderResult>;
  'orders.order.confirmFinalOrderPrice': (orderId: string) => Promise<{ ok: true; } | { ok: false; message: string; }>;
  'customer.customer.getCustomerContext': () => Promise<CustomerContextResult>;
  'customer.customer.selectCustomerEstablishment': (establishmentId: string) => Promise<{ ok: true; selected: EstablishmentOption; } | { ok: false; message: string; }>;
  'customer.customer.listActiveAddresses': () => Promise<{ ok: true; addresses: AddressOption[]; } | { ok: false; addresses: []; message: string; }>;
  'customer.customer.createAddress': (input: NewAddress) => Promise<{ ok: true; addressId: string; } | { ok: false; message: string; field?: keyof NewAddress; }>;
  'invitations.invitation.acceptCompanyInvitation': (input: { token: string; fullName?: string; }) => Promise<InvitationResult>;
  'invitations.invitation.createCompanyInvitation': (input: { companyId: string; email: string; role?: "CUSTOMER" | "INTERNAL_OPERATOR" | "DRIVER"; expiresInDays?: number; }) => Promise<CreateInvitationResult>;
  'chat.chat.listDirectConversations': () => Promise<{ ok: false; conversations: ConversationSummary[]; message: string; } | { ok: true; conversations: ConversationSummary[]; message?: undefined; }>;
  'chat.chat.listDirectMessages': (conversationId: string) => Promise<{ ok: false; messages: ChatMessage[]; message: string; } | { ok: true; messages: ChatMessage[]; message?: undefined; }>;
  'chat.chat.sendDirectMessage': (conversationId: string, body: string) => Promise<{ ok: false; message: string; } | { ok: true; message: ChatMessage; }>;
  'chat.chat.createDirectConversation': (peerProfileId: string) => Promise<{ ok: false; message: string; conversation?: undefined; } | { ok: true; conversation: { company_id: string; created_at: string; created_by_profile_id: string; id: string; status: string; updated_at: string; }; message?: undefined; }>;
  'banners.banner.listActiveBanners': () => Promise<{ ok: false; banners: never[]; message: string; } | { ok: true; banners: { imageUrl: string | null; id: string; storage_object_path: string; mime_type: string; byte_size: number; alt_text: string; title: string | null; status: "ACTIVE" | "INACTIVE"; sort_order: number; created_at: string; updated_at: string; }[]; message?: undefined; }>;
  'banners.banner.listAdminBanners': () => Promise<{ ok: false; banners: Banner[]; message: string; } | { ok: true; banners: { imageUrl: string | null; id: string; storage_object_path: string; mime_type: string; byte_size: number; alt_text: string; title: string | null; status: "ACTIVE" | "INACTIVE"; sort_order: number; created_at: string; updated_at: string; }[]; message?: undefined; }>;
  'banners.banner.createAdminBanner': (input: { altText: string; title: string; sortOrder: number; status: "ACTIVE" | "INACTIVE"; file: File; }) => Promise<{ ok: false; message: string; banner?: undefined; } | { ok: true; banner: Banner; message?: undefined; }>;
  'banners.banner.updateAdminBanner': (input: { id: string; altText: string; title: string; sortOrder: number; status: "ACTIVE" | "INACTIVE"; }) => Promise<{ ok: false; message: string; banner?: undefined; } | { ok: true; banner: Banner; message?: undefined; }>;
  'profile.updateMyPhone': (phone: string) => Promise<AuthResult>;
}
export type OperationName = keyof Operations;
export const routes = {
  "admin.admin.getCompany": {
    "path": "/v1/admin/admin/get-company",
    "upload": false
  },
  "admin.admin.listCompanies": {
    "path": "/v1/admin/admin/list-companies",
    "upload": false
  },
  "admin.admin.listEstablishments": {
    "path": "/v1/admin/admin/list-establishments",
    "upload": false
  },
  "admin.admin.listCompanyInvitations": {
    "path": "/v1/admin/admin/list-company-invitations",
    "upload": false
  },
  "admin.admin.revokeCompanyInvitation": {
    "path": "/v1/admin/admin/revoke-company-invitation",
    "upload": false
  },
  "admin.admin.updateCompany": {
    "path": "/v1/admin/admin/update-company",
    "upload": false
  },
  "admin.admin.setEstablishmentStatus": {
    "path": "/v1/admin/admin/set-establishment-status",
    "upload": false
  },
  "admin.admin.setCompanyStatus": {
    "path": "/v1/admin/admin/set-company-status",
    "upload": false
  },
  "admin.admin.listAdminCompanyPrices": {
    "path": "/v1/admin/admin/list-admin-company-prices",
    "upload": false
  },
  "admin.admin.upsertAdminCompanyPrice": {
    "path": "/v1/admin/admin/upsert-admin-company-price",
    "upload": false
  },
  "admin.admin.upsertAdminCompanyPrices": {
    "path": "/v1/admin/admin/upsert-admin-company-prices",
    "upload": false
  },
  "admin.admin.getCompanyOrderDetails": {
    "path": "/v1/admin/admin/get-company-order-details",
    "upload": false
  },
  "admin.admin.listAdminOrders": {
    "path": "/v1/admin/admin/list-admin-orders",
    "upload": false
  },
  "admin.admin.startOrderPicking": {
    "path": "/v1/admin/admin/start-order-picking",
    "upload": false
  },
  "admin.admin.listCompanyOrders": {
    "path": "/v1/admin/admin/list-company-orders",
    "upload": false
  },
  "admin.admin.listCompanyDrivers": {
    "path": "/v1/admin/admin/list-company-drivers",
    "upload": false
  },
  "admin.admin.assignCompanyOrderDriver": {
    "path": "/v1/admin/admin/assign-company-order-driver",
    "upload": false
  },
  "admin.admin.startCompanyOrderPicking": {
    "path": "/v1/admin/admin/start-company-order-picking",
    "upload": false
  },
  "admin.admin.setOrderFinalPrices": {
    "path": "/v1/admin/admin/set-order-final-prices",
    "upload": false
  },
  "admin.admin.advanceOrderStatus": {
    "path": "/v1/admin/admin/advance-order-status",
    "upload": false
  },
  "admin.admin.createCompany": {
    "path": "/v1/admin/admin/create-company",
    "upload": false
  },
  "admin.admin.createEstablishment": {
    "path": "/v1/admin/admin/create-establishment",
    "upload": false
  },
  "admin.admin.listAdminCategories": {
    "path": "/v1/admin/admin/list-admin-categories",
    "upload": false
  },
  "admin.admin.createAdminCategory": {
    "path": "/v1/admin/admin/create-admin-category",
    "upload": false
  },
  "admin.admin.updateAdminCategory": {
    "path": "/v1/admin/admin/update-admin-category",
    "upload": false
  },
  "admin.admin.deleteAdminCategory": {
    "path": "/v1/admin/admin/delete-admin-category",
    "upload": false
  },
  "admin.admin.listAdminProducts": {
    "path": "/v1/admin/admin/list-admin-products",
    "upload": false
  },
  "admin.admin.createAdminProduct": {
    "path": "/v1/admin/admin/create-admin-product",
    "upload": false
  },
  "admin.admin.updateAdminProduct": {
    "path": "/v1/admin/admin/update-admin-product",
    "upload": false
  },
  "admin.admin.listAdminVariants": {
    "path": "/v1/admin/admin/list-admin-variants",
    "upload": false
  },
  "admin.admin.createAdminVariant": {
    "path": "/v1/admin/admin/create-admin-variant",
    "upload": false
  },
  "admin.admin.updateAdminVariant": {
    "path": "/v1/admin/admin/update-admin-variant",
    "upload": false
  },
  "admin.admin.listAdminProductImages": {
    "path": "/v1/admin/admin/list-admin-product-images",
    "upload": false
  },
  "admin.admin.uploadAdminProductImage": {
    "path": "/v1/admin/admin/upload-admin-product-image",
    "upload": true
  },
  "admin.admin.getAdminImageUrl": {
    "path": "/v1/admin/admin/get-admin-image-url",
    "upload": false
  },
  "admin.admin-status.changeEstablishmentStatus": {
    "path": "/v1/admin/admin-status/change-establishment-status",
    "upload": false
  },
  "orders.order.listOrders": {
    "path": "/v1/orders/order/list-orders",
    "upload": false
  },
  "orders.order.listOrderNotifications": {
    "path": "/v1/orders/order/list-order-notifications",
    "upload": false
  },
  "orders.order.getOrderDetails": {
    "path": "/v1/orders/order/get-order-details",
    "upload": false
  },
  "orders.order.confirmOrderReceipt": {
    "path": "/v1/orders/order/confirm-order-receipt",
    "upload": false
  },
  "orders.order.cancelOrder": {
    "path": "/v1/orders/order/cancel-order",
    "upload": false
  },
  "orders.order.setCartItemQuantity": {
    "path": "/v1/orders/order/set-cart-item-quantity",
    "upload": false
  },
  "orders.order.getActiveCart": {
    "path": "/v1/orders/order/get-active-cart",
    "upload": false
  },
  "orders.order.listCatalog": {
    "path": "/v1/orders/order/list-catalog",
    "upload": false
  },
  "orders.order.addCatalogItem": {
    "path": "/v1/orders/order/add-catalog-item",
    "upload": false
  },
  "orders.order.confirmActiveCart": {
    "path": "/v1/orders/order/confirm-active-cart",
    "upload": false
  },
  "orders.order.confirmFinalOrderPrice": {
    "path": "/v1/orders/order/confirm-final-order-price",
    "upload": false
  },
  "customer.customer.getCustomerContext": {
    "path": "/v1/customer/customer/get-customer-context",
    "upload": false
  },
  "customer.customer.selectCustomerEstablishment": {
    "path": "/v1/customer/customer/select-customer-establishment",
    "upload": false
  },
  "customer.customer.listActiveAddresses": {
    "path": "/v1/customer/customer/list-active-addresses",
    "upload": false
  },
  "customer.customer.createAddress": {
    "path": "/v1/customer/customer/create-address",
    "upload": false
  },
  "invitations.invitation.acceptCompanyInvitation": {
    "path": "/v1/invitations/invitation/accept-company-invitation",
    "upload": false
  },
  "invitations.invitation.createCompanyInvitation": {
    "path": "/v1/invitations/invitation/create-company-invitation",
    "upload": false
  },
  "chat.chat.listDirectConversations": {
    "path": "/v1/chat/chat/list-direct-conversations",
    "upload": false
  },
  "chat.chat.listDirectMessages": {
    "path": "/v1/chat/chat/list-direct-messages",
    "upload": false
  },
  "chat.chat.sendDirectMessage": {
    "path": "/v1/chat/chat/send-direct-message",
    "upload": false
  },
  "chat.chat.createDirectConversation": {
    "path": "/v1/chat/chat/create-direct-conversation",
    "upload": false
  },
  "banners.banner.listActiveBanners": {
    "path": "/v1/banners/banner/list-active-banners",
    "upload": false
  },
  "banners.banner.listAdminBanners": {
    "path": "/v1/banners/banner/list-admin-banners",
    "upload": false
  },
  "banners.banner.createAdminBanner": {
    "path": "/v1/banners/banner/create-admin-banner",
    "upload": true
  },
  "banners.banner.updateAdminBanner": {
    "path": "/v1/banners/banner/update-admin-banner",
    "upload": false
  },
  "profile.updateMyPhone": {
    "path": "/v1/profile/phone",
    "upload": false
  }
} as const;
