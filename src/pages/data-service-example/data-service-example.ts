import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DataService, Assignment, Student } from '../../providers/data-service';


@Component({
  selector: 'page-data-service-example',
  templateUrl: 'data-service-example.html',
})
export class DataServiceExamplePage {

  user: any = null;

  assignmentList: Assignment[] = [];
  studentList: Student[] = [];

  constructor(public dataService: DataService, public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    this.dataService.getUserAuthStatus().subscribe(user => {
      this.user = user;
      this.dataService.setClass("Test Class").then(() => {
        let student = new Student();
        student.Key = 'Key1';
        this.dataService.getAssignmentList(student).then(list => {
          //console.log(list[0].PointsScored);
        })
        //this.refreshAssignmentList();
        //this.refreshStudentList();
      });
    });
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




  addAssignment(){
    let assignment:Assignment = new Assignment();

      assignment.Title = 'This is a test title';
      assignment.PointsPossible = 10;
      assignment.Description = "purple monkey trees, hows that for a description?";
      assignment.DueDate = '123456789';
      assignment.DateAssigned = '123456789';
      assignment.GithubLink = 'www.github.com/mybutt';
  //  assignment.Key // DON'T MODIFY KEY

    this.dataService.addAssignment(assignment);
  }

  removeAssignment(){
    if(this.assignmentList.length > 0)
      this.dataService.removeAssignment(this.assignmentList[0]).then(() => this.refreshAssignmentList());
  }

  updateAssignment(){
    if(this.assignmentList.length > 0){
      let assignment = this.assignmentList[0];
      assignment.Title = "Purple Awesome Sauce";
      this.dataService.updateAssignment(assignment).then(() => this.refreshAssignmentList());
    }
  }

  addStudent(){
    let student:Student = new Student();
      student.Email = "hamburgilin@aol.com";
      student.GithubID = "hamburgilin";
      student.ImageURL = "http://www.myspace.com/hamburgilin.png";
      student.SlackID = "hamburgilin";
      student.Name = "Hamburgesa Torez";
   // student.Key // DON'T MODIFY KEY
    
    this.dataService.addStudent(student).then(() => this.refreshStudentList());
  }

  removeStudent(){
    if(this.studentList.length > 0)
      this.dataService.removeStudent(this.studentList[0]).then(() => this.refreshStudentList());
  }

  updateStudent(){
    if(this.studentList.length > 0){
      let student = this.studentList[0];
      student.Name = "Joe Somebody";
      this.dataService.updateStudent(student).then(() => this.refreshStudentList());
    }
  }

  submitGrade() {
    if(this.studentList.length > 0 && this.assignmentList.length > 0){
      let student = this.studentList[0];
      let assignment = this.assignmentList[0];
      this.dataService.submitGrade(student, assignment, 17, new Date().toString()).then(() => console.log("submitted grade"));
    }
  }

  removeGrade() {
    if(this.studentList.length > 0 && this.assignmentList.length > 0){
      let student = this.studentList[0];
      let assignment = this.assignmentList[0];
      this.dataService.removeGrade(student, assignment).then(() => console.log("done removing grade"));
    }
  }

  refreshStudentList() {
    this.dataService.getStudentList().then(studentList => this.studentList = studentList);
  }

  refreshAssignmentList() {
    this.dataService.getAssignmentList().then(assignmentList => this.assignmentList = assignmentList);
  }

}
