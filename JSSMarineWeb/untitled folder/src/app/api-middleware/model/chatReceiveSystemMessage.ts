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

export interface ChatReceiveSystemMessage {
  /**
   * message id.
   */
  message_id?: number;
  /**
   * room id.
   */
  room_id?: string;
  /**
   * meeting_id.
   */
  meeting_id?: number;
  /**
   * display_recur_msg
   */
  display_recur_msg?: number;
  /**
   * The content of the message
   */
  content?: string;
  /**
   * true if the message is deleted. false - otherwise
   */
  is_deleted?: boolean;
  /**
   * true if the message is deleted. false - otherwise
   */
  deleted_at?: string;
  /**
   * contact number of the user created.
   */
  contact_number?: string;
  /**
   * 0 -> User message, 1 -> create, 2 -> edit, 3 -> join, 4 -> delete, 5 -> cancel, 6 -> addParticipants, 7 -> updateParticipantStatus, 8 -> removeParticipants, 9 -> update phone number, 10 -> delete account
   */
  system_generated?: number;
  /**
   * true if the message read by all the participants. false - otherwise
   */
  read_by_all?: boolean;
  /**
   * true if the message is delivered to all the participants. false - otherwise
   */
  delivered_to_all?: boolean;
}
