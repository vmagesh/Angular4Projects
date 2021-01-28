export interface SubscriptionInfoResponseData {
  customer_id?: string;
  subscription_id?: string;
  plan_id?: string;
  plan_amount?: number;
  plan_name?: string;
  plan_product?: number;
  start_date?: number;
  created?: number;
  current_period_start?: number;
  current_period_end?: number;
  status?: string;
}
