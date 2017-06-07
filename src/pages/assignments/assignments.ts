import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataService, Assignment } from '../../providers/data-service';

/**
 * Generated class for the AssignmentsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-assignments',
  templateUrl: 'assignments.html',
})
export class AssignmentsPage implements OnInit {

  assignments: Assignment[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService) {
  }

  getAssignments() {
    this.dataService.setClass("Mobile Development 2017").then(() => {

      this.dataService.getAssignmentList()
        .then(res => { console.log(res); this.assignments = res });
    });

  }

  ngOnInit() {
    this.getAssignments();
  }

}