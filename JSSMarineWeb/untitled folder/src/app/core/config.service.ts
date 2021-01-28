import { Inject, Injectable } from '@angular/core';
import { ConfigurationParameters, Configuration } from '../api-middleware';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  static config: ConfigurationParameters = {
    apiKeys: {},
    username: '',
    password: '',
    accessToken: '',
    basePath: environment.BASE_URL,
    withCredentials: false
  };

  public static setToken(value: any) {
    this.config.apiKeys['Authorization'] = value;
  }

  public static getConfig() {
    return new Configuration(this.config);
  }
}
