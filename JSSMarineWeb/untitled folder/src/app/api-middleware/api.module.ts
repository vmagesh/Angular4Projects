import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './api/auth.service';
import { ChatService } from './api/chat.service';
import { GroupService } from './api/group.service';
import { LocationService } from './api/location.service';
import { MeetingService } from './api/meeting.service';
import { TermsService } from './api/terms.service';
import { UserService } from './api/user.service';
import { PaymentService } from './api/payment.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    AuthService,
    ChatService,
    GroupService,
    LocationService,
    MeetingService,
    TermsService,
    UserService,
    PaymentService
  ]
})
export class ApiModule {
  public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
    return {
      ngModule: ApiModule,
      providers: [{ provide: Configuration, useFactory: configurationFactory }]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: ApiModule, @Optional() http: HttpClient) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error(
        'You need to import the HttpClientModule in your AppModule! \n' +
          'See also https://github.com/angular/angular/issues/20575'
      );
    }
  }
}
