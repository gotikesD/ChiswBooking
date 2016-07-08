'use strict';
const supertest = require("supertest");
const should = require("should");

const server = supertest.agent("http://localhost:3000");
const config = require('../config/tests');


describe("For not logged users ",() => {

  it(`Just a simple request for all rooms `, (done) => {
    server
      .get("/rooms")
      .end(function (err, res) {
        res.body.should.be.instanceOf(Array);
        res.status.should.equal(200);
        done();
      });
  });

  it("Request for getting single room info ",(done) => {
    server
      .get(`/rooms/${config.ROOM_ID}`)
      .end(function(err,res){
        res.body.should.have.property('_id');
        res.body.should.have.property('capacity');
        res.body.should.have.property('stage');
        res.body.should.have.property('name');
        res.body.should.be.instanceOf(Object);
        res.status.should.equal(200);
        done();
      });
  });

  it("Request for getting single room info with FAKE ID ",(done) => {
    server
      .get(`/rooms/${config.FAKE_ROOM_ID}`)
      .end(function(err,res){
        res.body.should.be.instanceOf(Object);
        res.status.should.equal(404);
        done();
      });
  });

  it("Request for getting all rooms per stage",(done) => {
    server
      .get(`/rooms/stage/${config.STAGE}/`)
      .end(function(err,res){
        res.body.should.be.instanceOf(Array);
        res.status.should.equal(200);
        done();
      });
  });


  it("Request for getting all rooms per FAKE STAGE",(done) => {
    server
      .get(`/rooms/stage/${config.FAKE_STAGE}/`)
      .end(function(err,res){
        res.body.should.be.instanceOf(Object);
        res.status.should.equal(404);
        done();
      });
  });


  //it("Request for sign up",(done) => {
  //
  //      let body = {
  //          firstName : 'test3' ,
  //          secondName : 'tester3',
  //          email : 'tester7@fake.ru',
  //          password : 'password'
  //      };
  //
  //  server
  //    .post(`/auth/sign`)
  //    .send(body)
  //    .end(function(err,res){
  //      res.body.should.be.instanceOf(Object);
  //      res.body.should.have.property('_id');
  //      res.body.should.have.property('firstName');
  //      res.body.should.have.property('secondName');
  //      res.body.should.have.property('email');
  //      res.body.should.have.property('password');
  //      res.status.should.equal(200);
  //      done();
  //    });
  //});


  it("Request for signUp with wrong email",(done) => {

        let body = {
            firstName : 'test3' ,
            secondName : 'tester3',
            email : 'test@mail.ru',
            password : 'password'
        };

    server
      .post(`/auth/sign`)
      .send(body)
      .end(function(err,res){
          res.body.should.be.instanceOf(Object);
          res.status.should.equal(404);
        done();
      });
  });

  it("Request for login ",(done) => {

        let body = {
            email : 'test@mail.ru',
            password : 'password'
        };
    server
      .post(`/auth/login`)
      .send(body)
      .end(function(err,res){
        res.body.should.be.instanceOf(Object);
        res.body.should.not.be.empty();
        res.status.should.equal(200);
        done();
      });
  });

  it("Request for login with fake email ",(done) => {

    let body = {
      email : 'fakeEmail@fake.ru',
      password : 'password'
    };
    server
      .post(`/auth/login`)
      .send(body)
      .end(function(err,res){
        res.body.should.be.instanceOf(Object);
        res.status.should.equal(404);
        done();
      });
  });

});

describe("For logged users",() => {

  it("Request for  viewing all current meetings", (done) => {
    server
      .get(`/meetings`)
      .set({'x-access-token': config.TOKEN})
      .end(function (err, res) {
        res.body.should.be.instanceOf(Array);
        res.body.should.be.not.empty();
        res.status.should.equal(200);
        done();
      });
  });


  it("Request for  viewing all current meetings without TOKEN", (done) => {
    server
      .get(`/meetings`)
      .end(function (err, res) {
        res.body.should.be.instanceOf(Object);
        res.status.should.equal(404);
        done();
      });
  });


  it("Request for  viewing one meeting", (done) => {
    server
      .get(`/meetings/${config.MEETING_ID}`)
      .set({'x-access-token': config.TOKEN})
      .end(function (err, res) {
        res.body.should.be.instanceOf(Object);
        res.body.should.be.not.empty();
        res.body.should.have.property('_id');
        res.body.should.have.property('client');
        res.body.should.have.property('room');
        res.status.should.equal(200);
        done();
      });
  });


  it("Request for  viewing one meeting with fake meeting ID", (done) => {
    server
      .get(`/meetings/${config.FAKE_MEETING_ID}`)
      .set({'x-access-token': config.TOKEN})
      .end(function (err, res) {
        res.body.should.be.instanceOf(Object);
        res.status.should.equal(404);
        done();
      });
  });

  //it("Add meeting",(done) => {
  //
  //  let body = {
  //    title : 'Some title',
  //    month : 6,
  //    day : 30,
  //    start : 10.3,
  //    end : 12.3
  //  };
  //  server
  //    .post(`/meetings/${config.ROOM_ID}`)
  //    .set({'x-access-token': config.TOKEN})
  //    .send(body)
  //    .end(function(err,res){
  //      res.body.should.be.instanceOf(Object);
  //      res.body.should.have.property('_id');
  //      res.body.should.have.property('client');
  //      res.body.should.have.property('room');
  //      res.status.should.equal(200);
  //      done();
  //    });
  //});

  it("Try add meeting without start and end property",(done) => {

    let body = {
      title : 'Some title'
    };
    server
      .post(`/meetings/${config.ROOM_ID}`)
      .set({'x-access-token': config.TOKEN})
      .send(body)
      .end(function(err,res){
        res.body.should.be.instanceOf(Object);
        res.status.should.equal(404);
        done();
      });
  });



  //HERE I STOP

  //it("Try update meetin",(done) => {
  //
  //  let body = {
  //    title : 'Some title'
  //  };
  //  server
  //    .put(`/meetings/${config.MEETING_ID}`)
  //    .set({'x-access-token': config.TOKEN})
  //    .send(body)
  //    .end(function(err,res){
  //            res.body.should.be.instanceOf(Object);
  //            res.body.should.have.property('_id');
  //            res.body.should.have.property('client');
  //            res.body.should.have.property('title');
  //            res.body.should.have.property('room');
  //            res.status.should.equal(200);
  //      done();
  //    });
  //});


});

