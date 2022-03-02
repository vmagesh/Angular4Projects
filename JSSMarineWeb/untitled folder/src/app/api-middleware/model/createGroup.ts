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

export interface CreateGroup {
  /**
   * Title of the group to be created.
   */
  title: string;
  /**
   * The array list of contact numbers of the participatns along with country code.
   */
  participants: Array<string>;
}