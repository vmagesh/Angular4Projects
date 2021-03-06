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
 * To send a message from one user to another user.
 */
export interface ChatSendMessage {
  /**
   * sender_message_id. Socket returns this id to update the same at front end app
   */
  sender_message_id?: string;
  /**
   * meeting_id
   */
  meeting_id?: number;
  /**
   * The content of the message
   */
  message?: string;
  /**
   * The subject of the meeting
   */
  subject?: string;
}
