/**
 * Catchup APIs
 * The Catchup API document is intended strictly for internal use only.
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { InlineResponse20011ResData } from './inlineResponse20011ResData';

export interface InlineResponse20011 {
  is_error?: boolean;
  status_code?: number;
  display_msg?: string;
  /**
   * array of the meeting id objects
   */
  res_data?: Array<InlineResponse20011ResData>;
}
