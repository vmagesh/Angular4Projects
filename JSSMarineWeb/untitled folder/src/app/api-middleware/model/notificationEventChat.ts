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
 * User Chat Message Notification Data. Clickable action name *CatchUp.EVENT_CHAT*
 */
export interface NotificationEventChat {
  message_id?: number;
  room_id?: string;
  meeting_id?: number;
  contact_number?: string;
  content?: string;
  created_at?: string;
}
