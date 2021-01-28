import { InvoiceInfoResponseData } from './invoiceInfoResponseData';

export interface InvoiceResponse {
  is_error?: boolean;
  status_code?: number;
  display_msg?: string;
  res_data?: Array<InvoiceInfoResponseData>;
}
