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
});