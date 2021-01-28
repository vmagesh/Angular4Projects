import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { ProfileModule } from './profile/profile.module';
import { ShellModule } from './shell/shell.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CalenderModule } from './calender/calender.module';
import { EventsModule } from './events/events.module';
import { ApiModule, Configuration } from './api-middleware/index';
import { ConfigService } from './core/config.service';
import { UserManagementModule } from './user-management/user-management.module';
import { AppoinmentsModule } from './appoinments/appoinments.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export function getConfig() {
  return ConfigService.getConfig();
}

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgbModule,
    CoreModule,
    SharedModule,
    ShellModule,
    ProfileModule,
    CalenderModule,
    UserManagementModule,
    AppoinmentsModule,
    EventsModule,
    LoginModule,
    ApiModule.forRoot(getConfig),
    AppRoutingModule,
    Ng4LoadingSpinnerModule.forRoot(),
    FlexLayoutModule
  ],
  declarations: [AppComponent],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {}
