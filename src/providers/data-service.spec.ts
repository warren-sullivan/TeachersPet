import {} from 'jasmine';
import { async, TestBed, inject } from '@angular/core/testing';
import {DataService, Assignment, Student} from './data-service';
import * as firebase from 'firebase';



describe('Data Service Testing', () => {
    let dataService:DataService = new DataService();

    let testStudent = {
        Email: 'email',
        GithubID: 'githubID',
        ImageURL: 'url',
        Name: 'name',
        SlackID: 'slackid',
        Key: '0'
    }

    let testAssignment = {
        DateAssigned: 'date',
        Description: 'description',
        DueDate: 'date',
        GithubLink: 'link',
        PointsPossible: 69,
        Title: 'title',
        Key: '0'
    }

    it('Creates a class', (done) => {
        // make sure to remove anything here first
        firebase.database().ref('Test Class').remove();

         dataService.addClass("Test Class", {'uid': "TestKey"}).then(() => {
            firebase.database().ref().child('Test Class').once('value', data => {
              expect(data).toBeTruthy();
              done();
            })      
         });
         return true;
    });

    it('returns a class', (done) => {
        dataService.setClass('Test Class').then(() => {
            let className = dataService.getClass();
            expect(className).toBeTruthy();
            done();
        })
    });
    
    it('sets a class', (done) => {
        dataService.setClass('Test Class').then(() => {
            let success = true;
            expect(success).toBe(true);
            done();
        });
    })

    it('verify that a class exists', (done) => {
        dataService.setClass('This Class Does Not Exist').then(() => {
            expect(false).toBe(true);
            done();
        }).catch(error => {
            expect(true).toBe(true);
            done();
        })
    });

    it('get a class list', (done) => {
        dataService.getClassList().then(classList => {
            expect(classList.length).toBeTruthy();
            done();
        });
    });

    it('get class list specific to teacher', (done) => {
        dataService.getClassList({'uid': 'TestKey'}).then(classList => {
            expect(classList.length).toBe(1);
            done();
        });
    });

    it('get a student list', (done) => {
        // make a couple of students first
        let slRef = firebase.database().ref("Test Class/StudentList");
        let student = Object.assign({}, testStudent);

        student.Key = 'Key1';
        slRef.child('Key1').set(student);

        student.Key = 'Key2';
        slRef.child('Key2').set(student);

        dataService.getStudentList().then(studentList => {
            expect(studentList.length).toBe(2);
            done();
        })
    });

    it('get assignment list', (done) => {
        let alRef = firebase.database().ref("Test Class/AssignmentList");
        let assignment = Object.assign({}, testAssignment);

        assignment.Key = 'Key1';
        alRef.child('Key1').set(assignment);

        assignment.Key = 'Key2';
        alRef.child('Key2').set(assignment);

        dataService.getAssignmentList().then(assignmentList => {
            expect(assignmentList.length).toBe(2);
            done();
        })
    });

    it('get student values if student values exist', done => {
        firebase.database().ref("Test Class/Submissions/Test1").set({
            StudentID: 'Key1',
            AssignmentID: 'Key1',
            Points: 100,
            DateSubmitted: 'Some Date'
        });
        let student = Object.assign({}, testStudent);
        student.Key = 'Key1';
        dataService.getAssignmentList(student).then(assignmentList => {
           if( assignmentList.length > 0){
               expect(assignmentList[0].PointsScored == 100 
               && assignmentList[0].DateSubmitted == "Some Date").toBeTruthy();
               done();
           }
        })
    });

    let assignmentToManipulate: Assignment = null;

    it('add an assignment to assignment list', done => {
        firebase.database().ref('Test Class/AssignmentList').remove();

        let assignment = new Assignment();
        assignment.Title = "this is a test assignment";
        assignment.DateAssigned = "assigned date";
        assignment.Description = "banana milkshakes";
        assignment.DueDate = "Friday the 13th";
        assignment.GithubLink = "www.github.com/donkySlayer";
        assignment.PointsPossible = 3;
        dataService.addAssignment(assignment).then(data => {
            firebase.database().ref("Test Class/AssignmentList").once('value', snapshot => {
                snapshot.forEach(childSnap => {

                    assignmentToManipulate = childSnap.val();
                    expect(childSnap.val().Title).toBe('this is a test assignment');
                    done();
                    return false;
                })
            });
        }).catch(error => console.log(error));
    });

    it('modify an assignment', done => {
        assignmentToManipulate.Title = "this is a changed title";
        dataService.updateAssignment(assignmentToManipulate).then(() => {
            firebase.database().ref("Test Class/AssignmentList/" + assignmentToManipulate.Key).once('value', snapshot => {
                expect(snapshot.val().Title).toBe("this is a changed title");
                done();
            });
        });
    });

    it('remove an assignment from list', done => {
        dataService.removeAssignment(assignmentToManipulate).then(() => {
            firebase.database().ref("Test Class/AssignmentList").child(assignmentToManipulate.Key).once('value', snapshot => {
                expect(snapshot.val()).toBeNull();
                done();
            })
        });
    });

    let studentToModify:Student = null;

    it('add a student', done => {
        let student = new Student();
        student.Name = "Jimmy Dean";
        student.SlackID = "smokedSausage";
        student.ImageURL = "www.jimmyknowsBest.com/porky.png";
        student.Email = "herecomesjimmy@aol.com";
        student.GithubID = "sausageParty";
        dataService.addStudent(student).then(() => {
            firebase.database().ref("Test Class/StudentList").once('value', snapshot => {
                
                snapshot.forEach(childSnap => {
                    if(childSnap.val().Name == 'Jimmy Dean'){
                        studentToModify = childSnap.val();
                        expect(childSnap.val().Name).toBe('Jimmy Dean');
                        done();
                    }
                    return false;
                })
            })
        })
    })

  it('update a student', done => {
    studentToModify.Name = "Johnsonville";

    dataService.updateStudent(studentToModify).then(() => {
        firebase.database().ref("Test Class/StudentList/" + studentToModify.Key).once('value', snapshot => {
            expect(snapshot.val().Name).toBe("Johnsonville");
            done();
        });
    });
  });

  it('submit a grade', done => {
    let student = new Student();
    let assignment = new Assignment();
    student.Key = 'Key3';
    assignment.Key = 'Key3';
    dataService.submitGrade(student, assignment, 100, 'Today').then(() => {
        firebase.database().ref("Test Class/Submissions").once('value', snapshot => {
            snapshot.forEach(childSnap => {
                if(childSnap.val().StudentID == 'Key3'){
                    expect(childSnap.val().StudentID).toBe('Key3');
                    done();
                }
                return false;
            })
        });
    });
  })

  it('remove a grade', done => {
    let student = new Student();
    let assignment = new Assignment();
    student.Key = 'Key3';
    assignment.Key = 'Key3';
    dataService.removeGrade(student, assignment).then(() => {
        firebase.database().ref("Test Class/Submissions").once('value', snapshot => {
            let foundMatch = false;
            snapshot.forEach(childSnap => {
                if(childSnap.val().StudentID == 'Key3')
                    foundMatch = true;
                return false;
            });
            expect(foundMatch).toBe(false);
            done();    
        })
    });
  });

  it('test that submissions are gone when student is removed', done => {
    let student = new Student();
    student.Key = 'Key1';
    dataService.removeStudent(student).then(() => {
        firebase.database().ref("Test Class/Submissions").once('value', snapshot => {
            expect(snapshot.val()).toBeNull();
            done();
        });
    });
  });
});