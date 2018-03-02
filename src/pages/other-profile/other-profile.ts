import { DetailMediaPage } from './../detail-media/detail-media';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaProvider } from './../../providers/media/media';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OtherProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-other-profile',
  templateUrl: 'other-profile.html',
})
export class OtherProfilePage {

  username;
  email;
  fullname;
  user_id;
  mediaArray: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    private mediaProvider: MediaProvider) {

    this.user_id = this.navParams.get('userId');
    console.log(this.user_id);
  }

  ionViewDidLoad() {
    this.userProvider.getAllUserInfo(this.user_id).subscribe(res => {
        this.username = res['username'];
        this.email = res['email'];
        this.fullname = res['full_name'];
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
      this.getMediaOtherUser();
  }

  getMediaOtherUser() {
    this.userProvider.getMediaOfOtherUser(this.user_id).subscribe((res: any) => {
      this.mediaArray = res.reverse();
    })
  }

  openDetailMedia(file_id, user_id) {
    this.navCtrl.push(DetailMediaPage, {
      mediaId: file_id,
      userId: user_id
    })
  }
}
