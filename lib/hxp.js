/**
 * HXP
 */

var hxp = exports;

/**
 * Hxp @constructor
 */
var Hxp = hxp.Hxp = function Hxp(tag, attrs, flags) {
  this.regExps = this.bootstrap(tag, attrs, flags);

  return this.parse.bind(this);
};
hxp.create = function(tag, attrs, flags) {
  return new Hxp(tag, attrs, flags);
};

/**
 * Bootstrap
 */
Hxp.prototype.bootstrap = function(tag, attrs, content, flags) {
  var space = '(?:\\s*|[^<]*(?:"|\\s))';

  attrs = Object.keys(attrs).map(function(key) {
    var val = attrs[key];
    key = sanitize(key);

    val = val.toString().replace(/^"|"$/g, '');
    val = sanitize(val);

    return val === '%s' ?
           '(' + key + '=(?:"(?:[^"]+)"|[^\\s>]+))'
           :
           val === '%d' ?
           '(' + key + '=(?:"(?:\\d+)"|\\d+))'
           :
           key + (
             /\s/.test(val) ?
                '="' + val + '"'
                :
                '=(?:"' + val + '"|' + val + ')'
           );
  });

  function recursive(re, attrs, simple, firstTime) {
    if (attrs.length <= 0) {
      if (firstTime) re.pop();

      return [re.concat(simple ? '>' : space + '>',
                        content ? '([^<]*)' : '')];
    };

    return attrs.reduce(function(prev, attr, i) {
      return prev.concat(recursive(
        re.concat([firstTime ? '' : simple ? ' ?' : space,
                   attr]),
        attrs.slice(0, i).concat(attrs.slice(i + 1)),
        simple,
        false
      ));
    }, []);
  };

  var re1 = recursive(['<', sanitize(tag), ' '], attrs, true, true),
      re2 = recursive(['<', space, sanitize(tag), space], attrs, false, true),
      res = re1.concat(re2);

  flags || (flags = '');

  return res.map(function(re) {
    return new RegExp(re.join(''), flags);
  });
};

/**
 * Parse
 */
Hxp.prototype.parse = function(html) {
  var that = this,
      res = false;

  this.regExps.some(function(re) {
    var match = html.match(re);

    if (match !== null) {
      res = that.prepare(match);
      return true;
    }
  });

  return res;
};

/**
 * Prepare result
 */
Hxp.prototype.prepare = function(match) {
  if (match.length == 1) return true;

  var result = {attrs: {}};

  Array.prototype.forEach.call(match, function(m, i) {
    if (i == 0) return;
    if (/=/.test(m)) {
      var kv = m.split(/=/);
      result.attrs[kv[0]] = kv[1].replace(/^"|"$/g, '');
    } else {
      result.content = m;
    }
  });

  return result;
};

function sanitize(val) {
  return val.replace(/([[\]{}.+?*\\\-])/g, '\\$1');
};
