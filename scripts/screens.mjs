/**
 * Every screenshot the site uses: where it is saved (images/<file>.png), the panel
 * address it shows, and who it is shown as. `open` names a link to follow first, for a
 * screen reached from a list (a contact, a message).
 *
 * The demo data is seed_dev's (Acme Retail and its people); voice is shown on the
 * Calling Demo account, whose plan has it.
 */

export const ACME = "priya@acme.in";
export const CALLING = "admin@calling-demo.in";

export const SCREENS = [
  // Using OMNI
  { file: "using/dashboard", path: "/", as: ACME },
  { file: "using/inbox", path: "/inbox", as: ACME },
  { file: "using/contacts", path: "/contacts", as: ACME },
  { file: "using/contact-page", path: "/contacts", open: 'a[href^="/contacts/"][href*="-"]', as: ACME },
  { file: "using/broadcasts", path: "/broadcasts", as: ACME },
  { file: "using/broadcast-new", path: "/broadcasts/new", as: ACME },
  { file: "using/delivery-report", path: "/delivery", as: ACME },
  { file: "using/downloads", path: "/downloads", as: ACME },
  { file: "using/billing", path: "/billing", as: ACME },
  { file: "using/transactions", path: "/billing/transactions", as: ACME },
  { file: "using/team", path: "/settings/team", as: ACME },
  { file: "using/roles", path: "/settings/team/roles", as: ACME },
  { file: "using/plan", path: "/settings/plan", as: ACME },
  { file: "using/modules", path: "/settings/modules", as: ACME },
  { file: "using/branding", path: "/settings/branding", as: ACME },
  { file: "using/settings", path: "/settings", as: ACME },
  { file: "using/channels", path: "/channels", as: ACME },

  // Channels
  { file: "channels/sms-settings", path: "/channels/sms", as: ACME },
  { file: "channels/sms-dashboard", path: "/dashboard/sms", as: ACME },
  { file: "channels/sms-send", path: "/channels/sms/send", as: ACME },
  { file: "channels/sms-senders", path: "/channels/sms/senders", as: ACME },
  { file: "channels/sms-templates", path: "/channels/sms/templates", as: ACME },
  { file: "channels/whatsapp-settings", path: "/channels/whatsapp", as: ACME },
  { file: "channels/whatsapp-dashboard", path: "/dashboard/whatsapp", as: ACME },
  { file: "channels/whatsapp-send", path: "/channels/whatsapp/send", as: ACME },
  { file: "channels/whatsapp-templates", path: "/channels/whatsapp/templates", as: ACME },
  { file: "channels/voice-dashboard", path: "/dashboard/firetone", as: CALLING },
  { file: "channels/voice-calls", path: "/channels/firetone/calls", as: CALLING },
  { file: "channels/voice-numbers", path: "/channels/firetone/numbers", as: CALLING },
  { file: "channels/voice-ivrs", path: "/channels/firetone/ivr", as: CALLING },
  { file: "channels/voice-settings", path: "/channels/firetone", as: CALLING },

  // Batteries
  { file: "batteries/analytics", path: "/analytics", as: ACME },
  { file: "batteries/analytics-new", path: "/analytics/new", as: ACME },
  { file: "batteries/analytics-schedules", path: "/analytics/schedules?built_in=messages.delivery", as: ACME },
  { file: "batteries/agents-overview", path: "/agents/overview", as: ACME },
  { file: "batteries/agents", path: "/agents", as: ACME },
  { file: "batteries/agent-approvals", path: "/agents/approvals", as: ACME },
  { file: "batteries/knowledge", path: "/knowledge", as: ACME },
  { file: "batteries/calendar", path: "/appointments", as: ACME },
  { file: "batteries/booking-types", path: "/appointments/types", as: ACME },
  { file: "batteries/catalogue", path: "/catalogue", as: ACME },
  { file: "batteries/orders", path: "/orders", as: ACME },
  { file: "batteries/audiences", path: "/audiences", as: ACME },
  { file: "batteries/duplicates", path: "/contacts/duplicates", as: ACME },
  { file: "batteries/consent", path: "/settings/consent", as: ACME },
  { file: "batteries/data-sources", path: "/settings/data-sources", as: ACME },
  { file: "batteries/pipelines", path: "/pipelines", as: ACME },
  { file: "batteries/tickets", path: "/tickets", as: ACME },

  // Developers
  { file: "developers/api-keys", path: "/developers", as: ACME },
  { file: "developers/playground", path: "/developers/api", as: ACME },
  { file: "developers/messages", path: "/developers/messages", as: ACME },
  { file: "developers/routes", path: "/developers/routes", as: ACME },
  { file: "developers/templates", path: "/developers/templates", as: ACME },
  { file: "developers/webhooks", path: "/developers/webhooks", as: ACME },
  { file: "developers/requests", path: "/developers/requests", as: ACME },

  // For operators (FireFlo staff; priya is staff in the demo data)
  { file: "operators/customers", path: "/platform/customers", as: ACME },
  { file: "operators/products", path: "/platform/products", as: ACME },
  { file: "operators/pricing", path: "/platform/pricing", as: ACME },
  { file: "operators/channels", path: "/platform/channels", as: ACME },
  { file: "operators/modules", path: "/platform/modules", as: ACME },
  { file: "operators/domains", path: "/platform/domains", as: ACME },
  { file: "operators/email", path: "/platform/email", as: ACME },
];
