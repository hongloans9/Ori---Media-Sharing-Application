import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { MediaProvider } from '../../providers/media/media';
import { UserProvider } from '../../providers/user/user';
import { DetailMediaPage } from '../detail-media/detail-media';
import { OtherProfilePage } from '../other-profile/other-profile';
import { ProfilePage } from '../profile/profile';
import { Navbar } from 'ionic-angular';


/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Navbar) navBar: Navbar;

  searchArray: any = [];
  medias : any = [];
  mediaArray : any = [];
  numberOfComment : any = [];
  numberOfLike : any = [];
  currentUser_id;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mediaProvider: MediaProvider,
    private userProvider: UserProvider
  ) {
    this.searchArray = navParams.get('searchArray');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    this.medias = this.searchArray
    console.log(this.medias);
    this.getNumberOfComment();
    this.getNumberOfLike();
    for (let user of this.medias) {
      this.userProvider.getAllUserInfo(user.user_id).subscribe(res => {
        this.mediaArray = res;
        for (let i in this.medias) {
          if (this.medias[i].user_id == res['user_id']) {
            this.medias[i].username = res['username'];
          }
        }
      })
    }

  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  // getAllMedia() {
  //   for(var i = 0; i < this.searchArray.length; i++ ){
  //     this.mediaProvider.getMediaById(this.searchArray[i]['file_id']).subscribe((data: any) => {
  //       this.medias = data;
  //       this.getNumberOfComment();
  //       this.getNumberOfLike();
  //       for (let user of this.medias) {
  //         this.userProvider.getAllUserInfo(user.user_id).subscribe(res => {
  //           this.mediaArray = res;
  //           for (let i in this.medias) {
  //             if (this.medias[i].user_id == res['user_id']) {
  //               this.medias[i].username = res['username'];
  //             }
  //           }
  //         })
  //       }
  //     });

  //   }
    
  // }

  getNumberOfComment() {
    for (let file of this.medias) {
      this.mediaProvider.getComment(file.file_id).subscribe(res => {
        this.numberOfComment = res;
        file.numberOfComment = this.numberOfComment.length;
      })
    }
  }

  getNumberOfLike() {
    for (let file of this.medias) {
      this.mediaProvider.getLike(file.file_id).subscribe(res => {
        this.numberOfLike = res;
        file.numberOfLike = this.numberOfLike.length;
      })
    }
  }

  openDetailMedia(id, user_id) {
    this.navCtrl.push(DetailMediaPage, {
      mediaId: id,
      userId: user_id,
    })
  }

  openOtherUser(user_id) {
    if (user_id !== this.currentUser_id) {
      this.navCtrl.push(OtherProfilePage, {
        userId: user_id
      })
    } else {
      this.navCtrl.push(ProfilePage);
    }
  }

}
