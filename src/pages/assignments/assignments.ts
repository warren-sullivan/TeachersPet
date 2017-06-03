import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataService } from '../../providers/data-service';

/**
 * Generated class for the AssignmentsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assignments',
  templateUrl: 'assignments.html',
})
export class AssignmentsPage implements OnInit {

  assignments: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService) {
  }

  getAssignments() {
    this.dataService.getAssignments()
    .then(res => this.assignments = res);
  }

  ngOnInit() {
    this.getAssignments();
  }

}
