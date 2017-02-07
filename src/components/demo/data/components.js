var path = require('path');
var fs = require('fs');
var deps = [];
var data = {};

const Component = function (name, url, renderResults) {
  this.name = name;
  this.url = url;
  this.renderResults = renderResults;
};

const RenderResult = function (type, binaries, dependencies) {
  this.type = type;
  this.binaries = binaries;
  this.dependencies = dependencies;
};

// JS dependency
var jsDependencyPath = path.resolve(path.join(__dirname, '/dependencies/dependency.js'));

deps.push(jsDependencyPath);

var jsDependency = fs.readFileSync(jsDependencyPath).toString();

// SASS dependency
var sassDependencyPath = path.resolve(path.join(__dirname, '/dependencies/dependency.scss'));

deps.push(sassDependencyPath);

var sassDependency = fs.readFileSync(sassDependencyPath).toString();

// Twig dependency
var twigDependencyPath = path.resolve(path.join(__dirname, '/dependencies/dependency.twig'));

deps.push(twigDependencyPath);

var twigDependency = fs.readFileSync(twigDependencyPath).toString();

// JS binary
var jsBinaryPath = path.resolve(path.join(__dirname, '/binaries/binary.js'));

deps.push(jsBinaryPath);

var jsBinary = fs.readFileSync(jsBinaryPath).toString();

// SASS binary
var sassBinaryPath = path.resolve(path.join(__dirname, '/binaries/binary.css'));

deps.push(sassBinaryPath);

var sassBinary = fs.readFileSync(sassBinaryPath).toString();

// SASS map binary
var sassMapBinaryPath = path.resolve(path.join(__dirname, '/binaries/binary.css.map'));

deps.push(sassMapBinaryPath);

var sassMapBinary = fs.readFileSync(sassMapBinaryPath).toString();

// Twig binary
var twigBinaryPath = path.resolve(path.join(__dirname, '/binaries/binary.html'));

deps.push(twigBinaryPath);

var twigBinary = fs.readFileSync(twigBinaryPath).toString();

// components
var components = [];

components.push(
  new Component('lorem/ipsum', '/breakpoint', [
    new RenderResult('js', [
      {
        path: 'index.js',
        data: jsBinary
      }
    ], [
      {
        path: 'index.js',
        data: jsDependency
      },
      {
        path: 'other.js',
        data: jsDependency
      },
      {
        path: 'lorem/ipsum/dolor/index.js',
        data: jsDependency
      },
      {
        path: 'lorem/ipsum/other.js',
        data: jsDependency
      }
    ]),
    new RenderResult('twig', [
      {
        path: 'index.html',
        data: twigBinary
      }
    ], [
      {
        path: 'index.twig',
        data: twigDependency
      },
      {
        path: 'other.twig',
        data: twigDependency
      },
      {
        path: 'lorem/ipsum/index.twig',
        data: twigDependency
      },
      {
        path: 'lorem/ipsum/dolor/other.twig',
        data: twigDependency
      }
    ])
  ]),
  new Component('lorem/ipsum/dolor', '/breakpoint', [
    new RenderResult('js', [
      {
        path: 'index.js',
        data: jsBinary
      }
    ], [
      {
        path: 'index.js',
        data: jsDependency
      },
      {
        path: 'lorem/ipsum/dolor/index.js',
        data: jsDependency
      }
    ])
  ]),
  new Component('dolor/sit', '/breakpoint', [
    new RenderResult('js', [
      {
        path: 'index.js',
        data: jsBinary
      }
    ], [
      {
        path: 'index.js',
        data: jsDependency
      },
      {
        path: 'lorem/ipsum/dolor/index.js',
        data: jsDependency
      }
    ])
  ]),
  new Component('dolor/amet', '/breakpoint', [
    new RenderResult('js', [
      {
        path: 'index.js',
        data: jsBinary
      }
    ], [
      {
        path: 'index.js',
        data: jsDependency
      },
      {
        path: 'lorem/ipsum/dolor/index.js',
        data: jsDependency
      }
    ]),
    new RenderResult('sass', [
      {
        path: 'index.css',
        data: sassBinary
      },
      {
        path: 'index.map',
        data: sassMapBinary
      }
    ], [
      {
        path: 'index.scss',
        data: sassDependency
      },
      {
        path: 'lorem/ipsum/dolor/index.scss',
        data: sassDependency
      }
    ])
  ])
);

module.exports = {
  deps: deps,
  data: components
};