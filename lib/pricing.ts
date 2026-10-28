// Source: Brikvent_Pricing_Plan.pdf (draft proposal, 27 Oct 2026). All prices in BDT.

export type PlanId = "starter" | "growth" | "business" | "enterprise";

// null = unlimited
type Limit = number | null;

export type Plan = {
  id: PlanId;
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
  trial: "14-day" | "demo-call";
};

export const plans: Plan[] = [
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
    trial: "14-day",
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
    trial: "14-day",
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
    trial: "14-day",
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

const ALL: PlanId[] = ["starter", "growth", "business", "enterprise"];

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
  plans: PlanId[];
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
export const planIncludes = (plan: PlanId, feature: FeatureId) =>
  allRows.find((r) => r.id === feature)?.plans.includes(plan) ?? false;

// Monthly cost at 500 orders (average order ৳1,500, ৳7,50,000 in sales).
// Source: competitor research in the pricing PDF. Re-check before launch, as
// competitors change their prices. Pricing model and notes are in the
// dictionaries (comparison.competitors), in the same order.
export const competitorComparison: { name: string; cost: string; ours?: true }[] = [
  { name: "Brikvent Starter", cost: "৳699", ours: true },
  { name: "Brikvent Growth", cost: "৳1,999", ours: true },
  { name: "Uddoktify", cost: "৳890–1,390" },
  { name: "ShopZero", cost: "৳2,499" },
  { name: "SeloraX", cost: "~৳5,450" },
  { name: "Banikh", cost: "৳11,250" },
];

export const lowestMonthlyPrice = Math.min(...plans.map((p) => p.monthly));
