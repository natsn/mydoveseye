'use strict';

const Hapi = require('hapi');
const mongoose = require('mongoose');
const Path = require('path');
const Hoek = require('hoek');
const server = new Hapi.Server();

server.connection({ port: 3000 });

// Schema
var contentSchema = mongoose.Schema({
  name: String,
  text: String,
  tags: Array,
  type: String,
  slug: String,
  love: Number,
  date: Date
});

var Post = mongoose.model('Post', contentSchema);
var Page = mongoose.model('Page', contentSchema);
// var Recipe = mongoose.model('Recipe', contentSchema);

var about = new Page({
  name: 'About',
  slug: 'about',
  text: 'My name is ria and nat is so haaawwt...',
  type: 'page'
})

var contact = new Page({
  name: 'Contact',
  slug: 'contact',
  type: 'page',
  text: '<b>bla</b><p>again</p>'
})

// Mock data
var test = new Post({ 
  date: Date(),
  love:13, 
  name: 'Test',
  slug:'test', 
  tags: ['learn', 'fun', 'YAY'],
  text: 'bl a blablao fierog oih prgoi hsepog ihetgpiuh! riu hoiuwheg, iwuehg iweugh wiugh. weiguh werilgu hwerlgi uwherg weorvhsdof87g 837 i3u4h3983hutg',
  type: 'post'
});

var test2 = new Post({ 
  date: Date(),
  love:10, 
  name: 'Another Test', 
  slug:'test2', 
  tags: ['learn', ';)'],
  text: 'pog ihetgpiuh! riu hoiuwheg, iwuehg iweugh wiugh. weiguh werilgu hwerlgi uwherg weorvhsdof87g 837 i3u4h3983hutg',
  type: 'post'
});
server.register(require('inert'), (err) => {
  Hoek.assert(!err, err);
  server.route({
    method: 'GET',
    path: '/css/{param*}',
    handler: {
      directory: {
        path: 'public/css/'
      }
    }
  });
});

// Views Config
server.register(require('vision'), (err) => {

    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates'
    });
});

// Index Page
server.route({
  method: 'GET',
  path: '/',
  handler: {
    view: {
      template: 'index',
      context: {
        title: 'My home page',
        posts: [test, test2] // TODO query last 5 order by date desc.
      }
    }
  }
});

// Regular Page
server.route({
  method: 'GET',
  path: '/{slug}',
  handler: {
    view: {
      template: 'page',
      // TODO look up the page by slug
      context: {
        name: 'About'
      }
    }
  }
});


var mongodbUri = 'mongodb://localhost/mydoveseye';
mongoose.connect(mongodbUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log('MongoDB running at: ', mongodbUri);
  server.start(() => {
    console.log('Server running at: http://localhost:3000');
  });
});
