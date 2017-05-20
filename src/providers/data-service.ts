import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import * as keys from '../../keys';

@Injectable()
export class DataService {

  constructor() {
    firebase.initializeApp(keys.firebaseConfig);
  }

  getStudents(): Promise<Student[]>{
    return new Promise((resolve, reject) => {
      firebase.database().ref('StudentList').once('value', (snapshot) => 
      {
        let studentArray: Student[] = [];
        snapshot.forEach(childSnapshot => {studentArray.push(this.studentMap(childSnapshot.val())); return false;});
        resolve(studentArray);
      }).catch(e => reject("problems loading student list"));
    });
  }

  private studentMap(jsonObj: any): Student{
    let student = {
      Name: jsonObj.Name,
      Slack: jsonObj.SlackID,
      Key: jsonObj.Key,
      Image: jsonObj.ImageURL,
      Github: jsonObj.GithubID,
      Email: jsonObj.Email,
      Assignments: null
    };
    student.Assignments = [];
    for (var key in jsonObj.AssignmentList){
      student.Assignments.push(this.assignmentDataMap(jsonObj.AssignmentList[key]));
    }

    return student;
  }

  private assignmentDataMap(jsonObj: any):AssignmentData {
    return {
      Key: jsonObj.Key,
      DateSubmitted: jsonObj.DateSubmitted,
      PointsScored: jsonObj.PointsScored
    }
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
