/*
*
*
*       Complete the API routing below
*
*
*/

// 'use strict';
if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config()
}
var expect = require('chai').expect;
const mongoose = require('mongoose');
const Issue = require("../models/issueSchema");

// db.on()
// db.once(()=> console.log("Mongoose is connected"))


const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true  })
  const db = mongoose.connection;
  db.on('error', error => console.error(error));
  db.once('open', () => console.log("Connected to Mongoose"))

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      const {project} = req.params;
      let fltrObj = (req.query)
      fltrObj['project'] = project
      try { 
          res.json(await Issue.find(fltrObj))
      } catch (err) {
         res.json(err)
      } 
    })
    
    .post(async (req, res) => {
      const project = req.params.project;
      const {issue_title, issue_text, created_by, assigned_to, status_text} = req.body;
      if (!issue_title || !issue_text || !created_by) return res.json('Missing Required Fields')
      try {
        let newIssue =  await new Issue({
           issue_title, issue_text, created_by, project,
           assigned_to: assigned_to || "",
           status_text: status_text || "",
           created_on: new Date().toUTCString(),
           updated_on: new Date().toUTCString(),
        })
         let savedIssue =  await newIssue.save(); 
         res.json(savedIssue)
      } catch (error) {
          res.json(error)
      }
    })
    
    .put(async (req, res) => {
      var project = req.params.project;
      const {_id} = req.body; 
      let newObj = {};
   
      Object.keys(req.body).map((key, index) => {
        req.body[key] !== ""? newObj[key] = req.body[key] : ""
      });
     
      let values = Object.values(newObj).length;
 
      if ( Object.values(newObj).length < 2) return res.json("no updated field sent");
      
      try {
        let isOpen = await Issue.findById(_id);
        if (!isOpen.open) {
          return res.json(`could not update ${_id} - issue is closed`)
        }

        let updtdIssue = await Issue.findByIdAndUpdate(_id, newObj, {new: true, useFindAndModify: false})
        if (updtdIssue) return res.json('successfully updated');
      
    } catch (err) {
        return res.json(`could not update ${_id}`)
    }
    })
    .delete(async (req, res) => {
      var project = req.params.project;
       const {_id} = req.body;
       if (!_id) return res.json('_id error');
      try {
        let dltIssue = await Issue.findByIdAndRemove(_id, {useFindAndModify: false});
        if (dltIssue) return res.json(`deleted ${_id}`);
      } catch (err) {
          res.json(`could not delete ${_id}`)
      }
    });
    
};
