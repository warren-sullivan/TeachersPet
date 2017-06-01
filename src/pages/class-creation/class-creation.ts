import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClassListPage } from '../class-list/class-list';
import { ClassService } from '../../providers/class-service';

/**
 * Generated class for the ClassCreation page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-class-creation',
  templateUrl: 'class-creation.html',
})
export class ClassCreationPage {
  className: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public classService: ClassService) {
  }

  addClass(){
    this.classService.classes.push({name: this.className});
    this.navCtrl.pop();
  }

}
