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
 * This gives the message list which are read by all the participants in the group
 */
export interface ChatUnreadNotificationCount {
  meeting_id?: number;
  unread_notification_count?: number;
}