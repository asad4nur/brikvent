import { cacheLife, cacheTag } from "next/cache";
import { getApiUrl } from "@/lib/config";
import { FALLBACK_TRIAL_DAYS, fallbackPlans, type FeatureId, type Plan } from "@/lib/pricing";

/**
 * Pricing plans from the Brikvent backend: GET /public/pricing-plans.
 * They are the plans set in the SaaS admin, always the latest version of each. Nothing here is
 * specific to a store.
 */

// ---- What the backend sends (backend/src/saas-admin/pricing-plan/dto/public-pricing-plan.response.ts) ----

type ApiService = { feature: string; available: boolean };

type ApiPlan = {
  code: string;
  name: string;
  description: string | null;
  isPopular: boolean;
  price: { monthly: number; yearly: number | null };
  trialDays: number | null;
  limits: {
    outlets: number | null;
    products: number | null;
    staffUsers: number | null;
    storageMb: number | null;
    salesOrdersPerMonth: number | null;
    purchaseOrdersPerMonth: number | null;
  };
  freeOrdersPerMonth: number | null;
  extraOrderFee: number;
  features: {
    pos: boolean;
    ecommerce: boolean;
    inventory: boolean;
    accounting: boolean;
    dedicatedSupport: boolean;
    whatsappSupport: boolean;
    customDomain: boolean;
    inbox: boolean;
  };
  services: ApiService[];
};

type ApiResponse = { success: boolean; data: { signupTrialDays: number; plans: ApiPlan[] } };

// ---- Which backend setting switches each feature of the comparison table on ----

// A feature with no setting of its own is part of every plan (`() => true`).
const featureRules: Record<FeatureId, (p: ApiPlan) => boolean> = {
  pos: (p) => p.features.pos,
  storefront: (p) => p.features.ecommerce,
  domain: (p) => p.features.customDomain,
  themes: (p) => p.features.ecommerce,
  promotions: (p) => p.features.ecommerce,
  tracking: (p) => p.features.ecommerce,
  inbox: (p) => p.features.inbox,
  courier: (p) => p.features.ecommerce,
  orderList: () => true,
  incomplete: (p) => p.features.ecommerce,
  codCalls: (p) => serviceAvailable(p, "IVR_CALL") || serviceAvailable(p, "AI_VOICE_CALL"),
  fraud: (p) => serviceAvailable(p, "FRAUD_CHECK"),
  products: () => true,
  purchasing: () => true,
  inventoryErp: (p) => p.features.inventory,
  customers: () => true,
  campaigns: (p) => serviceAvailable(p, "SMS"),
  reports: () => true,
  accounting: (p) => p.features.accounting,
  vipSupport: (p) => p.features.whatsappSupport,
  dedicatedSupport: (p) => p.features.dedicatedSupport,
};

const serviceAvailable = (p: ApiPlan, feature: string) =>
  p.services.find((s) => s.feature === feature)?.available ?? true;

function toPlan(p: ApiPlan): Plan {
  const free = p.freeOrdersPerMonth;
  return {
    id: p.code,
    name: p.name,
    tagline: p.description,
    monthly: p.price.monthly,
    yearly: p.price.yearly,
    popular: p.isPopular,
    limits: {
      outlets: p.limits.outlets,
      skus: p.limits.products,
      users: p.limits.staffUsers,
      salesOrdersPerMonth: p.limits.salesOrdersPerMonth,
      freeOrdersPerMonth: free,
      // An unlimited free quota has no per-order charge
      overagePerOrder: free === null ? null : p.extraOrderFee,
      purchaseOrdersPerMonth: p.limits.purchaseOrdersPerMonth,
      storageMb: p.limits.storageMb,
    },
    trialDays: p.trialDays,
    features: (Object.keys(featureRules) as FeatureId[]).filter((id) => featureRules[id](p)),
  };
}

export type Pricing = {
  plans: Plan[];
  // Days of free trial a new visitor gets: the number to show in every "N-day free trial" text
  trialDays: number;
};

/**
 * The plans and trial length for the site. Kept for a minute, so a price changed in the SaaS admin
 * shows on the site within about a minute. If the backend cannot be reached (or has no plans), the
 * draft plans in lib/pricing.ts are shown instead, so the page never breaks.
 */
export async function getPricing(): Promise<Pricing> {
  "use cache";
  cacheLife("minutes");
  cacheTag("pricing");

  try {
    const res = await fetch(`${getApiUrl()}/public/pricing-plans`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`Pricing API answered ${res.status}`);
    const body = (await res.json()) as ApiResponse;
    if (!body.success || !Array.isArray(body.data?.plans) || body.data.plans.length === 0) {
      throw new Error("Pricing API returned no plans");
    }
    return {
      plans: body.data.plans.map(toPlan),
      trialDays: body.data.signupTrialDays > 0 ? body.data.signupTrialDays : FALLBACK_TRIAL_DAYS,
    };
  } catch (error) {
    console.error("[pricing] Using the fallback plans:", error instanceof Error ? error.message : error);
    return { plans: fallbackPlans, trialDays: FALLBACK_TRIAL_DAYS };
  }
}
