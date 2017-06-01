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

  assignments = [
    { name: 'assignment 1' },
    { name: 'assignment 2' },
    { name: 'assignment 3' },
    { name: 'assignment 4' },
    { name: 'assignment 5' },
    { name: 'assignment 6' },
    { name: 'assignment 7' },
    { name: 'assignment 8' },
    { name: 'assignment 9' }
  ]


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
