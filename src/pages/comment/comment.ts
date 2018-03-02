import { ProfilePage } from './../profile/profile';
import { OtherProfilePage } from './../other-profile/other-profile';
import { UserProvider } from './../../providers/user/user';
import { MediaProvider } from './../../providers/media/media';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the CommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {

  id;
  my_id;
  username;
  title;
  description;
  comments: any = [];
  commentArr: any;
  newComment;
  myComment: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private mediaProvider: MediaProvider,
    private userProvider: UserProvider,
    private alertCtrl: AlertController) {

    this.id = navParams.get('mediaId');
    this.username = navParams.get('username');
    this.title = navParams.get('title');
    this.description = navParams.get('des');
    this.my_id = this.userProvider.my_id;
  }

  ionViewDidLoad() {
    this.getAllComment();
  }

  postComment() {
    const comment = {
      file_id: this.id,
      comment: this.newComment
    };
    this.mediaProvider.postComment(comment).subscribe(res => {
      this.getAllComment();
      this.newComment = '';
    })
  }

  deleteComment(cmt_id, cmt) {
    let alert = this.alertCtrl.create({
      subTitle: 'Delete this comment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.mediaProvider.deleteComment(cmt_id).subscribe(res => {
              console.log(res['message']);
              this.comments.splice(this.comments.indexOf(cmt), 1);
            });
          }
        }
      ]
    });
    alert.present();
  }

  getAllComment() {
    this.mediaProvider.getComment(this.id).subscribe((res: any) => {
      this.comments = res;
      for (let cmt of this.comments) {
        this.userProvider.getAllUserInfo(cmt.user_id).subscribe(res => {
          this.commentArr = res;
          for (let i in this.comments) {
            if (this.comments[i].user_id == res['user_id']) {
              this.comments[i].username = res['username'];
            }
          }
        })
      }
    })
  }

  openOtherUser(user_id) {
    if (user_id !== this.my_id) {
      this.navCtrl.push(OtherProfilePage, {
        userId: user_id
      })
    } else {
      this.navCtrl.push(ProfilePage);
    }
  }

}
