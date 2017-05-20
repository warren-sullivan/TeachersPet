import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import * as keys from '../../keys';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor() {
    firebase.initializeApp(keys.firebaseConfig);
  }

  getStudents():firebase.Promise<any>{
    return firebase.database().ref("StudentList").once('value');
  }

  getAssignments():firebase.Promise<any>{
    return firebase.database().ref("AssignmentList").once('value');
  }

  deleteStudent(studentKey:string):void{
    return null;
  }

  deleteAssignment(assignmentKey:string):void{
    return null;
  }

  getAssignmentDataFromStudents(students:Student[], assignment:Assignment):Object[]{
    let dataArray:Object[] = [];
    students.forEach(student => {
      student.Assignments.forEach(assignmentData => {
        if(assignmentData.Key == assignment.Key){
          let tempStr:string = student.Key;
          dataArray.push({tempStr, assignmentData});
        }
      })
    });
    return dataArray;
  }

}

interface Student {
  Key: string,
  Name: string,
  Email: string,
  Github: URL,
  Slack: URL,
  Image: URL,
  Assignments: AssignmentData[]
}

interface Assignment {
  Key: string,
  Title: string,
  PointsPossible: number,
  Description: string,
  DueDate: Date,
  DateAssigned: Date,
  GithubLink: URL
}

interface AssignmentData {
  Key: string,
  PointsScored: number,
  DateSubmitted: Date,
}
