'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');
const q = require('q');
const server = new Hapi.Server();

server.connection({ port: 3000 });

// Mock data
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema
var contentSchema = new Schema({
  name: { type: String, required: true},
  text: String,
  tags: Array,
  type: String,
  slug: String,
  love: Number,
  date: { type:Date, default:Date.now }
});

var Post = mongoose.model('Post', contentSchema);

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
  // public assets: css, js, img, static html
  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: 'public/'
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

var allPosts = Post.find({}).limit(1).exec();

// Index Page
server.route({
  method: 'GET',
  path: '/',
  handler: {
    view: {
      template: 'index',
      context: {
        title: 'My home page',
        posts: q.all(allPosts).then((posts) => {return posts})
      }
    }
  }
});

// DB and Server Initialization

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
