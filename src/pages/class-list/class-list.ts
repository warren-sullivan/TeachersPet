import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ClassCreationPage } from '../class-creation/class-creation';
import { ClassService } from '../../providers/class-service';

@Component({
    selector: 'page-class',
    templateUrl: 'class-list.html'
})
export class ClassListPage implements OnInit {

    classes: any;
    deleteToggle = false;

    constructor(public navCtrl: NavController, public classService: ClassService) {

    }

    createClass() {
        this.navCtrl.push(ClassCreationPage);
    }

    importClasses() {
        this.classes = this.classService.classes;
    }

    toggleDeleteButton(){
      if(!this.deleteToggle){
        this.deleteToggle = true;
      }
      else this.deleteToggle = false;
    }

    confirmDelete(){
      for(let i = 0; i < this.classes.length; i++){
        if(this.classes[i].selected){
          console.log(this.classes[i].name);
        }
      }
    }

    ngOnInit(){
        this.importClasses();
    }


}