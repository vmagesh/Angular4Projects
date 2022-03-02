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

/**
 * Update Event Notification Data. Clickable action name *CatchUp.UPDATE_EVENT*
 */
export interface NotificationUpdateEvent {
  recur_meeting_id?: number;
  meeting_id?: number;
  created_by_contact_number?: string;
  updated_by_contact_number?: string;
  start_time?: string;
  end_time?: string;
  msg_created_date?: string;
}