import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  _recaptchaWidgetId: null;
  _confirmationResult: null;
  get windowRef() {
    return window;
  }

  get recaptchaWidgetId() {
    return this._recaptchaWidgetId;
  }

  set recaptchaWidgetId(value) {
    this._recaptchaWidgetId = value;
  }

  get ConfirmationResult() {
    return this._confirmationResult;
  }

  set ConfirmationResult(value) {
    this._confirmationResult = value;
  }
}
