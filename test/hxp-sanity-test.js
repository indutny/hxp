/**
 * Sanity test for HXP
 */

var vows = require('vows'),
    assert = require('assert');

var hxp = require('../lib/hxp');

vows.describe('Hxp').addBatch({
  'Calling hxp.create() for': {
    'a simple h1 tag': {
      topic: function() {
        return hxp.create('h1', {});
      },
      'given a sample html content': {
        topic: function(h) {
          return h('<b>tag</b><h1>123</h1><c>tag</c>');
        },
        'should find tag inside it': function(result) {
          assert.ok(result);
        }
      },
      'given a sample stronger html content': {
        topic: function(h) {
          return h('<b>tag</b>< h1 >123</h1><c>tag</c>');
        },
        'should find tag inside it': function(result) {
          assert.ok(result);
        }
      },
      'given a sample html content with attrs': {
        topic: function(h) {
          return h('<b>tag</b>< h1 attr="x">123</h1><c>tag</c>');
        },
        'should find tag inside it': function(result) {
          assert.ok(result);
        }
      },
      'given a wrong html content': {
        topic: function(h) {
          return h('<wtf/>');
        },
        'should not find tag inside it': function(result) {
          assert.isFalse(result);
        }
      }
    },
    'a h1 tag with content': {
      topic: function() {
        return hxp.create('h1', {}, true);
      },
      'given a sample html content': {
        topic: function(h) {
          return h('<b>tag</b><h1>123</h1><c>tag</c>');
        },
        'should find tag inside it': function(result) {
          assert.ok(result);
        },
        'should fine tag with content': function(result) {
          assert.isString(result.content);
        }
      },
      'given a sample stronger html content': {
        topic: function(h) {
          return h('<b>tag</b>< h1 >123</h1><c>tag</c>');
        },
        'should find tag inside it': function(result) {
          assert.ok(result);
        }
      }
    },
    'a simple h1 tag with attribute': {
      topic: function() {
        return hxp.create('h1', {attr: 'val'});
      },
      'given a sample html content': {
        topic: function(h) {
          return h('<b>tag</b><h1 attr=val>123</h1><c>tag</c>');
        },
        'should find tag inside it': function(result) {
          assert.ok(result);
        }
      },
      'given a sample stronger html content': {
        topic: function(h) {
          return h('<b>tag</b>< h1 attr="val" >123</h1><c>tag</c>');
        },
        'should find tag inside it': function(result) {
          assert.ok(result);
        }
      },
      'given a sample html content with attrs': {
        topic: function(h) {
          return h('<b>tag</b>< h1 attr2="x" attr="val" >123</h1><c>tag</c>');
        },
        'should find tag inside it': function(result) {
          assert.ok(result);
        }
      },
      'given a wrong html content': {
        topic: function(h) {
          return h('<wtf/><h1 attr2="y" >');
        },
        'should not find tag inside it': function(result) {
          assert.isFalse(result);
        }
      }
    },
    'a h1 tag with attribute and content': {
      topic: function() {
        return hxp.create('h1', {attr: 'val'}, true);
      },
      'given a sample html content': {
        topic: function(h) {
          return h('<b>tag</b><h1 attr=val>123</h1><c>tag</c>');
        },
        'should find tag inside it': function(result) {
          assert.ok(result);
        },
        'should fine tag with content': function(result) {
          assert.isString(result.content);
        }
      },
      'given a sample stronger html content': {
        topic: function(h) {
          return h('<b>tag</b>< h1 attr="val" >123</h1><c>tag</c>');
        },
        'should find tag inside it': function(result) {
          assert.ok(result);
        }
      }
    },
    'a h1 tag with attribute placeholder': {
      topic: function() {
        return hxp.create('h1', {attr: '%s'}, true);
      },
      'given a sample html content': {
        topic: function(h) {
          return h('<b>tag</b><h1 attr=val>123</h1><c>tag</c>');
        },
        'should find tag inside it': function(result) {
          assert.ok(result);
        },
        'should fine tag with content': function(result) {
          assert.equal(result.attrs.attr, 'val');
        }
      },
      'given a sample stronger html content': {
        topic: function(h) {
          return h('<b>tag</b>< h1 attr="val" >123</h1><c>tag</c>');
        },
        'should find tag inside it': function(result) {
          assert.ok(result);
        }
      }
    }
  }
}).export(module);
