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

export interface EditLocation {
  /**
   * The id of the location.
   */
  id: number;
  /**
   * The code of the location.
   */
  code?: string;
  /**
   * The location name that has to be edited.
   */
  name: string;
  /**
   * Latitude of the location to be created.
   */
  latitude?: string;
  /**
   * Longitude of the location to be created.
   */
  longitude?: string;
}
