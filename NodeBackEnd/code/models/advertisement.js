const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

/**
 * possible types for nearby places search 
 * 
 * 
 * bank
 * bus_station, train_station, post_office, police
 * mosque, hindu_temple, synagogue, church
 * department_store, supermarket, shopping_mall
 * park, gym
 * hospital
 * school
 * restaurant
 */

const advertisementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // required
    minlength: 5,
    maxlength: 100
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  invalid_after:  { 
    type: Date,
    default: new Date(+new Date() + 31*24*60*60*1000) // default validation: 31 days 
  },
  is_rented:  { 
    type: Boolean,
    required: true, // required
    default: false
  },  
  contact_number: { 
    type: String, 
    required: true, // required
    trim: true,
    minlength: 11,
    maxlength: 14
  },
  alternative_contact: { 
    type: String,
    trim: true,
    minlength: 11,
    maxlength: 14
  },
  lat: { 
    type: Number,
    required: true, // required
  },
  long: { 
    type: Number,
    required: true, // required
  },
  address: { 
    type: String,
    trim: true
  },
  thana: { 
    type: String,
    trim: true
  },
  postCode: { 
    type: String,
    trim: true
  },
  zilla: { 
    type: String,
    trim: true
  },
  rent: { 
    type: Number,
    required: true, // required
  },
  size: { 
    type: Number
  },
  floor: { 
    type: Number
  },
  security_guards: { 
    type: Boolean
  },
  lift_escalator: { 
    type: Boolean
  },
  month_of_availability: { 
    type: String,
    enum: ['January', 'February', 'March',  'April',  'May',  'June',  'July',  'August',  'September',  'October',  'November', 'December'],
    required: true, // required
  },
  rooms: {
    bedroom: { 
      type: Number
    },
    bathroom: { 
      type: Number
    },
    kitchen: { 
      type: Number
    },
    drawing: { 
      type: Number
    },
    living: { 
      type: Number
    }
  },
  nearby: [{
    type: {
      type: String,
      enum: ['mosque', 'hospital', 'school', 'park', 'department_store']
    },
    distance: { 
      type: Number
    }, 
    lat: { 
      type: Number
    },
    long: { 
      type: Number
    },
    name: { 
      type: String
    }
  }], 
  images: [{
    tag: {
      type: String
    }, 
    value: {
      type: String // base64 converted
    }
  }]
});

advertisementSchema.methods.generateAuthToken = function () {
  const token = 'some token';
  return token;
}

module.exports = mongoose.model('Advertisement', advertisementSchema, 'advertisements');