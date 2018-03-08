import { CommentPage } from './../comment/comment';
import { OtherProfilePage } from './../other-profile/other-profile';
import { ProfilePage } from './../profile/profile';
import { DetailMediaPage } from './../detail-media/detail-media';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProvider } from './../../providers/user/user';
import { MediaProvider } from './../../providers/media/media';
import { Component, ViewChild } from '@angular/core';
import { InfiniteScroll, NavController } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { Search } from '../../app/models/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;

  medias: any = [];
  mediaArr: any = [];
  searchArray: any = [];
  numberOfComment: any;
  numberOfLike: any;
  currentUser_id;
  start: number = 0;
  end: number = 100;
  doLoadMore: boolean = true;
  toggled: boolean = false;
  search: Search = { title: '' };
  likeArr: any;
  tagArr: any;
  avatar_url = "https://api.adorable.io/avatars/40/";


  constructor(public navCtrl: NavController,
    private mediaProvider: MediaProvider,
    private userProvider: UserProvider) {

  }

  ionViewDidLoad() {
    if (localStorage.getItem('token') !== null) {
      this.userProvider.getUserData(localStorage.getItem('token')).
        subscribe(response => {
          this.currentUser_id = response['user_id'];
          this.userProvider.my_id = response['user_id'];
          this.userProvider.logged = true;
          localStorage.setItem('user', JSON.stringify(response));
        }, (error: HttpErrorResponse) => {
          console.log(error);
        });
    }
    this.getAllMedia();
  }

  ionViewWillEnter() {
    this.getNumberOfComment();
    this.getNumberOfLike();
    if (this.mediaProvider.reload) {
      this.medias = [];
      this.start = 0;
      this.end = 10;
      this.getAllMedia();
      this.mediaProvider.reload = false;
    }
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  getAllMedia() {
    this.mediaProvider.getAllMedia(this.start, 10).subscribe((data: any) => {
      this.medias = data;
      this.getNumberOfComment();
      this.getNumberOfLike();
      this.getUsername();
      this.getOnlyOriMedia(data);
    });
  }

  getOnlyOriMedia(data) {
    for (let file of data) {
      this.mediaProvider.getTagbyFileId(file.file_id).subscribe(res =>{
        this.tagArr = res;
        for (let i in this.tagArr) {
          if(this.tagArr[i].tag == "#ori") {
            console.log(file)
            this.mediaArr.push(file);
            console.log(this.mediaArr)
            //this.medias.splice(file, 1);
          } 
        }
      })
    }
  }

  getUsername() {
    for (let user of this.medias) {
      this.userProvider.getAllUserInfo(user.user_id).subscribe(res => {
        for (let i in this.medias) {
          if (this.medias[i].user_id == res['user_id']) {
            this.medias[i].username = res['username'];
          }
        }
      })
    }
  }

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
        this.likeArr = res;
        this.numberOfLike = res;
        file.numberOfLike = this.numberOfLike.length;
        file.like = false;
        file.likePost = "heart-outline";
        for (let i in this.likeArr) {
          if (this.likeArr[i].user_id == this.currentUser_id) {
            file.like = true;
            file.likePost = "heart";
          } else {
            file.like = false;
            file.likePost = "heart-outline";
          }
        }
      })
    }
  }

  clickLike(id, isLiked) {
    const like = {
      file_id: id
    };
    if (isLiked == false) {
      this.mediaProvider.postLike(like).subscribe(response => {
        this.getNumberOfLike();
      })
    } else {
      this.mediaProvider.deleteLike(id).subscribe(Response => {
        this.getNumberOfLike();
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

  openComment(id, username, title, description) {
    this.navCtrl.push(CommentPage, {
      mediaId: id,
      username: username,
      title: title,
      des: description
    });
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    setTimeout(() => {
      this.start = this.medias.length;
      console.log(this.start, this.end)
      if (this.doLoadMore) {
        this.mediaProvider.getAllMedia(this.start, 10).subscribe((data: any) => {
          console.log(data)
          this.medias = this.medias.concat(data);
          this.getNumberOfComment();
          this.getNumberOfLike();
          this.getUsername();
          this.getOnlyOriMedia(data);
        });
        infiniteScroll.complete();
      }
    }, 2500);
    if (this.medias.length > 30) {
      this.doLoadMore = false;
    }
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.medias = [];
      this.start = 0;
      this.end = 10;
      this.getAllMedia();
      this.doLoadMore = true;
      refresher.complete();
    }, 2000);
  }

  public toggle() {
    console.log('search call', this.toggled)
    this.toggled = this.toggled ? false : true;
  }

  onInputSearch(myInput) {
    this.searchArray = [];
    this.search.title = String(myInput);
    if (myInput !== '') {
      this.mediaProvider.postSearch(this.search).subscribe(data => {
        this.searchArray = data;
      });
    }
  }

  onCancle() {
    console.log('Cancle');
  }

}
