import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DataService } from '../../providers/data-service';


@Component({
  selector: 'page-data-service-example',
  templateUrl: 'data-service-example.html',
})
export class DataServiceExamplePage {

  constructor(public dataService: DataService, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.dataService.getStudents().then(students => console.log(students));
  }

}
