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

export interface CancelMeeting {
  /**
   * 1 - To cancel the whole series,0 - To cancel the specific meeting
   */
  set_recurrence: number;
  /**
   * The recur_meeting_id of the meeting to be cancelled.
   */
  recur_meeting_id: number;
  /**
   * The meeting_id of the meeting to be cancelled.
   */
  meeting_id: number;
}