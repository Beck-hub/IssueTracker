const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let issueSchema = new Schema({ // names from 
    issue_title: {
      type: String, 
      required: true
    },
    issue_text: {
      type: String, 
      required: true
    },
    created_by: {
      type: String, 
      required: true
    },
    assigned_to: String,
    status_text: String,
    open: {
      type: Boolean, 
      required: true, 
      default: true
    }, // default is true, when you close an issue, it will become false
    created_on: {type: Date, required: true
    }, // reset automatically
    updated_on: {type: Date, required: true
    },
    project: String // project name
  })
  module.exports = mongoose.model("Issue", issueSchema)
  // export the module: mongoose.model("Model Name that you give", SchemaName from above)