// Plans, limits and prices come from the backend (see lib/pricing-api.ts), set in the SaaS admin.
// This file keeps the types the pricing section uses, the feature list shown in the comparison, and
// the draft plans (Brikvent_Pricing_Plan.pdf, 27 Oct 2026, BDT) used ONLY if the backend cannot be reached.

type StaticPlanId = "starter" | "growth" | "business" | "enterprise";

// null = unlimited
type Limit = number | null;

type StaticPlan = {
  id: StaticPlanId;
  name: string;
  monthly: number;
  // null = custom contract
  yearly: number | null;
  // Enterprise is priced "from" its monthly figure.
  startingFrom?: boolean;
  popular?: boolean;
  limits: {
    outlets: Limit; // warehouses included
    skus: Limit; // products + variants
    users: Limit; // role-based users
    freeOrdersPerMonth: Limit;
    // Charge per order once the free quota is used; null = not applicable.
    overagePerOrder: number | null;
    purchaseOrdersPerMonth: Limit;
    storageGb: number | "custom";
  };
  trial: "trial" | "demo-call";
};

const staticPlans: StaticPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthly: 499,
    yearly: 4990,
    limits: {
      outlets: 1,
      skus: 300,
      users: 2,
      freeOrdersPerMonth: 300,
      overagePerOrder: 1,
      purchaseOrdersPerMonth: 50,
      storageGb: 1,
    },
    trial: "trial",
  },
  {
    id: "growth",
    name: "Growth",
    monthly: 1999,
    yearly: 19990,
    popular: true,
    limits: {
      outlets: 3,
      skus: 2000,
      users: 5,
      freeOrdersPerMonth: 3000,
      overagePerOrder: 0.5,
      purchaseOrdersPerMonth: 500,
      storageGb: 5,
    },
    trial: "trial",
  },
  {
    id: "business",
    name: "Business",
    monthly: 3999,
    yearly: 39990,
    limits: {
      outlets: 6,
      skus: 10000,
      users: 15,
      freeOrdersPerMonth: null,
      overagePerOrder: null,
      purchaseOrdersPerMonth: null,
      storageGb: 20,
    },
    trial: "trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: 9999,
    yearly: null,
    startingFrom: true,
    limits: {
      outlets: null,
      skus: null,
      users: null,
      freeOrdersPerMonth: null,
      overagePerOrder: null,
      purchaseOrdersPerMonth: null,
      storageGb: "custom",
    },
    trial: "demo-call",
  },
];

const ALL: StaticPlanId[] = ["starter", "growth", "business", "enterprise"];

// Labels for these ids live in the dictionaries (pricing.features / groups).
export type FeatureId =
  | "pos" | "storefront" | "domain" | "themes" | "promotions" | "tracking" | "inbox"
  | "courier" | "orderList" | "incomplete" | "codCalls" | "fraud"
  | "products" | "purchasing" | "inventoryErp"
  | "customers" | "campaigns" | "reports" | "accounting"
  | "vipSupport" | "dedicatedSupport";

export type FeatureGroupId = "selling" | "orders" | "inventory" | "customers" | "support";

export type FeatureRow = {
  id: FeatureId;
  // Only the fallback plans read this; live plans get their features from the backend flags.
  plans: StaticPlanId[];
  // Usage is paid with prepaid credits.
  credits?: true;
  // Not in the pricing PDF: inferred from the module the feature belongs to.
  // Confirm with the team before launch.
  assumed?: true;
};

// Full plan-by-plan comparison. Rows without `assumed` come from the PDF.
export const featureTable: { group: FeatureGroupId; rows: FeatureRow[] }[] = [
  {
    group: "selling",
    rows: [
      { id: "pos", plans: ALL },
      { id: "storefront", plans: ALL },
      { id: "domain", plans: ALL },
      { id: "themes", plans: ALL, assumed: true },
      { id: "promotions", plans: ALL, assumed: true },
      { id: "tracking", plans: ALL },
      { id: "inbox", plans: ["growth", "business", "enterprise"] },
    ],
  },
  {
    group: "orders",
    rows: [
      { id: "courier", plans: ALL },
      { id: "orderList", plans: ALL, assumed: true },
      { id: "incomplete", plans: ALL, assumed: true },
      { id: "codCalls", plans: ALL, credits: true, assumed: true },
      { id: "fraud", plans: ALL, assumed: true },
    ],
  },
  {
    group: "inventory",
    rows: [
      { id: "products", plans: ALL, assumed: true },
      { id: "purchasing", plans: ALL },
      { id: "inventoryErp", plans: ["growth", "business", "enterprise"] },
    ],
  },
  {
    group: "customers",
    rows: [
      { id: "customers", plans: ALL, assumed: true },
      { id: "campaigns", plans: ALL, credits: true, assumed: true },
      { id: "reports", plans: ALL, assumed: true },
      { id: "accounting", plans: ["business", "enterprise"] },
    ],
  },
  {
    group: "support",
    rows: [
      { id: "vipSupport", plans: ["business", "enterprise"] },
      { id: "dedicatedSupport", plans: ["enterprise"] },
    ],
  },
];

