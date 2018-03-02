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
import { SearchPage } from '../search/search';
import { Refresher } from 'ionic-angular/components/refresher/refresher';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;

  medias: any = [];
  arr: any = [];
  searchArray: any = [];
  numberOfComment: any;
  numberOfLike: any;  
  mediaArray: any;
  currentUser_id;
  limit: number = 10;
  start: number = 0;
  toggled: boolean = false;
  search: Search = {title: ''};
  showPopular = false;
  mediasLength: number = 0;



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
    this.medias = [];
    this.getAllMedia(null);
  }

  ionViewWillEnter() {
    this.getNumberOfComment();
    this.getNumberOfLike(null, null);
    if (this.mediaProvider.reload) {
      this.medias = [];
      this.limit = 10;
      this.getAllMedia(null);

      this.mediaProvider.reload = false;
    }
  }

  scrollToTop() {
    this.content.scrollToTop();
  }
  getAllMedia(callbacks: any) {
    console.log(this.start, this.limit);
    this.mediaProvider.getAllMedia(this.start, this.limit).subscribe((data: any) => {
      console.log("getAllMedia data received.");
      let likesCallback = null;
      let commentCallback = null;
      let mediaCallback = null;      
      this.medias = this.medias.concat(data);      

      console.log(this.medias);
      // Check callback to see if the call function is done or not
      if (callbacks != null) {
        if (typeof callbacks == 'object') {          
          if (callbacks.likes) {likesCallback = callbacks.likes;}
          if (callbacks.media) {mediaCallback = callbacks.media;}
          this.showPopular = true;
        }
      }            

      this.getNumberOfComment();      
      this.getNumberOfLike(likesCallback, this.medias);
      
      if (mediaCallback != null) {mediaCallback(this.medias);}

      for (let i = 0; i < this.medias.length; i++) {
        console.log(this.medias[i].user_id);
        this.userProvider.getAllUserInfo(this.medias[i].user_id).subscribe(res => {
          this.mediaArray = res;
          for (let i in this.medias) {
            if (this.medias[i].user_id == res['user_id']) {
              this.medias[i].username = res['username'];
            }           
          }         
        })
      }      
    });
  }

  getNumberOfComment() {
    for (let file of this.medias) {
      this.mediaProvider.getComment(file.file_id).subscribe(res => {
        this.numberOfComment = res;
        file.numberOfComment = this.numberOfComment.length;
      })
    }
  }

  getNumberOfLike(callback: any, param: any) {
    let count = 0;
    for (let file of this.medias) {
      this.mediaProvider.getLike(file.file_id).subscribe(res => {
        this.numberOfLike = res;
        file.numberOfLike = this.numberOfLike.length;                
          count += 1;
          if (count == this.medias.length)
          {
            if (callback != null) {
              console.log("getNumberOfLike callback");  
              callback(param);
            }
          }        
      })
    }
  }

  clickLike(id) {
     const like = {
      file_id: id
    };
    this.mediaProvider.postLike(like).subscribe(response => {
      this.getNumberOfLike(null, null);
    }, (error: HttpErrorResponse) => {
      if (error['statusText'] == 'Bad Request') {
        this.mediaProvider.deleteLike(id).subscribe(Response => {
          this.getNumberOfLike(null, null);
        })
      }
    });
  }

  savePost(media) {
    this.mediaProvider.saved.push(media);
    console.log(this.mediaProvider.saved);
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
    this.showPopular = false;
    this.start += 10 ;
    console.log(this.start, this.limit);
    setTimeout(() => {
      this.getAllMedia(null);
      infiniteScroll.complete();
      this.mediasLength = this.medias.length;
      if (this.medias.length > this.mediasLength +10) {
        infiniteScroll.enable(false);
      }
    }, 2000);
  }

  doRefresh(refresher) {
    this.showPopular = false;
    setTimeout(() => {
      this.medias = [];
      this.getAllMedia(null);

      refresher.complete();
    }, 2000);
  }

  public toggle() {
    console.log('search call', this.toggled)
    this.toggled = this.toggled ? false : true;
  }


 onFilter(){
   console.log('Filter');
   let likeValue: any;
   let lastLikeVal = 0;
   let bool = false;
   let sortCallbacks = {
      likes : function (arrayToSort) {
        console.log("onFilter likes callback.");        
        arrayToSort = arrayToSort.sort(function(a,b) 
          {
            return b.numberOfLike - a.numberOfLike
          });
        arrayToSort = arrayToSort.splice(20,80);
        
      }
   }

   //this.end = 100;   
   this.getAllMedia(sortCallbacks);   
   //this.end = 5;
 }

  onInputSearch(myInput) {
    this.searchArray = [];
    console.log(myInput);
    this.search.title = String(myInput);
    console.log(this.search.title);
    if (myInput !== '') {
      this.mediaProvider.postSearch(this.search).subscribe(data => {
        this.searchArray = data;
        console.log(this.searchArray);
      });
    }

  }

  onSearchEnter() {
    console.log('Enter');
    this.navCtrl.push(SearchPage, {
      searchArray: this.searchArray
    })
  }

  onCancle() {
    console.log('Cancle');
  }

}
