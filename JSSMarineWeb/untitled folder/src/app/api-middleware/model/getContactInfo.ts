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

export interface GetContactInfo {
  /**
   * The array list of contact numbers of the users for which the details has to be fetched.
   */
  contact_numbers: Array<string>;
  /**
   * the last sync date in YYYY-MM-DD HH:mm:ss
   */
  last_sync_time: string;
}