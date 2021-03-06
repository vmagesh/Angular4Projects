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

export interface UpdateEventOptions {
  /**
   * 1 - To delete the whole series,0 - To delete a specific meeting
   */
  set_recurrence?: number;
  /**
   * The recur_meeting_id of the meeting to be deleted.
   */
  recur_meeting_id?: number;
  /**
   * The meeting_id of the meeting to be deleted.
   */
  meeting_id?: number;
  /**
   * if the participant has disabled the notifications.
   */
  notification_disabled?: boolean;
  /**
   * if the participant has muted the meeting.
   */
  mute_notification?: boolean;
  /**
   * true - To allow the particpants to add new participants into the meeting, false - Otherwise.
   */
  allow_forwarding?: boolean;
}
