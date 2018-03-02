import { CommentPage } from './../pages/comment/comment';
import { OtherProfilePage } from './../pages/other-profile/other-profile';
import { ProfilePage } from './../pages/profile/profile';
import { DetailMediaPage } from './../pages/detail-media/detail-media';
import { HttpClientModule } from '@angular/common/http';
import { SignUpPage } from './../pages/sign-up/sign-up';
import { LogInPage } from './../pages/log-in/log-in';
import { UploadMediaPage } from './../pages/upload-media/upload-media';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';


import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';
import { MediaProvider } from '../providers/media/media';
import { SearchPage } from '../pages/search/search';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    UploadMediaPage,
    LogInPage,
    SignUpPage,
    DetailMediaPage,
    ProfilePage,
    OtherProfilePage,
    CommentPage,
    SearchPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      backButtonText:''
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    UploadMediaPage,
    LogInPage,
    SignUpPage,
    DetailMediaPage,
    ProfilePage,
    OtherProfilePage,
    CommentPage,
    SearchPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    MediaProvider,
    Camera
  ]
})
export class AppModule {}
