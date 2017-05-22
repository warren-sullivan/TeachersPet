import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from "../pages/login-page/login-page";
import { StudentsList } from "../pages/students-list/students-list";
import { StudentDetail } from "../pages/student-detail/student-detail";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    StudentsList,
    StudentDetail
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    StudentsList,
    StudentDetail
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
