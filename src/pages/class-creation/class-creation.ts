import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClassListPage } from '../class-list/class-list';
import { DataService } from '../../providers/data-service';


@Component({
  selector: 'page-class-creation',
  templateUrl: 'class-creation.html',
})
export class ClassCreationPage {
  className: string;

  user: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService) {
    this.getUser();
  }

  getUser(){
    this.dataService.getUserAuthStatus().subscribe(user => {
      this.user = user;
    });
  }

  addClass(){
    this.dataService.addClass(this.className, this.user);
    this.navCtrl.pop();
  }

}
