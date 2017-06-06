import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClassListPage } from '../class-list/class-list';
import { DataService } from '../../providers/data-service';

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

  user: any = 'Aaron Robinson';

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService) {
  }

  addClass(className){
    this.dataService.addClass(className, this.user)
    this.navCtrl.pop();
  }

}
