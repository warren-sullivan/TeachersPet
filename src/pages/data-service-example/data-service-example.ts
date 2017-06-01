import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DataService } from '../../providers/data-service';


@Component({
  selector: 'page-data-service-example',
  templateUrl: 'data-service-example.html',
})
export class DataServiceExamplePage {

  signedIn: boolean = false;
  user: any = null;

  constructor(public dataService: DataService, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.dataService.getUserAuthStatus().subscribe(user => {
      console.log(user)
      this.user = user;
    });
  }

  getStudentList(){
    this.dataService.getStudentList()
    .then(students => console.log(students));

  }

  signIn(){
    this.dataService.signIn();

  }

  signOut(){
    this.dataService.signOut();

  }

  addClass(){
    if(this.user)
      this.dataService.addClass("This Is a class", this.user);

  }

  getClassList() {
    this.dataService.getClassList().then(data => console.log(data));
  }

}
