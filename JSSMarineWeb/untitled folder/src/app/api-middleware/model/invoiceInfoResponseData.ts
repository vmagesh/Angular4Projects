export interface InvoiceInfoResponseData {
  id?: string;
  created?: number;
  currency?: string;
  customer_id?: string;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  period_end?: number;
  period_start?: number;
  status?: number;
  subscription_id?: string;
  total?: number;
}
