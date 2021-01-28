import { SubscriptionInfoResponseData } from './subscriptionInfoResponseData';

export interface SubscriptionResponse {
  is_error?: boolean;
  status_code?: number;
  display_msg?: string;
  res_data?: Array<SubscriptionInfoResponseData>;
}