// The nine features the PDF lists, shown on each plan card.
export const planFeatures: FeatureId[] = [
  "pos",
  "storefront",
  "domain",
  "courier",
  "inventoryErp",
  "inbox",
  "accounting",
  "vipSupport",
  "dedicatedSupport",
];

const allRows = featureTable.flatMap((g) => g.rows);

// null = unlimited
export type Plan = {
  // The plan's code, for example "starter"
  id: string;
  name: string;
  // Short description set in the SaaS admin; used when the dictionaries have no tagline for this plan
  tagline: string | null;
  monthly: number;
  // null = no yearly price / custom contract
  yearly: number | null;
  // Priced "from" its monthly figure (only the fallback Enterprise plan)
  startingFrom?: boolean;
  popular?: boolean;
  limits: {
    outlets: Limit; // warehouses included
    skus: Limit; // products + variants
    users: Limit; // role-based users
    salesOrdersPerMonth: Limit;
    freeOrdersPerMonth: Limit;
    // Charge per order once the free quota is used; null = not applicable.
    overagePerOrder: number | null;
    purchaseOrdersPerMonth: Limit;
    // null = unlimited, "custom" = agreed per contract
    storageMb: number | null | "custom";
  };
  // Free trial length in days; null = no trial (a demo call instead)
  trialDays: number | null;
  // Every feature this plan includes (ids of featureTable rows)
  features: FeatureId[];
};

export const planIncludes = (plan: Plan, feature: FeatureId) => plan.features.includes(feature);

// Free trial length of the draft plans, and of the site when the backend cannot be reached.
export const FALLBACK_TRIAL_DAYS = 7;

// The draft plans in the shape the pricing section uses.
export const fallbackPlans: Plan[] = staticPlans.map((p) => ({
  id: p.id,
  name: p.name,
  tagline: null,
  monthly: p.monthly,
  yearly: p.yearly,
  startingFrom: p.startingFrom,
  popular: p.popular,
  limits: {
    outlets: p.limits.outlets,
    skus: p.limits.skus,
    users: p.limits.users,
    salesOrdersPerMonth: null,
    freeOrdersPerMonth: p.limits.freeOrdersPerMonth,
    overagePerOrder: p.limits.overagePerOrder,
    purchaseOrdersPerMonth: p.limits.purchaseOrdersPerMonth,
    storageMb: p.limits.storageGb === "custom" ? "custom" : p.limits.storageGb * 1024,
  },
  trialDays: p.trial === "trial" ? FALLBACK_TRIAL_DAYS : null,
  features: allRows.filter((r) => r.plans.includes(p.id)).map((r) => r.id),
}));

// Monthly bill for a shop with 500 orders (average ৳1,500, ৳7,50,000 in
// sales). Other platforms are shown by type, not by name; the figures come
// from competitor research in the pricing PDF. Labels are in the
// dictionaries (comparison.rows), keyed by id.
export type CostRowId = "starter" | "growth" | "traffic" | "setupFee" | "flatCalls" | "commission";

// `value` sizes the bar; `from` is the low end when the cost is a range.
export const costComparison: { id: CostRowId; cost: string; value: number; from?: number; ours?: true }[] = [
  { id: "starter", cost: "৳699", value: 699, ours: true },
  { id: "growth", cost: "৳1,999", value: 1999, ours: true },
  { id: "traffic", cost: "৳890–1,390", value: 1390, from: 890 },
  { id: "setupFee", cost: "৳2,499", value: 2499 },
  { id: "flatCalls", cost: "~৳5,450", value: 5450 },
  { id: "commission", cost: "৳11,250", value: 11250 },
];

// The cheapest monthly price among the plans.
export const lowestMonthlyPrice = (plans: Plan[]) => Math.min(...plans.map((p) => p.monthly));
