import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ClassListPage } from '../pages/class-list/class-list';
import { ClassCreationPage } from '../pages/class-creation/class-creation';

import { ClassService } from '../providers/class-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { LoginPage } from "../pages/login-page/login-page";
import { StudentsList } from "../pages/students-list/students-list";
import { StudentDetail } from "../pages/student-detail/student-detail";

import { DataService } from '../providers/data-service';
import { DataServiceExamplePage } from '../pages/data-service-example/data-service-example'; // used for example usage and testing


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,

    LoginPage,
    StudentsList,
    StudentDetail,

    ClassListPage,
    ClassCreationPage,
    DataServiceExamplePage

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,

    LoginPage,
    StudentsList,
    StudentDetail,

    ClassListPage,
    ClassCreationPage,
    DataServiceExamplePage

  ],
  providers: [
    StatusBar,
    SplashScreen,



    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ClassService,
    DataService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}

  ]
})
export class AppModule { }
