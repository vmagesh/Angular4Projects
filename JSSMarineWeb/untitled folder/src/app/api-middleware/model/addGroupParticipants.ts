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

export interface AddGroupParticipants {
  /**
   * The group_id of the group in which the participants to be added.
   */
  group_id: number;
  /**
   * The array list of contact numbers of the participants.
   */
  participants?: Array<string>;
}
