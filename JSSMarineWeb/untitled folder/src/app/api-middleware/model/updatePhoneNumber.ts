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

export interface UpdatePhoneNumber {
  /**
   * The updated phone number
   */
  new_phone_number?: string;
  /**
   * The updated country code
   */
  new_country_code?: string;
  app_version?: string;
  /**
   * The OS of the device.
   */
  device_os?: number;
  /**
   * The os_version of the mobile
   */
  device_os_version?: string;
  /**
   * Device make company.
   */
  device_make?: string;
  /**
   * Device model
   */
  device_model?: string;
  /**
   * The device id of the mobile.
   */
  device_id?: string;
}
