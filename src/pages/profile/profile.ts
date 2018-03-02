import { User } from '../../app/models/user';
import { LogInPage } from '../log-in/log-in';
import { DetailMediaPage } from './../detail-media/detail-media';
import { MediaProvider } from './../../providers/media/media';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { App, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  userId;
  username;
  email;
  user: User = { username: '', password: '', email: '' };
  listMedia: string;
  myMediaArray: any = [];
  mySavedArray: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    private mediaProvider: MediaProvider,
    private app: App,
    private alertCtrl: AlertController) { }

  ionViewDidLoad() {
    this.listMedia = "myPost";
    if (localStorage.getItem('token') !== null) {
      this.userProvider.getUserData(localStorage.getItem('token')).subscribe(res => {
        this.userId = res['user_id'];
        console.log(this.userId);
        this.username = res['username'];
        this.email = res['email'];
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
    }
    this.getMediaCurrentUser();
    this.mySavedArray = this.mediaProvider.saved;
    console.log(this.mySavedArray)
  }

 ionViewWillEnter() {
    if (this.mediaProvider.reloadProfile) {
    this.getMediaCurrentUser();
    this.mediaProvider.reloadProfile = false
    }
  }

  getMediaCurrentUser() {
    this.userProvider.getMediaOfCurrentUser().subscribe((res: any) => {
      this.myMediaArray = res.reverse();
    })
  }

  openDetailMedia(file_id, user_id) {
    this.navCtrl.push(DetailMediaPage, {
      mediaId: file_id,
      userId: user_id
    })
  }

  editProfile() {
    let alert = this.alertCtrl.create({
      title: 'Edit Profile',
      inputs: [
        {
          name: 'username',
          value: this.username,
          placeholder: 'New username',
        },
        {
          name: 'password',
          placeholder: 'New password',
          type: 'password'
        },
        {
          name: 'email',
          value: this.email,
          type: 'email',
          placeholder: 'New email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Update',
          handler: data => {
            console.log(data)
            this.checkUsername(data.username);
            if (data.username != '' && data.password != '' && data.email != '') {
              this.userProvider.editProfile(data).subscribe(res => {
                this.username = data.username;
                this.showPopup("", "User data updated" )
              });
            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  checkUsername(username) {
    if (username !== this.username) {
      this.userProvider.checkUsername(username).subscribe(res => {
        switch (res['available']) {
          case true:
            break;
          case false:
            this.showPopup("Fail","username already exists");
            break
        }
      });
    }
  }
  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  deletePost(file_id, post) {
    let alert = this.alertCtrl.create({
      subTitle: 'Delete this post?',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.mediaProvider.deleteMedia(file_id).subscribe(res => {
              console.log(res['message']);
              this.myMediaArray.splice(this.myMediaArray.indexOf(post),1);
              console.log(this.myMediaArray);
              this.mediaProvider.reload = true;
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });
    alert.present();
  }

  logout() {
    let alert = this.alertCtrl.create({
      subTitle: 'Do you want to logout?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.userProvider.logout();
            this.app.getRootNav().setRoot(LogInPage);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });
    alert.present();
  }


}
