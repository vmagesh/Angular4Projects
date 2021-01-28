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

export interface CreateMeeting {
  /**
   * Subject of the meeting to be created.
   */
  subject: string;
  /**
   * 1 - Recurrent, 0 - Non Recurrent (default)
   */
  set_recurrence: number;
  /**
   * The number of times the recurrent meeting has to be repeated.
   */
  repeat_count: number;
  /**
   * The interval between the recurring meeting repetitions.
   */
  repeat_interval: number;
  /**
   * The repeat mode of a recurring meeting. 1 - monthly. 2 - yearly. 0 - Daily
   */
  repeat_mode: number;
  /**
   * The start date and time of the meeting in YYYY-MM-DD HH:mm:SS format. This field is mandatory.
   */
  start_time: string;
  /**
   * The end date and time of the meeting in YYYY-MM-DD HH:mm:SS format. This field is mandatory for events.
   */
  end_time?: string;
  /**
   * The location of the meeting. This field is optional.
   */
  location?: string;
  /**
   * The latitude of the location of the meeting. This field is optional.
   */
  latitude?: string;
  /**
   * The longitude of the location of the meeting. This field is optional.
   */
  longitude?: string;
  /**
   * 1/4 - events. 0/2/3 - reminders.
   */
  event_category: number;
  /**
   * true - To allow the particpants to add new participants into the meeting, false - Otherwise.
   */
  allow_forwarding?: boolean;
  /**
   * The array list of contact numbers of the participatns along with country code.
   */
  participants: Array<string>;
  /**
   * The business link id if the customer has a coupon code.
   */
  business_link_id?: number;
}
