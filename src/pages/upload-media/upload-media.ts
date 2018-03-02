import { TabsPage } from './../tabs/tabs';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Media } from '../../app/models/media';
import { Component } from '@angular/core';
import {
  App,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  ToastController,
} from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { HttpErrorResponse } from '@angular/common/http/src/response';

/**
 * Generated class for the UploadMediaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload-media',
  templateUrl: 'upload-media.html',
})
export class UploadMediaPage {

  file: File;
  fileName: string = 'No File Chosen';
  mediaData;
  media: Media = { file: this.file, title: '', description: '' };
  message: any;
  loading = this.loadingCtrl.create({
    content: 'Uploading, please wait...',
  });


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private mediaProvider: MediaProvider,
    private camera: Camera,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
  }

  setFile(evt) {
    console.log(evt.target.files[0]);
    this.file = evt.target.files[0];
    this.fileName = this.file.name;
  }

  startUpload(form: any) {
    //Create FormData object
    //add title & discription, add file,send FormData obj
    this.loading.present();

    const formData: FormData = new FormData();
    if (this.mediaData) {
      formData.append('file', this.dataURItoBlob(this.mediaData));
      this.fileName = 'No File Chosen';
      this.file = null;
    } else {
      formData.append('file', this.file);
    }
    formData.append('title', this.media.title);
    formData.append('description', this.media.description);

    this.mediaProvider.uploadFile(formData).subscribe(data => {
      console.log(data);
      this.message = data['message'];
      const tag = {
        file_id: data['file_id'],
        tag: "#ori"
      };
      this.mediaProvider.postTag(tag).subscribe(res => {
        setTimeout(() => {
          this.presentToast(this.message);
          this.loading.dismiss();
          this.app.getRootNav().setRoot(TabsPage);
          this.mediaData = '';
        }, 3000);
      }, (tabErr: HttpErrorResponse) => {
        console.log(tabErr);
        this.loading.dismiss();
      })
    }, (e: HttpErrorResponse) => {
      console.log(e);
      this.loading.dismiss();
      this.presentToast("Error while uploading");
    });
  }
 
  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.ALLMEDIA,
      correctOrientation: true,
      allowEdit: true,
      targetHeight: 1000,
      targetWidth: 1000
    };
    this.camera.getPicture(options).then((imageData) => {
      this.mediaData = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
      this.presentToast('Error while storing file.');
    })

  }

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
    }

    var dataView = new DataView(arrayBuffer);
    var blob = new Blob([dataView.buffer], { type: mimeString });
    return blob;
  }

  cancel() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
