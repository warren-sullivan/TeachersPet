import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ClassCreationPage } from '../class-creation/class-creation';
import { DataService } from '../../providers/data-service';
import { StudentsList } from "../students-list/students-list";

@Component({
  selector: 'page-class',
  templateUrl: 'class-list.html'
})
export class ClassListPage implements OnInit {

  user: any = 'Aaron Robinson';

  classes: any;
  deleteToggle = false;

  constructor(public navCtrl: NavController, public dataService: DataService) {

  }

  createClass() {
    this.navCtrl.push(ClassCreationPage);
  }

  importClasses() {
    this.dataService.getClassList().then(res => {
      this.classes = res;
    })
  }

  toggleDeleteButton() {
    if (!this.deleteToggle) {
      this.deleteToggle = true;
    }
    else this.deleteToggle = false;
  }

  confirmDelete() {
    for (let i = 0; i < this.classes.length; i++) {
      if (this.classes[i].selected) {
        console.log(this.classes[i].name);
      }
    }
  }

  classSelected() {
    this.navCtrl.push(StudentsList);
  }

  ngOnInit() {
    this.importClasses();
  }
  
  ionViewWillEnter(){
    this.importClasses();
  }
}