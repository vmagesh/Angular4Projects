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

export interface ValidateParticipantStatus {
  /**
   * The array of meeting_ids
   */
  meeting_ids: Array<number>;
  /**
   * The contact numbers for which the status has to be fetched
   */
  contact_numbers: Array<string>;
}