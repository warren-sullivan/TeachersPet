import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()

export class CameraService {
  constructor(public camera: Camera) {
    
  }

  takePicture(): Promise<any> {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    //this promise should give a string containing the image
    //this has a possibility of crashing/freezing the app
    return this.camera.getPicture(options);
  }
}
