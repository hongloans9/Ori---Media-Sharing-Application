import { User } from './../../app/models/user';
import { LogInPage } from './../log-in/log-in';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  logInPage = LogInPage;
  user: User = { username: '', email: '', password: '' };
  createSuccess = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private userProvider: UserProvider, 
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  register() {
    this.userProvider.register(this.user).subscribe(response => {
      this.createSuccess = true;
      this.showPopup("Success", "Account created.");
      
      },
      error => {
        this.showPopup("Error", "username already exists");
    });
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.navCtrl.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

  backLogin() {
    this.navCtrl.push(this.logInPage);
  }

}
