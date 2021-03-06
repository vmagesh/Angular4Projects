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

export interface GetReferralMeeting {
  /**
   * The meeting_id of the referral meetings has to be fetched.
   */
  meeting_id?: number;
  fetch_event_details?: number;
  /**
   * This field defines the next participant to be fetched
   */
  previous_index?: number;
  /**
   * Maximum number of meetings to be fetched.
   */
  max_limit?: number;
  /**
   * get_cancelled_meetings
   */
  get_cancelled_meetings?: boolean;
}
