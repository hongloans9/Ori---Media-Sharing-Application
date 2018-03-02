import { CommentPage } from './../comment/comment';
import { UserProvider } from './../../providers/user/user';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaProvider } from './../../providers/media/media';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Navbar } from 'ionic-angular';

/**
 * Generated class for the DetailMediaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detail-media',
  templateUrl: 'detail-media.html',
})
export class DetailMediaPage {
  @ViewChild(Navbar) navBar: Navbar;

  id;
  userId;
  myId;
  commentArr: any = [];
  likeArr: any = [];
  numberOfComment: any;
  numberOfLike: any;
  url: string;
  title: string;
  description: any;
  username: any;
  time;
  likeUsers: any = [];
  type: any;
  likePost: string = "heart-outline";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private mediaProvider: MediaProvider,
    private userProvider: UserProvider,
    private alertCtrl: AlertController) {

    this.id = navParams.get('mediaId');
    this.userId = navParams.get('userId');
  }

  ionViewDidLoad() {
    this.mediaProvider.getMediaById(this.navParams.get('mediaId')).
      subscribe(response => {
        this.url = this.mediaProvider.mediaUrl + response['filename'];
        this.title = response['title'];
        this.description = response['description'];
        this.type = response['media_type'];
        this.time = response['time_added'];
      }, (error: HttpErrorResponse) => {
        console.log(error);
      });
    this.userProvider.getAllUserInfo(this.userId).subscribe(res => {
      this.username = res['username'];
    });
    this.getNumberOfLike();
    this.myId = this.userProvider.my_id;
  }

  ionViewWillEnter() {
    this.getNumberOfComment();
  }

  getNumberOfComment() {
    this.mediaProvider.getComment(this.id).subscribe(res => {
      this.commentArr = res;
      this.numberOfComment = this.commentArr.length;
    });
  }

  getNumberOfLike() {
    this.mediaProvider.getLike(this.id).subscribe(data => {
      this.likeArr = data;
      this.likeUsers = [];
      this.numberOfLike = this.likeArr.length;

      for (var i = 0; i < (this.numberOfLike); i++) {
        this.userProvider.getAllUserInfo(data[i]['user_id']).subscribe(data => {
          this.likeUsers.push(data['username']);
        });
      }
    });
  }

  clickLike() {
     const like = {
      file_id: this.id
    };
    this.mediaProvider.postLike(like).subscribe(response => {
      this.getNumberOfLike();
      this.likePost = "heart";
    }, (error: HttpErrorResponse) => {
      if (error['statusText'] == 'Bad Request') {
        this.mediaProvider.deleteLike(this.id).subscribe(Response => {
          this.getNumberOfLike();
          this.likePost = "heart-outline";
        })
      }
    });
  }

  likeClicked: boolean = false;

  public onIconCommentClick() {
    this.navCtrl.push(CommentPage, {
      mediaId: this.id,
      username: this.username,
      title: this.title,
      des: this.description
    });
  }

  public onLikeClick() {
    this.likeClicked = !this.likeClicked;
  }

  deletePost() {
    let alert = this.alertCtrl.create({
      subTitle: 'Delete this post?',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.mediaProvider.deleteMedia(this.id).subscribe(res => {
              console.log(res['message']);
              this.mediaProvider.reloadProfile = true;
              this.navCtrl.pop();
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

}