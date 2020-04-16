const fs = require('fs')
const path = require('path')
const async = require('async')
const Papa = require('papaparse')

async.waterfall([
  function(cb) { // step 1 - grab the csv
    console.log("reading file...");
    fs.readFile('./files/data.csv', 'utf8', (err, data) => {
      if (err) {
        cb(err)
      }
      console.log("parsing csv...");
      Papa.parse(data, {
        header: true,
        error: function(error) {
          cb(error)
        },
        complete: function(results) {
          cb(null, results.data)
        }
      });
    })
  },
  function(data, cb) { // step 2 - parse each row into multiple rows
    console.log("structuring data...");
    function dataObject(row, category, string){
      return {
        question: category,
        id: row['﻿id'],
        gender: row["gender"],
        zip: row["zip"],
        string: string
      }
    }
    var results = []
    async.each(data, function(row, callback) { 
      if(!!row["personal"]) {
        results = results.concat(dataObject(row,"personal",row["personal"])) }
      if(!!row["immediate1"]) {
        results = results.concat(dataObject(row,"immediate",row["immediate1"])) }
      if(!!row["immediate2"]) {
        results = results.concat(dataObject(row,"immediate",row["immediate2"])) }
      if(!!row["immediate3"]) {
        results = results.concat(dataObject(row,"immediate",row["immediate3"])) }
      if(!!row["future1"]) {
        results = results.concat(dataObject(row,"future",row["future1"])) }
      if(!!row["future2"]) {
        results = results.concat(dataObject(row,"future",row["future2"])) }
      if(!!row["future3"]) {
        results = results.concat(dataObject(row,"future",row["future3"])) }
      if(!!row["humanitarian_assistance"]) {
        results = results.concat(dataObject(row,"humanitarian_assistance",row["humanitarian_assistance"])) }
      if(!!row["comments"]) {
        results = results.concat(dataObject(row,"comments",row["comments"])) }
      callback();
    }, function(err){ 
      cb(err, results)
    });
  },
  function(result, cb) { // step 3 - write the csv
    console.log("writing the csv...");
    var csv = Papa.unparse(result);
    var fileName = "output.csv";
    const outputFile = path.join(__dirname,'files',fileName);
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
    fs.writeFileSync(outputFile, csv);
    cb();
  }],
  function(err, result){
    if(err) {
      console.log("error:",err)
    } else {
      console.log("done.")
    }
  }
)
