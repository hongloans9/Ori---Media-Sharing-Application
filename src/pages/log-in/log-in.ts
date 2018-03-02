import { User } from './../../app/models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { SignUpPage } from './../sign-up/sign-up';
import { UserProvider } from './../../providers/user/user';
import { TabsPage } from './../tabs/tabs';
import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LogInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html',
})
export class LogInPage {

  user: User = { username: '', password: '' };

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    if(localStorage.getItem('token') !== null){
      this.userProvider.getUserData(localStorage.getItem('token')).subscribe(response =>{
        this.userProvider.logged = true;
      },(err: HttpErrorResponse) =>{
        console.log(err);
      });
    }
  }

  createAccount() {
    this.navCtrl.push(SignUpPage);
  }

  login() {
    this.userProvider.login(this.user).subscribe(response => {     
        console.log(response['token']);
        localStorage.setItem('token', response['token']);
        this.navCtrl.setRoot(TabsPage);
        this.userProvider.logged = true;     
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      this.showError("Wrong username or password");
    });
  }

  showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
}
