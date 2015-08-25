(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a)return a(o, !0);
        if (i)return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f
      }
      var l = n[o] = {exports: {}};
      t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];
        return s(n ? n : e)
      }, l, l.exports, e, t, n, r)
    }
    return n[o].exports
  }

  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++)s(r[o]);
  return s
})({
  1: [function (require, module, exports) {
    'use strict';


    var $ = require('jquery'),
      DmnModeler = require('dmn-js/lib/Modeler');

    var container = $('#js-drop-zone');

    var canvas = $('#js-table');

    var renderer = new DmnModeler({container: canvas, keyboard: {bindTo: document}});

    var newTableXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<Definitions xmlns=\"http://www.omg.org/spec/DMN/20130901\"\r\n             id=\"definitions\"\r\n             name=\"camunda\"\r\n             namespace=\"http://camunda.org/dmn\">\r\n  <ItemDefinition id=\"itemDefinition1\" name=\"CustomerStatusType\">\r\n    <typeDefinition>string</typeDefinition>\r\n    <allowedValue id=\"allowedValue1\">\r\n      <text>gold</text>\r\n    </allowedValue>\r\n    <allowedValue id=\"allowedValue2\">\r\n      <text>silver</text>\r\n    </allowedValue>\r\n    <allowedValue id=\"allowedValue3\">\r\n      <text>bronze</text>\r\n    </allowedValue>\r\n  </ItemDefinition>\r\n  <ItemDefinition id=\"itemDefinition2\" name=\"OrderSumType\">\r\n    <typeDefinition>number</typeDefinition>\r\n  </ItemDefinition>\r\n  <ItemDefinition id=\"itemDefinition3\" name=\"CheckResultType\">\r\n    <typeDefinition>string</typeDefinition>\r\n    <allowedValue id=\"allowedValue4\">\r\n      <text>ok</text>\r\n    </allowedValue>\r\n    <allowedValue id=\"allowedValue5\">\r\n      <text>notok</text>\r\n    </allowedValue>\r\n  </ItemDefinition>\r\n  <ItemDefinition id=\"itemDefinition4\" name=\"ReasonType\">\r\n    <typeDefinition>string</typeDefinition>\r\n  </ItemDefinition>\r\n  <Decision id=\"decision\" name=\"CheckOrder\">\r\n    <DecisionTable id=\"decisionTable\" name=\"CheckOrder\" isComplete=\"true\" isConsistent=\"true\">\r\n      <clause id=\"clause1\" name=\"Customer Status\">\r\n        <inputExpression id=\"inputExpression1\" name=\"Status\">\r\n          <itemDefinition href=\"#itemDefinition1\" />\r\n        </inputExpression>\r\n        <inputEntry id=\"inputEntry1\">\r\n          <text>bronze</text>\r\n        </inputEntry>\r\n        <inputEntry id=\"inputEntry2\">\r\n          <text>silver</text>\r\n        </inputEntry>\r\n        <inputEntry id=\"inputEntry3\">\r\n          <text>gold</text>\r\n        </inputEntry>\r\n      </clause>\r\n      <clause id=\"clause2\" name=\"Order Sum\">\r\n        <inputExpression id=\"inputExpression2\" name=\"Sum\">\r\n          <itemDefinition href=\"#itemDefinition2\" />\r\n        </inputExpression>\r\n        <inputEntry id=\"inputEntry4\">\r\n          <text><![CDATA[< 1000]]></text>\r\n        </inputEntry>\r\n        <inputEntry id=\"inputEntry5\">\r\n          <text><![CDATA[>= 1000]]></text>\r\n        </inputEntry>\r\n      </clause>\r\n      <clause id=\"clause3\" name=\"Check Result\">\r\n        <outputDefinition href=\"#itemDefinition3\" />\r\n        <outputEntry id=\"outputEntry1\">\r\n          <text>notok</text>\r\n        </outputEntry>\r\n        <outputEntry id=\"outputEntry2\">\r\n          <text>ok</text>\r\n        </outputEntry>\r\n      </clause>\r\n      <clause id=\"clause4\" name=\"Reason\">\r\n        <outputDefinition href=\"#itemDefinition4\" />\r\n        <outputEntry id=\"outputEntry3\">\r\n          <text><![CDATA[work on your status first, as bronze you're not going to get anything]]></text>\r\n        </outputEntry>\r\n        <outputEntry id=\"outputEntry4\">\r\n          <text>you little fish will get what you want</text>\r\n        </outputEntry>\r\n        <outputEntry id=\"outputEntry5\">\r\n          <text>you took too much man, you took too much!</text>\r\n        </outputEntry>\r\n        <outputEntry id=\"outputEntry6\">\r\n          <text>you get anything you want</text>\r\n        </outputEntry>\r\n      </clause>\r\n      <rule id=\"rule1\">\r\n        <condition>inputEntry1</condition>\r\n        <conclusion>outputEntry1</conclusion>\r\n        <conclusion>outputEntry3</conclusion>\r\n      </rule>\r\n      <rule id=\"rule2\">\r\n        <condition>inputEntry2</condition>\r\n        <condition>inputEntry4</condition>\r\n        <conclusion>outputEntry2</conclusion>\r\n        <conclusion>outputEntry4</conclusion>\r\n      </rule>\r\n      <rule id=\"rule3\">\r\n        <condition>inputEntry2</condition>\r\n        <condition>inputEntry5</condition>\r\n        <conclusion>outputEntry1</conclusion>\r\n        <conclusion>outputEntry5</conclusion>\r\n      </rule>\r\n      <rule id=\"rule4\">\r\n        <condition>inputEntry3</condition>\r\n        <conclusion>outputEntry2</conclusion>\r\n        <conclusion>outputEntry6</conclusion>\r\n      </rule>\r\n    </DecisionTable>\r\n  </Decision>\r\n</Definitions>\r\n";

    function createNewTable() {
      openTable(newTableXML);
    }

    function openTable(xml) {

      renderer.importXML(xml, function (err) {

        if (err) {
          container
            .removeClass('with-table')
            .addClass('with-error');

          container.find('.error pre').text(err.message);

          console.error(err);
        } else {
          container
            .removeClass('with-error')
            .addClass('with-table');
        }


      });
    }

    function saveTable(done) {

      renderer.saveXML({format: true}, function (err, xml) {
        done(err, xml);
      });
    }

    function registerFileDrop(container, callback) {

      function handleFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();

        var files = e.dataTransfer.files;

        var file = files[0];

        var reader = new FileReader();

        reader.onload = function (e) {

          var xml = e.target.result;

          callback(xml);
        };

        reader.readAsText(file);
      }

      function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();

        e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
      }

      container.get(0).addEventListener('dragover', handleDragOver, false);
      container.get(0).addEventListener('drop', handleFileSelect, false);
    }


////// file drag / drop ///////////////////////

// check file api availability
    if (!window.FileList || !window.FileReader) {
      window.alert(
        'Looks like you use an older browser that does not support drag and drop. ' +
        'Try using Chrome, Firefox or the Internet Explorer > 10.');
    } else {
      registerFileDrop(container, openTable);
    }

// bootstrap table functions

    $(document).on('ready', function () {

      $('#js-create-table').click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        createNewTable();
      });

      var downloadLink = $('#js-download-table');

      $('.buttons a').click(function (e) {
        if (!$(this).is('.active')) {
          e.preventDefault();
          e.stopPropagation();
        }
      });

      function setEncoded(link, name, data) {
        var encodedData = encodeURIComponent(data);

        if (data) {
          link.addClass('active').attr({
            'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
            'download': name
          });
        } else {
          link.removeClass('active');
        }
      }

      var exportArtifacts = function () {
        saveTable(function (err, xml) {
          setEncoded(downloadLink, 'table.dmn', err ? null : xml);
        });

      };

      renderer.on('commandStack.changed', exportArtifacts);
    });

  }, {"dmn-js/lib/Modeler": 2, "jquery": 123}],
  2: [function (require, module, exports) {
    'use strict';

    var inherits = require('inherits');

    var IdSupport = require('dmn-moddle/lib/id-support'),
      Ids = require('ids');

    var Viewer = require('./Viewer');

    /**
     * A modeler for DMN tables.
     *
     *
     * ## Extending the Modeler
     *
     * In order to extend the viewer pass extension modules to bootstrap via the
     * `additionalModules` option. An extension module is an object that exposes
     * named services.
     *
     * The following example depicts the integration of a simple
     * logging component that integrates with interaction events:
     *
     *
     * ```javascript
     *
     * // logging component
     * function InteractionLogger(eventBus) {
 *   eventBus.on('element.hover', function(event) {
 *     console.log()
 *   })
 * }
     *
     * InteractionLogger.$inject = [ 'eventBus' ]; // minification save
     *
     * // extension module
     * var extensionModule = {
 *   __init__: [ 'interactionLogger' ],
 *   interactionLogger: [ 'type', InteractionLogger ]
 * };
     *
     * // extend the viewer
     * var dmnModeler = new Modeler({ additionalModules: [ extensionModule ] });
     * dmnModeler.importXML(...);
     * ```
     *
     *
     * ## Customizing / Replacing Components
     *
     * You can replace individual table components by redefining them in override modules.
     * This works for all components, including those defined in the core.
     *
     * Pass in override modules via the `options.additionalModules` flag like this:
     *
     * ```javascript
     * function CustomContextPadProvider(contextPad) {
 *
 *   contextPad.registerProvider(this);
 *
 *   this.getContextPadEntries = function(element) {
 *     // no entries, effectively disable the context pad
 *     return {};
 *   };
 * }
     *
     * CustomContextPadProvider.$inject = [ 'contextPad' ];
     *
     * var overrideModule = {
 *   contextPadProvider: [ 'type', CustomContextPadProvider ]
 * };
     *
     * var dmnModeler = new Modeler({ additionalModules: [ overrideModule ]});
     * ```
     *
     * @param {Object} [options] configuration options to pass to the viewer
     * @param {DOMElement} [options.container] the container to render the viewer in, defaults to body.
     * @param {String|Number} [options.width] the width of the viewer
     * @param {String|Number} [options.height] the height of the viewer
     * @param {Object} [options.moddleExtensions] extension packages to provide
     * @param {Array<didi.Module>} [options.modules] a list of modules to override the default modules
     * @param {Array<didi.Module>} [options.additionalModules] a list of modules to use with the default modules
     */
    function Modeler(options) {
      Viewer.call(this, options);
    }

    inherits(Modeler, Viewer);


    Modeler.prototype.createModdle = function () {
      var moddle = Viewer.prototype.createModdle.call(this);

      IdSupport.extend(moddle, new Ids([32, 36, 1]));

      return moddle;
    };

    Modeler.prototype._modelingModules = [
      // modeling components
      require('table-js/lib/features/editing'),
      require('./features/modeling'),
      require('table-js/lib/features/line-numbers'),
      require('./features/context-menu'),
      require('table-js/lib/features/keyboard'),
      require('./features/io-label')
    ];


// modules the modeler is composed of
//
// - viewer modules
// - interaction modules
// - modeling modules

    Modeler.prototype._modules = [].concat(
      Modeler.prototype._modules,
      Modeler.prototype._modelingModules);


    module.exports = Modeler;

  }, {
    "./Viewer": 3,
    "./features/context-menu": 8,
    "./features/io-label": 12,
    "./features/modeling": 18,
    "dmn-moddle/lib/id-support": 35,
    "ids": 52,
    "inherits": 54,
    "table-js/lib/features/editing": 88,
    "table-js/lib/features/keyboard": 92,
    "table-js/lib/features/line-numbers": 94
  }],
  3: [function (require, module, exports) {
    'use strict';

    var assign = require('lodash/object/assign'),
      omit = require('lodash/object/omit'),
      isString = require('lodash/lang/isString'),
      isNumber = require('lodash/lang/isNumber');

    var domify = require('min-dom/lib/domify'),
      domQuery = require('min-dom/lib/query'),
      domRemove = require('min-dom/lib/remove');

    var Table = require('table-js'),
      DmnModdle = require('dmn-moddle');

    var Importer = require('./import/Importer');


    function initListeners(table, listeners) {
      var events = table.get('eventBus');

      listeners.forEach(function (l) {
        events.on(l.event, l.handler);
      });
    }

    function checkValidationError(err) {

      // check if we can help the user by indicating wrong DMN xml
      // (in case he or the exporting tool did not get that right)

      var pattern = /unparsable content <([^>]+)> detected([\s\S]*)$/;
      var match = pattern.exec(err.message);

      if (match) {
        err.message =
          'unparsable content <' + match[1] + '> detected; ' +
          'this may indicate an invalid DMN file' + match[2];
      }

      return err;
    }

    var DEFAULT_OPTIONS = {
      width: '100%',
      height: '100%',
      position: 'relative',
      container: 'body'
    };


    /**
     * Ensure the passed argument is a proper unit (defaulting to px)
     */
    function ensureUnit(val) {
      return val + (isNumber(val) ? 'px' : '');
    }

    /**
     * A viewer for DMN tables.
     *
     *
     * ## Extending the Viewer
     *
     * In order to extend the viewer pass extension modules to bootstrap via the
     * `additionalModules` option. An extension module is an object that exposes
     * named services.
     *
     * The following example depicts the integration of a simple
     * logging component that integrates with interaction events:
     *
     *
     * ```javascript
     *
     * // logging component
     * function InteractionLogger(eventBus) {
 *   eventBus.on('element.hover', function(event) {
 *     console.log()
 *   })
 * }
     *
     * InteractionLogger.$inject = [ 'eventBus' ]; // minification save
     *
     * // extension module
     * var extensionModule = {
 *   __init__: [ 'interactionLogger' ],
 *   interactionLogger: [ 'type', InteractionLogger ]
 * };
     *
     * // extend the viewer
     * var dmnViewer = new Viewer({ additionalModules: [ extensionModule ] });
     * dmnViewer.importXML(...);
     * ```
     *
     * @param {Object} [options] configuration options to pass to the viewer
     * @param {DOMElement} [options.container] the container to render the viewer in, defaults to body.
     * @param {String|Number} [options.width] the width of the viewer
     * @param {String|Number} [options.height] the height of the viewer
     * @param {Object} [options.moddleExtensions] extension packages to provide
     * @param {Array<didi.Module>} [options.modules] a list of modules to override the default modules
     * @param {Array<didi.Module>} [options.additionalModules] a list of modules to use with the default modules
     */
    function Viewer(options) {

      this.options = options = assign({}, DEFAULT_OPTIONS, options || {});

      var parent = options.container;

      // support jquery element
      // unwrap it if passed
      if (parent.get) {
        parent = parent.get(0);
      }

      // support selector
      if (isString(parent)) {
        parent = domQuery(parent);
      }

      var container = this.container = domify('<div class="dmn-table"></div>');
      parent.appendChild(container);

      assign(container.style, {
        width: ensureUnit(options.width),
        height: ensureUnit(options.height),
        position: options.position
      });

      /**
       * The code in the <project-logo></project-logo> area
       * must not be changed, see http://bpmn.io/license for more information
       *
       * <project-logo>
       */

      /* jshint -W101 */

      // inlined ../resources/bpmnjs.png
      var logoData = 'iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAMAAADypuvZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFiMte9PrwldFwfcZPqtqN0+zEyOe1XLgjvuKncsJAZ70y6fXh3vDT////UrQV////G2zN+AAAABB0Uk5T////////////////////AOAjXRkAAAHDSURBVHjavJZJkoUgDEBJmAX8979tM8u3E6x20VlYJfFFMoL4vBDxATxZcakIOJTWSmxvKWVIkJ8jHvlRv1F2LFrVISCZI+tCtQx+XfewgVTfyY3plPiQEAzI3zWy+kR6NBhFBYeBuscJLOUuA2WVLpCjVIaFzrNQZArxAZKUQm6gsj37L9Cb7dnIBUKxENaaMJQqMpDXvSL+ktxdGRm2IsKgJGGPg7atwUG5CcFUEuSv+CwQqizTrvDTNXdMU2bMiDWZd8d7QIySWVRsb2vBBioxOFt4OinPBapL+neAb5KL5IJ8szOza2/DYoipUCx+CjO0Bpsv0V6mktNZ+k8rlABlWG0FrOpKYVo8DT3dBeLEjUBAj7moDogVii7nSS9QzZnFcOVBp1g2PyBQ3Vr5aIapN91VJy33HTJLC1iX2FY6F8gRdaAeIEfVONgtFCzZTmoLEdOjBDfsIOA6128gw3eu1shAajdZNAORxuQDJN5A5PbEG6gNIu24QJD5iNyRMZIr6bsHbCtCU/OaOaSvgkUyDMdDa1BXGf5HJ1To+/Ym6mCKT02Y+/Sa126ZKyd3jxhzpc1r8zVL6YM1Qy/kR4ABAFJ6iQUnivhAAAAAAElFTkSuQmCC';

      /* jshint +W101 */

      var linkMarkup =
        '<a href="http://bpmn.io" ' +
        'target="_blank" ' +
        'class="bjs-powered-by" ' +
        'title="Powered by bpmn.io" ' +
        'style="position: absolute; bottom: 15px; right: 15px; z-index: 100">' +
        '<img src="data:image/png;base64,' + logoData + '">' +
        '</a>';

      container.appendChild(domify(linkMarkup));

      /* </project-logo> */
    }

    Viewer.prototype.importXML = function (xml, done) {

      var self = this;

      this.moddle = this.createModdle();

      this.moddle.fromXML(xml, 'dmn:Definitions', function (err, definitions, context) {

        if (err) {
          err = checkValidationError(err);
          return done(err);
        }

        var parseWarnings = context.warnings;

        self.importDefinitions(definitions, function (err, importWarnings) {
          if (err) {
            return done(err);
          }

          done(null, parseWarnings.concat(importWarnings || []));
        });
      });
    };

    Viewer.prototype.saveXML = function (options, done) {

      if (!done) {
        done = options;
        options = {};
      }

      var definitions = this.definitions;

      if (!definitions) {
        return done(new Error('no definitions loaded'));
      }

      this.moddle.toXML(definitions, options, done);
    };

    Viewer.prototype.createModdle = function () {
      return new DmnModdle(this.options.moddleExtensions);
    };

    Viewer.prototype.get = function (name) {

      if (!this.table) {
        throw new Error('no table loaded');
      }

      return this.table.get(name);
    };

    Viewer.prototype.invoke = function (fn) {

      if (!this.table) {
        throw new Error('no table loaded');
      }

      return this.table.invoke(fn);
    };

    Viewer.prototype.importDefinitions = function (definitions, done) {

      // use try/catch to not swallow synchronous exceptions
      // that may be raised during model parsing
      try {
        if (this.table) {
          this.clear();
        }

        this.definitions = definitions;

        var table = this.table = this._createTable(this.options);

        this._init(table);

        Importer.importDmnTable(table, definitions, done);
      } catch (e) {
        done(e);
      }
    };

    Viewer.prototype._init = function (table) {
      initListeners(table, this.__listeners || []);
    };

    Viewer.prototype._createTable = function (options) {

      var modules = [].concat(options.modules || this.getModules(), options.additionalModules || []);

      // add self as an available service
      modules.unshift({
        dmnjs: ['value', this],
        moddle: ['value', this.moddle]
      });

      options = omit(options, 'additionalModules');

      options = assign(options, {
        sheet: {container: this.container},
        modules: modules
      });

      return new Table(options);
    };


    Viewer.prototype.getModules = function () {
      return this._modules;
    };

    /**
     * Remove all drawn elements from the viewer.
     *
     * After calling this method the viewer can still
     * be reused for opening another table.
     */
    Viewer.prototype.clear = function () {
      var table = this.table;

      if (table) {
        table.destroy();
      }
    };

    /**
     * Destroy the viewer instance and remove all its remainders
     * from the document tree.
     */
    Viewer.prototype.destroy = function () {
      // clear underlying diagram
      this.clear();

      // remove container
      domRemove(this.container);
    };

    /**
     * Register an event listener on the viewer
     *
     * @param {String} event
     * @param {Function} handler
     */
    Viewer.prototype.on = function (event, handler) {
      var table = this.table,
        listeners = this.__listeners = this.__listeners || [];

      listeners.push({event: event, handler: handler});

      if (table) {
        table.get('eventBus').on(event, handler);
      }
    };

// modules the viewer is composed of
    Viewer.prototype._modules = [
      require('./core'),
      require('./features/table-name'),
    ];

    module.exports = Viewer;

  }, {
    "./core": 4,
    "./features/table-name": 20,
    "./import/Importer": 23,
    "dmn-moddle": 33,
    "lodash/lang/isNumber": 215,
    "lodash/lang/isString": 217,
    "lodash/object/assign": 219,
    "lodash/object/omit": 222,
    "min-dom/lib/domify": 58,
    "min-dom/lib/query": 61,
    "min-dom/lib/remove": 62,
    "table-js": 71
  }],
  4: [function (require, module, exports) {
    module.exports = {
      __depends__: [
        require('../import'),
        require('../draw')
      ]
    };

  }, {"../draw": 6, "../import": 25}],
  5: [function (require, module, exports) {
    'use strict';

    var domClasses = require('min-dom/lib/classes');

    function DmnRenderer(eventBus) {

      eventBus.on('row.render', function (event) {
        if (event.data.isClauseRow) {
          domClasses(event.gfx).add('labels');
        }
      });

      eventBus.on('cell.render', function (event) {
        var data = event.data,
          gfx = event.gfx;

        if (!data.column.businessObject) {
          return;
        }

        if (data.row.isClauseRow) {
          // clause names
          gfx.childNodes[0].textContent = data.column.businessObject.name;
        } else if (data.content) {
          if (!data.content.tagName && data.row.businessObject) {
            // conditions and conclusions
            gfx.childNodes[0].textContent = data.content.text;
          }
        }
        if (!data.row.isFoot) {
          if (!!data.column.businessObject.inputExpression) {
            gfx.classList.add('input');
          } else {
            gfx.classList.add('output');
          }
        }
      });
    }

    DmnRenderer.$inject = ['eventBus'];

    module.exports = DmnRenderer;

  }, {"min-dom/lib/classes": 56}],
  6: [function (require, module, exports) {
    module.exports = {
      __init__: ['dmnRenderer'],
      dmnRenderer: ['type', require('./DmnRenderer')]
    };

  }, {"./DmnRenderer": 5}],
  7: [function (require, module, exports) {
    'use strict';

    var ids = new (require('diagram-js/lib/util/IdGenerator'))('table'),
      forEach = require('lodash/collection/forEach');

    function ContextMenu(popupMenu, eventBus, modeling, elementRegistry, selection) {
      this._popupMenu = popupMenu;
      this._eventBus = eventBus;
      this._modeling = modeling;
      this._elementRegistry = elementRegistry;
      this._selection = selection;

      var self = this;

      eventBus.on('element.contextmenu', function (evt) {
        // Do not open context mneu on table footer
        if (!evt.element.row.isFoot) {
          evt.preventDefault();
          evt.gfx.firstChild.focus();
          self.open(evt.originalEvent.clientX, evt.originalEvent.clientY, evt.element);
        }
      });

      document.addEventListener('click', function (evt) {
        self.close();
      });

    }

    ContextMenu.$inject = ['popupMenu', 'eventBus', 'modeling', 'elementRegistry', 'selection'];

    module.exports = ContextMenu;

    ContextMenu.prototype.getRuleActions = function (context) {
      return {
        id: 'rule', content: {
          label: 'Rule', linkClass: 'disabled', entries: [
            {
              id: 'ruleAdd', action: this.ruleAddAction.bind(this, context),
              content: {
                label: 'add', icon: 'plus', entries: [
                  {
                    id: 'ruleAddAbove', content: {label: '', icon: 'above'},
                    action: this.ruleAddAction.bind(this, context, 'above')
                  },
                  {
                    id: 'ruleAddBelow', content: {label: '', icon: 'below'},
                    action: this.ruleAddAction.bind(this, context, 'below')
                  }
                ]
              }
            },
            {
              id: 'ruleRemove', content: {label: 'remove', icon: 'minus'},
              action: this.ruleRemoveAction.bind(this, context)
            },
            {
              id: 'ruleClear', content: {label: 'clear', icon: 'clear'},
              action: this.ruleClearAction.bind(this, context)
            }
          ]
        }
      };
    };

    ContextMenu.prototype.getInputActions = function (context) {
      return {
        id: 'clause', content: {
          label: 'Input', linkClass: 'disabled', icon: 'input', entries: [
            {
              id: 'clauseAdd', action: this.clauseAddAction.bind(this, context),
              content: {
                label: 'add', icon: 'plus', entries: [
                  {
                    id: 'clauseAddLeft', content: {label: '', icon: 'left'},
                    action: this.clauseAddAction.bind(this, context, 'left')
                  },
                  {
                    id: 'clauseAddRight', content: {label: '', icon: 'right'},
                    action: this.clauseAddAction.bind(this, context, 'right')
                  }
                ]
              }
            },
            {
              id: 'clauseRemove', content: {label: 'remove', icon: 'minus'},
              action: this.clauseRemoveAction.bind(this, context)
            }
          ]
        }
      };
    };

    ContextMenu.prototype.getOutputActions = function (context) {
      return {
        id: 'clause', content: {
          label: 'Output', linkClass: 'disabled', icon: 'output', entries: [
            {
              id: 'clauseAdd', action: this.clauseAddAction.bind(this, context),
              content: {
                label: 'add', icon: 'plus', entries: [
                  {
                    id: 'clauseAddLeft', content: {label: '', icon: 'left'},
                    action: this.clauseAddAction.bind(this, context, 'left')
                  },
                  {
                    id: 'clauseAddRight', content: {label: '', icon: 'right'},
                    action: this.clauseAddAction.bind(this, context, 'right')
                  }
                ]
              }
            },
            {
              id: 'clauseRemove', content: {label: 'remove', icon: 'minus'},
              action: this.clauseRemoveAction.bind(this, context)
            }
          ]
        }
      };
    };

    ContextMenu.prototype.getActions = function (context) {
      var out = [];
      if (context.row.businessObject && !context.row.businessObject.$instanceOf('dmn:DecisionTable')) {
        out.push(this.getRuleActions(context));
      }
      if (context.column.id !== 'utilityColumn' && !context.row.isLabelRow) {
        if (context.column.businessObject.inputExpression) {
          out.push(this.getInputActions(context));
        } else {
          out.push(this.getOutputActions(context));
        }
      }
      return out;
    };

    ContextMenu.prototype.open = function (x, y, context) {
      var actions = this.getActions(context);
      if (actions.length > 0) {
        this._popupMenu.open(
          {
            position: {x: x, y: y},
            entries: actions
          }
        );
      }
    };

    ContextMenu.prototype.close = function () {
      this._popupMenu.close();
    };

    ContextMenu.prototype.clauseRemoveAction = function (context) {
      this._modeling.deleteColumn(context.column);
      this.close();
    };

    ContextMenu.prototype.clauseAddAction = function (context, position) {
      var type = context.column.businessObject.inputEntry ? 'inputEntry' : 'outputEntry';
      var col = context.column;
      if (position === 'left') {
        col = col.previous;
      } else if (position !== 'right') {
        while (col.next && col.next.businessObject[type]) {
          col = col.next;
        }
      }

      var newColumn = {
        id: ids.next(),
        previous: col,
        name: '',
        isInput: type === 'inputEntry'
      };

      this._modeling.createColumn(newColumn);
      this.close();
    };

    ContextMenu.prototype.ruleRemoveAction = function (context) {
      this._modeling.deleteRow(context.row);
      this.close();
    };

    ContextMenu.prototype.ruleAddAction = function (context, position) {
      var newRow = {id: ids.next()};
      if (position === 'above') {
        newRow.next = context.row;
      } else if (position === 'below') {
        newRow.previous = context.row;
      }
      this._modeling.createRow(newRow);
      this.close();
    };

    ContextMenu.prototype.ruleClearAction = function (context) {
      this._modeling.clearRow(context.row);
      this.close();
    };

  }, {"diagram-js/lib/util/IdGenerator": 28, "lodash/collection/forEach": 130}],
  8: [function (require, module, exports) {
    module.exports = {
      __init__: ['contextMenu'],
      __depends__: [
        require('table-js/lib/features/popup-menu')
      ],
      contextMenu: ['type', require('./ContextMenu')]
    };

  }, {"./ContextMenu": 7, "table-js/lib/features/popup-menu": 105}],
  9: [function (require, module, exports) {
    'use strict';

    var domify = require('min-dom/lib/domify'),
      forEach = require('lodash/collection/forEach');

// document wide unique overlay ids
    var ids = new (require('diagram-js/lib/util/IdGenerator'))('clause');

    /**
     * Adds a control to the table to add more rows
     *
     * @param {EventBus} eventBus
     */
    function IoLabel(eventBus, sheet, elementRegistry, modeling, graphicsFactory) {

      this.row = null;

      var self = this;
      eventBus.on('sheet.init', function (event) {

        eventBus.fire('ioLabel.add', event);

        self.row = sheet.addRow({
          id: 'ioLabel',
          isHead: true,
          isLabelRow: true,
          useTH: true
        });

        eventBus.fire('ioLabel.added', self.column);
      });

      eventBus.on('sheet.destroy', function (event) {

        eventBus.fire('ioLabel.destroy', self.column);

        sheet.removeColumn({
          id: 'ioLabel'
        });

        eventBus.fire('ioLabel.destroyed', self.column);
      });

      function updateColspans(evt) {
        if (evt._type === 'column') {
          var cells = elementRegistry.filter(function (element) {
            return element._type === 'cell' && element.row === self.row;
          });

          var inputs = cells.filter(function (cell) {
            return cell.column.businessObject && cell.column.businessObject.inputExpression;
          });

          forEach(inputs, function (input) {
            if (!input.column.previous.businessObject) {
              // first cell of the inputs array has the colspan attribute set
              input.colspan = inputs.length;

              var node = domify('Input <a class="icon-dmn icon-plus"></a>');
              node.querySelector('a').addEventListener('mouseup', function () {
                var type = input.column.businessObject.inputEntry ? 'inputEntry' : 'outputEntry';
                var col = input.column;
                while (col.next && col.next.businessObject[type]) {
                  col = col.next;
                }

                var newColumn = {
                  id: ids.next(),
                  previous: col,
                  name: '',
                  isInput: type === 'inputEntry'
                };

                modeling.createColumn(newColumn);
              });

              input.content = node;
            }
          });

          var outputs = cells.filter(function (cell) {
            return cell.column.businessObject && cell.column.businessObject.outputDefinition;
          });

          forEach(outputs, function (output) {
            if (output.column.previous.businessObject.inputExpression) {
              // first cell of the outputs array has the colspan attribute set
              output.colspan = outputs.length;

              var node = domify('Output <a class="icon-dmn icon-plus"></a>');
              node.querySelector('a').addEventListener('mouseup', function () {
                var type = output.column.businessObject.inputEntry ? 'inputEntry' : 'outputEntry';
                var col = output.column;
                while (col.next && col.next.businessObject[type]) {
                  col = col.next;
                }

                var newColumn = {
                  id: ids.next(),
                  previous: col,
                  name: '',
                  isInput: type === 'inputEntry'
                };

                modeling.createColumn(newColumn);
              });

              output.content = node;
            }
          });

          if (cells.length > 0) {
            graphicsFactory.update('row', cells[0].row, elementRegistry.getGraphics(cells[0].row.id));
          }
        }
      }

      eventBus.on(['cells.added', 'cells.removed'], updateColspans);
    }

    IoLabel.$inject = ['eventBus', 'sheet', 'elementRegistry', 'modeling', 'graphicsFactory'];

    module.exports = IoLabel;

    IoLabel.prototype.getRow = function () {
      return this.row;
    };

  }, {"diagram-js/lib/util/IdGenerator": 28, "lodash/collection/forEach": 130, "min-dom/lib/domify": 58}],
  10: [function (require, module, exports) {
    'use strict';

    function IoLabelRenderer(eventBus,
                             ioLabel) {

      eventBus.on('cell.render', function (event) {
        if (event.data.row === ioLabel.getRow() &&
          event.data.content && !event.gfx.childNodes[0].firstChild) {
          event.gfx.childNodes[0].appendChild(event.data.content);
        }
      });

    }

    IoLabelRenderer.$inject = [
      'eventBus',
      'ioLabel'
    ];

    module.exports = IoLabelRenderer;

  }, {}],
  11: [function (require, module, exports) {
    'use strict';

    var inherits = require('inherits');

    var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');

    /**
     * LineNumber specific modeling rule
     */
    function IoLabelRules(eventBus, ioLabel) {
      RuleProvider.call(this, eventBus);

      this._ioLabel = ioLabel;
    }

    inherits(IoLabelRules, RuleProvider);

    IoLabelRules.$inject = ['eventBus', 'ioLabel'];

    module.exports = IoLabelRules;

    IoLabelRules.prototype.init = function () {
      var self = this;
      this.addRule('cell.edit', function (context) {
        if (context.row === self._ioLabel.row) {
          return false;
        }
      });

    };

  }, {"diagram-js/lib/features/rules/RuleProvider": 27, "inherits": 54}],
  12: [function (require, module, exports) {
    module.exports = {
      __init__: ['ioLabel', 'ioLabelRules', 'ioLabelRenderer'],
      __depends__: [],
      ioLabel: ['type', require('./IoLabel')],
      ioLabelRules: ['type', require('./IoLabelRules')],
      ioLabelRenderer: ['type', require('./IoLabelRenderer')]
    };

  }, {"./IoLabel": 9, "./IoLabelRenderer": 10, "./IoLabelRules": 11}],
  13: [function (require, module, exports) {
    'use strict';

    function DmnFactory(moddle) {
      this._model = moddle;
    }

    DmnFactory.$inject = ['moddle'];


    DmnFactory.prototype._needsId = function (element) {
      return element.$instanceOf('dmn:DMNElement');
    };

    DmnFactory.prototype._ensureId = function (element) {

      // generate semantic ids for elements
      // bpmn:SequenceFlow -> SequenceFlow_ID
      var prefix = (element.$type || '').replace(/^[^:]*:/g, '') + '_';

      if (!element.id && this._needsId(element)) {
        element.id = this._model.ids.nextPrefixed(prefix, element);
      }
    };


    DmnFactory.prototype.create = function (type, attrs) {
      var element = this._model.create(type, attrs || {});

      this._ensureId(element);

      return element;
    };

    DmnFactory.prototype.createRule = function (type, attrs) {
      attrs = attrs || {};
      attrs.condition = attrs.condition || [];
      attrs.conclusion = attrs.conclusion || [];

      var element = this.create(type, attrs);

      return element;
    };

    DmnFactory.prototype.createInputEntry = function (text, clause, rule) {
      var element = this.create('dmn:LiteralExpression', {
        text: text
      });
      element.$parent = clause;
      clause.inputEntry.push(element);
      rule.condition.push(element);

      return element;
    };

    DmnFactory.prototype.createInputClause = function (name) {
      var element = this.create('dmn:Clause', {
        name: name
      });
      element.inputEntry = [];
      element.inputExpression = this.create('dmn:Expression', {});

      return element;
    };

    DmnFactory.prototype.createOutputClause = function (name) {
      var element = this.create('dmn:Clause', {
        name: name
      });
      element.outputEntry = [];
      element.outputDefinition = this.create('dmn:DMNElementReference', {});

      return element;
    };

    DmnFactory.prototype.createOutputEntry = function (text, clause, rule) {
      var element = this.create('dmn:LiteralExpression', {
        text: text
      });
      element.$parent = clause;
      clause.outputEntry.push(element);
      rule.conclusion.push(element);

      return element;
    };

    module.exports = DmnFactory;

  }, {}],
  14: [function (require, module, exports) {
    'use strict';

    var inherits = require('inherits'),
      forEach = require('lodash/collection/forEachRight');

    var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');


    /**
     * A handler responsible for updating the underlying DMN
     * once changes on the diagram happen
     */
    function DmnUpdater(eventBus, moddle, elementRegistry) {

      CommandInterceptor.call(this, eventBus);


      function setParent(event) {

        event.context.row.businessObject.$parent = elementRegistry.get('decisionTable').businessObject;
        if (event.context.row.next) {
          event.context.row.businessObject.$parent.rule.splice(
            event.context.row.businessObject.$parent.rule.indexOf(event.context.row.next.businessObject), 0,
            event.context.row.businessObject);
        } else {
          event.context.row.businessObject.$parent.rule.push(event.context.row.businessObject);
        }

        if (event.context._cells) {
          // if the row has cells, they should be added to the rules
          forEach(event.context._cells, function (cell) {
            if (cell.column.businessObject && cell.content) {
              // if the row has cells, they should be added to the clauses
              var entries = cell.column.businessObject.inputEntry || cell.column.businessObject.outputEntry;
              if (entries.indexOf(cell.content) === -1) {
                entries.push(cell.content);
              }
            }
          });
        }
      }

      function setColumnParent(event) {

        event.context.column.businessObject.$parent = elementRegistry.get('decisionTable').businessObject;
        if (event.context.column.next) {
          event.context.column.businessObject.$parent.clause.splice(
            event.context.column.businessObject.$parent.clause.indexOf(event.context.column.next.businessObject), 0,
            event.context.column.businessObject);
        } else {
          event.context.column.businessObject.$parent.clause.push(event.context.column.businessObject);
        }

        if (event.context._cells) {
          // if the column has cells, they should be added to the rules
          forEach(event.context._cells, function (cell) {
            if (!cell.row.isHead && !cell.row.isFoot && cell.content) {
              var ruleObj = cell.row.businessObject[
                cell.column.businessObject.inputExpression ? 'condition' : 'conclusion'
                ];
              if (ruleObj.indexOf(cell.content) === -1) {
                ruleObj.push(cell.content);
              }
            }
          });
        }
      }

      function unsetParent(event) {
        event.context.column.businessObject.$parent.clause.splice(
          event.context.column.businessObject.$parent.clause.indexOf(event.context.column.businessObject), 1);

        updateRules(event.context.column.businessObject.$parent.rule, event.context.column.businessObject);

      }

      function updateRules(rules, clause) {
        forEach(rules, function (rule) {
          forEach(rule.condition, function (condition) {
            if (condition.$parent === clause) {
              rule.condition.splice(rule.condition.indexOf(condition), 1);
            }
          });
          forEach(rule.conclusion, function (conclusion) {
            if (conclusion.$parent === clause) {
              rule.conclusion.splice(rule.conclusion.indexOf(conclusion), 1);
            }
          });
        });
      }

      function deleteRule(event) {
        // remove references
        // ATTENTION: This assumes that every reference is used only once
        forEach(event.context.row.businessObject.condition, function (condition) {
          var type = condition.$parent.inputExpression ? 'inputEntry' : 'outputEntry';
          condition.$parent[type].splice(condition.$parent[type].indexOf(condition), 1);
        });
        forEach(event.context.row.businessObject.conclusion, function (conclusion) {
          var type = conclusion.$parent.inputExpression ? 'inputEntry' : 'outputEntry';
          conclusion.$parent[type].splice(conclusion.$parent[type].indexOf(conclusion), 1);
        });
        event.context.row.businessObject.$parent.rule.splice(
          event.context.row.businessObject.$parent.rule.indexOf(event.context.row.businessObject), 1);
      }

      function clearRule(event) {
        forEach(event.context.row.businessObject.condition, function (condition) {
          var type = condition.$parent.inputExpression ? 'inputEntry' : 'outputEntry';
          condition.$parent[type].splice(condition.$parent[type].indexOf(condition), 1);
        });
        forEach(event.context.row.businessObject.conclusion, function (conclusion) {
          var type = conclusion.$parent.inputExpression ? 'inputEntry' : 'outputEntry';
          conclusion.$parent[type].splice(conclusion.$parent[type].indexOf(conclusion), 1);
        });
        event.context.row.businessObject.condition.length = 0;
        event.context.row.businessObject.conclusion.length = 0;
      }

      function unclearRule(event) {
        forEach(event.context._oldContent, function (content) {
          if (typeof content === 'object') {
            // only apply to the moddle objects (e.g. not the linenumber display)
            var type = content.$parent.inputExpression ? 'inputEntry' : 'outputEntry';
            content.$parent[type].push(content);
            event.context.row.businessObject[type === 'inputEntry' ? 'condition' : 'conclusion'].push(content);
          }
        });
      }

      this.executed(['column.create'], setColumnParent);
      this.executed(['row.create'], setParent);
      this.executed(['column.delete'], unsetParent);
      this.executed(['row.delete'], deleteRule);
      this.executed(['row.clear'], clearRule);

      this.reverted(['row.create'], deleteRule);
      this.reverted(['column.create'], unsetParent);
      this.reverted(['column.delete'], setColumnParent);
      this.reverted(['row.delete'], setParent);
      this.reverted(['row.clear'], unclearRule);
    }

    inherits(DmnUpdater, CommandInterceptor);

    module.exports = DmnUpdater;

    DmnUpdater.$inject = ['eventBus', 'moddle', 'elementRegistry'];

  }, {"diagram-js/lib/command/CommandInterceptor": 26, "inherits": 54, "lodash/collection/forEachRight": 131}],
  15: [function (require, module, exports) {
    'use strict';

    var inherits = require('inherits');

    var BaseElementFactory = require('table-js/lib/core/ElementFactory');


    /**
     * A dmn-aware factory for table-js elements
     */
    function ElementFactory(moddle, dmnFactory) {
      BaseElementFactory.call(this);

      this._moddle = moddle;
      this._dmnFactory = dmnFactory;
    }

    inherits(ElementFactory, BaseElementFactory);


    ElementFactory.$inject = ['moddle', 'dmnFactory'];

    module.exports = ElementFactory;

    ElementFactory.prototype.baseCreate = BaseElementFactory.prototype.create;

    ElementFactory.prototype.create = function (elementType, attrs) {
      attrs = attrs || {};

      var businessObject = attrs.businessObject;
      if (elementType === 'row') {
        attrs.type = 'dmn:DecisionRule';
      } else if (elementType === 'column') {
        attrs.type = 'dmn:Clause';
      }

      if (!businessObject) {
        if (!attrs.type) {
          throw new Error('no type specified');
        }
        else if (attrs.type === 'dmn:DecisionRule') {
          businessObject = this._dmnFactory.createRule(attrs.type);
        } else if (attrs.type === 'dmn:Clause') {
          if (attrs.isInput) {
            businessObject = this._dmnFactory.createInputClause(attrs.name);
          } else {
            businessObject = this._dmnFactory.createOutputClause(attrs.name);
          }
        } else {
          businessObject = this._dmnFactory.create(attrs.type);
        }
      }

      attrs.businessObject = businessObject;
      attrs.id = businessObject.id;

      return this.baseCreate(elementType, attrs);

    };

  }, {"inherits": 54, "table-js/lib/core/ElementFactory": 73}],
  16: [function (require, module, exports) {
    'use strict';

    var inherits = require('inherits');

    var BaseModeling = require('table-js/lib/features/modeling/Modeling');

    var EditCellHandler = require('./cmd/EditCellHandler');


    /**
     * DMN modeling features activator
     *
     * @param {EventBus} eventBus
     * @param {ElementFactory} elementFactory
     * @param {CommandStack} commandStack
     */
    function Modeling(eventBus, elementFactory, commandStack, sheet, elementRegistry, tableName) {
      BaseModeling.call(this, eventBus, elementFactory, commandStack, sheet, tableName);

      this._elementRegistry = elementRegistry;
    }

    inherits(Modeling, BaseModeling);

    Modeling.$inject = ['eventBus', 'elementFactory', 'commandStack', 'sheet', 'elementRegistry', 'tableName'];

    module.exports = Modeling;


    Modeling.prototype.getHandlers = function () {
      var handlers = BaseModeling.prototype.getHandlers.call(this);

      handlers['cell.edit'] = EditCellHandler;

      return handlers;
    };

    Modeling.prototype.editCell = function (row, column, content) {

      var context = {
        row: row,
        column: column,
        content: content
      };

      var cell = this._elementRegistry.filter(function (element) {
        return element._type === 'cell' && element.row.id === row && element.column.id === column;
      })[0];

      if (cell.row.isHead) {
        if (cell.column.businessObject.name !== content) {
          this._commandStack.execute('cell.edit', context);
        }
      } else {
        var previousContent = cell.content;
        if ((!previousContent && context.content !== '') || (previousContent && context.content !== previousContent.text)) {
          // only execute edit command if content changed
          this._commandStack.execute('cell.edit', context);
        }
      }


      return context;
    };

  }, {"./cmd/EditCellHandler": 17, "inherits": 54, "table-js/lib/features/modeling/Modeling": 95}],
  17: [function (require, module, exports) {
    'use strict';

    /**
     * A handler that implements reversible addition of rows.
     *
     * @param {sheet} sheet
     */
    function EditCellHandler(sheet, elementRegistry, graphicsFactory, moddle, dmnFactory) {
      this._sheet = sheet;
      this._elementRegistry = elementRegistry;
      this._graphicsFactory = graphicsFactory;
      this._dmnFactory = dmnFactory;
      this._moddle = moddle;
    }

    EditCellHandler.$inject = ['sheet', 'elementRegistry', 'graphicsFactory', 'moddle', 'dmnFactory'];

    module.exports = EditCellHandler;


////// api /////////////////////////////////////////


    /**
     * Edits the content of the cell
     *
     * @param {Object} context
     */
    EditCellHandler.prototype.execute = function (context) {
      // get the business object
      var el = this._elementRegistry.get('cell_' + context.column + '_' + context.row);
      var gfx = this._elementRegistry.getGraphics('cell_' + context.column + '_' + context.row);
      if (el.row.isHead) {
        // update the clause names
        context.oldContent = el.column.businessObject.name;
        el.column.businessObject.name = context.content;
      } else {
        // update a rule cell
        if (el.content) {
          context.oldContent = el.content.text;
          el.content.text = context.content;
        } else {
          // need to create a semantic object
          el.content = this._dmnFactory[el.column.businessObject.inputExpression ? 'createInputEntry' : 'createOutputEntry']
          (context.content, el.column.businessObject, el.row.businessObject);
        }

        // remove empty cells
        if (context.content === '') {
          if (el.column.businessObject.inputEntry) {
            el.column.businessObject.inputEntry.splice(el.column.businessObject.inputEntry.indexOf(el.content), 1);
          } else {
            el.column.businessObject.outputEntry.splice(el.column.businessObject.outputEntry.indexOf(el.content), 1);
          }
          el.row.businessObject[el.column.businessObject.inputEntry ? 'condition' : 'conclusion'].splice(
            el.row.businessObject[el.column.businessObject.inputEntry ? 'condition' : 'conclusion'].indexOf(el.content), 1);
          delete el.content;
        }
      }

      this._graphicsFactory.update('cell', el, gfx);

      return context;
    };


    /**
     * Undo Edit by resetting the content
     */
    EditCellHandler.prototype.revert = function (context) {
      var el = this._elementRegistry.get('cell_' + context.column + '_' + context.row);
      var gfx = this._elementRegistry.getGraphics('cell_' + context.column + '_' + context.row);

      if (el.row.isHead) {
        // revert clause name
        el.column.businessObject.name = context.oldContent;
      } else {
        // revert a rule cell
        if (!el.content) {
          // could have been deleted
          el.content = this._dmnFactory[el.column.businessObject.inputExpression ? 'createInputEntry' : 'createOutputEntry']
          (context.oldContent, el.column.businessObject, el.row.businessObject);
        } else {
          el.content.text = context.oldContent;
        }

        // remove empty cells
        if (!el.content.text) {
          if (el.column.businessObject.inputEntry) {
            el.column.businessObject.inputEntry.splice(el.column.businessObject.inputEntry.indexOf(el.content), 1);
          } else {
            el.column.businessObject.outputEntry.splice(el.column.businessObject.outputEntry.indexOf(el.content), 1);
          }
          el.row.businessObject[el.column.businessObject.inputEntry ? 'condition' : 'conclusion'].splice(
            el.row.businessObject[el.column.businessObject.inputEntry ? 'condition' : 'conclusion'].indexOf(el.content), 1);
          delete el.content;
        }
      }

      this._graphicsFactory.update('cell', el, gfx);

      return context;
    };

  }, {}],
  18: [function (require, module, exports) {
    module.exports = {
      __init__: ['modeling', 'dmnUpdater'],
      __depends__: [
        require('table-js/lib/features/modeling'),
        require('table-js/lib/features/add-row')
      ],
      dmnFactory: ['type', require('./DmnFactory')],
      modeling: ['type', require('./Modeling')],
      dmnUpdater: ['type', require('./DmnUpdater')],
      elementFactory: ['type', require('./ElementFactory')]
    };

  }, {
    "./DmnFactory": 13,
    "./DmnUpdater": 14,
    "./ElementFactory": 15,
    "./Modeling": 16,
    "table-js/lib/features/add-row": 82,
    "table-js/lib/features/modeling": 103
  }],
  19: [function (require, module, exports) {
    'use strict';

    var domify = require('min-dom/lib/domify');

    var inherits = require('inherits');

    var BaseModule = require('table-js/lib/features/table-name/TableName');

    /**
     * Adds a header to the table containing the table name
     *
     * @param {EventBus} eventBus
     */
    function TableName(eventBus, sheet, tableName) {

      BaseModule.call(this, eventBus, sheet, tableName);

      this.semantic = null;
    }

    inherits(TableName, BaseModule);

    TableName.$inject = ['eventBus', 'sheet', 'config.tableName'];

    module.exports = TableName;

    TableName.prototype.setSemantic = function (semantic) {
      this.semantic = semantic;
      this.setName(semantic.name);
    };

    TableName.prototype.setName = function (newName) {
      this.semantic.name = newName;
      this.node.querySelector('h3').textContent = newName;
    };

    TableName.prototype.getName = function () {
      return this.semantic.name;
    };

  }, {"inherits": 54, "min-dom/lib/domify": 58, "table-js/lib/features/table-name/TableName": 106}],
  20: [function (require, module, exports) {
    module.exports = {
      __init__: ['tableName'],
      __depends__: [],
      tableName: ['type', require('./TableName')]
    };

  }, {"./TableName": 19}],
  21: [function (require, module, exports) {
    'use strict';

    var assign = require('lodash/object/assign');

    var elementToString = require('./Util').elementToString;


    function elementData(semantic, attrs) {
      return assign({
        id: semantic.id,
        type: semantic.$type,
        businessObject: semantic
      }, attrs);
    }


    /**
     * An importer that adds dmn elements to the sheet
     *
     * @param {EventBus} eventBus
     * @param {Sheet} sheet
     * @param {ElementFactory} elementFactory
     * @param {ElementRegistry} elementRegistry
     */
    function DmnImporter(eventBus, sheet, elementRegistry, elementFactory, moddle, tableName) {
      this._eventBus = eventBus;
      this._sheet = sheet;

      this._elementRegistry = elementRegistry;
      this._elementFactory = elementFactory;
      this._tableName = tableName;

      this._moddle = moddle;

      this.usedEntries = [];
    }

    DmnImporter.$inject = ['eventBus', 'sheet', 'elementRegistry', 'elementFactory', 'moddle', 'tableName'];

    module.exports = DmnImporter;


    DmnImporter.prototype._makeCopy = function (semantic) {
      var newSemantic = this._moddle.create(semantic.$type);

      for (var prop in semantic) {
        if (semantic.hasOwnProperty(prop) && prop !== '$type') {
          newSemantic[prop] = semantic[prop];
        }
      }
      newSemantic.$parent = semantic.$parent;

      return newSemantic;
    };

    /**
     * Add dmn element (semantic) to the sheet onto the
     * parent element.
     */
    DmnImporter.prototype.add = function (semantic, parentElement) {

      var element;

      if (semantic.$instanceOf('dmn:DecisionTable')) {
        // Add the header row
        element = this._elementFactory.createRow(elementData(semantic, {
          isHead: true,
          isClauseRow: true
        }));
        this._sheet.addRow(element, parentElement);

        this._tableName.setSemantic(semantic);
      }

      // CLAUSE
      else if (semantic.$instanceOf('dmn:Clause')) {
        if (semantic.inputExpression && !semantic.inputEntry) {
          semantic.inputEntry = [];
        } else if (semantic.outputDefinition && !semantic.outputEntry) {
          semantic.outputEntry = [];
        }

        element = this._elementFactory.createColumn(elementData(semantic, {}));

        this._sheet.addColumn(element, parentElement);
      }

      // RULE
      else if (semantic.$instanceOf('dmn:DecisionRule')) {
        if (!semantic.condition) {
          semantic.condition = [];
        }
        if (!semantic.conclusion) {
          semantic.conclusion = [];
        }
        element = this._elementFactory.createRow(elementData(semantic, {}));
        this._sheet.addRow(element, parentElement);

      }

      // CELL
      else if (semantic.$instanceOf('dmn:LiteralExpression')) {

        // now I have to get the ID of the row and the column
        var column = this._elementRegistry.filter(function (ea) {
          return ea.businessObject === semantic.$parent;
        })[0].id;

        var row = this._elementRegistry.filter(function (ea) {
          return ea.businessObject === parentElement;
        })[0].id;

        var content = semantic;
        if (this.usedEntries.indexOf(semantic) !== -1) {
          content = this._makeCopy(semantic);
          content.id = row + '_' + column;
          content.$parent[content.$parent.inputEntry ? 'inputEntry' : 'outputEntry'].push(content);
          var ruleProp = !!content.$parent.inputEntry ? 'condition' : 'conclusion';
          parentElement[ruleProp].splice(parentElement[ruleProp].indexOf(semantic), 1, content);
        }

        this._sheet.setCellContent({
          row: row,
          column: column,
          content: content
        });

        this.usedEntries.push(content);

      } else {
        throw new Error('can not render element ' + elementToString(semantic));
      }

      this._eventBus.fire('dmnElement.added', {element: element});

      return element;
    };

  }, {"./Util": 24, "lodash/object/assign": 219}],
  22: [function (require, module, exports) {
    'use strict';

    var forEach = require('lodash/collection/forEach'),
      sortBy = require('lodash/collection/sortBy');

    var elementToString = require('./Util').elementToString;

    function DmnTreeWalker(handler) {

      function visit(element, ctx) {

        var gfx = element.gfx;

        // avoid multiple rendering of elements
        if (gfx) {
          throw new Error('already rendered ' + elementToString(element));
        }

        // call handler
        return handler.element(element, ctx);
      }

      function visitTable(element) {
        return handler.table(element);
      }

      ////// Semantic handling //////////////////////

      function handleDefinitions(definitions) {
        // make sure we walk the correct bpmnElement

        var decisions = definitions.Decision,
          decision;

        if (decisions && decisions.length) {
          decision = decisions[0];
        }

        // no decision -> nothing to import
        if (!decision) {
          return;
        }

        var table = decision.DecisionTable;


        // no decision table -> nothing to import
        if (!table) {
          throw new Error('no table for ' + elementToString(decision));
        }

        var ctx = visitTable(table);

        handleClauses(table.clause, ctx);

        handleRules(table.rule, ctx);

      }

      function handleClauses(clauses, context) {
        forEach(sortBy(clauses, function (clause) {
          return !clause.inputExpression;
        }), function (e) {
          visit(e, context);
        });
      }

      function handleRules(rules, context) {
        forEach(rules, function (e) {
          visit(e, context);

          handleConditions(e.condition, e);

          handleConclusions(e.conclusion, e);
        });
      }

      function handleConditions(conditions, context) {
        forEach(conditions, function (e) {
          visit(e, context);
        });
      }

      function handleConclusions(conclusions, context) {
        forEach(conclusions, function (e) {
          visit(e, context);
        });
      }

      ///// API ////////////////////////////////

      return {
        handleDefinitions: handleDefinitions
      };
    }

    module.exports = DmnTreeWalker;

  }, {"./Util": 24, "lodash/collection/forEach": 130, "lodash/collection/sortBy": 134}],
  23: [function (require, module, exports) {
    'use strict';

    var DmnTreeWalker = require('./DmnTreeWalker');


    /**
     * Import the definitions into a table.
     *
     * Errors and warnings are reported through the specified callback.
     *
     * @param  {Sheet} sheet
     * @param  {ModdleElement} definitions
     * @param  {Function} done the callback, invoked with (err, [ warning ]) once the import is done
     */
    function importDmnTable(sheet, definitions, done) {

      var importer = sheet.get('dmnImporter'),
        eventBus = sheet.get('eventBus');

      var error,
        warnings = [];

      function parse(definitions) {

        var visitor = {

          table: function (element) {
            return importer.add(element);
          },

          element: function (element, parentShape) {
            return importer.add(element, parentShape);
          },

          error: function (message, context) {
            warnings.push({message: message, context: context});
          }
        };

        var walker = new DmnTreeWalker(visitor);

        // import
        walker.handleDefinitions(definitions);
      }

      eventBus.fire('import.start');

      try {
        parse(definitions);
      } catch (e) {
        error = e;
      }

      eventBus.fire(error ? 'import.error' : 'import.success', {error: error, warnings: warnings});
      done(error, warnings);
    }

    module.exports.importDmnTable = importDmnTable;

  }, {"./DmnTreeWalker": 22}],
  24: [function (require, module, exports) {
    'use strict';

    module.exports.elementToString = function (e) {
      if (!e) {
        return '<null>';
      }

      return '<' + e.$type + (e.id ? ' id="' + e.id : '') + '" />';
    };
  }, {}],
  25: [function (require, module, exports) {
    module.exports = {
      dmnImporter: ['type', require('./DmnImporter')]
    };

  }, {"./DmnImporter": 21}],
  26: [function (require, module, exports) {
    'use strict';

    var forEach = require('lodash/collection/forEach'),
      isFunction = require('lodash/lang/isFunction'),
      isArray = require('lodash/lang/isArray'),
      isNumber = require('lodash/lang/isNumber');


    var DEFAULT_PRIORITY = 1000;


    /**
     * A utility that can be used to plug-in into the command execution for
     * extension and/or validation.
     *
     * @param {EventBus} eventBus
     *
     * @example
     *
     * var inherits = require('inherits');
     *
     * var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');
     *
     * function CommandLogger(eventBus) {
 *   CommandInterceptor.call(this, eventBus);
 *
 *   this.preExecute(function(event) {
 *     console.log('command pre-execute', event);
 *   });
 * }
     *
     * inherits(CommandLogger, CommandInterceptor);
     *
     */
    function CommandInterceptor(eventBus) {
      this._eventBus = eventBus;
    }

    CommandInterceptor.$inject = ['eventBus'];

    module.exports = CommandInterceptor;

    function unwrapEvent(fn) {
      return function (event) {
        return fn(event.context, event.command, event);
      };
    }

    /**
     * Register an interceptor for a command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {String} [hook] command hook, i.e. preExecute, executed to listen on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} unwrap if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     */
    CommandInterceptor.prototype.on = function (events, hook, priority, handlerFn, unwrap) {

      if (isFunction(hook) || isNumber(hook)) {
        unwrap = handlerFn;
        handlerFn = priority;
        priority = hook;
        hook = null;
      }

      if (isFunction(priority)) {
        unwrap = handlerFn;
        handlerFn = priority;
        priority = DEFAULT_PRIORITY;
      }

      if (!isFunction(handlerFn)) {
        throw new Error('handlerFn must be a function');
      }

      if (!isArray(events)) {
        events = [events];
      }

      var eventBus = this._eventBus;

      forEach(events, function (event) {
        // concat commandStack(.event)?(.hook)?
        var fullEvent = ['commandStack', event, hook].filter(function (e) {
          return e;
        }).join('.');

        eventBus.on(fullEvent, priority, unwrap ? unwrapEvent(handlerFn) : handlerFn);
      });
    };


    var hooks = [
      'canExecute',
      'preExecute',
      'execute',
      'executed',
      'postExecute',
      'revert',
      'reverted'
    ];

    /*
     * Install hook shortcuts
     *
     * This will generate the CommandInterceptor#(preExecute|...|reverted) methods
     * which will in term forward to CommandInterceptor#on.
     */
    forEach(hooks, function (hook) {

      /**
       * {canExecute|preExecute|execute|executed|postExecute|revert|reverted}
       *
       * A named hook for plugging into the command execution
       *
       * @param {String|Array<String>} [events] list of commands to register on
       * @param {Number} [priority] the priority on which to hook into the execution
       * @param {Function} handlerFn interceptor to be invoked with (event)
       * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
       *                          listener instead
       */
      CommandInterceptor.prototype[hook] = function (events, priority, handlerFn, unwrap) {

        if (isFunction(events) || isNumber(events)) {
          unwrap = handlerFn;
          handlerFn = priority;
          priority = events;
          events = null;
        }

        this.on(events, hook, priority, handlerFn, unwrap);
      };
    });
  }, {"lodash/collection/forEach": 130, "lodash/lang/isArray": 212, "lodash/lang/isFunction": 213, "lodash/lang/isNumber": 215}],
  27: [function (require, module, exports) {
    'use strict';

    var inherits = require('inherits');

    var CommandInterceptor = require('../../command/CommandInterceptor');

    /**
     * A basic provider that may be extended to implement modeling rules.
     *
     * Extensions should implement the init method to actually add their custom
     * modeling checks. Checks may be added via the #addRule(action, fn) method.
     *
     * @param {EventBus} eventBus
     */
    function RuleProvider(eventBus) {
      CommandInterceptor.call(this, eventBus);

      this.init();
    }

    RuleProvider.$inject = ['eventBus'];

    inherits(RuleProvider, CommandInterceptor);

    module.exports = RuleProvider;


    /**
     * Adds a modeling rule for the given action, implemented through a callback function.
     *
     * The function will receive the modeling specific action context to perform its check.
     * It must return false or null to disallow the action from happening.
     *
     * Returning <code>null</code> may encode simply ignoring the action.
     *
     * @example
     *
     * ResizableRules.prototype.init = function() {
 *
 *   this.addRule('shape.resize', function(context) {
 *
 *     var shape = context.shape;
 *
 *     if (!context.newBounds) {
 *       // check general resizability
 *       if (!shape.resizable) {
 *         return false;
 *       }
 *     } else {
 *       // element must have minimum size of 10*10 points
 *       return context.newBounds.width > 10 && context.newBounds.height > 10;
 *     }
 *   });
 * };
     *
     * @param {String|Array<String>} actions the identifier for the modeling action to check
     * @param {Number} [priority] the priority at which this rule is being applied
     * @param {Function} fn the callback function that performs the actual check
     */
    RuleProvider.prototype.addRule = function (actions, priority, fn) {

      var self = this;

      if (typeof actions === 'string') {
        actions = [actions];
      }

      actions.forEach(function (action) {

        self.canExecute(action, priority, function (context, action, event) {
          return fn(context);
        }, true);
      });
    };
  }, {"../../command/CommandInterceptor": 26, "inherits": 54}],
  28: [function (require, module, exports) {
    'use strict';

    /**
     * Util that provides unique IDs.
     *
     * @class djs.util.IdGenerator
     * @constructor
     * @memberOf djs.util
     *
     * The ids can be customized via a given prefix and contain a random value to avoid collisions.
     *
     * @param {String} prefix a prefix to prepend to generated ids (for better readability)
     */
    function IdGenerator(prefix) {

      this._counter = 0;
      this._prefix = (prefix ? prefix + '-' : '') + Math.floor(Math.random() * 1000000000) + '-';
    }

    module.exports = IdGenerator;

    /**
     * Returns a next unique ID.
     *
     * @method djs.util.IdGenerator#next
     *
     * @returns {String} the id
     */
    IdGenerator.prototype.next = function () {
      return this._prefix + (++this._counter);
    };

  }, {}],
  29: [function (require, module, exports) {

    var isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };

    var annotate = function () {
      var args = Array.prototype.slice.call(arguments);

      if (args.length === 1 && isArray(args[0])) {
        args = args[0];
      }

      var fn = args.pop();

      fn.$inject = args;

      return fn;
    };


// Current limitations:
// - can't put into "function arg" comments
// function /* (no parenthesis like this) */ (){}
// function abc( /* xx (no parenthesis like this) */ a, b) {}
//
// Just put the comment before function or inside:
// /* (((this is fine))) */ function(a, b) {}
// function abc(a) { /* (((this is fine))) */}

    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var FN_ARG = /\/\*([^\*]*)\*\//m;

    var parse = function (fn) {
      if (typeof fn !== 'function') {
        throw new Error('Cannot annotate "' + fn + '". Expected a function!');
      }

      var match = fn.toString().match(FN_ARGS);
      return match[1] && match[1].split(',').map(function (arg) {
          match = arg.match(FN_ARG);
          return match ? match[1].trim() : arg.trim();
        }) || [];
    };


    exports.annotate = annotate;
    exports.parse = parse;
    exports.isArray = isArray;

  }, {}],
  30: [function (require, module, exports) {
    module.exports = {
      annotate: require('./annotation').annotate,
      Module: require('./module'),
      Injector: require('./injector')
    };

  }, {"./annotation": 29, "./injector": 31, "./module": 32}],
  31: [function (require, module, exports) {
    var Module = require('./module');
    var autoAnnotate = require('./annotation').parse;
    var annotate = require('./annotation').annotate;
    var isArray = require('./annotation').isArray;


    var Injector = function (modules, parent) {
      parent = parent || {
          get: function (name) {
            currentlyResolving.push(name);
            throw error('No provider for "' + name + '"!');
          }
        };

      var currentlyResolving = [];
      var providers = this._providers = Object.create(parent._providers || null);
      var instances = this._instances = Object.create(null);

      var self = instances.injector = this;

      var error = function (msg) {
        var stack = currentlyResolving.join(' -> ');
        currentlyResolving.length = 0;
        return new Error(stack ? msg + ' (Resolving: ' + stack + ')' : msg);
      };

      var get = function (name) {
        if (!providers[name] && name.indexOf('.') !== -1) {
          var parts = name.split('.');
          var pivot = get(parts.shift());

          while (parts.length) {
            pivot = pivot[parts.shift()];
          }

          return pivot;
        }

        if (Object.hasOwnProperty.call(instances, name)) {
          return instances[name];
        }

        if (Object.hasOwnProperty.call(providers, name)) {
          if (currentlyResolving.indexOf(name) !== -1) {
            currentlyResolving.push(name);
            throw error('Cannot resolve circular dependency!');
          }

          currentlyResolving.push(name);
          instances[name] = providers[name][0](providers[name][1]);
          currentlyResolving.pop();

          return instances[name];
        }

        return parent.get(name);
      };

      var instantiate = function (Type) {
        var instance = Object.create(Type.prototype);
        var returned = invoke(Type, instance);

        return typeof returned === 'object' ? returned : instance;
      };

      var invoke = function (fn, context) {
        if (typeof fn !== 'function') {
          if (isArray(fn)) {
            fn = annotate(fn.slice());
          } else {
            throw new Error('Cannot invoke "' + fn + '". Expected a function!');
          }
        }

        var inject = fn.$inject && fn.$inject || autoAnnotate(fn);
        var dependencies = inject.map(function (dep) {
          return get(dep);
        });

        // TODO(vojta): optimize without apply
        return fn.apply(context, dependencies);
      };


      var createPrivateInjectorFactory = function (privateChildInjector) {
        return annotate(function (key) {
          return privateChildInjector.get(key);
        });
      };

      var createChild = function (modules, forceNewInstances) {
        if (forceNewInstances && forceNewInstances.length) {
          var fromParentModule = Object.create(null);
          var matchedScopes = Object.create(null);

          var privateInjectorsCache = [];
          var privateChildInjectors = [];
          var privateChildFactories = [];

          var provider;
          var cacheIdx;
          var privateChildInjector;
          var privateChildInjectorFactory;
          for (var name in providers) {
            provider = providers[name];

            if (forceNewInstances.indexOf(name) !== -1) {
              if (provider[2] === 'private') {
                cacheIdx = privateInjectorsCache.indexOf(provider[3]);
                if (cacheIdx === -1) {
                  privateChildInjector = provider[3].createChild([], forceNewInstances);
                  privateChildInjectorFactory = createPrivateInjectorFactory(privateChildInjector);
                  privateInjectorsCache.push(provider[3]);
                  privateChildInjectors.push(privateChildInjector);
                  privateChildFactories.push(privateChildInjectorFactory);
                  fromParentModule[name] = [privateChildInjectorFactory, name, 'private', privateChildInjector];
                } else {
                  fromParentModule[name] = [privateChildFactories[cacheIdx], name, 'private', privateChildInjectors[cacheIdx]];
                }
              } else {
                fromParentModule[name] = [provider[2], provider[1]];
              }
              matchedScopes[name] = true;
            }

            if ((provider[2] === 'factory' || provider[2] === 'type') && provider[1].$scope) {
              forceNewInstances.forEach(function (scope) {
                if (provider[1].$scope.indexOf(scope) !== -1) {
                  fromParentModule[name] = [provider[2], provider[1]];
                  matchedScopes[scope] = true;
                }
              });
            }
          }

          forceNewInstances.forEach(function (scope) {
            if (!matchedScopes[scope]) {
              throw new Error('No provider for "' + scope + '". Cannot use provider from the parent!');
            }
          });

          modules.unshift(fromParentModule);
        }

        return new Injector(modules, self);
      };

      var factoryMap = {
        factory: invoke,
        type: instantiate,
        value: function (value) {
          return value;
        }
      };

      modules.forEach(function (module) {

        function arrayUnwrap(type, value) {
          if (type !== 'value' && isArray(value)) {
            value = annotate(value.slice());
          }

          return value;
        }

        // TODO(vojta): handle wrong inputs (modules)
        if (module instanceof Module) {
          module.forEach(function (provider) {
            var name = provider[0];
            var type = provider[1];
            var value = provider[2];

            providers[name] = [factoryMap[type], arrayUnwrap(type, value), type];
          });
        } else if (typeof module === 'object') {
          if (module.__exports__) {
            var clonedModule = Object.keys(module).reduce(function (m, key) {
              if (key.substring(0, 2) !== '__') {
                m[key] = module[key];
              }
              return m;
            }, Object.create(null));

            var privateInjector = new Injector((module.__modules__ || []).concat([clonedModule]), self);
            var getFromPrivateInjector = annotate(function (key) {
              return privateInjector.get(key);
            });
            module.__exports__.forEach(function (key) {
              providers[key] = [getFromPrivateInjector, key, 'private', privateInjector];
            });
          } else {
            Object.keys(module).forEach(function (name) {
              if (module[name][2] === 'private') {
                providers[name] = module[name];
                return;
              }

              var type = module[name][0];
              var value = module[name][1];

              providers[name] = [factoryMap[type], arrayUnwrap(type, value), type];
            });
          }
        }
      });

      // public API
      this.get = get;
      this.invoke = invoke;
      this.instantiate = instantiate;
      this.createChild = createChild;
    };

    module.exports = Injector;

  }, {"./annotation": 29, "./module": 32}],
  32: [function (require, module, exports) {
    var Module = function () {
      var providers = [];

      this.factory = function (name, factory) {
        providers.push([name, 'factory', factory]);
        return this;
      };

      this.value = function (name, value) {
        providers.push([name, 'value', value]);
        return this;
      };

      this.type = function (name, type) {
        providers.push([name, 'type', type]);
        return this;
      };

      this.forEach = function (iterator) {
        providers.forEach(iterator);
      };
    };

    module.exports = Module;

  }, {}],
  33: [function (require, module, exports) {
    module.exports = require('./lib/simple');
  }, {"./lib/simple": 36}],
  34: [function (require, module, exports) {
    'use strict';

    var isString = require('lodash/lang/isString'),
      isFunction = require('lodash/lang/isFunction'),
      assign = require('lodash/object/assign');

    var Moddle = require('moddle'),
      XmlReader = require('moddle-xml/lib/reader'),
      XmlWriter = require('moddle-xml/lib/writer');

    /**
     * A sub class of {@link Moddle} with support for import and export of DMN xml files.
     *
     * @class DmnModdle
     * @extends Moddle
     *
     * @param {Object|Array} packages to use for instantiating the model
     * @param {Object} [options] additional options to pass over
     */
    function DmnModdle(packages, options) {
      Moddle.call(this, packages, options);
    }

    DmnModdle.prototype = Object.create(Moddle.prototype);

    module.exports = DmnModdle;


    /**
     * Instantiates a DMN model tree from a given xml string.
     *
     * @param {String}   xmlStr
     * @param {String}   [typeName='bpmn:Definitions'] name of the root element
     * @param {Object}   [options]  options to pass to the underlying reader
     * @param {Function} done       callback that is invoked with (err, result, parseContext)
     *                              once the import completes
     */
    DmnModdle.prototype.fromXML = function (xmlStr, typeName, options, done) {

      if (!isString(typeName)) {
        done = options;
        options = typeName;
        typeName = 'Definitions';
      }

      if (isFunction(options)) {
        done = options;
        options = {};
      }

      var reader = new XmlReader(assign({model: this, lax: true}, options));
      var rootHandler = reader.handler(typeName);

      reader.fromXML(xmlStr, rootHandler, done);
    };


    /**
     * Serializes a DMN object tree to XML.
     *
     * @param {String}   element    the root element, typically an instance of `Definitions`
     * @param {Object}   [options]  to pass to the underlying writer
     * @param {Function} done       callback invoked with (err, xmlStr) once the import completes
     */
    DmnModdle.prototype.toXML = function (element, options, done) {

      if (isFunction(options)) {
        done = options;
        options = {};
      }

      var writer = new XmlWriter(options);
      try {
        var result = writer.toXML(element);
        done(null, result);
      } catch (e) {
        done(e);
      }
    };

  }, {
    "lodash/lang/isFunction": 213,
    "lodash/lang/isString": 217,
    "lodash/object/assign": 219,
    "moddle": 42,
    "moddle-xml/lib/reader": 38,
    "moddle-xml/lib/writer": 39
  }],
  35: [function (require, module, exports) {
    'use strict';

    var ID_PATTERN = /^(.*:)?id$/;

    /**
     * Extends the bpmn instance with id support.
     *
     * @example
     *
     * var moddle, ids;
     *
     * require('id-support').extend(moddle, ids);
     *
     * moddle.ids.next(); // create a next id
     * moddle.ids; // ids instance
     *
     * // claims id as used
     * moddle.create('foo:Bar', { id: 'fooobar1' });
     *
     *
     * @param  {Moddle} model
     * @param  {Ids} ids
     *
     * @return {Moddle} the extended moddle instance
     */
    module.exports.extend = function (model, ids) {

      var set = model.properties.set;

      // do not reinitialize setter
      // unless it is already initialized
      if (!model.ids) {

        model.properties.set = function (target, property, value) {

          // ensure we log used ids once they are assigned
          // to model elements
          if (ID_PATTERN.test(property)) {

            var assigned = model.ids.assigned(value);
            if (assigned && assigned !== target) {
              throw new Error('id <' + value + '> already used');
            }

            model.ids.claim(value, target);
          }

          set.call(this, target, property, value);
        };
      }

      model.ids = ids;

      return model;
    };

  }, {}],
  36: [function (require, module, exports) {
    'use strict';

    var assign = require('lodash/object/assign');

    var DmnModdle = require('./dmn-moddle');

    var packages = {
      dmn: require('../resources/dmn/json/dmn.json')
    };

    module.exports = function (additionalPackages, options) {
      return new DmnModdle(assign({}, packages, additionalPackages), options);
    };

  }, {"../resources/dmn/json/dmn.json": 51, "./dmn-moddle": 34, "lodash/object/assign": 219}],
  37: [function (require, module, exports) {
    'use strict';

    function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function lower(string) {
      return string.charAt(0).toLowerCase() + string.slice(1);
    }

    function hasLowerCaseAlias(pkg) {
      return pkg.xml && pkg.xml.tagAlias === 'lowerCase';
    }


    module.exports.aliasToName = function (alias, pkg) {
      if (hasLowerCaseAlias(pkg)) {
        return capitalize(alias);
      } else {
        return alias;
      }
    };

    module.exports.nameToAlias = function (name, pkg) {
      if (hasLowerCaseAlias(pkg)) {
        return lower(name);
      } else {
        return name;
      }
    };

    module.exports.DEFAULT_NS_MAP = {
      'xsi': 'http://www.w3.org/2001/XMLSchema-instance'
    };

    var XSI_TYPE = module.exports.XSI_TYPE = 'xsi:type';

    function serializeFormat(element) {
      return element.xml && element.xml.serialize;
    }

    module.exports.serializeAsType = function (element) {
      return serializeFormat(element) === XSI_TYPE;
    };

    module.exports.serializeAsProperty = function (element) {
      return serializeFormat(element) === 'property';
    };
  }, {}],
  38: [function (require, module, exports) {
    'use strict';

    var reduce = require('lodash/collection/reduce'),
      forEach = require('lodash/collection/forEach'),
      find = require('lodash/collection/find'),
      assign = require('lodash/object/assign'),
      defer = require('lodash/function/defer');

    var Stack = require('tiny-stack'),
      SaxParser = require('sax').parser,
      Moddle = require('moddle'),
      parseNameNs = require('moddle/lib/ns').parseName,
      Types = require('moddle/lib/types'),
      coerceType = Types.coerceType,
      isSimpleType = Types.isSimple,
      common = require('./common'),
      XSI_TYPE = common.XSI_TYPE,
      XSI_URI = common.DEFAULT_NS_MAP.xsi,
      serializeAsType = common.serializeAsType,
      aliasToName = common.aliasToName;

    function parseNodeAttributes(node) {
      var nodeAttrs = node.attributes;

      return reduce(nodeAttrs, function (result, v, k) {
        var name, ns;

        if (!v.local) {
          name = v.prefix;
        } else {
          ns = parseNameNs(v.name, v.prefix);
          name = ns.name;
        }

        result[name] = v.value;
        return result;
      }, {});
    }

    function normalizeType(node, attr, model) {
      var nameNs = parseNameNs(attr.value);

      var uri = node.ns[nameNs.prefix || ''],
        localName = nameNs.localName,
        pkg = uri && model.getPackage(uri),
        typePrefix;

      if (pkg) {
        typePrefix = pkg.xml && pkg.xml.typePrefix;

        if (typePrefix && localName.indexOf(typePrefix) === 0) {
          localName = localName.slice(typePrefix.length);
        }

        attr.value = pkg.prefix + ':' + localName;
      }
    }

    /**
     * Normalizes namespaces for a node given an optional default namespace and a
     * number of mappings from uris to default prefixes.
     *
     * @param  {XmlNode} node
     * @param  {Model} model the model containing all registered namespaces
     * @param  {Uri} defaultNsUri
     */
    function normalizeNamespaces(node, model, defaultNsUri) {
      var uri, prefix;

      uri = node.uri || defaultNsUri;

      if (uri) {
        var pkg = model.getPackage(uri);

        if (pkg) {
          prefix = pkg.prefix;
        } else {
          prefix = node.prefix;
        }

        node.prefix = prefix;
        node.uri = uri;
      }

      forEach(node.attributes, function (attr) {

        // normalize xsi:type attributes because the
        // assigned type may or may not be namespace prefixed
        if (attr.uri === XSI_URI && attr.local === 'type') {
          normalizeType(node, attr, model);
        }

        normalizeNamespaces(attr, model, null);
      });
    }


    /**
     * A parse context.
     *
     * @class
     *
     * @param {Object} options
     * @param {ElementHandler} options.parseRoot the root handler for parsing a document
     * @param {boolean} [options.lax=false] whether or not to ignore invalid elements
     */
    function Context(options) {

      /**
       * @property {ElementHandler} parseRoot
       */

      /**
       * @property {Boolean} lax
       */

      assign(this, options);

      var elementsById = this.elementsById = {};
      var references = this.references = [];
      var warnings = this.warnings = [];

      this.addReference = function (reference) {
        references.push(reference);
      };

      this.addElement = function (id, element) {

        if (!id || !element) {
          throw new Error('[xml-reader] id or ctx must not be null');
        }

        elementsById[id] = element;
      };

      this.addWarning = function (w) {
        warnings.push(w);
      };
    }

    function BaseHandler() {
    }

    BaseHandler.prototype.handleEnd = function () {
    };
    BaseHandler.prototype.handleText = function () {
    };
    BaseHandler.prototype.handleNode = function () {
    };


    /**
     * A simple pass through handler that does nothing except for
     * ignoring all input it receives.
     *
     * This is used to ignore unknown elements and
     * attributes.
     */
    function NoopHandler() {
    }

    NoopHandler.prototype = new BaseHandler();

    NoopHandler.prototype.handleNode = function () {
      return this;
    };

    function BodyHandler() {
    }

    BodyHandler.prototype = new BaseHandler();

    BodyHandler.prototype.handleText = function (text) {
      this.body = (this.body || '') + text;
    };

    function ReferenceHandler(property, context) {
      this.property = property;
      this.context = context;
    }

    ReferenceHandler.prototype = new BodyHandler();

    ReferenceHandler.prototype.handleNode = function (node) {

      if (this.element) {
        throw new Error('expected no sub nodes');
      } else {
        this.element = this.createReference(node);
      }

      return this;
    };

    ReferenceHandler.prototype.handleEnd = function () {
      this.element.id = this.body;
    };

    ReferenceHandler.prototype.createReference = function () {
      return {
        property: this.property.ns.name,
        id: ''
      };
    };

    function ValueHandler(propertyDesc, element) {
      this.element = element;
      this.propertyDesc = propertyDesc;
    }

    ValueHandler.prototype = new BodyHandler();

    ValueHandler.prototype.handleEnd = function () {

      var value = this.body,
        element = this.element,
        propertyDesc = this.propertyDesc;

      value = coerceType(propertyDesc.type, value);

      if (propertyDesc.isMany) {
        element.get(propertyDesc.name).push(value);
      } else {
        element.set(propertyDesc.name, value);
      }
    };


    function BaseElementHandler() {
    }

    BaseElementHandler.prototype = Object.create(BodyHandler.prototype);

    BaseElementHandler.prototype.handleNode = function (node) {
      var parser = this,
        element = this.element,
        id;

      if (!element) {
        element = this.element = this.createElement(node);
        id = element.id;

        if (id) {
          this.context.addElement(id, element);
        }
      } else {
        parser = this.handleChild(node);
      }

      return parser;
    };

    /**
     * @class XMLReader.ElementHandler
     *
     */
    function ElementHandler(model, type, context) {
      this.model = model;
      this.type = model.getType(type);
      this.context = context;
    }

    ElementHandler.prototype = new BaseElementHandler();

    ElementHandler.prototype.addReference = function (reference) {
      this.context.addReference(reference);
    };

    ElementHandler.prototype.handleEnd = function () {

      var value = this.body,
        element = this.element,
        descriptor = element.$descriptor,
        bodyProperty = descriptor.bodyProperty;

      if (bodyProperty && value !== undefined) {
        value = coerceType(bodyProperty.type, value);
        element.set(bodyProperty.name, value);
      }
    };

    /**
     * Create an instance of the model from the given node.
     *
     * @param  {Element} node the xml node
     */
    ElementHandler.prototype.createElement = function (node) {
      var attributes = parseNodeAttributes(node),
        Type = this.type,
        descriptor = Type.$descriptor,
        context = this.context,
        instance = new Type({});

      forEach(attributes, function (value, name) {

        var prop = descriptor.propertiesByName[name];

        if (prop && prop.isReference) {
          context.addReference({
            element: instance,
            property: prop.ns.name,
            id: value
          });
        } else {
          if (prop) {
            value = coerceType(prop.type, value);
          }

          instance.set(name, value);
        }
      });

      return instance;
    };

    ElementHandler.prototype.getPropertyForNode = function (node) {

      var nameNs = parseNameNs(node.local, node.prefix);

      var type = this.type,
        model = this.model,
        descriptor = type.$descriptor;

      var propertyName = nameNs.name,
        property = descriptor.propertiesByName[propertyName],
        elementTypeName,
        elementType,
        typeAnnotation;

      // search for properties by name first

      if (property) {

        if (serializeAsType(property)) {
          typeAnnotation = node.attributes[XSI_TYPE];

          // xsi type is optional, if it does not exists the
          // default type is assumed
          if (typeAnnotation) {

            elementTypeName = typeAnnotation.value;

            // TODO: extract real name from attribute
            elementType = model.getType(elementTypeName);

            return assign({}, property, {effectiveType: elementType.$descriptor.name});
          }
        }

        // search for properties by name first
        return property;
      }


      var pkg = model.getPackage(nameNs.prefix);

      if (pkg) {
        elementTypeName = nameNs.prefix + ':' + aliasToName(nameNs.localName, descriptor.$pkg);
        elementType = model.getType(elementTypeName);

        // search for collection members later
        property = find(descriptor.properties, function (p) {
          return !p.isVirtual && !p.isReference && !p.isAttribute && elementType.hasType(p.type);
        });

        if (property) {
          return assign({}, property, {effectiveType: elementType.$descriptor.name});
        }
      } else {
        // parse unknown element (maybe extension)
        property = find(descriptor.properties, function (p) {
          return !p.isReference && !p.isAttribute && p.type === 'Element';
        });

        if (property) {
          return property;
        }
      }

      throw new Error('unrecognized element <' + nameNs.name + '>');
    };

    ElementHandler.prototype.toString = function () {
      return 'ElementDescriptor[' + this.type.$descriptor.name + ']';
    };

    ElementHandler.prototype.valueHandler = function (propertyDesc, element) {
      return new ValueHandler(propertyDesc, element);
    };

    ElementHandler.prototype.referenceHandler = function (propertyDesc) {
      return new ReferenceHandler(propertyDesc, this.context);
    };

    ElementHandler.prototype.handler = function (type) {
      if (type === 'Element') {
        return new GenericElementHandler(this.model, type, this.context);
      } else {
        return new ElementHandler(this.model, type, this.context);
      }
    };

    /**
     * Handle the child element parsing
     *
     * @param  {Element} node the xml node
     */
    ElementHandler.prototype.handleChild = function (node) {
      var propertyDesc, type, element, childHandler;

      propertyDesc = this.getPropertyForNode(node);
      element = this.element;

      type = propertyDesc.effectiveType || propertyDesc.type;

      if (isSimpleType(type)) {
        return this.valueHandler(propertyDesc, element);
      }

      if (propertyDesc.isReference) {
        childHandler = this.referenceHandler(propertyDesc).handleNode(node);
      } else {
        childHandler = this.handler(type).handleNode(node);
      }

      var newElement = childHandler.element;

      // child handles may decide to skip elements
      // by not returning anything
      if (newElement !== undefined) {

        if (propertyDesc.isMany) {
          element.get(propertyDesc.name).push(newElement);
        } else {
          element.set(propertyDesc.name, newElement);
        }

        if (propertyDesc.isReference) {
          assign(newElement, {
            element: element
          });

          this.context.addReference(newElement);
        } else {
          // establish child -> parent relationship
          newElement.$parent = element;
        }
      }

      return childHandler;
    };


    function GenericElementHandler(model, type, context) {
      this.model = model;
      this.context = context;
    }

    GenericElementHandler.prototype = Object.create(BaseElementHandler.prototype);

    GenericElementHandler.prototype.createElement = function (node) {

      var name = node.name,
        prefix = node.prefix,
        uri = node.ns[prefix],
        attributes = node.attributes;

      return this.model.createAny(name, uri, attributes);
    };

    GenericElementHandler.prototype.handleChild = function (node) {

      var handler = new GenericElementHandler(this.model, 'Element', this.context).handleNode(node),
        element = this.element;

      var newElement = handler.element,
        children;

      if (newElement !== undefined) {
        children = element.$children = element.$children || [];
        children.push(newElement);

        // establish child -> parent relationship
        newElement.$parent = element;
      }

      return handler;
    };

    GenericElementHandler.prototype.handleText = function (text) {
      this.body = this.body || '' + text;
    };

    GenericElementHandler.prototype.handleEnd = function () {
      if (this.body) {
        this.element.$body = this.body;
      }
    };

    /**
     * A reader for a meta-model
     *
     * @param {Object} options
     * @param {Model} options.model used to read xml files
     * @param {Boolean} options.lax whether to make parse errors warnings
     */
    function XMLReader(options) {

      if (options instanceof Moddle) {
        options = {
          model: options
        };
      }

      assign(this, {lax: false}, options);
    }


    XMLReader.prototype.fromXML = function (xml, rootHandler, done) {

      var model = this.model,
        lax = this.lax,
        context = new Context({
          parseRoot: rootHandler
        });

      var parser = new SaxParser(true, {xmlns: true, trim: true}),
        stack = new Stack();

      rootHandler.context = context;

      // push root handler
      stack.push(rootHandler);


      function resolveReferences() {

        var elementsById = context.elementsById;
        var references = context.references;

        var i, r;

        for (i = 0; !!(r = references[i]); i++) {
          var element = r.element;
          var reference = elementsById[r.id];
          var property = element.$descriptor.propertiesByName[r.property];

          if (!reference) {
            context.addWarning({
              message: 'unresolved reference <' + r.id + '>',
              element: r.element,
              property: r.property,
              value: r.id
            });
          }

          if (property.isMany) {
            var collection = element.get(property.name),
              idx = collection.indexOf(r);

            if (!reference) {
              // remove unresolvable reference
              collection.splice(idx, 1);
            } else {
              // update reference
              collection[idx] = reference;
            }
          } else {
            element.set(property.name, reference);
          }
        }
      }

      function handleClose(tagName) {
        stack.pop().handleEnd();
      }

      function handleOpen(node) {
        var handler = stack.peek();

        normalizeNamespaces(node, model);

        try {
          stack.push(handler.handleNode(node));
        } catch (e) {

          var line = this.line,
            column = this.column;

          var message =
            'unparsable content <' + node.name + '> detected\n\t' +
            'line: ' + line + '\n\t' +
            'column: ' + column + '\n\t' +
            'nested error: ' + e.message;

          if (lax) {
            context.addWarning({
              message: message,
              error: e
            });

            console.warn('could not parse node');
            console.warn(e);

            stack.push(new NoopHandler());
          } else {
            console.error('could not parse document');
            console.error(e);

            throw new Error(message);
          }
        }
      }

      function handleText(text) {
        stack.peek().handleText(text);
      }

      parser.onopentag = handleOpen;
      parser.oncdata = parser.ontext = handleText;
      parser.onclosetag = handleClose;
      parser.onend = resolveReferences;

      // deferred parse XML to make loading really ascnchronous
      // this ensures the execution environment (node or browser)
      // is kept responsive and that certain optimization strategies
      // can kick in
      defer(function () {
        var error;

        try {
          parser.write(xml).close();
        } catch (e) {
          error = e;
        }

        done(error, error ? undefined : rootHandler.element, context);
      });
    };

    XMLReader.prototype.handler = function (name) {
      return new ElementHandler(this.model, name);
    };

    module.exports = XMLReader;
    module.exports.ElementHandler = ElementHandler;
  }, {
    "./common": 37,
    "lodash/collection/find": 129,
    "lodash/collection/forEach": 130,
    "lodash/collection/reduce": 133,
    "lodash/function/defer": 135,
    "lodash/object/assign": 219,
    "moddle": 42,
    "moddle/lib/ns": 47,
    "moddle/lib/types": 50,
    "sax": 40,
    "tiny-stack": 41
  }],
  39: [function (require, module, exports) {
    'use strict';

    var map = require('lodash/collection/map'),
      forEach = require('lodash/collection/forEach'),
      isString = require('lodash/lang/isString'),
      filter = require('lodash/collection/filter'),
      assign = require('lodash/object/assign');

    var Types = require('moddle/lib/types'),
      parseNameNs = require('moddle/lib/ns').parseName,
      common = require('./common'),
      nameToAlias = common.nameToAlias,
      serializeAsType = common.serializeAsType,
      serializeAsProperty = common.serializeAsProperty;

    var XML_PREAMBLE = '<?xml version="1.0" encoding="UTF-8"?>\n',
      ESCAPE_CHARS = /(<|>|'|"|&|\n\r|\n)/g,
      DEFAULT_NS_MAP = common.DEFAULT_NS_MAP,
      XSI_TYPE = common.XSI_TYPE;


    function nsName(ns) {
      if (isString(ns)) {
        return ns;
      } else {
        return (ns.prefix ? ns.prefix + ':' : '') + ns.localName;
      }
    }

    function getElementNs(ns, descriptor) {
      if (descriptor.isGeneric) {
        return descriptor.name;
      } else {
        return assign({localName: nameToAlias(descriptor.ns.localName, descriptor.$pkg)}, ns);
      }
    }

    function getPropertyNs(ns, descriptor) {
      return assign({localName: descriptor.ns.localName}, ns);
    }

    function getSerializableProperties(element) {
      var descriptor = element.$descriptor;

      return filter(descriptor.properties, function (p) {
        var name = p.name;

        // do not serialize defaults
        if (!element.hasOwnProperty(name)) {
          return false;
        }

        var value = element[name];

        // do not serialize default equals
        if (value === p.default) {
          return false;
        }

        return p.isMany ? value.length : true;
      });
    }

    var ESCAPE_MAP = {
      '\n': '10',
      '\n\r': '10',
      '"': '34',
      '\'': '39',
      '<': '60',
      '>': '62',
      '&': '38'
    };

    /**
     * Escape a string attribute to not contain any bad values (line breaks, '"', ...)
     *
     * @param {String} str the string to escape
     * @return {String} the escaped string
     */
    function escapeAttr(str) {

      // ensure we are handling strings here
      str = isString(str) ? str : '' + str;

      return str.replace(ESCAPE_CHARS, function (str) {
        return '&#' + ESCAPE_MAP[str] + ';';
      });
    }

    function filterAttributes(props) {
      return filter(props, function (p) {
        return p.isAttr;
      });
    }

    function filterContained(props) {
      return filter(props, function (p) {
        return !p.isAttr;
      });
    }


    function ReferenceSerializer(parent, ns) {
      this.ns = ns;
    }

    ReferenceSerializer.prototype.build = function (element) {
      this.element = element;
      return this;
    };

    ReferenceSerializer.prototype.serializeTo = function (writer) {
      writer
        .appendIndent()
        .append('<' + nsName(this.ns) + '>' + this.element.id + '</' + nsName(this.ns) + '>')
        .appendNewLine();
    };

    function BodySerializer() {
    }

    BodySerializer.prototype.serializeValue = BodySerializer.prototype.serializeTo = function (writer) {
      var escape = this.escape;

      if (escape) {
        writer.append('<![CDATA[');
      }

      writer.append(this.value);

      if (escape) {
        writer.append(']]>');
      }
    };

    BodySerializer.prototype.build = function (prop, value) {
      this.value = value;

      if (prop.type === 'String' && ESCAPE_CHARS.test(value)) {
        this.escape = true;
      }

      return this;
    };

    function ValueSerializer(ns) {
      this.ns = ns;
    }

    ValueSerializer.prototype = new BodySerializer();

    ValueSerializer.prototype.serializeTo = function (writer) {

      writer
        .appendIndent()
        .append('<' + nsName(this.ns) + '>');

      this.serializeValue(writer);

      writer
        .append('</' + nsName(this.ns) + '>')
        .appendNewLine();
    };

    function ElementSerializer(parent, ns) {
      this.body = [];
      this.attrs = [];

      this.parent = parent;
      this.ns = ns;
    }

    ElementSerializer.prototype.build = function (element) {
      this.element = element;

      var otherAttrs = this.parseNsAttributes(element);

      if (!this.ns) {
        this.ns = this.nsTagName(element.$descriptor);
      }

      if (element.$descriptor.isGeneric) {
        this.parseGeneric(element);
      } else {
        var properties = getSerializableProperties(element);

        this.parseAttributes(filterAttributes(properties));
        this.parseContainments(filterContained(properties));

        this.parseGenericAttributes(element, otherAttrs);
      }

      return this;
    };

    ElementSerializer.prototype.nsTagName = function (descriptor) {
      var effectiveNs = this.logNamespaceUsed(descriptor.ns);
      return getElementNs(effectiveNs, descriptor);
    };

    ElementSerializer.prototype.nsPropertyTagName = function (descriptor) {
      var effectiveNs = this.logNamespaceUsed(descriptor.ns);
      return getPropertyNs(effectiveNs, descriptor);
    };

    ElementSerializer.prototype.isLocalNs = function (ns) {
      return ns.uri === this.ns.uri;
    };

    ElementSerializer.prototype.nsAttributeName = function (element) {

      var ns;

      if (isString(element)) {
        ns = parseNameNs(element);
      } else if (element.ns) {
        ns = element.ns;
      }

      var effectiveNs = this.logNamespaceUsed(ns);

      // strip prefix if same namespace like parent
      if (this.isLocalNs(effectiveNs)) {
        return {localName: ns.localName};
      } else {
        return assign({localName: ns.localName}, effectiveNs);
      }
    };

    ElementSerializer.prototype.parseGeneric = function (element) {

      var self = this,
        body = this.body,
        attrs = this.attrs;

      forEach(element, function (val, key) {

        if (key === '$body') {
          body.push(new BodySerializer().build({type: 'String'}, val));
        } else if (key === '$children') {
          forEach(val, function (child) {
            body.push(new ElementSerializer(self).build(child));
          });
        } else if (key.indexOf('$') !== 0) {
          attrs.push({name: key, value: escapeAttr(val)});
        }
      });
    };

    /**
     * Parse namespaces and return a list of left over generic attributes
     *
     * @param  {Object} element
     * @return {Array<Object>}
     */
    ElementSerializer.prototype.parseNsAttributes = function (element) {
      var self = this;

      var genericAttrs = element.$attrs;

      var attributes = [];

      // parse namespace attributes first
      // and log them. push non namespace attributes to a list
      // and process them later
      forEach(genericAttrs, function (value, name) {
        var nameNs = parseNameNs(name);

        if (nameNs.prefix === 'xmlns') {
          self.logNamespace({prefix: nameNs.localName, uri: value});
        } else if (!nameNs.prefix && nameNs.localName === 'xmlns') {
          self.logNamespace({uri: value});
        } else {
          attributes.push({name: name, value: value});
        }
      });

      return attributes;
    };

    ElementSerializer.prototype.parseGenericAttributes = function (element, attributes) {

      var self = this;

      forEach(attributes, function (attr) {

        // do not serialize xsi:type attribute
        // it is set manually based on the actual implementation type
        if (attr.name === XSI_TYPE) {
          return;
        }

        try {
          self.addAttribute(self.nsAttributeName(attr.name), attr.value);
        } catch (e) {
          console.warn('[writer] missing namespace information for ', attr.name, '=', attr.value, 'on', element, e);
        }
      });
    };

    ElementSerializer.prototype.parseContainments = function (properties) {

      var self = this,
        body = this.body,
        element = this.element;

      forEach(properties, function (p) {
        var value = element.get(p.name),
          isReference = p.isReference,
          isMany = p.isMany;

        var ns = self.nsPropertyTagName(p);

        if (!isMany) {
          value = [value];
        }

        if (p.isBody) {
          body.push(new BodySerializer().build(p, value[0]));
        } else if (Types.isSimple(p.type)) {
          forEach(value, function (v) {
            body.push(new ValueSerializer(ns).build(p, v));
          });
        } else if (isReference) {
          forEach(value, function (v) {
            body.push(new ReferenceSerializer(self, ns).build(v));
          });
        } else {
          // allow serialization via type
          // rather than element name
          var asType = serializeAsType(p),
            asProperty = serializeAsProperty(p);

          forEach(value, function (v) {
            var serializer;

            if (asType) {
              serializer = new TypeSerializer(self, ns);
            } else if (asProperty) {
              serializer = new ElementSerializer(self, ns);
            } else {
              serializer = new ElementSerializer(self);
            }

            body.push(serializer.build(v));
          });
        }
      });
    };

    ElementSerializer.prototype.getNamespaces = function () {
      if (!this.parent) {
        if (!this.namespaces) {
          this.namespaces = {
            prefixMap: {},
            uriMap: {},
            used: {}
          };
        }
      } else {
        this.namespaces = this.parent.getNamespaces();
      }

      return this.namespaces;
    };

    ElementSerializer.prototype.logNamespace = function (ns) {
      var namespaces = this.getNamespaces();

      var existing = namespaces.uriMap[ns.uri];

      if (!existing) {
        namespaces.uriMap[ns.uri] = ns;
      }

      namespaces.prefixMap[ns.prefix] = ns.uri;

      return ns;
    };

    ElementSerializer.prototype.logNamespaceUsed = function (ns) {
      var element = this.element,
        model = element.$model,
        namespaces = this.getNamespaces();

      // ns may be
      //
      //   * prefix only
      //   * prefix:uri

      var prefix = ns.prefix;
      var uri = ns.uri || DEFAULT_NS_MAP[prefix] ||
        namespaces.prefixMap[prefix] || (model ? (model.getPackage(prefix) || {}).uri : null);

      if (!uri) {
        throw new Error('no namespace uri given for prefix <' + ns.prefix + '>');
      }

      ns = namespaces.uriMap[uri];

      if (!ns) {
        ns = this.logNamespace({prefix: prefix, uri: uri});
      }

      if (!namespaces.used[ns.uri]) {
        namespaces.used[ns.uri] = ns;
      }

      return ns;
    };

    ElementSerializer.prototype.parseAttributes = function (properties) {
      var self = this,
        element = this.element;

      forEach(properties, function (p) {
        self.logNamespaceUsed(p.ns);

        var value = element.get(p.name);

        if (p.isReference) {
          value = value.id;
        }

        self.addAttribute(self.nsAttributeName(p), value);
      });
    };

    ElementSerializer.prototype.addAttribute = function (name, value) {
      var attrs = this.attrs;

      if (isString(value)) {
        value = escapeAttr(value);
      }

      attrs.push({name: name, value: value});
    };

    ElementSerializer.prototype.serializeAttributes = function (writer) {
      var attrs = this.attrs,
        root = !this.parent,
        namespaces = this.namespaces;

      function collectNsAttrs() {
        return map(namespaces.used, function (ns) {
          var name = 'xmlns' + (ns.prefix ? ':' + ns.prefix : '');
          return {name: name, value: ns.uri};
        });
      }

      if (root) {
        attrs = collectNsAttrs().concat(attrs);
      }

      forEach(attrs, function (a) {
        writer
          .append(' ')
          .append(nsName(a.name)).append('="').append(a.value).append('"');
      });
    };

    ElementSerializer.prototype.serializeTo = function (writer) {
      var hasBody = this.body.length,
        indent = !(this.body.length === 1 && this.body[0] instanceof BodySerializer);

      writer
        .appendIndent()
        .append('<' + nsName(this.ns));

      this.serializeAttributes(writer);

      writer.append(hasBody ? '>' : ' />');

      if (hasBody) {

        if (indent) {
          writer
            .appendNewLine()
            .indent();
        }

        forEach(this.body, function (b) {
          b.serializeTo(writer);
        });

        if (indent) {
          writer
            .unindent()
            .appendIndent();
        }

        writer.append('</' + nsName(this.ns) + '>');
      }

      writer.appendNewLine();
    };

    /**
     * A serializer for types that handles serialization of data types
     */
    function TypeSerializer(parent, ns) {
      ElementSerializer.call(this, parent, ns);
    }

    TypeSerializer.prototype = new ElementSerializer();

    TypeSerializer.prototype.build = function (element) {
      var descriptor = element.$descriptor;

      this.element = element;

      this.typeNs = this.nsTagName(descriptor);

      // add xsi:type attribute to represent the elements
      // actual type

      var typeNs = this.typeNs,
        pkg = element.$model.getPackage(typeNs.uri),
        typePrefix = (pkg.xml && pkg.xml.typePrefix) || '';

      this.addAttribute(this.nsAttributeName(XSI_TYPE),
        (typeNs.prefix ? typeNs.prefix + ':' : '') +
        typePrefix + descriptor.ns.localName);

      // do the usual stuff
      return ElementSerializer.prototype.build.call(this, element);
    };

    TypeSerializer.prototype.isLocalNs = function (ns) {
      return ns.uri === this.typeNs.uri;
    };

    function SavingWriter() {
      this.value = '';

      this.write = function (str) {
        this.value += str;
      };
    }

    function FormatingWriter(out, format) {

      var indent = [''];

      this.append = function (str) {
        out.write(str);

        return this;
      };

      this.appendNewLine = function () {
        if (format) {
          out.write('\n');
        }

        return this;
      };

      this.appendIndent = function () {
        if (format) {
          out.write(indent.join('  '));
        }

        return this;
      };

      this.indent = function () {
        indent.push('');
        return this;
      };

      this.unindent = function () {
        indent.pop();
        return this;
      };
    }

    /**
     * A writer for meta-model backed document trees
     *
     * @param {Object} options output options to pass into the writer
     */
    function XMLWriter(options) {

      options = assign({format: false, preamble: true}, options || {});

      function toXML(tree, writer) {
        var internalWriter = writer || new SavingWriter();
        var formatingWriter = new FormatingWriter(internalWriter, options.format);

        if (options.preamble) {
          formatingWriter.append(XML_PREAMBLE);
        }

        new ElementSerializer().build(tree).serializeTo(formatingWriter);

        if (!writer) {
          return internalWriter.value;
        }
      }

      return {
        toXML: toXML
      };
    }

    module.exports = XMLWriter;

  }, {
    "./common": 37,
    "lodash/collection/filter": 128,
    "lodash/collection/forEach": 130,
    "lodash/collection/map": 132,
    "lodash/lang/isString": 217,
    "lodash/object/assign": 219,
    "moddle/lib/ns": 47,
    "moddle/lib/types": 50
  }],
  40: [function (require, module, exports) {
    (function (Buffer) {
// wrapper for non-node envs
      ;
      (function (sax) {

        sax.parser = function (strict, opt) {
          return new SAXParser(strict, opt)
        }
        sax.SAXParser = SAXParser
        sax.SAXStream = SAXStream
        sax.createStream = createStream

// When we pass the MAX_BUFFER_LENGTH position, start checking for buffer overruns.
// When we check, schedule the next check for MAX_BUFFER_LENGTH - (max(buffer lengths)),
// since that's the earliest that a buffer overrun could occur.  This way, checks are
// as rare as required, but as often as necessary to ensure never crossing this bound.
// Furthermore, buffers are only tested at most once per write(), so passing a very
// large string into write() might have undesirable effects, but this is manageable by
// the caller, so it is assumed to be safe.  Thus, a call to write() may, in the extreme
// edge case, result in creating at most one complete copy of the string passed in.
// Set to Infinity to have unlimited buffers.
        sax.MAX_BUFFER_LENGTH = 64 * 1024

        var buffers = [
          "comment", "sgmlDecl", "textNode", "tagName", "doctype",
          "procInstName", "procInstBody", "entity", "attribName",
          "attribValue", "cdata", "script"
        ]

        sax.EVENTS = // for discoverability.
          ["text"
            , "processinginstruction"
            , "sgmldeclaration"
            , "doctype"
            , "comment"
            , "attribute"
            , "opentag"
            , "closetag"
            , "opencdata"
            , "cdata"
            , "closecdata"
            , "error"
            , "end"
            , "ready"
            , "script"
            , "opennamespace"
            , "closenamespace"
          ]

        function SAXParser(strict, opt) {
          if (!(this instanceof SAXParser)) return new SAXParser(strict, opt)

          var parser = this
          clearBuffers(parser)
          parser.q = parser.c = ""
          parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH
          parser.opt = opt || {}
          parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags
          parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase"
          parser.tags = []
          parser.closed = parser.closedRoot = parser.sawRoot = false
          parser.tag = parser.error = null
          parser.strict = !!strict
          parser.noscript = !!(strict || parser.opt.noscript)
          parser.state = S.BEGIN
          parser.ENTITIES = Object.create(sax.ENTITIES)
          parser.attribList = []

          // namespaces form a prototype chain.
          // it always points at the current tag,
          // which protos to its parent tag.
          if (parser.opt.xmlns) parser.ns = Object.create(rootNS)

          // mostly just for error reporting
          parser.trackPosition = parser.opt.position !== false
          if (parser.trackPosition) {
            parser.position = parser.line = parser.column = 0
          }
          emit(parser, "onready")
        }

        if (!Object.create) Object.create = function (o) {
          function f() {
            this.__proto__ = o
          }

          f.prototype = o
          return new f
        }

        if (!Object.getPrototypeOf) Object.getPrototypeOf = function (o) {
          return o.__proto__
        }

        if (!Object.keys) Object.keys = function (o) {
          var a = []
          for (var i in o) if (o.hasOwnProperty(i)) a.push(i)
          return a
        }

        function checkBufferLength(parser) {
          var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10)
            , maxActual = 0
          for (var i = 0, l = buffers.length; i < l; i++) {
            var len = parser[buffers[i]].length
            if (len > maxAllowed) {
              // Text/cdata nodes can get big, and since they're buffered,
              // we can get here under normal conditions.
              // Avoid issues by emitting the text node now,
              // so at least it won't get any bigger.
              switch (buffers[i]) {
                case "textNode":
                  closeText(parser)
                  break

                case "cdata":
                  emitNode(parser, "oncdata", parser.cdata)
                  parser.cdata = ""
                  break

                case "script":
                  emitNode(parser, "onscript", parser.script)
                  parser.script = ""
                  break

                default:
                  error(parser, "Max buffer length exceeded: " + buffers[i])
              }
            }
            maxActual = Math.max(maxActual, len)
          }
          // schedule the next check for the earliest possible buffer overrun.
          parser.bufferCheckPosition = (sax.MAX_BUFFER_LENGTH - maxActual)
            + parser.position
        }

        function clearBuffers(parser) {
          for (var i = 0, l = buffers.length; i < l; i++) {
            parser[buffers[i]] = ""
          }
        }

        function flushBuffers(parser) {
          closeText(parser)
          if (parser.cdata !== "") {
            emitNode(parser, "oncdata", parser.cdata)
            parser.cdata = ""
          }
          if (parser.script !== "") {
            emitNode(parser, "onscript", parser.script)
            parser.script = ""
          }
        }

        SAXParser.prototype =
        {
          end: function () {
            end(this)
          }
          , write: write
          , resume: function () {
          this.error = null;
          return this
        }
          , close: function () {
          return this.write(null)
        }
          , flush: function () {
          flushBuffers(this)
        }
        }

        try {
          var Stream = require("stream").Stream
        } catch (ex) {
          var Stream = function () {
          }
        }


        var streamWraps = sax.EVENTS.filter(function (ev) {
          return ev !== "error" && ev !== "end"
        })

        function createStream(strict, opt) {
          return new SAXStream(strict, opt)
        }

        function SAXStream(strict, opt) {
          if (!(this instanceof SAXStream)) return new SAXStream(strict, opt)

          Stream.apply(this)

          this._parser = new SAXParser(strict, opt)
          this.writable = true
          this.readable = true


          var me = this

          this._parser.onend = function () {
            me.emit("end")
          }

          this._parser.onerror = function (er) {
            me.emit("error", er)

            // if didn't throw, then means error was handled.
            // go ahead and clear error, so we can write again.
            me._parser.error = null
          }

          this._decoder = null;

          streamWraps.forEach(function (ev) {
            Object.defineProperty(me, "on" + ev, {
              get: function () {
                return me._parser["on" + ev]
              },
              set: function (h) {
                if (!h) {
                  me.removeAllListeners(ev)
                  return me._parser["on" + ev] = h
                }
                me.on(ev, h)
              },
              enumerable: true,
              configurable: false
            })
          })
        }

        SAXStream.prototype = Object.create(Stream.prototype,
          {constructor: {value: SAXStream}})

        SAXStream.prototype.write = function (data) {
          if (typeof Buffer === 'function' &&
            typeof Buffer.isBuffer === 'function' &&
            Buffer.isBuffer(data)) {
            if (!this._decoder) {
              var SD = require('string_decoder').StringDecoder
              this._decoder = new SD('utf8')
            }
            data = this._decoder.write(data);
          }

          this._parser.write(data.toString())
          this.emit("data", data)
          return true
        }

        SAXStream.prototype.end = function (chunk) {
          if (chunk && chunk.length) this.write(chunk)
          this._parser.end()
          return true
        }

        SAXStream.prototype.on = function (ev, handler) {
          var me = this
          if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
            me._parser["on" + ev] = function () {
              var args = arguments.length === 1 ? [arguments[0]]
                : Array.apply(null, arguments)
              args.splice(0, 0, ev)
              me.emit.apply(me, args)
            }
          }

          return Stream.prototype.on.call(me, ev, handler)
        }


// character classes and tokens
        var whitespace = "\r\n\t "
        // this really needs to be replaced with character classes.
        // XML allows all manner of ridiculous numbers and digits.
          , number = "0124356789"
          , letter = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        // (Letter | "_" | ":")
          , quote = "'\""
          , entity = number + letter + "#"
          , attribEnd = whitespace + ">"
          , CDATA = "[CDATA["
          , DOCTYPE = "DOCTYPE"
          , XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace"
          , XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/"
          , rootNS = {xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE}

// turn all the string character sets into character class objects.
        whitespace = charClass(whitespace)
        number = charClass(number)
        letter = charClass(letter)

// http://www.w3.org/TR/REC-xml/#NT-NameStartChar
// This implementation works on strings, a single character at a time
// as such, it cannot ever support astral-plane characters (10000-EFFFF)
// without a significant breaking change to either this  parser, or the
// JavaScript language.  Implementation of an emoji-capable xml parser
// is left as an exercise for the reader.
        var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/

        var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040\.\d-]/

        quote = charClass(quote)
        entity = charClass(entity)
        attribEnd = charClass(attribEnd)

        function charClass(str) {
          return str.split("").reduce(function (s, c) {
            s[c] = true
            return s
          }, {})
        }

        function isRegExp(c) {
          return Object.prototype.toString.call(c) === '[object RegExp]'
        }

        function is(charclass, c) {
          return isRegExp(charclass) ? !!c.match(charclass) : charclass[c]
        }

        function not(charclass, c) {
          return !is(charclass, c)
        }

        var S = 0
        sax.STATE =
        {
          BEGIN: S++
          , TEXT: S++ // general stuff
          , TEXT_ENTITY: S++ // &amp and such.
          , OPEN_WAKA: S++ // <
          , SGML_DECL: S++ // <!BLARG
          , SGML_DECL_QUOTED: S++ // <!BLARG foo "bar
          , DOCTYPE: S++ // <!DOCTYPE
          , DOCTYPE_QUOTED: S++ // <!DOCTYPE "//blah
          , DOCTYPE_DTD: S++ // <!DOCTYPE "//blah" [ ...
          , DOCTYPE_DTD_QUOTED: S++ // <!DOCTYPE "//blah" [ "foo
          , COMMENT_STARTING: S++ // <!-
          , COMMENT: S++ // <!--
          , COMMENT_ENDING: S++ // <!-- blah -
          , COMMENT_ENDED: S++ // <!-- blah --
          , CDATA: S++ // <![CDATA[ something
          , CDATA_ENDING: S++ // ]
          , CDATA_ENDING_2: S++ // ]]
          , PROC_INST: S++ // <?hi
          , PROC_INST_BODY: S++ // <?hi there
          , PROC_INST_ENDING: S++ // <?hi "there" ?
          , OPEN_TAG: S++ // <strong
          , OPEN_TAG_SLASH: S++ // <strong /
          , ATTRIB: S++ // <a
          , ATTRIB_NAME: S++ // <a foo
          , ATTRIB_NAME_SAW_WHITE: S++ // <a foo _
          , ATTRIB_VALUE: S++ // <a foo=
          , ATTRIB_VALUE_QUOTED: S++ // <a foo="bar
          , ATTRIB_VALUE_CLOSED: S++ // <a foo="bar"
          , ATTRIB_VALUE_UNQUOTED: S++ // <a foo=bar
          , ATTRIB_VALUE_ENTITY_Q: S++ // <foo bar="&quot;"
          , ATTRIB_VALUE_ENTITY_U: S++ // <foo bar=&quot;
          , CLOSE_TAG: S++ // </a
          , CLOSE_TAG_SAW_WHITE: S++ // </a   >
          , SCRIPT: S++ // <script> ...
          , SCRIPT_ENDING: S++ // <script> ... <
        }

        sax.ENTITIES =
        {
          "amp": "&"
          , "gt": ">"
          , "lt": "<"
          , "quot": "\""
          , "apos": "'"
          , "AElig": 198
          , "Aacute": 193
          , "Acirc": 194
          , "Agrave": 192
          , "Aring": 197
          , "Atilde": 195
          , "Auml": 196
          , "Ccedil": 199
          , "ETH": 208
          , "Eacute": 201
          , "Ecirc": 202
          , "Egrave": 200
          , "Euml": 203
          , "Iacute": 205
          , "Icirc": 206
          , "Igrave": 204
          , "Iuml": 207
          , "Ntilde": 209
          , "Oacute": 211
          , "Ocirc": 212
          , "Ograve": 210
          , "Oslash": 216
          , "Otilde": 213
          , "Ouml": 214
          , "THORN": 222
          , "Uacute": 218
          , "Ucirc": 219
          , "Ugrave": 217
          , "Uuml": 220
          , "Yacute": 221
          , "aacute": 225
          , "acirc": 226
          , "aelig": 230
          , "agrave": 224
          , "aring": 229
          , "atilde": 227
          , "auml": 228
          , "ccedil": 231
          , "eacute": 233
          , "ecirc": 234
          , "egrave": 232
          , "eth": 240
          , "euml": 235
          , "iacute": 237
          , "icirc": 238
          , "igrave": 236
          , "iuml": 239
          , "ntilde": 241
          , "oacute": 243
          , "ocirc": 244
          , "ograve": 242
          , "oslash": 248
          , "otilde": 245
          , "ouml": 246
          , "szlig": 223
          , "thorn": 254
          , "uacute": 250
          , "ucirc": 251
          , "ugrave": 249
          , "uuml": 252
          , "yacute": 253
          , "yuml": 255
          , "copy": 169
          , "reg": 174
          , "nbsp": 160
          , "iexcl": 161
          , "cent": 162
          , "pound": 163
          , "curren": 164
          , "yen": 165
          , "brvbar": 166
          , "sect": 167
          , "uml": 168
          , "ordf": 170
          , "laquo": 171
          , "not": 172
          , "shy": 173
          , "macr": 175
          , "deg": 176
          , "plusmn": 177
          , "sup1": 185
          , "sup2": 178
          , "sup3": 179
          , "acute": 180
          , "micro": 181
          , "para": 182
          , "middot": 183
          , "cedil": 184
          , "ordm": 186
          , "raquo": 187
          , "frac14": 188
          , "frac12": 189
          , "frac34": 190
          , "iquest": 191
          , "times": 215
          , "divide": 247
          , "OElig": 338
          , "oelig": 339
          , "Scaron": 352
          , "scaron": 353
          , "Yuml": 376
          , "fnof": 402
          , "circ": 710
          , "tilde": 732
          , "Alpha": 913
          , "Beta": 914
          , "Gamma": 915
          , "Delta": 916
          , "Epsilon": 917
          , "Zeta": 918
          , "Eta": 919
          , "Theta": 920
          , "Iota": 921
          , "Kappa": 922
          , "Lambda": 923
          , "Mu": 924
          , "Nu": 925
          , "Xi": 926
          , "Omicron": 927
          , "Pi": 928
          , "Rho": 929
          , "Sigma": 931
          , "Tau": 932
          , "Upsilon": 933
          , "Phi": 934
          , "Chi": 935
          , "Psi": 936
          , "Omega": 937
          , "alpha": 945
          , "beta": 946
          , "gamma": 947
          , "delta": 948
          , "epsilon": 949
          , "zeta": 950
          , "eta": 951
          , "theta": 952
          , "iota": 953
          , "kappa": 954
          , "lambda": 955
          , "mu": 956
          , "nu": 957
          , "xi": 958
          , "omicron": 959
          , "pi": 960
          , "rho": 961
          , "sigmaf": 962
          , "sigma": 963
          , "tau": 964
          , "upsilon": 965
          , "phi": 966
          , "chi": 967
          , "psi": 968
          , "omega": 969
          , "thetasym": 977
          , "upsih": 978
          , "piv": 982
          , "ensp": 8194
          , "emsp": 8195
          , "thinsp": 8201
          , "zwnj": 8204
          , "zwj": 8205
          , "lrm": 8206
          , "rlm": 8207
          , "ndash": 8211
          , "mdash": 8212
          , "lsquo": 8216
          , "rsquo": 8217
          , "sbquo": 8218
          , "ldquo": 8220
          , "rdquo": 8221
          , "bdquo": 8222
          , "dagger": 8224
          , "Dagger": 8225
          , "bull": 8226
          , "hellip": 8230
          , "permil": 8240
          , "prime": 8242
          , "Prime": 8243
          , "lsaquo": 8249
          , "rsaquo": 8250
          , "oline": 8254
          , "frasl": 8260
          , "euro": 8364
          , "image": 8465
          , "weierp": 8472
          , "real": 8476
          , "trade": 8482
          , "alefsym": 8501
          , "larr": 8592
          , "uarr": 8593
          , "rarr": 8594
          , "darr": 8595
          , "harr": 8596
          , "crarr": 8629
          , "lArr": 8656
          , "uArr": 8657
          , "rArr": 8658
          , "dArr": 8659
          , "hArr": 8660
          , "forall": 8704
          , "part": 8706
          , "exist": 8707
          , "empty": 8709
          , "nabla": 8711
          , "isin": 8712
          , "notin": 8713
          , "ni": 8715
          , "prod": 8719
          , "sum": 8721
          , "minus": 8722
          , "lowast": 8727
          , "radic": 8730
          , "prop": 8733
          , "infin": 8734
          , "ang": 8736
          , "and": 8743
          , "or": 8744
          , "cap": 8745
          , "cup": 8746
          , "int": 8747
          , "there4": 8756
          , "sim": 8764
          , "cong": 8773
          , "asymp": 8776
          , "ne": 8800
          , "equiv": 8801
          , "le": 8804
          , "ge": 8805
          , "sub": 8834
          , "sup": 8835
          , "nsub": 8836
          , "sube": 8838
          , "supe": 8839
          , "oplus": 8853
          , "otimes": 8855
          , "perp": 8869
          , "sdot": 8901
          , "lceil": 8968
          , "rceil": 8969
          , "lfloor": 8970
          , "rfloor": 8971
          , "lang": 9001
          , "rang": 9002
          , "loz": 9674
          , "spades": 9824
          , "clubs": 9827
          , "hearts": 9829
          , "diams": 9830
        }

        Object.keys(sax.ENTITIES).forEach(function (key) {
          var e = sax.ENTITIES[key]
          var s = typeof e === 'number' ? String.fromCharCode(e) : e
          sax.ENTITIES[key] = s
        })

        for (var S in sax.STATE) sax.STATE[sax.STATE[S]] = S

// shorthand
        S = sax.STATE

        function emit(parser, event, data) {
          parser[event] && parser[event](data)
        }

        function emitNode(parser, nodeType, data) {
          if (parser.textNode) closeText(parser)
          emit(parser, nodeType, data)
        }

        function closeText(parser) {
          parser.textNode = textopts(parser.opt, parser.textNode)
          if (parser.textNode) emit(parser, "ontext", parser.textNode)
          parser.textNode = ""
        }

        function textopts(opt, text) {
          if (opt.trim) text = text.trim()
          if (opt.normalize) text = text.replace(/\s+/g, " ")
          return text
        }

        function error(parser, er) {
          closeText(parser)
          if (parser.trackPosition) {
            er += "\nLine: " + parser.line +
              "\nColumn: " + parser.column +
              "\nChar: " + parser.c
          }
          er = new Error(er)
          parser.error = er
          emit(parser, "onerror", er)
          return parser
        }

        function end(parser) {
          if (!parser.closedRoot) strictFail(parser, "Unclosed root tag")
          if ((parser.state !== S.BEGIN) && (parser.state !== S.TEXT)) error(parser, "Unexpected end")
          closeText(parser)
          parser.c = ""
          parser.closed = true
          emit(parser, "onend")
          SAXParser.call(parser, parser.strict, parser.opt)
          return parser
        }

        function strictFail(parser, message) {
          if (typeof parser !== 'object' || !(parser instanceof SAXParser))
            throw new Error('bad call to strictFail');
          if (parser.strict) error(parser, message)
        }

        function newTag(parser) {
          if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]()
          var parent = parser.tags[parser.tags.length - 1] || parser
            , tag = parser.tag = {name: parser.tagName, attributes: {}}

          // will be overridden if tag contails an xmlns="foo" or xmlns:foo="bar"
          if (parser.opt.xmlns) tag.ns = parent.ns
          parser.attribList.length = 0
        }

        function qname(name, attribute) {
          var i = name.indexOf(":")
            , qualName = i < 0 ? ["", name] : name.split(":")
            , prefix = qualName[0]
            , local = qualName[1]

          // <x "xmlns"="http://foo">
          if (attribute && name === "xmlns") {
            prefix = "xmlns"
            local = ""
          }

          return {prefix: prefix, local: local}
        }

        function attrib(parser) {
          if (!parser.strict) parser.attribName = parser.attribName[parser.looseCase]()

          if (parser.attribList.indexOf(parser.attribName) !== -1 ||
            parser.tag.attributes.hasOwnProperty(parser.attribName)) {
            return parser.attribName = parser.attribValue = ""
          }

          if (parser.opt.xmlns) {
            var qn = qname(parser.attribName, true)
              , prefix = qn.prefix
              , local = qn.local

            if (prefix === "xmlns") {
              // namespace binding attribute; push the binding into scope
              if (local === "xml" && parser.attribValue !== XML_NAMESPACE) {
                strictFail(parser
                  , "xml: prefix must be bound to " + XML_NAMESPACE + "\n"
                  + "Actual: " + parser.attribValue)
              } else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) {
                strictFail(parser
                  , "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\n"
                  + "Actual: " + parser.attribValue)
              } else {
                var tag = parser.tag
                  , parent = parser.tags[parser.tags.length - 1] || parser
                if (tag.ns === parent.ns) {
                  tag.ns = Object.create(parent.ns)
                }
                tag.ns[local] = parser.attribValue
              }
            }

            // defer onattribute events until all attributes have been seen
            // so any new bindings can take effect; preserve attribute order
            // so deferred events can be emitted in document order
            parser.attribList.push([parser.attribName, parser.attribValue])
          } else {
            // in non-xmlns mode, we can emit the event right away
            parser.tag.attributes[parser.attribName] = parser.attribValue
            emitNode(parser
              , "onattribute"
              , {
                name: parser.attribName
                , value: parser.attribValue
              })
          }

          parser.attribName = parser.attribValue = ""
        }

        function openTag(parser, selfClosing) {
          if (parser.opt.xmlns) {
            // emit namespace binding events
            var tag = parser.tag

            // add namespace info to tag
            var qn = qname(parser.tagName)
            tag.prefix = qn.prefix
            tag.local = qn.local
            tag.uri = tag.ns[qn.prefix] || ""

            if (tag.prefix && !tag.uri) {
              strictFail(parser, "Unbound namespace prefix: "
                + JSON.stringify(parser.tagName))
              tag.uri = qn.prefix
            }

            var parent = parser.tags[parser.tags.length - 1] || parser
            if (tag.ns && parent.ns !== tag.ns) {
              Object.keys(tag.ns).forEach(function (p) {
                emitNode(parser
                  , "onopennamespace"
                  , {prefix: p, uri: tag.ns[p]})
              })
            }

            // handle deferred onattribute events
            // Note: do not apply default ns to attributes:
            //   http://www.w3.org/TR/REC-xml-names/#defaulting
            for (var i = 0, l = parser.attribList.length; i < l; i++) {
              var nv = parser.attribList[i]
              var name = nv[0]
                , value = nv[1]
                , qualName = qname(name, true)
                , prefix = qualName.prefix
                , local = qualName.local
                , uri = prefix == "" ? "" : (tag.ns[prefix] || "")
                , a = {
                  name: name
                  , value: value
                  , prefix: prefix
                  , local: local
                  , uri: uri
                }

              // if there's any attributes with an undefined namespace,
              // then fail on them now.
              if (prefix && prefix != "xmlns" && !uri) {
                strictFail(parser, "Unbound namespace prefix: "
                  + JSON.stringify(prefix))
                a.uri = prefix
              }
              parser.tag.attributes[name] = a
              emitNode(parser, "onattribute", a)
            }
            parser.attribList.length = 0
          }

          parser.tag.isSelfClosing = !!selfClosing

          // process the tag
          parser.sawRoot = true
          parser.tags.push(parser.tag)
          emitNode(parser, "onopentag", parser.tag)
          if (!selfClosing) {
            // special case for <script> in non-strict mode.
            if (!parser.noscript && parser.tagName.toLowerCase() === "script") {
              parser.state = S.SCRIPT
            } else {
              parser.state = S.TEXT
            }
            parser.tag = null
            parser.tagName = ""
          }
          parser.attribName = parser.attribValue = ""
          parser.attribList.length = 0
        }

        function closeTag(parser) {
          if (!parser.tagName) {
            strictFail(parser, "Weird empty close tag.")
            parser.textNode += "</>"
            parser.state = S.TEXT
            return
          }

          if (parser.script) {
            if (parser.tagName !== "script") {
              parser.script += "</" + parser.tagName + ">"
              parser.tagName = ""
              parser.state = S.SCRIPT
              return
            }
            emitNode(parser, "onscript", parser.script)
            parser.script = ""
          }

          // first make sure that the closing tag actually exists.
          // <a><b></c></b></a> will close everything, otherwise.
          var t = parser.tags.length
          var tagName = parser.tagName
          if (!parser.strict) tagName = tagName[parser.looseCase]()
          var closeTo = tagName
          while (t--) {
            var close = parser.tags[t]
            if (close.name !== closeTo) {
              // fail the first time in strict mode
              strictFail(parser, "Unexpected close tag")
            } else break
          }

          // didn't find it.  we already failed for strict, so just abort.
          if (t < 0) {
            strictFail(parser, "Unmatched closing tag: " + parser.tagName)
            parser.textNode += "</" + parser.tagName + ">"
            parser.state = S.TEXT
            return
          }
          parser.tagName = tagName
          var s = parser.tags.length
          while (s-- > t) {
            var tag = parser.tag = parser.tags.pop()
            parser.tagName = parser.tag.name
            emitNode(parser, "onclosetag", parser.tagName)

            var x = {}
            for (var i in tag.ns) x[i] = tag.ns[i]

            var parent = parser.tags[parser.tags.length - 1] || parser
            if (parser.opt.xmlns && tag.ns !== parent.ns) {
              // remove namespace bindings introduced by tag
              Object.keys(tag.ns).forEach(function (p) {
                var n = tag.ns[p]
                emitNode(parser, "onclosenamespace", {prefix: p, uri: n})
              })
            }
          }
          if (t === 0) parser.closedRoot = true
          parser.tagName = parser.attribValue = parser.attribName = ""
          parser.attribList.length = 0
          parser.state = S.TEXT
        }

        function parseEntity(parser) {
          var entity = parser.entity
            , entityLC = entity.toLowerCase()
            , num
            , numStr = ""
          if (parser.ENTITIES[entity])
            return parser.ENTITIES[entity]
          if (parser.ENTITIES[entityLC])
            return parser.ENTITIES[entityLC]
          entity = entityLC
          if (entity.charAt(0) === "#") {
            if (entity.charAt(1) === "x") {
              entity = entity.slice(2)
              num = parseInt(entity, 16)
              numStr = num.toString(16)
            } else {
              entity = entity.slice(1)
              num = parseInt(entity, 10)
              numStr = num.toString(10)
            }
          }
          entity = entity.replace(/^0+/, "")
          if (numStr.toLowerCase() !== entity) {
            strictFail(parser, "Invalid character entity")
            return "&" + parser.entity + ";"
          }

          return String.fromCodePoint(num)
        }

        function write(chunk) {
          var parser = this
          if (this.error) throw this.error
          if (parser.closed) return error(parser,
            "Cannot write after close. Assign an onready handler.")
          if (chunk === null) return end(parser)
          var i = 0, c = ""
          while (parser.c = c = chunk.charAt(i++)) {
            if (parser.trackPosition) {
              parser.position++
              if (c === "\n") {
                parser.line++
                parser.column = 0
              } else parser.column++
            }
            switch (parser.state) {

              case S.BEGIN:
                if (c === "<") {
                  parser.state = S.OPEN_WAKA
                  parser.startTagPosition = parser.position
                } else if (not(whitespace, c)) {
                  // have to process this as a text node.
                  // weird, but happens.
                  strictFail(parser, "Non-whitespace before first tag.")
                  parser.textNode = c
                  parser.state = S.TEXT
                }
                continue

              case S.TEXT:
                if (parser.sawRoot && !parser.closedRoot) {
                  var starti = i - 1
                  while (c && c !== "<" && c !== "&") {
                    c = chunk.charAt(i++)
                    if (c && parser.trackPosition) {
                      parser.position++
                      if (c === "\n") {
                        parser.line++
                        parser.column = 0
                      } else parser.column++
                    }
                  }
                  parser.textNode += chunk.substring(starti, i - 1)
                }
                if (c === "<") {
                  parser.state = S.OPEN_WAKA
                  parser.startTagPosition = parser.position
                } else {
                  if (not(whitespace, c) && (!parser.sawRoot || parser.closedRoot))
                    strictFail(parser, "Text data outside of root node.")
                  if (c === "&") parser.state = S.TEXT_ENTITY
                  else parser.textNode += c
                }
                continue

              case S.SCRIPT:
                // only non-strict
                if (c === "<") {
                  parser.state = S.SCRIPT_ENDING
                } else parser.script += c
                continue

              case S.SCRIPT_ENDING:
                if (c === "/") {
                  parser.state = S.CLOSE_TAG
                } else {
                  parser.script += "<" + c
                  parser.state = S.SCRIPT
                }
                continue

              case S.OPEN_WAKA:
                // either a /, ?, !, or text is coming next.
                if (c === "!") {
                  parser.state = S.SGML_DECL
                  parser.sgmlDecl = ""
                } else if (is(whitespace, c)) {
                  // wait for it...
                } else if (is(nameStart, c)) {
                  parser.state = S.OPEN_TAG
                  parser.tagName = c
                } else if (c === "/") {
                  parser.state = S.CLOSE_TAG
                  parser.tagName = ""
                } else if (c === "?") {
                  parser.state = S.PROC_INST
                  parser.procInstName = parser.procInstBody = ""
                } else {
                  strictFail(parser, "Unencoded <")
                  // if there was some whitespace, then add that in.
                  if (parser.startTagPosition + 1 < parser.position) {
                    var pad = parser.position - parser.startTagPosition
                    c = new Array(pad).join(" ") + c
                  }
                  parser.textNode += "<" + c
                  parser.state = S.TEXT
                }
                continue

              case S.SGML_DECL:
                if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
                  emitNode(parser, "onopencdata")
                  parser.state = S.CDATA
                  parser.sgmlDecl = ""
                  parser.cdata = ""
                } else if (parser.sgmlDecl + c === "--") {
                  parser.state = S.COMMENT
                  parser.comment = ""
                  parser.sgmlDecl = ""
                } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
                  parser.state = S.DOCTYPE
                  if (parser.doctype || parser.sawRoot) strictFail(parser,
                    "Inappropriately located doctype declaration")
                  parser.doctype = ""
                  parser.sgmlDecl = ""
                } else if (c === ">") {
                  emitNode(parser, "onsgmldeclaration", parser.sgmlDecl)
                  parser.sgmlDecl = ""
                  parser.state = S.TEXT
                } else if (is(quote, c)) {
                  parser.state = S.SGML_DECL_QUOTED
                  parser.sgmlDecl += c
                } else parser.sgmlDecl += c
                continue

              case S.SGML_DECL_QUOTED:
                if (c === parser.q) {
                  parser.state = S.SGML_DECL
                  parser.q = ""
                }
                parser.sgmlDecl += c
                continue

              case S.DOCTYPE:
                if (c === ">") {
                  parser.state = S.TEXT
                  emitNode(parser, "ondoctype", parser.doctype)
                  parser.doctype = true // just remember that we saw it.
                } else {
                  parser.doctype += c
                  if (c === "[") parser.state = S.DOCTYPE_DTD
                  else if (is(quote, c)) {
                    parser.state = S.DOCTYPE_QUOTED
                    parser.q = c
                  }
                }
                continue

              case S.DOCTYPE_QUOTED:
                parser.doctype += c
                if (c === parser.q) {
                  parser.q = ""
                  parser.state = S.DOCTYPE
                }
                continue

              case S.DOCTYPE_DTD:
                parser.doctype += c
                if (c === "]") parser.state = S.DOCTYPE
                else if (is(quote, c)) {
                  parser.state = S.DOCTYPE_DTD_QUOTED
                  parser.q = c
                }
                continue

              case S.DOCTYPE_DTD_QUOTED:
                parser.doctype += c
                if (c === parser.q) {
                  parser.state = S.DOCTYPE_DTD
                  parser.q = ""
                }
                continue

              case S.COMMENT:
                if (c === "-") parser.state = S.COMMENT_ENDING
                else parser.comment += c
                continue

              case S.COMMENT_ENDING:
                if (c === "-") {
                  parser.state = S.COMMENT_ENDED
                  parser.comment = textopts(parser.opt, parser.comment)
                  if (parser.comment) emitNode(parser, "oncomment", parser.comment)
                  parser.comment = ""
                } else {
                  parser.comment += "-" + c
                  parser.state = S.COMMENT
                }
                continue

              case S.COMMENT_ENDED:
                if (c !== ">") {
                  strictFail(parser, "Malformed comment")
                  // allow <!-- blah -- bloo --> in non-strict mode,
                  // which is a comment of " blah -- bloo "
                  parser.comment += "--" + c
                  parser.state = S.COMMENT
                } else parser.state = S.TEXT
                continue

              case S.CDATA:
                if (c === "]") parser.state = S.CDATA_ENDING
                else parser.cdata += c
                continue

              case S.CDATA_ENDING:
                if (c === "]") parser.state = S.CDATA_ENDING_2
                else {
                  parser.cdata += "]" + c
                  parser.state = S.CDATA
                }
                continue

              case S.CDATA_ENDING_2:
                if (c === ">") {
                  if (parser.cdata) emitNode(parser, "oncdata", parser.cdata)
                  emitNode(parser, "onclosecdata")
                  parser.cdata = ""
                  parser.state = S.TEXT
                } else if (c === "]") {
                  parser.cdata += "]"
                } else {
                  parser.cdata += "]]" + c
                  parser.state = S.CDATA
                }
                continue

              case S.PROC_INST:
                if (c === "?") parser.state = S.PROC_INST_ENDING
                else if (is(whitespace, c)) parser.state = S.PROC_INST_BODY
                else parser.procInstName += c
                continue

              case S.PROC_INST_BODY:
                if (!parser.procInstBody && is(whitespace, c)) continue
                else if (c === "?") parser.state = S.PROC_INST_ENDING
                else parser.procInstBody += c
                continue

              case S.PROC_INST_ENDING:
                if (c === ">") {
                  emitNode(parser, "onprocessinginstruction", {
                    name: parser.procInstName,
                    body: parser.procInstBody
                  })
                  parser.procInstName = parser.procInstBody = ""
                  parser.state = S.TEXT
                } else {
                  parser.procInstBody += "?" + c
                  parser.state = S.PROC_INST_BODY
                }
                continue

              case S.OPEN_TAG:
                if (is(nameBody, c)) parser.tagName += c
                else {
                  newTag(parser)
                  if (c === ">") openTag(parser)
                  else if (c === "/") parser.state = S.OPEN_TAG_SLASH
                  else {
                    if (not(whitespace, c)) strictFail(
                      parser, "Invalid character in tag name")
                    parser.state = S.ATTRIB
                  }
                }
                continue

              case S.OPEN_TAG_SLASH:
                if (c === ">") {
                  openTag(parser, true)
                  closeTag(parser)
                } else {
                  strictFail(parser, "Forward-slash in opening tag not followed by >")
                  parser.state = S.ATTRIB
                }
                continue

              case S.ATTRIB:
                // haven't read the attribute name yet.
                if (is(whitespace, c)) continue
                else if (c === ">") openTag(parser)
                else if (c === "/") parser.state = S.OPEN_TAG_SLASH
                else if (is(nameStart, c)) {
                  parser.attribName = c
                  parser.attribValue = ""
                  parser.state = S.ATTRIB_NAME
                } else strictFail(parser, "Invalid attribute name")
                continue

              case S.ATTRIB_NAME:
                if (c === "=") parser.state = S.ATTRIB_VALUE
                else if (c === ">") {
                  strictFail(parser, "Attribute without value")
                  parser.attribValue = parser.attribName
                  attrib(parser)
                  openTag(parser)
                }
                else if (is(whitespace, c)) parser.state = S.ATTRIB_NAME_SAW_WHITE
                else if (is(nameBody, c)) parser.attribName += c
                else strictFail(parser, "Invalid attribute name")
                continue

              case S.ATTRIB_NAME_SAW_WHITE:
                if (c === "=") parser.state = S.ATTRIB_VALUE
                else if (is(whitespace, c)) continue
                else {
                  strictFail(parser, "Attribute without value")
                  parser.tag.attributes[parser.attribName] = ""
                  parser.attribValue = ""
                  emitNode(parser, "onattribute",
                    {name: parser.attribName, value: ""})
                  parser.attribName = ""
                  if (c === ">") openTag(parser)
                  else if (is(nameStart, c)) {
                    parser.attribName = c
                    parser.state = S.ATTRIB_NAME
                  } else {
                    strictFail(parser, "Invalid attribute name")
                    parser.state = S.ATTRIB
                  }
                }
                continue

              case S.ATTRIB_VALUE:
                if (is(whitespace, c)) continue
                else if (is(quote, c)) {
                  parser.q = c
                  parser.state = S.ATTRIB_VALUE_QUOTED
                } else {
                  strictFail(parser, "Unquoted attribute value")
                  parser.state = S.ATTRIB_VALUE_UNQUOTED
                  parser.attribValue = c
                }
                continue

              case S.ATTRIB_VALUE_QUOTED:
                if (c !== parser.q) {
                  if (c === "&") parser.state = S.ATTRIB_VALUE_ENTITY_Q
                  else parser.attribValue += c
                  continue
                }
                attrib(parser)
                parser.q = ""
                parser.state = S.ATTRIB_VALUE_CLOSED
                continue

              case S.ATTRIB_VALUE_CLOSED:
                if (is(whitespace, c)) {
                  parser.state = S.ATTRIB
                } else if (c === ">") openTag(parser)
                else if (c === "/") parser.state = S.OPEN_TAG_SLASH
                else if (is(nameStart, c)) {
                  strictFail(parser, "No whitespace between attributes")
                  parser.attribName = c
                  parser.attribValue = ""
                  parser.state = S.ATTRIB_NAME
                } else strictFail(parser, "Invalid attribute name")
                continue

              case S.ATTRIB_VALUE_UNQUOTED:
                if (not(attribEnd, c)) {
                  if (c === "&") parser.state = S.ATTRIB_VALUE_ENTITY_U
                  else parser.attribValue += c
                  continue
                }
                attrib(parser)
                if (c === ">") openTag(parser)
                else parser.state = S.ATTRIB
                continue

              case S.CLOSE_TAG:
                if (!parser.tagName) {
                  if (is(whitespace, c)) continue
                  else if (not(nameStart, c)) {
                    if (parser.script) {
                      parser.script += "</" + c
                      parser.state = S.SCRIPT
                    } else {
                      strictFail(parser, "Invalid tagname in closing tag.")
                    }
                  } else parser.tagName = c
                }
                else if (c === ">") closeTag(parser)
                else if (is(nameBody, c)) parser.tagName += c
                else if (parser.script) {
                  parser.script += "</" + parser.tagName
                  parser.tagName = ""
                  parser.state = S.SCRIPT
                } else {
                  if (not(whitespace, c)) strictFail(parser,
                    "Invalid tagname in closing tag")
                  parser.state = S.CLOSE_TAG_SAW_WHITE
                }
                continue

              case S.CLOSE_TAG_SAW_WHITE:
                if (is(whitespace, c)) continue
                if (c === ">") closeTag(parser)
                else strictFail(parser, "Invalid characters in closing tag")
                continue

              case S.TEXT_ENTITY:
              case S.ATTRIB_VALUE_ENTITY_Q:
              case S.ATTRIB_VALUE_ENTITY_U:
                switch (parser.state) {
                  case S.TEXT_ENTITY:
                    var returnState = S.TEXT, buffer = "textNode"
                    break

                  case S.ATTRIB_VALUE_ENTITY_Q:
                    var returnState = S.ATTRIB_VALUE_QUOTED, buffer = "attribValue"
                    break

                  case S.ATTRIB_VALUE_ENTITY_U:
                    var returnState = S.ATTRIB_VALUE_UNQUOTED, buffer = "attribValue"
                    break
                }
                if (c === ";") {
                  parser[buffer] += parseEntity(parser)
                  parser.entity = ""
                  parser.state = returnState
                }
                else if (is(entity, c)) parser.entity += c
                else {
                  strictFail(parser, "Invalid character entity")
                  parser[buffer] += "&" + parser.entity + c
                  parser.entity = ""
                  parser.state = returnState
                }
                continue

              default:
                throw new Error(parser, "Unknown state: " + parser.state)
            }
          } // while
          // cdata blocks can get very big under normal conditions. emit and move on.
          // if (parser.state === S.CDATA && parser.cdata) {
          //   emitNode(parser, "oncdata", parser.cdata)
          //   parser.cdata = ""
          // }
          if (parser.position >= parser.bufferCheckPosition) checkBufferLength(parser)
          return parser
        }

        /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
        if (!String.fromCodePoint) {
          (function () {
            var stringFromCharCode = String.fromCharCode;
            var floor = Math.floor;
            var fromCodePoint = function () {
              var MAX_SIZE = 0x4000;
              var codeUnits = [];
              var highSurrogate;
              var lowSurrogate;
              var index = -1;
              var length = arguments.length;
              if (!length) {
                return '';
              }
              var result = '';
              while (++index < length) {
                var codePoint = Number(arguments[index]);
                if (
                  !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
                  codePoint < 0 || // not a valid Unicode code point
                  codePoint > 0x10FFFF || // not a valid Unicode code point
                  floor(codePoint) != codePoint // not an integer
                ) {
                  throw RangeError('Invalid code point: ' + codePoint);
                }
                if (codePoint <= 0xFFFF) { // BMP code point
                  codeUnits.push(codePoint);
                } else { // Astral code point; split in surrogate halves
                  // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                  codePoint -= 0x10000;
                  highSurrogate = (codePoint >> 10) + 0xD800;
                  lowSurrogate = (codePoint % 0x400) + 0xDC00;
                  codeUnits.push(highSurrogate, lowSurrogate);
                }
                if (index + 1 == length || codeUnits.length > MAX_SIZE) {
                  result += stringFromCharCode.apply(null, codeUnits);
                  codeUnits.length = 0;
                }
              }
              return result;
            };
            if (Object.defineProperty) {
              Object.defineProperty(String, 'fromCodePoint', {
                'value': fromCodePoint,
                'configurable': true,
                'writable': true
              });
            } else {
              String.fromCodePoint = fromCodePoint;
            }
          }());
        }

      })(typeof exports === "undefined" ? sax = {} : exports);

    }).call(this, undefined)
  }, {"stream": undefined, "string_decoder": undefined}],
  41: [function (require, module, exports) {
    /**
     * Tiny stack for browser or server
     *
     * @author Jason Mulligan <jason.mulligan@avoidwork.com>
     * @copyright 2014 Jason Mulligan
     * @license BSD-3 <https://raw.github.com/avoidwork/tiny-stack/master/LICENSE>
     * @link http://avoidwork.github.io/tiny-stack
     * @module tiny-stack
     * @version 0.1.0
     */

    (function (global) {

      "use strict";

      /**
       * TinyStack
       *
       * @constructor
       */
      function TinyStack() {
        this.data = [null];
        this.top = 0;
      }

      /**
       * Clears the stack
       *
       * @method clear
       * @memberOf TinyStack
       * @return {Object} {@link TinyStack}
       */
      TinyStack.prototype.clear = function clear() {
        this.data = [null];
        this.top = 0;

        return this;
      };

      /**
       * Gets the size of the stack
       *
       * @method length
       * @memberOf TinyStack
       * @return {Number} Size of stack
       */
      TinyStack.prototype.length = function length() {
        return this.top;
      };

      /**
       * Gets the item at the top of the stack
       *
       * @method peek
       * @memberOf TinyStack
       * @return {Mixed} Item at the top of the stack
       */
      TinyStack.prototype.peek = function peek() {
        return this.data[this.top];
      };

      /**
       * Gets & removes the item at the top of the stack
       *
       * @method pop
       * @memberOf TinyStack
       * @return {Mixed} Item at the top of the stack
       */
      TinyStack.prototype.pop = function pop() {
        if (this.top > 0) {
          this.top--;

          return this.data.pop();
        }
        else {
          return undefined;
        }
      };

      /**
       * Pushes an item onto the stack
       *
       * @method push
       * @memberOf TinyStack
       * @return {Object} {@link TinyStack}
       */
      TinyStack.prototype.push = function push(arg) {
        this.data[++this.top] = arg;

        return this;
      };

      /**
       * TinyStack factory
       *
       * @method factory
       * @return {Object} {@link TinyStack}
       */
      function factory() {
        return new TinyStack();
      }

// Node, AMD & window supported
      if (typeof exports != "undefined") {
        module.exports = factory;
      }
      else if (typeof define == "function") {
        define(function () {
          return factory;
        });
      }
      else {
        global.stack = factory;
      }
    })(this);

  }, {}],
  42: [function (require, module, exports) {
    module.exports = require('./lib/moddle');
  }, {"./lib/moddle": 46}],
  43: [function (require, module, exports) {
    'use strict';

    function Base() {
    }

    Base.prototype.get = function (name) {
      return this.$model.properties.get(this, name);
    };

    Base.prototype.set = function (name, value) {
      this.$model.properties.set(this, name, value);
    };


    module.exports = Base;
  }, {}],
  44: [function (require, module, exports) {
    'use strict';

    var pick = require('lodash/object/pick'),
      assign = require('lodash/object/assign'),
      forEach = require('lodash/collection/forEach');

    var parseNameNs = require('./ns').parseName;


    function DescriptorBuilder(nameNs) {
      this.ns = nameNs;
      this.name = nameNs.name;
      this.allTypes = [];
      this.properties = [];
      this.propertiesByName = {};
    }

    module.exports = DescriptorBuilder;


    DescriptorBuilder.prototype.build = function () {
      return pick(this, ['ns', 'name', 'allTypes', 'properties', 'propertiesByName', 'bodyProperty']);
    };

    DescriptorBuilder.prototype.addProperty = function (p, idx) {
      this.addNamedProperty(p, true);

      var properties = this.properties;

      if (idx !== undefined) {
        properties.splice(idx, 0, p);
      } else {
        properties.push(p);
      }
    };


    DescriptorBuilder.prototype.replaceProperty = function (oldProperty, newProperty) {
      var oldNameNs = oldProperty.ns;

      var props = this.properties,
        propertiesByName = this.propertiesByName,
        rename = oldProperty.name !== newProperty.name;

      if (oldProperty.isBody) {

        if (!newProperty.isBody) {
          throw new Error(
            'property <' + newProperty.ns.name + '> must be body property ' +
            'to refine <' + oldProperty.ns.name + '>');
        }

        // TODO: Check compatibility
        this.setBodyProperty(newProperty, false);
      }

      // replacing the named property is intentional
      // thus, validate only if this is a "rename" operation
      this.addNamedProperty(newProperty, rename);

      // replace old property at index with new one
      var idx = props.indexOf(oldProperty);
      if (idx === -1) {
        throw new Error('property <' + oldNameNs.name + '> not found in property list');
      }

      props[idx] = newProperty;

      // replace propertiesByName entry with new property
      propertiesByName[oldNameNs.name] = propertiesByName[oldNameNs.localName] = newProperty;
    };


    DescriptorBuilder.prototype.redefineProperty = function (p) {

      var nsPrefix = p.ns.prefix;
      var parts = p.redefines.split('#');

      var name = parseNameNs(parts[0], nsPrefix);
      var attrName = parseNameNs(parts[1], name.prefix).name;

      var redefinedProperty = this.propertiesByName[attrName];
      if (!redefinedProperty) {
        throw new Error('refined property <' + attrName + '> not found');
      } else {
        this.replaceProperty(redefinedProperty, p);
      }

      delete p.redefines;
    };

    DescriptorBuilder.prototype.addNamedProperty = function (p, validate) {
      var ns = p.ns,
        propsByName = this.propertiesByName;

      if (validate) {
        this.assertNotDefined(p, ns.name);
        this.assertNotDefined(p, ns.localName);
      }

      propsByName[ns.name] = propsByName[ns.localName] = p;
    };

    DescriptorBuilder.prototype.removeNamedProperty = function (p) {
      var ns = p.ns,
        propsByName = this.propertiesByName;

      delete propsByName[ns.name];
      delete propsByName[ns.localName];
    };

    DescriptorBuilder.prototype.setBodyProperty = function (p, validate) {

      if (validate && this.bodyProperty) {
        throw new Error(
          'body property defined multiple times ' +
          '(<' + this.bodyProperty.ns.name + '>, <' + p.ns.name + '>)');
      }

      this.bodyProperty = p;
    };

    DescriptorBuilder.prototype.addIdProperty = function (name) {
      var nameNs = parseNameNs(name, this.ns.prefix);

      var p = {
        name: nameNs.localName,
        type: 'String',
        isAttr: true,
        ns: nameNs
      };

      // ensure that id is always the first attribute (if present)
      this.addProperty(p, 0);
    };

    DescriptorBuilder.prototype.assertNotDefined = function (p, name) {
      var propertyName = p.name,
        definedProperty = this.propertiesByName[propertyName];

      if (definedProperty) {
        throw new Error(
          'property <' + propertyName + '> already defined; ' +
          'override of <' + definedProperty.definedBy.ns.name + '#' + definedProperty.ns.name + '> by ' +
          '<' + p.definedBy.ns.name + '#' + p.ns.name + '> not allowed without redefines');
      }
    };

    DescriptorBuilder.prototype.hasProperty = function (name) {
      return this.propertiesByName[name];
    };

    DescriptorBuilder.prototype.addTrait = function (t) {

      var allTypes = this.allTypes;

      if (allTypes.indexOf(t) !== -1) {
        return;
      }

      forEach(t.properties, function (p) {

        // clone property to allow extensions
        p = assign({}, p, {
          name: p.ns.localName
        });

        Object.defineProperty(p, 'definedBy', {
          value: t
        });

        // add redefine support
        if (p.redefines) {
          this.redefineProperty(p);
        } else {
          if (p.isBody) {
            this.setBodyProperty(p);
          }
          this.addProperty(p);
        }
      }, this);

      allTypes.push(t);
    };

  }, {"./ns": 47, "lodash/collection/forEach": 130, "lodash/object/assign": 219, "lodash/object/pick": 224}],
  45: [function (require, module, exports) {
    'use strict';

    var forEach = require('lodash/collection/forEach');

    var Base = require('./base');


    function Factory(model, properties) {
      this.model = model;
      this.properties = properties;
    }

    module.exports = Factory;


    Factory.prototype.createType = function (descriptor) {

      var model = this.model;

      var props = this.properties,
        prototype = Object.create(Base.prototype);

      // initialize default values
      forEach(descriptor.properties, function (p) {
        if (!p.isMany && p.default !== undefined) {
          prototype[p.name] = p.default;
        }
      });

      props.defineModel(prototype, model);
      props.defineDescriptor(prototype, descriptor);

      var name = descriptor.ns.name;

      /**
       * The new type constructor
       */
      function ModdleElement(attrs) {
        props.define(this, '$type', {value: name, enumerable: true});
        props.define(this, '$attrs', {value: {}});
        props.define(this, '$parent', {writable: true});

        forEach(attrs, function (val, key) {
          this.set(key, val);
        }, this);
      }

      ModdleElement.prototype = prototype;

      ModdleElement.hasType = prototype.$instanceOf = this.model.hasType;

      // static links
      props.defineModel(ModdleElement, model);
      props.defineDescriptor(ModdleElement, descriptor);

      return ModdleElement;
    };
  }, {"./base": 43, "lodash/collection/forEach": 130}],
  46: [function (require, module, exports) {
    'use strict';

    var isString = require('lodash/lang/isString'),
      isObject = require('lodash/lang/isObject'),
      forEach = require('lodash/collection/forEach'),
      find = require('lodash/collection/find');


    var Factory = require('./factory'),
      Registry = require('./registry'),
      Properties = require('./properties');

    var parseNameNs = require('./ns').parseName;


//// Moddle implementation /////////////////////////////////////////////////

    /**
     * @class Moddle
     *
     * A model that can be used to create elements of a specific type.
     *
     * @example
     *
     * var Moddle = require('moddle');
     *
     * var pkg = {
 *   name: 'mypackage',
 *   prefix: 'my',
 *   types: [
 *     { name: 'Root' }
 *   ]
 * };
     *
     * var moddle = new Moddle([pkg]);
     *
     * @param {Array<Package>} packages  the packages to contain
     * @param {Object} options  additional options to pass to the model
     */
    function Moddle(packages, options) {

      options = options || {};

      this.properties = new Properties(this);

      this.factory = new Factory(this, this.properties);
      this.registry = new Registry(packages, this.properties, options);

      this.typeCache = {};
    }

    module.exports = Moddle;


    /**
     * Create an instance of the specified type.
     *
     * @method Moddle#create
     *
     * @example
     *
     * var foo = moddle.create('my:Foo');
     * var bar = moddle.create('my:Bar', { id: 'BAR_1' });
     *
     * @param  {String|Object} descriptor the type descriptor or name know to the model
     * @param  {Object} attrs   a number of attributes to initialize the model instance with
     * @return {Object}         model instance
     */
    Moddle.prototype.create = function (descriptor, attrs) {
      var Type = this.getType(descriptor);

      if (!Type) {
        throw new Error('unknown type <' + descriptor + '>');
      }

      return new Type(attrs);
    };


    /**
     * Returns the type representing a given descriptor
     *
     * @method Moddle#getType
     *
     * @example
     *
     * var Foo = moddle.getType('my:Foo');
     * var foo = new Foo({ 'id' : 'FOO_1' });
     *
     * @param  {String|Object} descriptor the type descriptor or name know to the model
     * @return {Object}         the type representing the descriptor
     */
    Moddle.prototype.getType = function (descriptor) {

      var cache = this.typeCache;

      var name = isString(descriptor) ? descriptor : descriptor.ns.name;

      var type = cache[name];

      if (!type) {
        descriptor = this.registry.getEffectiveDescriptor(name);
        type = cache[name] = this.factory.createType(descriptor);
      }

      return type;
    };


    /**
     * Creates an any-element type to be used within model instances.
     *
     * This can be used to create custom elements that lie outside the meta-model.
     * The created element contains all the meta-data required to serialize it
     * as part of meta-model elements.
     *
     * @method Moddle#createAny
     *
     * @example
     *
     * var foo = moddle.createAny('vendor:Foo', 'http://vendor', {
 *   value: 'bar'
 * });
     *
     * var container = moddle.create('my:Container', 'http://my', {
 *   any: [ foo ]
 * });
     *
     * // go ahead and serialize the stuff
     *
     *
     * @param  {String} name  the name of the element
     * @param  {String} nsUri the namespace uri of the element
     * @param  {Object} [properties] a map of properties to initialize the instance with
     * @return {Object} the any type instance
     */
    Moddle.prototype.createAny = function (name, nsUri, properties) {

      var nameNs = parseNameNs(name);

      var element = {
        $type: name
      };

      var descriptor = {
        name: name,
        isGeneric: true,
        ns: {
          prefix: nameNs.prefix,
          localName: nameNs.localName,
          uri: nsUri
        }
      };

      this.properties.defineDescriptor(element, descriptor);
      this.properties.defineModel(element, this);
      this.properties.define(element, '$parent', {enumerable: false, writable: true});

      forEach(properties, function (a, key) {
        if (isObject(a) && a.value !== undefined) {
          element[a.name] = a.value;
        } else {
          element[key] = a;
        }
      });

      return element;
    };

    /**
     * Returns a registered package by uri or prefix
     *
     * @return {Object} the package
     */
    Moddle.prototype.getPackage = function (uriOrPrefix) {
      return this.registry.getPackage(uriOrPrefix);
    };

    /**
     * Returns a snapshot of all known packages
     *
     * @return {Object} the package
     */
    Moddle.prototype.getPackages = function () {
      return this.registry.getPackages();
    };

    /**
     * Returns the descriptor for an element
     */
    Moddle.prototype.getElementDescriptor = function (element) {
      return element.$descriptor;
    };

    /**
     * Returns true if the given descriptor or instance
     * represents the given type.
     *
     * May be applied to this, if element is omitted.
     */
    Moddle.prototype.hasType = function (element, type) {
      if (type === undefined) {
        type = element;
        element = this;
      }

      var descriptor = element.$model.getElementDescriptor(element);

      return !!find(descriptor.allTypes, function (t) {
        return t.name === type;
      });
    };


    /**
     * Returns the descriptor of an elements named property
     */
    Moddle.prototype.getPropertyDescriptor = function (element, property) {
      return this.getElementDescriptor(element).propertiesByName[property];
    };

  }, {
    "./factory": 45,
    "./ns": 47,
    "./properties": 48,
    "./registry": 49,
    "lodash/collection/find": 129,
    "lodash/collection/forEach": 130,
    "lodash/lang/isObject": 216,
    "lodash/lang/isString": 217
  }],
  47: [function (require, module, exports) {
    'use strict';

    /**
     * Parses a namespaced attribute name of the form (ns:)localName to an object,
     * given a default prefix to assume in case no explicit namespace is given.
     *
     * @param {String} name
     * @param {String} [defaultPrefix] the default prefix to take, if none is present.
     *
     * @return {Object} the parsed name
     */
    module.exports.parseName = function (name, defaultPrefix) {
      var parts = name.split(/:/),
        localName, prefix;

      // no prefix (i.e. only local name)
      if (parts.length === 1) {
        localName = name;
        prefix = defaultPrefix;
      } else
      // prefix + local name
      if (parts.length === 2) {
        localName = parts[1];
        prefix = parts[0];
      } else {
        throw new Error('expected <prefix:localName> or <localName>, got ' + name);
      }

      name = (prefix ? prefix + ':' : '') + localName;

      return {
        name: name,
        prefix: prefix,
        localName: localName
      };
    };
  }, {}],
  48: [function (require, module, exports) {
    'use strict';


    /**
     * A utility that gets and sets properties of model elements.
     *
     * @param {Model} model
     */
    function Properties(model) {
      this.model = model;
    }

    module.exports = Properties;


    /**
     * Sets a named property on the target element
     *
     * @param {Object} target
     * @param {String} name
     * @param {Object} value
     */
    Properties.prototype.set = function (target, name, value) {

      var property = this.model.getPropertyDescriptor(target, name);

      if (!property) {
        target.$attrs[name] = value;
      } else {
        Object.defineProperty(target, property.name, {
          enumerable: !property.isReference,
          writable: true,
          value: value
        });
      }
    };

    /**
     * Returns the named property of the given element
     *
     * @param  {Object} target
     * @param  {String} name
     *
     * @return {Object}
     */
    Properties.prototype.get = function (target, name) {

      var property = this.model.getPropertyDescriptor(target, name);

      if (!property) {
        return target.$attrs[name];
      }

      var propertyName = property.name;

      // check if access to collection property and lazily initialize it
      if (!target[propertyName] && property.isMany) {
        Object.defineProperty(target, propertyName, {
          enumerable: !property.isReference,
          writable: true,
          value: []
        });
      }

      return target[propertyName];
    };


    /**
     * Define a property on the target element
     *
     * @param  {Object} target
     * @param  {String} name
     * @param  {Object} options
     */
    Properties.prototype.define = function (target, name, options) {
      Object.defineProperty(target, name, options);
    };


    /**
     * Define the descriptor for an element
     */
    Properties.prototype.defineDescriptor = function (target, descriptor) {
      this.define(target, '$descriptor', {value: descriptor});
    };

    /**
     * Define the model for an element
     */
    Properties.prototype.defineModel = function (target, model) {
      this.define(target, '$model', {value: model});
    };
  }, {}],
  49: [function (require, module, exports) {
    'use strict';

    var assign = require('lodash/object/assign'),
      forEach = require('lodash/collection/forEach');

    var Types = require('./types'),
      DescriptorBuilder = require('./descriptor-builder');

    var parseNameNs = require('./ns').parseName,
      isBuiltInType = Types.isBuiltIn;


    function Registry(packages, properties, options) {
      this.options = assign({generateId: 'id'}, options || {});

      this.packageMap = {};
      this.typeMap = {};

      this.packages = [];

      this.properties = properties;

      forEach(packages, this.registerPackage, this);
    }

    module.exports = Registry;


    Registry.prototype.getPackage = function (uriOrPrefix) {
      return this.packageMap[uriOrPrefix];
    };

    Registry.prototype.getPackages = function () {
      return this.packages;
    };


    Registry.prototype.registerPackage = function (pkg) {

      // copy package
      pkg = assign({}, pkg);

      // register types
      forEach(pkg.types, function (descriptor) {
        this.registerType(descriptor, pkg);
      }, this);

      this.packageMap[pkg.uri] = this.packageMap[pkg.prefix] = pkg;
      this.packages.push(pkg);
    };


    /**
     * Register a type from a specific package with us
     */
    Registry.prototype.registerType = function (type, pkg) {

      type = assign({}, type, {
        superClass: (type.superClass || []).slice(),
        extends: (type.extends || []).slice(),
        properties: (type.properties || []).slice()
      });

      var ns = parseNameNs(type.name, pkg.prefix),
        name = ns.name,
        propertiesByName = {};

      // parse properties
      forEach(type.properties, function (p) {

        // namespace property names
        var propertyNs = parseNameNs(p.name, ns.prefix),
          propertyName = propertyNs.name;

        // namespace property types
        if (!isBuiltInType(p.type)) {
          p.type = parseNameNs(p.type, propertyNs.prefix).name;
        }

        assign(p, {
          ns: propertyNs,
          name: propertyName
        });

        propertiesByName[propertyName] = p;
      });

      // update ns + name
      assign(type, {
        ns: ns,
        name: name,
        propertiesByName: propertiesByName
      });

      forEach(type.extends, function (extendsName) {
        var extended = this.typeMap[extendsName];

        extended.traits = extended.traits || [];
        extended.traits.push(name);
      }, this);

      // link to package
      this.definePackage(type, pkg);

      // register
      this.typeMap[name] = type;
    };


    /**
     * Traverse the type hierarchy from bottom to top.
     */
    Registry.prototype.mapTypes = function (nsName, iterator) {

      var type = isBuiltInType(nsName.name) ? {name: nsName.name} : this.typeMap[nsName.name];

      var self = this;

      /**
       * Traverse the selected super type or trait
       *
       * @param {String} cls
       */
      function traverseSuper(cls) {
        var parentNs = parseNameNs(cls, isBuiltInType(cls) ? '' : nsName.prefix);
        self.mapTypes(parentNs, iterator);
      }

      if (!type) {
        throw new Error('unknown type <' + nsName.name + '>');
      }

      forEach(type.superClass, traverseSuper);

      iterator(type);

      forEach(type.traits, traverseSuper);
    };


    /**
     * Returns the effective descriptor for a type.
     *
     * @param  {String} type the namespaced name (ns:localName) of the type
     *
     * @return {Descriptor} the resulting effective descriptor
     */
    Registry.prototype.getEffectiveDescriptor = function (name) {

      var nsName = parseNameNs(name);

      var builder = new DescriptorBuilder(nsName);

      this.mapTypes(nsName, function (type) {
        builder.addTrait(type);
      });

      // check we have an id assigned
      var id = this.options.generateId;
      if (id && !builder.hasProperty(id)) {
        builder.addIdProperty(id);
      }

      var descriptor = builder.build();

      // define package link
      this.definePackage(descriptor, descriptor.allTypes[descriptor.allTypes.length - 1].$pkg);

      return descriptor;
    };


    Registry.prototype.definePackage = function (target, pkg) {
      this.properties.define(target, '$pkg', {value: pkg});
    };
  }, {"./descriptor-builder": 44, "./ns": 47, "./types": 50, "lodash/collection/forEach": 130, "lodash/object/assign": 219}],
  50: [function (require, module, exports) {
    'use strict';

    /**
     * Built-in moddle types
     */
    var BUILTINS = {
      String: true,
      Boolean: true,
      Integer: true,
      Real: true,
      Element: true
    };

    /**
     * Converters for built in types from string representations
     */
    var TYPE_CONVERTERS = {
      String: function (s) {
        return s;
      },
      Boolean: function (s) {
        return s === 'true';
      },
      Integer: function (s) {
        return parseInt(s, 10);
      },
      Real: function (s) {
        return parseFloat(s, 10);
      }
    };

    /**
     * Convert a type to its real representation
     */
    module.exports.coerceType = function (type, value) {

      var converter = TYPE_CONVERTERS[type];

      if (converter) {
        return converter(value);
      } else {
        return value;
      }
    };

    /**
     * Return whether the given type is built-in
     */
    module.exports.isBuiltIn = function (type) {
      return !!BUILTINS[type];
    };

    /**
     * Return whether the given type is simple
     */
    module.exports.isSimple = function (type) {
      return !!TYPE_CONVERTERS[type];
    };
  }, {}],
  51: [function (require, module, exports) {
    module.exports = {
      "name": "DMN",
      "uri": "http://www.omg.org/spec/DMN/20130901",
      "prefix": "dmn",
      "types": [
        {
          "name": "DMNElement",
          "properties": [
            {"name": "description", "type": "String"},
            {"name": "id", "type": "String", "isAttr": true},
            {"name": "name", "type": "String", "isAttr": true}
          ]
        },
        {
          "name": "DMNElementReference",
          "properties": [
            {"name": "href", "type": "String", "isAttr": true}
          ]
        },
        {
          "name": "Definitions",
          "superClass": ["DMNElement"],
          "properties": [
            {"name": "namespace", "type": "String", "isAttr": true},
            {"name": "typeLanguage", "type": "String", "isAttr": true, "default": "http://www.omg.org/spec/FEEL/20140401"},
            {"name": "expressionLanguage", "type": "String", "isAttr": true, "default": "http://www.omg.org/spec/FEEL/20140401"},
            {"name": "ItemDefinition", "type": "ItemDefinition", "isMany": true},
            {"name": "Decision", "type": "Decision", "isMany": true}
          ]
        },
        {
          "name": "ItemDefinition",
          "superClass": ["DMNElement"],
          "properties": [
            {"name": "typeDefinition", "type": "String"},
            {"name": "typeLanguage", "type": "String", "isAttr": true},
            {"name": "isCollection", "type": "Boolean", "isAttr": true, "default": false},
            {"name": "typeRef", "type": "String", "isAttr": true},
            {"name": "allowedValue", "type": "LiteralExpression", "isMany": true, "xml": {"serialize": "property"}}
          ]
        },
        {
          "name": "Expression",
          "superClass": ["DMNElement"],
          "properties": [
            {"name": "inputVariable", "type": "DMNElement", "isReference": true},
            {"name": "itemDefinition", "type": "DMNElementReference", "xml": {"serialize": "property"}}
          ]
        },
        {
          "name": "LiteralExpression",
          "superClass": ["Expression"],
          "properties": [
            {"name": "expressionLanguage", "type": "String", "isAttr": true},
            {"name": "text", "type": "String"}
          ]
        },
        {
          "name": "DRGElement",
          "superClass": ["DMNElement"],
          "properties": []
        },
        {
          "name": "Decision",
          "superClass": ["DRGElement"],
          "properties": [
            {"name": "question", "type": "String", "isAttr": true},
            {"name": "allowedAnswers", "type": "String", "isAttr": true},
            {"name": "DecisionTable", "type": "DecisionTable"},
            {"name": "outputDefinition", "type": "DMNElementReference", "xml": {"serialize": "property"}}
          ]
        },
        {
          "name": "DecisionTable",
          "superClass": ["Expression"],
          "properties": [
            {"name": "hitPolicy", "type": "HitPolicy", "isAttr": true, "default": "UNIQUE"},
            {"name": "aggregation", "type": "BuiltinAggregator", "isAttr": true},
            {"name": "preferredOrientation", "type": "DecisionTableOrientation", "isAttr": true},
            {"name": "isComplete", "type": "Boolean", "isAttr": true, "default": false},
            {"name": "isConsistent", "type": "Boolean", "isAttr": true, "default": false},
            {"name": "clause", "type": "Clause", "isMany": true, "xml": {"serialize": "property"}},
            {"name": "rule", "type": "DecisionRule", "isMany": true, "xml": {"serialize": "property"}}
          ]
        },
        {
          "name": "Clause",
          "superClass": ["DMNElement"],
          "properties": [
            {"name": "inputExpression", "type": "Expression", "xml": {"serialize": "property"}},
            {"name": "outputDefinition", "type": "DMNElementReference", "xml": {"serialize": "property"}},
            {"name": "inputEntry", "type": "LiteralExpression", "isMany": true, "xml": {"serialize": "property"}},
            {"name": "outputEntry", "type": "LiteralExpression", "isMany": true, "xml": {"serialize": "property"}}
          ]
        },
        {
          "name": "DecisionRule",
          "superClass": ["DMNElement"],
          "properties": [
            {"name": "condition", "type": "Expression", "isReference": true, "isMany": true},
            {"name": "conclusion", "type": "Expression", "isReference": true, "isMany": true}
          ]
        }
      ],
      "emumerations": [
        {
          "name": "HitPolicy",
          "literalValues": [
            {
              "name": "UNIQUE"
            },
            {
              "name": "FIRST"
            },
            {
              "name": "PRIORITY"
            },
            {
              "name": "ANY"
            },
            {
              "name": "COLLECT"
            },
            {
              "name": "RULE ORDER"
            },
            {
              "name": "OUTPUT ORDER"
            }
          ]
        },
        {
          "name": "BuiltinAggregator",
          "literalValues": [
            {
              "name": "SUM"
            },
            {
              "name": "COUNT"
            },
            {
              "name": "MIN"
            },
            {
              "name": "MAX"
            }
          ]
        },
        {
          "name": "DecisionTableOrientation",
          "literalValues": [
            {
              "name": "Rule-as-Row"
            },
            {
              "name": "Rule-as-Column"
            },
            {
              "name": "CrossTable"
            }
          ]
        }
      ]
    }

  }, {}],
  52: [function (require, module, exports) {
    'use strict';

    var hat = require('hat');


    /**
     * Create a new id generator / cache instance.
     *
     * You may optionally provide a seed that is used internally.
     *
     * @param {Seed} seed
     */
    function Ids(seed) {
      seed = seed || [128, 36, 1];
      this._seed = seed.length ? hat.rack(seed[0], seed[1], seed[2]) : seed;
    }

    module.exports = Ids;

    /**
     * Generate a next id.
     *
     * @param {Object} [element] element to bind the id to
     *
     * @return {String} id
     */
    Ids.prototype.next = function (element) {
      return this._seed(element || true);
    };

    /**
     * Generate a next id with a given prefix.
     *
     * @param {Object} [element] element to bind the id to
     *
     * @return {String} id
     */
    Ids.prototype.nextPrefixed = function (prefix, element) {
      var id;

      do {
        id = prefix + this.next(true);
      } while (this.assigned(id));

      // claim {prefix}{random}
      this.claim(id, element);

      // return
      return id;
    };

    /**
     * Manually claim an existing id.
     *
     * @param {String} id
     * @param {String} [element] element the id is claimed by
     */
    Ids.prototype.claim = function (id, element) {
      this._seed.set(id, element || true);
    };

    /**
     * Returns true if the given id has already been assigned.
     *
     * @param  {String} id
     * @return {Boolean}
     */
    Ids.prototype.assigned = function (id) {
      return this._seed.get(id) || false;
    };
  }, {"hat": 53}],
  53: [function (require, module, exports) {
    var hat = module.exports = function (bits, base) {
      if (!base) base = 16;
      if (bits === undefined) bits = 128;
      if (bits <= 0) return '0';

      var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
      for (var i = 2; digits === Infinity; i *= 2) {
        digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
      }

      var rem = digits - Math.floor(digits);

      var res = '';

      for (var i = 0; i < Math.floor(digits); i++) {
        var x = Math.floor(Math.random() * base).toString(base);
        res = x + res;
      }

      if (rem) {
        var b = Math.pow(base, rem);
        var x = Math.floor(Math.random() * b).toString(base);
        res = x + res;
      }

      var parsed = parseInt(res, base);
      if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
        return hat(bits, base)
      }
      else return res;
    };

    hat.rack = function (bits, base, expandBy) {
      var fn = function (data) {
        var iters = 0;
        do {
          if (iters++ > 10) {
            if (expandBy) bits += expandBy;
            else throw new Error('too many ID collisions, use more bits')
          }

          var id = hat(bits, base);
        } while (Object.hasOwnProperty.call(hats, id));

        hats[id] = data;
        return id;
      };
      var hats = fn.hats = {};

      fn.get = function (id) {
        return fn.hats[id];
      };

      fn.set = function (id, value) {
        fn.hats[id] = value;
        return fn;
      };

      fn.bits = bits || 128;
      fn.base = base || 16;
      return fn;
    };

  }, {}],
  54: [function (require, module, exports) {
    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      };
    } else {
      // old school shim for old browsers
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor
        var TempCtor = function () {
        }
        TempCtor.prototype = superCtor.prototype
        ctor.prototype = new TempCtor()
        ctor.prototype.constructor = ctor
      }
    }

  }, {}],
  55: [function (require, module, exports) {
    /**
     * Set attribute `name` to `val`, or get attr `name`.
     *
     * @param {Element} el
     * @param {String} name
     * @param {String} [val]
     * @api public
     */

    module.exports = function (el, name, val) {
      // get
      if (arguments.length == 2) {
        return el.getAttribute(name);
      }

      // remove
      if (val === null) {
        return el.removeAttribute(name);
      }

      // set
      el.setAttribute(name, val);

      return el;
    };
  }, {}],
  56: [function (require, module, exports) {
    module.exports = require('component-classes');
  }, {"component-classes": 63}],
  57: [function (require, module, exports) {
    module.exports = require('component-delegate');
  }, {"component-delegate": 66}],
  58: [function (require, module, exports) {
    module.exports = require('domify');
  }, {"domify": 70}],
  59: [function (require, module, exports) {
    module.exports = require('component-event');
  }, {"component-event": 67}],
  60: [function (require, module, exports) {
    module.exports = require('component-matches-selector');
  }, {"component-matches-selector": 68}],
  61: [function (require, module, exports) {
    module.exports = require('component-query');
  }, {"component-query": 69}],
  62: [function (require, module, exports) {
    module.exports = function (el) {
      el.parentNode && el.parentNode.removeChild(el);
    };
  }, {}],
  63: [function (require, module, exports) {
    /**
     * Module dependencies.
     */

    var index = require('indexof');

    /**
     * Whitespace regexp.
     */

    var re = /\s+/;

    /**
     * toString reference.
     */

    var toString = Object.prototype.toString;

    /**
     * Wrap `el` in a `ClassList`.
     *
     * @param {Element} el
     * @return {ClassList}
     * @api public
     */

    module.exports = function (el) {
      return new ClassList(el);
    };

    /**
     * Initialize a new ClassList for `el`.
     *
     * @param {Element} el
     * @api private
     */

    function ClassList(el) {
      if (!el || !el.nodeType) {
        throw new Error('A DOM element reference is required');
      }
      this.el = el;
      this.list = el.classList;
    }

    /**
     * Add class `name` if not already present.
     *
     * @param {String} name
     * @return {ClassList}
     * @api public
     */

    ClassList.prototype.add = function (name) {
      // classList
      if (this.list) {
        this.list.add(name);
        return this;
      }

      // fallback
      var arr = this.array();
      var i = index(arr, name);
      if (!~i) arr.push(name);
      this.el.className = arr.join(' ');
      return this;
    };

    /**
     * Remove class `name` when present, or
     * pass a regular expression to remove
     * any which match.
     *
     * @param {String|RegExp} name
     * @return {ClassList}
     * @api public
     */

    ClassList.prototype.remove = function (name) {
      if ('[object RegExp]' == toString.call(name)) {
        return this.removeMatching(name);
      }

      // classList
      if (this.list) {
        this.list.remove(name);
        return this;
      }

      // fallback
      var arr = this.array();
      var i = index(arr, name);
      if (~i) arr.splice(i, 1);
      this.el.className = arr.join(' ');
      return this;
    };

    /**
     * Remove all classes matching `re`.
     *
     * @param {RegExp} re
     * @return {ClassList}
     * @api private
     */

    ClassList.prototype.removeMatching = function (re) {
      var arr = this.array();
      for (var i = 0; i < arr.length; i++) {
        if (re.test(arr[i])) {
          this.remove(arr[i]);
        }
      }
      return this;
    };

    /**
     * Toggle class `name`, can force state via `force`.
     *
     * For browsers that support classList, but do not support `force` yet,
     * the mistake will be detected and corrected.
     *
     * @param {String} name
     * @param {Boolean} force
     * @return {ClassList}
     * @api public
     */

    ClassList.prototype.toggle = function (name, force) {
      // classList
      if (this.list) {
        if ("undefined" !== typeof force) {
          if (force !== this.list.toggle(name, force)) {
            this.list.toggle(name); // toggle again to correct
          }
        } else {
          this.list.toggle(name);
        }
        return this;
      }

      // fallback
      if ("undefined" !== typeof force) {
        if (!force) {
          this.remove(name);
        } else {
          this.add(name);
        }
      } else {
        if (this.has(name)) {
          this.remove(name);
        } else {
          this.add(name);
        }
      }

      return this;
    };

    /**
     * Return an array of classes.
     *
     * @return {Array}
     * @api public
     */

    ClassList.prototype.array = function () {
      var className = this.el.getAttribute('class') || '';
      var str = className.replace(/^\s+|\s+$/g, '');
      var arr = str.split(re);
      if ('' === arr[0]) arr.shift();
      return arr;
    };

    /**
     * Check if class `name` is present.
     *
     * @param {String} name
     * @return {ClassList}
     * @api public
     */

    ClassList.prototype.has =
      ClassList.prototype.contains = function (name) {
        return this.list
          ? this.list.contains(name)
          : !!~index(this.array(), name);
      };

  }, {"indexof": 64}],
  64: [function (require, module, exports) {
    module.exports = function (arr, obj) {
      if (arr.indexOf) return arr.indexOf(obj);
      for (var i = 0; i < arr.length; ++i) {
        if (arr[i] === obj) return i;
      }
      return -1;
    };
  }, {}],
  65: [function (require, module, exports) {
    var matches = require('matches-selector')

    module.exports = function (element, selector, checkYoSelf, root) {
      element = checkYoSelf ? {parentNode: element} : element

      root = root || document

      // Make sure `element !== document` and `element != null`
      // otherwise we get an illegal invocation
      while ((element = element.parentNode) && element !== document) {
        if (matches(element, selector))
          return element
        // After `matches` on the edge case that
        // the selector matches the root
        // (when the root is not the document)
        if (element === root)
          return
      }
    }

  }, {"matches-selector": 68}],
  66: [function (require, module, exports) {
    /**
     * Module dependencies.
     */

    var closest = require('closest')
      , event = require('event');

    /**
     * Delegate event `type` to `selector`
     * and invoke `fn(e)`. A callback function
     * is returned which may be passed to `.unbind()`.
     *
     * @param {Element} el
     * @param {String} selector
     * @param {String} type
     * @param {Function} fn
     * @param {Boolean} capture
     * @return {Function}
     * @api public
     */

    exports.bind = function (el, selector, type, fn, capture) {
      return event.bind(el, type, function (e) {
        var target = e.target || e.srcElement;
        e.delegateTarget = closest(target, selector, true, el);
        if (e.delegateTarget) fn.call(el, e);
      }, capture);
    };

    /**
     * Unbind event `type`'s callback `fn`.
     *
     * @param {Element} el
     * @param {String} type
     * @param {Function} fn
     * @param {Boolean} capture
     * @api public
     */

    exports.unbind = function (el, type, fn, capture) {
      event.unbind(el, type, fn, capture);
    };

  }, {"closest": 65, "event": 67}],
  67: [function (require, module, exports) {
    var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
      unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
      prefix = bind !== 'addEventListener' ? 'on' : '';

    /**
     * Bind `el` event `type` to `fn`.
     *
     * @param {Element} el
     * @param {String} type
     * @param {Function} fn
     * @param {Boolean} capture
     * @return {Function}
     * @api public
     */

    exports.bind = function (el, type, fn, capture) {
      el[bind](prefix + type, fn, capture || false);
      return fn;
    };

    /**
     * Unbind `el` event `type`'s callback `fn`.
     *
     * @param {Element} el
     * @param {String} type
     * @param {Function} fn
     * @param {Boolean} capture
     * @return {Function}
     * @api public
     */

    exports.unbind = function (el, type, fn, capture) {
      el[unbind](prefix + type, fn, capture || false);
      return fn;
    };
  }, {}],
  68: [function (require, module, exports) {
    /**
     * Module dependencies.
     */

    var query = require('query');

    /**
     * Element prototype.
     */

    var proto = Element.prototype;

    /**
     * Vendor function.
     */

    var vendor = proto.matches
      || proto.webkitMatchesSelector
      || proto.mozMatchesSelector
      || proto.msMatchesSelector
      || proto.oMatchesSelector;

    /**
     * Expose `match()`.
     */

    module.exports = match;

    /**
     * Match `el` to `selector`.
     *
     * @param {Element} el
     * @param {String} selector
     * @return {Boolean}
     * @api public
     */

    function match(el, selector) {
      if (!el || el.nodeType !== 1) return false;
      if (vendor) return vendor.call(el, selector);
      var nodes = query.all(selector, el.parentNode);
      for (var i = 0; i < nodes.length; ++i) {
        if (nodes[i] == el) return true;
      }
      return false;
    }

  }, {"query": 69}],
  69: [function (require, module, exports) {
    function one(selector, el) {
      return el.querySelector(selector);
    }

    exports = module.exports = function (selector, el) {
      el = el || document;
      return one(selector, el);
    };

    exports.all = function (selector, el) {
      el = el || document;
      return el.querySelectorAll(selector);
    };

    exports.engine = function (obj) {
      if (!obj.one) throw new Error('.one callback required');
      if (!obj.all) throw new Error('.all callback required');
      one = obj.one;
      exports.all = obj.all;
      return exports;
    };

  }, {}],
  70: [function (require, module, exports) {

    /**
     * Expose `parse`.
     */

    module.exports = parse;

    /**
     * Tests for browser support.
     */

    var div = document.createElement('div');
// Setup
    div.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
// Make sure that link elements get serialized correctly by innerHTML
// This requires a wrapper element in IE
    var innerHTMLBug = !div.getElementsByTagName('link').length;
    div = undefined;

    /**
     * Wrap map from jquery.
     */

    var map = {
      legend: [1, '<fieldset>', '</fieldset>'],
      tr: [2, '<table><tbody>', '</tbody></table>'],
      col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
      // for script/link/style tags to work in IE6-8, you have to wrap
      // in a div with a non-whitespace character in front, ha!
      _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
    };

    map.td =
      map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

    map.option =
      map.optgroup = [1, '<select multiple="multiple">', '</select>'];

    map.thead =
      map.tbody =
        map.colgroup =
          map.caption =
            map.tfoot = [1, '<table>', '</table>'];

    map.polyline =
      map.ellipse =
        map.polygon =
          map.circle =
            map.text =
              map.line =
                map.path =
                  map.rect =
                    map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', '</svg>'];

    /**
     * Parse `html` and return a DOM Node instance, which could be a TextNode,
     * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
     * instance, depending on the contents of the `html` string.
     *
     * @param {String} html - HTML string to "domify"
     * @param {Document} doc - The `document` instance to create the Node for
     * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
     * @api private
     */

    function parse(html, doc) {
      if ('string' != typeof html) throw new TypeError('String expected');

      // default to the global `document` object
      if (!doc) doc = document;

      // tag name
      var m = /<([\w:]+)/.exec(html);
      if (!m) return doc.createTextNode(html);

      html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

      var tag = m[1];

      // body support
      if (tag == 'body') {
        var el = doc.createElement('html');
        el.innerHTML = html;
        return el.removeChild(el.lastChild);
      }

      // wrap map
      var wrap = map[tag] || map._default;
      var depth = wrap[0];
      var prefix = wrap[1];
      var suffix = wrap[2];
      var el = doc.createElement('div');
      el.innerHTML = prefix + html + suffix;
      while (depth--) el = el.lastChild;

      // one element
      if (el.firstChild == el.lastChild) {
        return el.removeChild(el.firstChild);
      }

      // several elements
      var fragment = doc.createDocumentFragment();
      while (el.firstChild) {
        fragment.appendChild(el.removeChild(el.firstChild));
      }

      return fragment;
    }

  }, {}],
  71: [function (require, module, exports) {
    module.exports = require('./lib/Table');

  }, {"./lib/Table": 72}],
  72: [function (require, module, exports) {
    'use strict';

    var di = require('didi');


    /**
     * Bootstrap an injector from a list of modules, instantiating a number of default components
     *
     * @ignore
     * @param {Array<didi.Module>} bootstrapModules
     *
     * @return {didi.Injector} a injector to use to access the components
     */
    function bootstrap(bootstrapModules) {

      var modules = [],
        components = [];

      function hasModule(m) {
        return modules.indexOf(m) >= 0;
      }

      function addModule(m) {
        modules.push(m);
      }

      function visit(m) {
        if (hasModule(m)) {
          return;
        }

        (m.__depends__ || []).forEach(visit);

        if (hasModule(m)) {
          return;
        }

        addModule(m);
        (m.__init__ || []).forEach(function (c) {
          components.push(c);
        });
      }

      bootstrapModules.forEach(visit);

      var injector = new di.Injector(modules);

      components.forEach(function (c) {

        try {
          // eagerly resolve component (fn or string)
          injector[typeof c === 'string' ? 'get' : 'invoke'](c);
        } catch (e) {
          console.error('Failed to instantiate component');
          console.error(e.stack);

          throw e;
        }
      });

      return injector;
    }

    /**
     * Creates an injector from passed options.
     *
     * @ignore
     * @param  {Object} options
     * @return {didi.Injector}
     */
    function createInjector(options) {

      options = options || {};

      var configModule = {
        'config': ['value', options]
      };

      var coreModule = require('./core');

      var modules = [configModule, coreModule].concat(options.modules || []);

      return bootstrap(modules);
    }


    /**
     * The main table-js entry point that bootstraps the table with the given
     * configuration.
     *
     * To register extensions with the table, pass them as Array<didi.Module> to the constructor.
     *
     * @class tjs.Table
     * @memberOf tjs
     * @constructor
     *
     * @param {Object} options
     * @param {Array<didi.Module>} [options.modules] external modules to instantiate with the table
     * @param {didi.Injector} [injector] an (optional) injector to bootstrap the table with
     */
    function Table(options, injector) {

      // create injector unless explicitly specified
      this.injector = injector = injector || createInjector(options);

      // API

      /**
       * Resolves a table service
       *
       * @method Table#get
       *
       * @param {String} name the name of the table service to be retrieved
       * @param {Object} [locals] a number of locals to use to resolve certain dependencies
       */
      this.get = injector.get;

      /**
       * Executes a function into which table services are injected
       *
       * @method Table#invoke
       *
       * @param {Function|Object[]} fn the function to resolve
       * @param {Object} locals a number of locals to use to resolve certain dependencies
       */
      this.invoke = injector.invoke;

      // init

      // indicate via event


      /**
       * An event indicating that all plug-ins are loaded.
       *
       * Use this event to fire other events to interested plug-ins
       *
       * @memberOf Table
       *
       * @event table.init
       *
       * @example
       *
       * eventBus.on('table.init', function() {
   *   eventBus.fire('my-custom-event', { foo: 'BAR' });
   * });
       *
       * @type {Object}
       */
      this.get('eventBus').fire('table.init');
    }

    module.exports = Table;


    /**
     * Destroys the table
     *
     * @method  Table#destroy
     */
    Table.prototype.destroy = function () {
      this.get('eventBus').fire('table.destroy');
    };

  }, {"./core": 77, "didi": 30}],
  73: [function (require, module, exports) {
    'use strict';

    var Model = require('../model');


    /**
     * A factory for diagram-js shapes
     */
    function ElementFactory() {
      this._uid = 12;
    }

    module.exports = ElementFactory;


    ElementFactory.prototype.createTable = function (attrs) {
      return document.createElement('table');
      //return this.create('table', attrs);
    };

    ElementFactory.prototype.createRow = function (attrs) {
      return this.create('row', attrs);
    };

    ElementFactory.prototype.createColumn = function (attrs) {
      return this.create('column', attrs);
    };

    /**
     * Create a model element with the given type and
     * a number of pre-set attributes.
     *
     * @param  {String} type
     * @param  {Object} attrs
     * @return {djs.model.Base} the newly created model instance
     */
    ElementFactory.prototype.create = function (type, attrs) {

      attrs = attrs || {};

      if (!attrs.id) {
        attrs.id = type + '_' + (this._uid++);
      }

      return Model.create(type, attrs);
    };

  }, {"../model": 111}],
  74: [function (require, module, exports) {
    'use strict';

    var ELEMENT_ID = 'data-element-id';


    /**
     * @class
     *
     * A registry that keeps track of all shapes in the diagram.
     */
    function ElementRegistry() {
      this._elements = {};
    }

    module.exports = ElementRegistry;

    /**
     * Register a pair of (element, gfx, (secondaryGfx)).
     *
     * @param {djs.model.Base} element
     * @param {Snap<SVGElement>} gfx
     * @param {Snap<SVGElement>} [secondaryGfx] optional other element to register, too
     */
    ElementRegistry.prototype.add = function (element, gfx, secondaryGfx) {

      var id = element.id;

      this._validateId(id);

      // associate dom node with element
      gfx.setAttribute(ELEMENT_ID, id);

      if (secondaryGfx) {
        secondaryGfx.setAttribute(ELEMENT_ID, id);
      }

      this._elements[id] = {element: element, gfx: gfx, secondaryGfx: secondaryGfx};
    };

    /**
     * Removes an element from the registry.
     *
     * @param {djs.model.Base} element
     */
    ElementRegistry.prototype.remove = function (element) {
      var elements = this._elements,
        id = element.id || element,
        container = id && elements[id];

      if (container) {

        // unset element id on gfx
        container.gfx.setAttribute(ELEMENT_ID, null);

        if (container.secondaryGfx) {
          container.secondaryGfx.setAttribute(ELEMENT_ID, null);
        }

        delete elements[id];
      }
    };

    /**
     * Update the id of an element
     *
     * @param {djs.model.Base} element
     * @param {String} newId
     */
    ElementRegistry.prototype.updateId = function (element, newId) {

      this._validateId(newId);

      if (typeof element === 'string') {
        element = this.get(element);
      }

      var gfx = this.getGraphics(element),
        secondaryGfx = this.getGraphics(element, true);

      this.remove(element);

      element.id = newId;

      this.add(element, gfx, secondaryGfx);
    };

    /**
     * Return the model element for a given id or graphics.
     *
     * @example
     *
     * elementRegistry.get('SomeElementId_1');
     * elementRegistry.get(gfx);
     *
     *
     * @param {String|SVGElement} filter for selecting the element
     *
     * @return {djs.model.Base}
     */
    ElementRegistry.prototype.get = function (filter) {
      var id;

      if (typeof filter === 'string') {
        id = filter;
      } else {
        // get by graphics
        id = filter && filter.getAttribute(ELEMENT_ID);
      }

      var container = this._elements[id];
      return container && container.element;
    };

    /**
     * Return all elements that match a given filter function.
     *
     * @param {Function} fn
     *
     * @return {Array<djs.model.Base>}
     */
    ElementRegistry.prototype.filter = function (fn) {

      var filtered = [];

      this.forEach(function (element, gfx) {
        if (fn(element, gfx)) {
          filtered.push(element);
        }
      });

      return filtered;
    };

    /**
     * Iterate over all diagram elements.
     *
     * @param {Function} fn
     */
    ElementRegistry.prototype.forEach = function (fn) {

      var map = this._elements;

      Object.keys(map).forEach(function (id) {
        var container = map[id],
          element = container.element,
          gfx = container.gfx;

        return fn(element, gfx);
      });
    };

    /**
     * Return the graphical representation of an element or its id.
     *
     * @example
     * elementRegistry.getGraphics('SomeElementId_1');
     * elementRegistry.getGraphics(rootElement); // <g ...>
     *
     * elementRegistry.getGraphics(rootElement, true); // <svg ...>
     *
     *
     * @param {String|djs.model.Base} filter
     * @param {Boolean} [secondary=false] whether to return the secondary connected element
     *
     * @return {SVGElement}
     */
    ElementRegistry.prototype.getGraphics = function (filter, secondary) {
      var id = filter.id || filter;

      var container = this._elements[id];
      return container && (secondary ? container.secondaryGfx : container.gfx);
    };

    /**
     * Validate the suitability of the given id and signals a problem
     * with an exception.
     *
     * @param {String} id
     *
     * @throws {Error} if id is empty or already assigned
     */
    ElementRegistry.prototype._validateId = function (id) {
      if (!id) {
        throw new Error('element must have an id');
      }

      if (this._elements[id]) {
        throw new Error('element with id ' + id + ' already added');
      }
    };

  }, {}],
  75: [function (require, module, exports) {
    'use strict';

    var forEach = require('lodash/collection/forEach');

    /**
     * A factory that creates graphical elements
     *
     * @param {Renderer} renderer
     */
    function GraphicsFactory(elementRegistry, renderer) {
      this._renderer = renderer;
      this._elementRegistry = elementRegistry;
    }

    GraphicsFactory.$inject = ['elementRegistry', 'renderer'];

    module.exports = GraphicsFactory;

    GraphicsFactory.prototype.create = function (type, element, parent) {
      var newElement;
      switch (type) {
        case 'row':
          newElement = document.createElement('tr');
          break;
        case 'cell':
          // cells consist of a td element with a nested span which contains the content
          newElement = document.createElement(element.row.useTH ? 'th' : 'td');
          var contentContainer = document.createElement('span');
          newElement.appendChild(contentContainer);
          break;
      }
      if (newElement && type === 'row') {
        if (element.next) {
          parent.insertBefore(newElement, this._elementRegistry.getGraphics(element.next));
        } else {
          parent.appendChild(newElement);
        }
      } else if (type === 'cell') {
        var neighboringCell = this._elementRegistry.filter(function (el) {
          return el.row === element.row && el.column === element.column.next;
        })[0];
        if (neighboringCell) {
          parent.insertBefore(newElement, this._elementRegistry.getGraphics(neighboringCell));
        } else {
          parent.appendChild(newElement);
        }
      }
      return newElement || document.createElement('div');
    };


    GraphicsFactory.prototype.update = function (type, element, gfx) {

      // Do not update root element
      if (!element.parent) {
        return;
      }

      var self = this;
      // redraw
      if (type === 'row') {
        this._renderer.drawRow(gfx, element);

        // also redraw all cells in this row
        forEach(this._elementRegistry.filter(function (el) {
          return el.row === element;
        }), function (cell) {
          self.update('cell', cell, self._elementRegistry.getGraphics(cell));
        });
      } else if (type === 'column') {
        this._renderer.drawColumn(gfx, element);

        // also redraw all cells in this column
        forEach(this._elementRegistry.filter(function (el) {
          return el.column === element;
        }), function (cell) {
          self.update('cell', cell, self._elementRegistry.getGraphics(cell));
        });
      } else if (type === 'cell') {
        this._renderer.drawCell(gfx, element);
      } else {
        throw new Error('unknown type: ' + type);
      }
    };

    GraphicsFactory.prototype.remove = function (element) {
      var gfx = this._elementRegistry.getGraphics(element);

      // remove
      gfx.parentNode && gfx.parentNode.removeChild(gfx);
    };

  }, {"lodash/collection/forEach": 130}],
  76: [function (require, module, exports) {
    'use strict';

    var isNumber = require('lodash/lang/isNumber'),
      assign = require('lodash/object/assign'),
      forEach = require('lodash/collection/forEach'),
      every = require('lodash/collection/every');

    function ensurePx(number) {
      return isNumber(number) ? number + 'px' : number;
    }

    /**
     * Creates a HTML container element for a table element with
     * the given configuration
     *
     * @param  {Object} options
     * @return {HTMLElement} the container element
     */
    function createContainer(options) {

      options = assign({}, {width: '100%', height: '100%'}, options);

      var container = options.container || document.body;

      // create a <div> around the table element with the respective size
      // this way we can always get the correct container size
      var parent = document.createElement('div');
      parent.setAttribute('class', 'tjs-container');

      assign(parent.style, {
        position: 'relative',
        overflow: 'hidden',
        width: ensurePx(options.width),
        height: ensurePx(options.height)
      });

      container.appendChild(parent);

      return parent;
    }

    var REQUIRED_MODEL_ATTRS = {
      row: ['next', 'previous'],
      column: ['next', 'previous'],
      cell: ['row', 'column']
    };

    /**
     * The main drawing sheet.
     *
     * @class
     * @constructor
     *
     * @emits Sheet#sheet.init
     *
     * @param {Object} config
     * @param {EventBus} eventBus
     * @param {GraphicsFactory} graphicsFactory
     * @param {ElementRegistry} elementRegistry
     */
    function Sheet(config, eventBus, elementRegistry, graphicsFactory) {
      this._eventBus = eventBus;
      this._elementRegistry = elementRegistry;
      this._graphicsFactory = graphicsFactory;

      this._init(config || {});
    }

    Sheet.$inject = ['config.sheet', 'eventBus', 'elementRegistry', 'graphicsFactory'];

    module.exports = Sheet;


    Sheet.prototype.getLastColumn = function () {
      return this._lastColumn;
    };

    Sheet.prototype.setLastColumn = function (element) {
      this._lastColumn = element;
    };

    Sheet.prototype.getLastRow = function () {
      return this._lastRow;
    };

    Sheet.prototype.setLastRow = function (element) {
      this._lastRow = element;
    };

    Sheet.prototype.setSibling = function (first, second) {
      if (first) first.next = second;
      if (second) second.previous = first;
    };

    Sheet.prototype.addSiblings = function (type, element) {
      var tmp;
      if (!element.previous && !element.next) {
        if (type === 'column') {
          // add column to end of table per default
          element.next = null;
          this.setSibling(this.getLastColumn(), element);
          this.setLastColumn(element);
        } else if (type === 'row') {
          // add row to end of table per default
          element.next = null;
          this.setSibling(this.getLastRow(), element);
          this.setLastRow(element);
        }
      } else if (element.previous && !element.next) {
        tmp = element.previous.next;
        this.setSibling(element.previous, element);
        this.setSibling(element, tmp);
      } else if (!element.previous && element.next) {
        tmp = element.next.previous;
        this.setSibling(tmp, element);
        this.setSibling(element, element.next);
      } else if (element.previous && element.next) {
        if (element.previous.next !== element.next) {
          throw new Error('cannot set both previous and next when adding new element <' + type + '>');
        } else {
          this.setSibling(element.previous, element);
          this.setSibling(element, element.next);
        }
      }
    };

    Sheet.prototype.removeSiblings = function (type, element) {
      if (type === 'column') {
        if (this.getLastColumn() === element) {
          this.setLastColumn(element.previous);
        }
      } else if (type === 'row') {
        if (this.getLastRow() === element) {
          this.setLastRow(element.previous);
        }
      }
      if (element.previous) {
        element.previous.next = element.next;
      }
      if (element.next) {
        element.next.previous = element.previous;
      }
      delete element.previous;
      delete element.next;
    };

    Sheet.prototype._init = function (config) {

      // Creates a <table> element that is wrapped into a <div>.
      // This way we are always able to correctly figure out the size of the table element
      // by querying the parent node.
      //
      // <div class="tjs-container" style="width: {desired-width}, height: {desired-height}">
      //   <table width="100%" height="100%">
      //    ...
      //   </table>
      // </div>

      // html container
      var eventBus = this._eventBus,
        container = createContainer(config),
        self = this;

      this._container = container;

      this._rootNode = document.createElement('table');

      assign(this._rootNode.style, {
        width: '100%'
      });

      container.appendChild(this._rootNode);

      this._head = document.createElement('thead');
      this._body = document.createElement('tbody');
      this._foot = document.createElement('tfoot');

      this._rootNode.appendChild(this._head);
      this._rootNode.appendChild(this._body);
      this._rootNode.appendChild(this._foot);

      this._lastColumn = null;
      this._lastRow = null;

      eventBus.on('table.init', function (event) {

        /**
         * An event indicating that the table is ready to be used.
         *
         * @memberOf Sheet
         *
         * @event sheet.init
         *
         * @type {Object}
         * @property {DOMElement} sheet the created table element
         * @property {Snap<SVGGroup>} viewport the direct parent of diagram elements and shapes
         */

        eventBus.fire('sheet.init', {sheet: self._rootNode});
      });

      eventBus.on('table.destroy', function () {

        var parent = self._container.parentNode;

        if (parent) {
          parent.removeChild(container);
        }

        eventBus.fire('sheet.destroy', {sheet: self._rootNode});
      });

    };


    /**
     * Returns the html element that encloses the
     * drawing canvas.
     *
     * @return {DOMNode}
     */
    Sheet.prototype.getContainer = function () {
      return this._container;
    };


///////////// add functionality ///////////////////////////////

    Sheet.prototype._ensureValid = function (type, element) {
      if (!element.id) {
        throw new Error('element must have an id');
      }

      if (this._elementRegistry.get(element.id)) {
        throw new Error('element with id ' + element.id + ' already exists');
      }

      var requiredAttrs = REQUIRED_MODEL_ATTRS[type];

      var valid = every(requiredAttrs, function (attr) {
        return typeof element[attr] !== 'undefined';
      });

      if (!valid) {
        throw new Error(
          'must supply { ' + requiredAttrs.join(', ') + ' } with ' + type);
      }
    };

    /**
     * Adds an element to the sheet.
     *
     * This wires the parent <-> child relationship between the element and
     * a explicitly specified parent or an implicit root element.
     *
     * During add it emits the events
     *
     *  * <{type}.add> (element, parent)
     *  * <{type}.added> (element, gfx)
     *
     * Extensions may hook into these events to perform their magic.
     *
     * @param {String} type
     * @param {Object|djs.model.Base} element
     * @param {Object|djs.model.Base} [parent]
     *
     * @return {Object|djs.model.Base} the added element
     */
    Sheet.prototype._addElement = function (type, element, parent) {

      element._type = type;

      var eventBus = this._eventBus,
        graphicsFactory = this._graphicsFactory;

      this._ensureValid(type, element);

      eventBus.fire(type + '.add', element);

      // create graphics

      element.parent = parent || this._rootNode;

      var gfx = graphicsFactory.create(type, element, element.parent);

      this._elementRegistry.add(element, gfx);

      // update its visual
      graphicsFactory.update(type, element, gfx);

      eventBus.fire(type + '.added', {element: element, gfx: gfx});

      return element;
    };

    Sheet.prototype.addRow = function (row) {
      if (!row.isHead && !row.isFoot) {
        this.addSiblings('row', row);
      } else {
        row.next = row.previous = null;
      }

      var r = this._addElement('row', row, row.isHead ? this._head : row.isFoot ? this._foot : this._body);

      this._eventBus.fire('cells.add', r);

      // create new cells
      var self = this;
      forEach(this._elementRegistry.filter(function (el) {
        return el._type === 'column';
      }).sort(function (a, b) {
        var c = a;
        while (c = c.next) {
          if (c === b) {
            return -1;
          }
        }
        return 1;
      }), function (el) {
        self._addCell({row: r, column: el, id: 'cell_' + el.id + '_' + r.id});
      });

      this._eventBus.fire('cells.added', r);

      return r;
    };

    Sheet.prototype.addColumn = function (column) {

      this.addSiblings('column', column);

      var c = this._addElement('column', column);

      this._eventBus.fire('cells.add', c);

      // create new cells
      var self = this;
      forEach(this._elementRegistry.filter(function (el) {
        return el._type === 'row';
      }), function (el) {
        self._addCell({row: el, column: c, id: 'cell_' + c.id + '_' + el.id});
      });

      this._eventBus.fire('cells.added', c);

      return c;
    };

    Sheet.prototype._addCell = function (cell) {
      return this._addElement('cell', cell, this._elementRegistry.getGraphics(cell.row.id));
    };

    Sheet.prototype.setCellContent = function (config) {
      if (typeof config.column === 'object') {
        config.column = config.column.id;
      }
      if (typeof config.row === 'object') {
        config.row = config.row.id;
      }

      this._elementRegistry.get('cell_' + config.column + '_' + config.row).content = config.content;
      this._graphicsFactory.update('cell', this._elementRegistry.get('cell_' + config.column + '_' + config.row),
        this._elementRegistry.getGraphics('cell_' + config.column + '_' + config.row));
    };

    Sheet.prototype.getCellContent = function (config) {
      return this._elementRegistry.get('cell_' + config.column + '_' + config.row).content;
    };


    /**
     * Internal remove element
     */
    Sheet.prototype._removeElement = function (element, type) {

      var elementRegistry = this._elementRegistry,
        graphicsFactory = this._graphicsFactory,
        eventBus = this._eventBus;

      element = elementRegistry.get(element.id || element);

      if (!element) {
        // element was removed already
        return;
      }

      eventBus.fire(type + '.remove', {element: element});

      graphicsFactory.remove(element);

      element.parent = null;

      elementRegistry.remove(element);

      eventBus.fire(type + '.removed', {element: element});

      return element;
    };

    Sheet.prototype.removeRow = function (element) {

      this.removeSiblings('row', element);

      var el = this._removeElement(element, 'row');

      // remove cells
      this._eventBus.fire('cells.remove', el);

      var self = this;
      forEach(this._elementRegistry.filter(function (el) {
        return el.row === element;
      }), function (el) {
        self._removeElement(el.id, 'cell');
      });

      this._eventBus.fire('cells.removed', el);

      return el;
    };

    Sheet.prototype.removeColumn = function (element) {

      this.removeSiblings('column', element);

      var el = this._removeElement(element, 'column');

      // remove cells
      this._eventBus.fire('cells.remove', el);

      var self = this;
      forEach(this._elementRegistry.filter(function (el) {
        return el.column === element;
      }), function (el) {
        self._removeElement(el.id, 'cell');
      });

      this._eventBus.fire('cells.removed', el);

      return el;
    };

    Sheet.prototype.getRootElement = function () {
      return this._rootNode;
    };

    Sheet.prototype.setRootElement = function (root) {
      this._rootNode = root;
    };

  }, {"lodash/collection/every": 127, "lodash/collection/forEach": 130, "lodash/lang/isNumber": 215, "lodash/object/assign": 219}],
  77: [function (require, module, exports) {
    module.exports = {
      __depends__: [require('../draw')],
      __init__: ['sheet'],
      sheet: ['type', require('./Sheet')],
      elementRegistry: ['type', require('./ElementRegistry')],
      elementFactory: ['type', require('./ElementFactory')],
      graphicsFactory: ['type', require('./GraphicsFactory')],
      eventBus: ['type', require('diagram-js/lib/core/EventBus')]
    };

  }, {
    "../draw": 79,
    "./ElementFactory": 73,
    "./ElementRegistry": 74,
    "./GraphicsFactory": 75,
    "./Sheet": 76,
    "diagram-js/lib/core/EventBus": 115
  }],
  78: [function (require, module, exports) {
    'use strict';

    var forEach = require('lodash/collection/forEach'),
      distance = function distance(from, to) {
        var i = 0,
          current = from.column;
        while (current && current !== to.column) {
          current = current.next;
          i++;
        }
        return !current ? -1 : i;
      };

    /**
     * The default renderer used for shapes and connections.
     *
     */
    function Renderer(elementRegistry, eventBus) {
      this._elementRegistry = elementRegistry;
      this._eventBus = eventBus;
    }

    Renderer.$inject = ['elementRegistry', 'eventBus'];

    module.exports = Renderer;

    Renderer.prototype.drawRow = function drawRow(gfx, data) {
      this._eventBus.fire('row.render', {
        gfx: gfx,
        data: data
      });
      return gfx;
    };

    Renderer.prototype.drawColumn = function drawColumn(gfx, data) {
      this._eventBus.fire('column.render', {
        gfx: gfx,
        data: data
      });
      return gfx;
    };

    Renderer.prototype.drawCell = function drawCell(gfx, data) {
      if (data.colspan) {
        gfx.setAttribute('colspan', data.colspan);
      }

      // traverse backwards to find colspanned elements which might overlap us
      var cells = this._elementRegistry.filter(function (element) {
        return element._type === 'cell' && element.row === data.row;
      });

      gfx.setAttribute('style', '');
      forEach(cells, function (cell) {
        var d = distance(cell, data);
        if (cell.colspan && d > 0 && d < cell.colspan) {
          gfx.setAttribute('style', 'display: none;');
        }
      });

      if (data.content) {
        if (typeof data.content === 'string' && !data.content.tagName) {
          gfx.childNodes[0].textContent = data.content;
        } else if (!!data.content.tagName) {
          gfx.childNodes[0].appendChild(data.content);
        }
      } else {
        gfx.childNodes[0].textContent = '';
      }

      this._eventBus.fire('cell.render', {
        gfx: gfx,
        data: data
      });

      return gfx;
    };


  }, {"lodash/collection/forEach": 130}],
  79: [function (require, module, exports) {
    module.exports = {
      renderer: ['type', require('./Renderer')]
    };

  }, {"./Renderer": 78}],
  80: [function (require, module, exports) {
    'use strict';

    var domify = require('min-dom/lib/domify');

// document wide unique overlay ids
    var ids = new (require('diagram-js/lib/util/IdGenerator'))('row');

    /**
     * Adds a control to the table to add more rows
     *
     * @param {EventBus} eventBus
     */
    function AddRow(eventBus, sheet, elementRegistry, modeling) {

      this.row = null;

      var self = this;
      // add the row control row
      eventBus.on('utilityColumn.added', function (column) {
        self.row = sheet.addRow({
          id: 'tjs-controls',
          isFoot: true
        });

        var node = domify('<a title="Add row" class="icon-dmn icon-plus"></a>');

        node.addEventListener('mouseup', function () {
          modeling.createRow({id: ids.next()});
        });

        sheet.setCellContent({
          row: self.row,
          column: column,
          content: node
        });

      });
    }

    AddRow.$inject = ['eventBus', 'sheet', 'elementRegistry', 'modeling'];

    module.exports = AddRow;

    AddRow.prototype.getRow = function () {
      return this.row;
    };

  }, {"diagram-js/lib/util/IdGenerator": 120, "min-dom/lib/domify": 58}],
  81: [function (require, module, exports) {
    'use strict';

    var domClasses = require('min-dom/lib/classes');

    function AddRowRenderer(eventBus,
                            addRow) {

      eventBus.on('cell.render', function (event) {
        if (event.data.row === addRow.getRow() && event.data.content) {
          domClasses(event.gfx).add('add-rule');
          event.gfx.childNodes[0].appendChild(event.data.content);
        }
      });

      eventBus.on('row.render', function (event) {
        if (event.data === addRow.getRow()) {
          domClasses(event.gfx).add('rules-controls');
        }
      });

    }

    AddRowRenderer.$inject = [
      'eventBus',
      'addRow'
    ];

    module.exports = AddRowRenderer;

  }, {"min-dom/lib/classes": 56}],
  82: [function (require, module, exports) {
    module.exports = {
      __init__: ['addRow', 'addRowRenderer'],
      __depends__: [
        require('../modeling'),
        require('../utility-column')
      ],
      addRow: ['type', require('./AddRow')],
      addRowRenderer: ['type', require('./AddRowRenderer')]
    };

  }, {"../modeling": 103, "../utility-column": 110, "./AddRow": 80, "./AddRowRenderer": 81}],
  83: [function (require, module, exports) {
    'use strict';

    /**
     * Adds change support to the sheet, including
     *
     * <ul>
     *   <li>redrawing rows and cells on change</li>
     * </ul>
     *
     * @param {EventBus} eventBus
     * @param {ElementRegistry} elementRegistry
     * @param {GraphicsFactory} graphicsFactory
     */
    function ChangeSupport(eventBus, elementRegistry, graphicsFactory) {

      // redraw row / cells on change

      eventBus.on('element.changed', function (event) {

        var element = event.element;

        if (!event.gfx) {
          event.gfx = elementRegistry.getGraphics(element);
        }

        // shape + gfx may have been deleted
        if (!event.gfx) {
          return;
        }

        if (element.column) {
          eventBus.fire('cell.changed', event);
        } else {
          eventBus.fire('row.changed', event);
        }
      });

      eventBus.on('elements.changed', function (event) {
        for (var i = 0; i < event.elements.length; i++) {
          eventBus.fire('element.changed', {element: event.elements[i]});
        }
      });

      eventBus.on('cell.changed', function (event) {
        graphicsFactory.update('cell', event.element, event.gfx);
      });

      eventBus.on('row.changed', function (event) {
        graphicsFactory.update('row', event.element, event.gfx);

        // also update all cells of the row
        var cells = elementRegistry.filter(function (ea) {
          return ea.row === event.element;
        });
        for (var i = 0; i < cells.length; i++) {
          graphicsFactory.update('cell', cells[i], elementRegistry.getGraphics(cells[i]));
        }
      });
    }

    ChangeSupport.$inject = ['eventBus', 'elementRegistry', 'graphicsFactory'];

    module.exports = ChangeSupport;

  }, {}],
  84: [function (require, module, exports) {
    module.exports = {
      __init__: ['changeSupport'],
      changeSupport: ['type', require('./ChangeSupport')]
    };

  }, {"./ChangeSupport": 83}],
  85: [function (require, module, exports) {
    'use strict';


    function EditBehavior(eventBus,
                          selection,
                          sheet,
                          elementRegistry,
                          modeling,
                          rules,
                          graphicsFactory,
                          keyboard,
                          commandStack,
                          tableName) {

      var ignoreFocus = false;

      eventBus.on('element.focus', function (event) {
        if (ignoreFocus) {
          ignoreFocus = false;
          return;
        }
        if (rules.allowed('cell.edit', {
            row: event.element.row,
            column: event.element.column,
            content: event.element.content
          }) && !event.element.row.isFoot) {

          event.gfx.childNodes[0].focus();

          var element = event.element;

          selection.select(element);

          // select the content of the focused cell
          var sel = window.getSelection();
          sel.selectAllChildren(event.gfx.childNodes[0]);

          // IE has execCommand, but throws an Exception when trying to use it with
          // enableInlineTableEditing
          // We need this line so that FF does not screw us with its build in
          // table editing features
          try {
            document.execCommand('enableInlineTableEditing', false, 'false');
          } catch (e) {
            // only catch the IE error
            if (e.description !== 'Invalid argument.') {
              // rethrow all other errors
              throw e;
            }
          }
        }
      });

      eventBus.on('element.mousedown', function (event) {
        if (rules.allowed('cell.edit', {
            row: event.element.row,
            column: event.element.column,
            content: event.element.content
          }) && !event.element.row.isFoot &&
          selection.get() !== event.element) {

          // when we use the mouse click, we want to select the element, but
          // do not want to perform auto-selection of the content, so
          // ignore the next focus event
          ignoreFocus = true;

          selection.select(event.element);

        }
      });

      eventBus.on('element.blur', function (event) {
        var element = event.element;

        if (selection.isSelected(element)) {
          selection.deselect();
        }
      });

      eventBus.on('selection.changed', function (event) {
        if (event.oldSelection) {
          // apply changes of the diagram to the model
          var gfxOld = elementRegistry.getGraphics(event.oldSelection);
          if (gfxOld) {
            modeling.editCell(event.oldSelection.row.id, event.oldSelection.column.id, gfxOld.textContent);
            graphicsFactory.update('row', event.oldSelection.row, elementRegistry.getGraphics(event.oldSelection.row));
            graphicsFactory.update('column', event.oldSelection.column,
              elementRegistry.getGraphics(event.oldSelection.column));
          }
        }
        if (event.newSelection) {
          graphicsFactory.update('cell', event.newSelection, elementRegistry.getGraphics(event.newSelection));
          graphicsFactory.update('row', event.newSelection.row, elementRegistry.getGraphics(event.newSelection.row));
          graphicsFactory.update('column', event.newSelection.column,
            elementRegistry.getGraphics(event.newSelection.column));
        }
      });

      var nameFocus = false;
      var nameElement = null;
      eventBus.on('tableName.init', function (event) {
        if (rules.allowed('name.edit')) {

          nameElement = event.node;
          event.node.setAttribute('contenteditable', true);

          event.node.addEventListener('focus', function (evt) {
            nameFocus = true;
          }, true);
          event.node.addEventListener('blur', function (evt) {
            nameFocus = false;
            modeling.editName(evt.target.textContent);
          }, true);
        }
      });

      if (keyboard) {
        // to react to keyboard events, commit work when stack actions will occur
        // HACK: Our handler needs a higher priority than the undo handler
        keyboard._listeners.unshift(function (key, modifiers) {
          if ((modifiers.ctrlKey || modifiers.metaKey) && !modifiers.shiftKey && key === 90) {
            if (nameFocus) {
              modeling.editName(nameElement.textContent);
            }
            var selected = selection.deselect();
            selection.select(selected);

          }
        });
      }
    }

    EditBehavior.$inject = [
      'eventBus',
      'selection',
      'sheet',
      'elementRegistry',
      'modeling',
      'rules',
      'graphicsFactory',
      'keyboard',
      'commandStack',
      'tableName'];

    module.exports = EditBehavior;

  }, {}],
  86: [function (require, module, exports) {
    'use strict';

    var domClasses = require('min-dom/lib/classes');

    function EditRenderer(eventBus,
                          rules) {

      eventBus.on('cell.render', function (event) {
        if (rules.allowed('cell.edit', {
            row: event.data.row,
            column: event.data.column,
            content: event.data.content
          }) && !event.data.row.isFoot) {
          event.gfx.childNodes[0].setAttribute('contenteditable', true);
        }

        event.gfx.childNodes[0].setAttribute('spellcheck', 'false');

        if (event.data.selected) {
          domClasses(event.gfx).add('focused');
        } else {
          domClasses(event.gfx).remove('focused');
        }

        if (!event.data.row.isFoot) {

          if (event.data.row.selected && !event.data.isHead) {
            domClasses(event.gfx).add('row-focused');
          } else {
            domClasses(event.gfx).remove('row-focused');
          }
          if (event.data.column.selected) {
            domClasses(event.gfx).add('col-focused');
          } else {
            domClasses(event.gfx).remove('col-focused');
          }
        }

      });

      eventBus.on('row.render', function (event) {
        if (event.data.selected && !event.data.isHead) {
          domClasses(event.gfx).add('row-focused');
        } else {
          domClasses(event.gfx).remove('row-focused');
        }

      });
    }

    EditRenderer.$inject = [
      'eventBus',
      'rules'
    ];

    module.exports = EditRenderer;

  }, {"min-dom/lib/classes": 56}],
  87: [function (require, module, exports) {
    'use strict';

    /**
     * A service that offers the current selection in a table.
     * Offers the api to control the selection, too.
     *
     * @class
     *
     * @param {EventBus} eventBus the event bus
     */
    function Selection(eventBus) {

      this._eventBus = eventBus;

      this._selectedElement = null;
    }

    Selection.$inject = ['eventBus'];

    module.exports = Selection;


    Selection.prototype.deselect = function (skipEvent) {
      if (this._selectedElement) {
        var oldSelection = this._selectedElement;

        this._selectedElement.row.selected = false;
        this._selectedElement.column.selected = false;
        this._selectedElement.selected = false;
        this._selectedElement = null;
        if (!skipEvent) {
          this._eventBus.fire('selection.changed', {oldSelection: oldSelection, newSelection: this._selectedElement});
        }
        return oldSelection;
      }
    };


    Selection.prototype.get = function () {
      return this._selectedElement;
    };

    Selection.prototype.isSelected = function (element) {
      return this._selectedElement === element;
    };


    /**
     * This method selects a cell in the table.
     *
     * @method Selection#select
     *
     * @param  {Object} element element to be selected
     */
    Selection.prototype.select = function (element) {
      if (!element || this.isSelected(element)) {
        return;
      }

      var oldSelection = this._selectedElement;

      if (oldSelection) {
        this.deselect(true);
      }

      this._selectedElement = element;
      element.selected = true;
      element.row.selected = true;
      element.column.selected = true;

      this._eventBus.fire('selection.changed', {oldSelection: oldSelection, newSelection: this._selectedElement});
    };

  }, {}],
  88: [function (require, module, exports) {
    module.exports = {
      __init__: ['editBehavior', 'editRenderer'],
      __depends__: [
        require('../interaction-events'),
        require('../modeling'),
        require('../keyboard'),
        require('diagram-js/lib/features/rules')
      ],
      selection: ['type', require('./Selection')],
      editBehavior: ['type', require('./EditBehavior')],
      editRenderer: ['type', require('./EditRenderer')]
    };

  }, {
    "../interaction-events": 90,
    "../keyboard": 92,
    "../modeling": 103,
    "./EditBehavior": 85,
    "./EditRenderer": 86,
    "./Selection": 87,
    "diagram-js/lib/features/rules": 118
  }],
  89: [function (require, module, exports) {
    'use strict';

    var forEach = require('lodash/collection/forEach'),
      domDelegate = require('min-dom/lib/delegate');


    var isPrimaryButton = require('diagram-js/lib/util/Mouse').isPrimaryButton;

    /**
     * A plugin that provides interaction events for table elements.
     *
     * It emits the following events:
     *
     *   * element.hover
     *   * element.out
     *   * element.click
     *   * element.dblclick
     *   * element.mousedown
     *   * element.focus
     *   * element.blur
     *
     * Each event is a tuple { element, gfx, originalEvent }.
     *
     * Canceling the event via Event#preventDefault() prevents the original DOM operation.
     *
     * @param {EventBus} eventBus
     */
    function InteractionEvents(eventBus, elementRegistry) {

      function fire(type, event) {
        var target = event.delegateTarget || event.target,
          gfx = target,
          element = elementRegistry.get(gfx),
          returnValue;

        if (!gfx || !element) {
          return;
        }

        returnValue = eventBus.fire(type, {element: element, gfx: gfx, originalEvent: event});

        if (returnValue === false) {
          event.stopPropagation();
          event.preventDefault();
        }
      }

      var handlers = {};

      function mouseHandler(type) {

        var fn = handlers[type];

        if (!fn) {
          fn = handlers[type] = function (event) {
            // only indicate left mouse button interactions and contextmenu
            if (isPrimaryButton(event) || type === 'element.contextmenu') {
              fire(type, event);
            }
          };
        }

        return fn;
      }

      var bindings = {
        mouseover: 'element.hover',
        mouseout: 'element.out',
        click: 'element.click',
        dblclick: 'element.dblclick',
        mousedown: 'element.mousedown',
        mouseup: 'element.mouseup',
        focus: 'element.focus',
        blur: 'element.blur',
        contextmenu: 'element.contextmenu'
      };

      var elementSelector = 'td';

      ///// event registration

      function isFocusEvent(event) {
        return event === 'focus' || event === 'blur';
      }

      function registerEvent(node, event, localEvent) {
        var handler = mouseHandler(localEvent);
        handler.$delegate = domDelegate.bind(node, elementSelector, event, handler, isFocusEvent(event));
      }

      function unregisterEvent(node, event, localEvent) {
        domDelegate.unbind(node, event, mouseHandler(localEvent).$delegate, isFocusEvent(event));
      }

      function registerEvents(node) {
        forEach(bindings, function (val, key) {
          registerEvent(node, key, val);
        });
      }

      function unregisterEvents(node) {
        forEach(bindings, function (val, key) {
          unregisterEvent(node, key, val);
        });
      }

      eventBus.on('sheet.destroy', function (event) {
        unregisterEvents(event.sheet);
      });

      eventBus.on('sheet.init', function (event) {
        registerEvents(event.sheet);
      });


      // API

      this.fire = fire;

      this.mouseHandler = mouseHandler;

      this.registerEvent = registerEvent;
      this.unregisterEvent = unregisterEvent;
    }


    InteractionEvents.$inject = ['eventBus', 'elementRegistry'];

    module.exports = InteractionEvents;


    /**
     * An event indicating that the mouse hovered over an element
     *
     * @event element.hover
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {element} gfx
     * @property {Event} originalEvent
     */

    /**
     * An event indicating that the mouse has left an element
     *
     * @event element.out
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {element} gfx
     * @property {Event} originalEvent
     */

    /**
     * An event indicating that the mouse has clicked an element
     *
     * @event element.click
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {element} gfx
     * @property {Event} originalEvent
     */

    /**
     * An event indicating that the mouse has double clicked an element
     *
     * @event element.dblclick
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {element} gfx
     * @property {Event} originalEvent
     */

    /**
     * An event indicating that the mouse has gone down on an element.
     *
     * @event element.mousedown
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {element} gfx
     * @property {Event} originalEvent
     */

    /**
     * An event indicating that the mouse has gone up on an element.
     *
     * @event element.mouseup
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {element} gfx
     * @property {Event} originalEvent
     */

    /**
     * An event indicating that the element has gained focus.
     *
     * @event element.focus
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {element} gfx
     * @property {Event} originalEvent
     */

    /**
     * An event indicating that the element has lost focus
     *
     * @event element.blur
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {element} gfx
     * @property {Event} originalEvent
     */

  }, {"diagram-js/lib/util/Mouse": 121, "lodash/collection/forEach": 130, "min-dom/lib/delegate": 57}],
  90: [function (require, module, exports) {
    module.exports = {
      __init__: ['interactionEvents'],
      interactionEvents: ['type', require('./InteractionEvents')]
    };

  }, {"./InteractionEvents": 89}],
  91: [function (require, module, exports) {
    'use strict';

    var domEvent = require('min-dom/lib/event'),
      domMatches = require('min-dom/lib/matches');

    /**
     * A keyboard abstraction that may be activated and
     * deactivated by users at will, consuming key events
     * and triggering table actions.
     *
     * The implementation fires the following key events that allow
     * other components to hook into key handling:
     *
     *  - keyboard.bind
     *  - keyboard.unbind
     *  - keyboard.init
     *  - keyboard.destroy
     *
     * All events contain the fields (node, listeners).
     *
     * A default binding for the keyboard may be specified via the
     * `keyboard.bindTo` configuration option.
     *
     * @param {EventBus} eventBus
     * @param {CommandStack} commandStack
     */
    function Keyboard(config, eventBus, commandStack) {
      var self = this;

      this._commandStack = commandStack;
      this._eventBus = eventBus;

      this._listeners = [];

      // our key handler is a singleton that passes
      // (keycode, modifiers) to each listener.
      //
      // listeners must indicate that they handled a key event
      // by returning true. This stops the event propagation.
      //
      this._keyHandler = function (event) {

        var i, l,
          target = event.target,
          listeners = self._listeners,
          code = event.keyCode || event.charCode || -1;

        if (domMatches(target, 'input, textarea')) {
          return;
        }

        for (i = 0; !!(l = listeners[i]); i++) {
          if (l(code, event)) {
            event.stopPropagation();
            event.preventDefault();
          }
        }
      };

      // properly clean dom registrations
      eventBus.on('table.destroy', function () {
        self._fire('destroy');

        self.unbind();
        self._listeners = null;
      });

      eventBus.on('table.init', function () {
        self._fire('init');

        if (config && config.bindTo) {
          self.bind(config.bindTo);
        }
      });

      this._init();
    }

    Keyboard.$inject = ['config.keyboard', 'eventBus', 'commandStack'];

    module.exports = Keyboard;


    Keyboard.prototype.bind = function (node) {
      this._node = node;

      // bind key events
      domEvent.bind(node, 'keydown', this._keyHandler, true);

      this._fire('bind');
    };

    Keyboard.prototype.getBinding = function () {
      return this._node;
    };

    Keyboard.prototype.unbind = function () {
      var node = this._node;

      if (node) {
        this._fire('unbind');

        // unbind key events
        domEvent.unbind(node, 'keydown', this._keyHandler, true);
      }

      this._node = null;
    };


    Keyboard.prototype._fire = function (event) {
      this._eventBus.fire('keyboard.' + event, {node: this._node, listeners: this._listeners});
    };

    Keyboard.prototype._init = function () {
      var listeners = this._listeners,
        commandStack = this._commandStack;


      // init default listeners

      // undo
      // (CTRL|CMD) + Z
      function undo(key, modifiers) {

        if (isCmd(modifiers) && !isShift(modifiers) && key === 90) {
          commandStack.undo();

          return true;
        }
      }

      // redo
      // CTRL + Y
      // CMD + SHIFT + Z
      function redo(key, modifiers) {

        if (isCmd(modifiers) && (key === 89 || (key === 90 && isShift(modifiers)))) {
          commandStack.redo();

          return true;
        }
      }

      listeners.push(undo);
      listeners.push(redo);
    };


    /**
     * Add a listener function that is notified with (key, modifiers) whenever
     * the keyboard is bound and the user presses a key.
     *
     * @param {Function} listenerFn
     */
    Keyboard.prototype.addListener = function (listenerFn) {
      this._listeners.push(listenerFn);
    };

    Keyboard.prototype.hasModifier = hasModifier;
    Keyboard.prototype.isCmd = isCmd;
    Keyboard.prototype.isShift = isShift;


    function hasModifier(modifiers) {
      return (modifiers.ctrlKey || modifiers.metaKey || modifiers.shiftKey || modifiers.altKey);
    }

    function isCmd(modifiers) {
      return modifiers.ctrlKey || modifiers.metaKey;
    }

    function isShift(modifiers) {
      return modifiers.shiftKey;
    }

  }, {"min-dom/lib/event": 59, "min-dom/lib/matches": 60}],
  92: [function (require, module, exports) {
    module.exports = {
      __init__: ['keyboard'],
      keyboard: ['type', require('./Keyboard')]
    };

  }, {"./Keyboard": 91}],
  93: [function (require, module, exports) {
    'use strict';

    function LineNumbers(eventBus, sheet) {

      this._sheet = sheet;
      this._utilityColumn = null;

      var self = this;

      eventBus.on('utilityColumn.added', function (column) {
        self._utilityColumn = column;
        self.updateLineNumbers();
      });
      var updateFct = function () {
        self.updateLineNumbers();
      };
      eventBus.on(['cells.added', 'row.removed'], updateFct);
    }


    LineNumbers.$inject = ['eventBus', 'sheet'];

    module.exports = LineNumbers;

    LineNumbers.prototype.updateLineNumbers = function () {
      if (!this._utilityColumn || !this._sheet._lastRow) {
        // only render line numbers if utility column has been added
        return;
      }

      // find the first row
      var currentRow = this._sheet._lastRow;
      while (currentRow.previous) {
        currentRow = currentRow.previous;
      }

      // update the row number for all rows
      var i = 1;
      while (currentRow) {
        this._sheet.setCellContent({
          row: currentRow,
          column: this._utilityColumn,
          content: i
        });
        i++;
        currentRow = currentRow.next;
      }
    };

  }, {}],
  94: [function (require, module, exports) {
    module.exports = {
      __init__: ['lineNumbers'],
      __depends__: [
        require('../utility-column')
      ],
      lineNumbers: ['type', require('./LineNumbers')]
    };

  }, {"../utility-column": 110, "./LineNumbers": 93}],
  95: [function (require, module, exports) {
    'use strict';

    var forEach = require('lodash/collection/forEach');


    /**
     * The basic modeling entry point.
     *
     * @param {EventBus} eventBus
     * @param {ElementFactory} elementFactory
     * @param {CommandStack} commandStack
     */
    function Modeling(eventBus, elementFactory, commandStack, sheet, tableName) {
      this._eventBus = eventBus;
      this._elementFactory = elementFactory;
      this._commandStack = commandStack;
      this._sheet = sheet;
      this._tableName = tableName;

      var self = this;

      // high priority listener to make sure listeners are initialized when
      // subsequent setup steps ask whether operations are possible
      eventBus.on('table.init', 1500, function () {
        // register modeling handlers
        self._registerHandlers(commandStack);
      });
    }

    Modeling.$inject = ['eventBus', 'elementFactory', 'commandStack', 'sheet', 'tableName'];

    module.exports = Modeling;


    Modeling.prototype.getHandlers = function () {
      return {
        'row.create': require('./cmd/CreateRowHandler'),
        'row.delete': require('./cmd/DeleteRowHandler'),
        'row.clear': require('./cmd/ClearRowHandler'),

        'column.create': require('./cmd/CreateColumnHandler'),
        'column.delete': require('./cmd/DeleteColumnHandler'),

        'cell.edit': require('./cmd/EditCellHandler'),

        'name.edit': require('./cmd/EditNameHandler')
      };
    };

    /**
     * Register handlers with the command stack
     *
     * @param {CommandStack} commandStack
     */
    Modeling.prototype._registerHandlers = function (commandStack) {
      forEach(this.getHandlers(), function (handler, id) {
        commandStack.registerHandler(id, handler);
      });
    };


///// modeling helpers /////////////////////////////////////////

    Modeling.prototype.createRow = function (row) {

      row = this._elementFactory.create('row', row);

      var context = {
        row: row
      };
      this._commandStack.execute('row.create', context);

      return context.row;
    };

    Modeling.prototype.createColumn = function (column) {

      column = this._elementFactory.create('column', column);

      var context = {
        column: column
      };

      this._commandStack.execute('column.create', context);

      return context.column;
    };

    Modeling.prototype.deleteRow = function (row) {

      var context = {
        row: row
      };

      this._commandStack.execute('row.delete', context);

      return context.row;
    };

    Modeling.prototype.clearRow = function (row) {

      var context = {
        row: row
      };

      this._commandStack.execute('row.clear', context);

      return context.row;
    };

    Modeling.prototype.deleteColumn = function (column) {

      var context = {
        column: column
      };

      this._commandStack.execute('column.delete', context);

      return context.column;
    };

    Modeling.prototype.editCell = function (row, column, content) {

      var context = {
        row: row,
        column: column,
        content: content
      };

      if (content !== this._sheet.getCellContent(context)) {
        // only execute edit command if content changed
        this._commandStack.execute('cell.edit', context);
      }

      return context;
    };

    Modeling.prototype.editName = function (newName) {
      var context = {
        newName: newName
      };

      if (newName !== this._tableName.getName()) {
        this._commandStack.execute('name.edit', context);
      }

      return context;
    };

  }, {
    "./cmd/ClearRowHandler": 96,
    "./cmd/CreateColumnHandler": 97,
    "./cmd/CreateRowHandler": 98,
    "./cmd/DeleteColumnHandler": 99,
    "./cmd/DeleteRowHandler": 100,
    "./cmd/EditCellHandler": 101,
    "./cmd/EditNameHandler": 102,
    "lodash/collection/forEach": 130
  }],
  96: [function (require, module, exports) {
    'use strict';

    var forEach = require('lodash/collection/forEach');

    /**
     * A handler that implements reversible clear of rows
     *
     * @param {sheet} sheet
     */
    function DeleteRowHandler(sheet, elementRegistry, utilityColumn) {
      this._sheet = sheet;
      this._elementRegistry = elementRegistry;
      this._utilityColumn = utilityColumn;
    }

    DeleteRowHandler.$inject = ['sheet', 'elementRegistry', 'utilityColumn'];

    module.exports = DeleteRowHandler;


////// api /////////////////////////////////////////


    /**
     * Clear a row
     *
     * @param {Object} context
     */
    DeleteRowHandler.prototype.execute = function (context) {
      var self = this;
      var utilityColumn = this._utilityColumn && this._utilityColumn.getColumn();
      var cells = this._elementRegistry.filter(function (element) {
        if (utilityColumn) {
          return element._type === 'cell' && element.row === context.row && element.column !== utilityColumn;
        } else {
          return element._type === 'cell' && element.row === context.row;
        }
      });
      context._oldContent = [];
      forEach(cells, function (cell) {
        context._oldContent.push(cell.content);
        self._sheet.setCellContent({row: context.row, column: cell.column, content: null});
      });
    };


    /**
     * Undo clear by resetting the content
     */
    DeleteRowHandler.prototype.revert = function (context) {
      var self = this;
      var utilityColumn = this._utilityColumn && this._utilityColumn.getColumn();
      var cells = this._elementRegistry.filter(function (element) {
        if (utilityColumn) {
          return element._type === 'cell' && element.row === context.row && element.column !== utilityColumn;
        } else {
          return element._type === 'cell' && element.row === context.row;
        }
      });
      var i = 0;
      forEach(cells, function (cell) {
        self._sheet.setCellContent({row: context.row, column: cell.column, content: context._oldContent[i++]});
      });
    };

  }, {"lodash/collection/forEach": 130}],
  97: [function (require, module, exports) {
    'use strict';

    /**
     * A handler that implements reversible addition of columns.
     *
     * @param {sheet} sheet
     */
    function CreateColumnHandler(sheet) {
      this._sheet = sheet;
    }

    CreateColumnHandler.$inject = ['sheet'];

    module.exports = CreateColumnHandler;


////// api /////////////////////////////////////////


    /**
     * Appends a column to the sheet
     *
     * @param {Object} context
     */
    CreateColumnHandler.prototype.execute = function (context) {
      if (context._previousColumn) {
        context.column.previous = context._previousColumn;
      }
      if (context._nextColumn) {
        context.column.next = context._nextColumn;
      }

      this._sheet.addColumn(context.column);

      context._previousColumn = context.column.previous;
      context._nextColumn = context.column.next;

      return context.column;
    };


    /**
     * Undo create by removing the column
     */
    CreateColumnHandler.prototype.revert = function (context) {
      this._sheet.removeColumn(context.column);
    };

  }, {}],
  98: [function (require, module, exports) {
    'use strict';

    /**
     * A handler that implements reversible addition of rows.
     *
     * @param {sheet} sheet
     */
    function CreateRowHandler(sheet) {
      this._sheet = sheet;
    }

    CreateRowHandler.$inject = ['sheet'];

    module.exports = CreateRowHandler;


////// api /////////////////////////////////////////


    /**
     * Appends a row to the sheet
     *
     * @param {Object} context
     */
    CreateRowHandler.prototype.execute = function (context) {
      if (context._previousRow) {
        context.row.previous = context._previousRow;
      }
      if (context._nextRow) {
        context.row.next = context._nextRow;
      }

      this._sheet.addRow(context.row);

      context._previousRow = context.row.previous;
      context._nextRow = context.row.next;

      return context.row;
    };


    /**
     * Undo create by removing the row
     */
    CreateRowHandler.prototype.revert = function (context) {
      this._sheet.removeRow(context.row);
    };

  }, {}],
  99: [function (require, module, exports) {
    'use strict';

    var forEach = require('lodash/collection/forEach');

    /**
     * A handler that implements reversible addition of columns.
     *
     * @param {sheet} sheet
     */
    function DeleteColumnHandler(sheet, elementRegistry) {
      this._sheet = sheet;
      this._elementRegistry = elementRegistry;
    }

    DeleteColumnHandler.$inject = ['sheet', 'elementRegistry'];

    module.exports = DeleteColumnHandler;


////// api /////////////////////////////////////////


    /**
     * Appends a column to the sheet
     *
     * @param {Object} context
     */
    DeleteColumnHandler.prototype.execute = function (context) {

      // save the neighbors
      context._next = context.column.next;
      context._previous = context.column.previous;

      // save the cells
      context._cells = this._elementRegistry.filter(function (element) {
        return element._type === 'cell' && element.column === context.column;
      });

      this._sheet.removeColumn(context.column);
      return context.column;
    };


    /**
     * Undo create by removing the column
     */
    DeleteColumnHandler.prototype.revert = function (context) {
      context.column.next = context._next;
      context.column.previous = context._previous;

      this._sheet.addColumn(context.column);

      var self = this;

      // relive the cells
      forEach(context._cells, function (cell) {
        self._sheet.setCellContent({row: cell.row, column: context.column, content: cell.content});
      });
    };

  }, {"lodash/collection/forEach": 130}],
  100: [function (require, module, exports) {
    'use strict';

    var forEach = require('lodash/collection/forEach');

    /**
     * A handler that implements reversible addition of rows.
     *
     * @param {sheet} sheet
     */
    function DeleteRowHandler(sheet, elementRegistry) {
      this._sheet = sheet;
      this._elementRegistry = elementRegistry;
    }

    DeleteRowHandler.$inject = ['sheet', 'elementRegistry'];

    module.exports = DeleteRowHandler;


////// api /////////////////////////////////////////


    /**
     * Appends a row to the sheet
     *
     * @param {Object} context
     */
    DeleteRowHandler.prototype.execute = function (context) {

      // save the neighbors
      context._next = context.row.next;
      context._previous = context.row.previous;

      // save the cells
      context._cells = this._elementRegistry.filter(function (element) {
        return element._type === 'cell' && element.row === context.row;
      });

      this._sheet.removeRow(context.row);
      return context.row;
    };


    /**
     * Undo create by removing the row
     */
    DeleteRowHandler.prototype.revert = function (context) {
      context.row.next = context._next;
      context.row.previous = context._previous;

      this._sheet.addRow(context.row);

      var self = this;

      // relive the cells
      forEach(context._cells, function (cell) {
        self._sheet.setCellContent({column: cell.column, row: context.row, content: cell.content});
      });
    };

  }, {"lodash/collection/forEach": 130}],
  101: [function (require, module, exports) {
    'use strict';

    /**
     * A handler that implements reversible addition of rows.
     *
     * @param {sheet} sheet
     */
    function EditCellHandler(sheet) {
      this._sheet = sheet;
    }

    EditCellHandler.$inject = ['sheet'];

    module.exports = EditCellHandler;


////// api /////////////////////////////////////////


    /**
     * Edits the content of the cell
     *
     * @param {Object} context
     */
    EditCellHandler.prototype.execute = function (context) {
      context.oldContent = this._sheet.getCellContent(context);
      this._sheet.setCellContent(context);
      return context;
    };


    /**
     * Undo Edit by resetting the content
     */
    EditCellHandler.prototype.revert = function (context) {
      this._sheet.setCellContent({row: context.row, column: context.column, content: context.oldContent});
      return context;
    };

  }, {}],
  102: [function (require, module, exports) {
    'use strict';

    /**
     * A handler that implements reversible editing of the table name.
     *
     * @param {tableName} tableName
     */
    function EditNameHandler(tableName) {
      this._tableName = tableName;
    }

    EditNameHandler.$inject = ['tableName'];

    module.exports = EditNameHandler;


////// api /////////////////////////////////////////


    /**
     * Edits the table name
     *
     * @param {Object} context
     */
    EditNameHandler.prototype.execute = function (context) {
      context.oldName = this._tableName.getName();
      this._tableName.setName(context.newName);
      return context;
    };


    /**
     * Undo Edit by resetting the content
     */
    EditNameHandler.prototype.revert = function (context) {
      this._tableName.setName(context.oldName);
      return context;
    };

  }, {}],
  103: [function (require, module, exports) {
    module.exports = {
      __depends__: [
        require('diagram-js/lib/command'),
        require('../change-support'),
        require('diagram-js/lib/features/rules'),
        require('../utility-column')
      ],
      __init__: ['modeling'],
      modeling: ['type', require('./Modeling')]
    };

  }, {
    "../change-support": 84,
    "../utility-column": 110,
    "./Modeling": 95,
    "diagram-js/lib/command": 114,
    "diagram-js/lib/features/rules": 118
  }],
  104: [function (require, module, exports) {
    'use strict';

    var forEach = require('lodash/collection/forEach'),
      assign = require('lodash/object/assign'),
      domDelegate = require('min-dom/lib/delegate'),
      domify = require('min-dom/lib/domify'),
      domClasses = require('min-dom/lib/classes'),
      domAttr = require('min-dom/lib/attr'),
      domRemove = require('min-dom/lib/remove');


    var DATA_REF = 'data-id';

    /**
     * A popup menu that can be used to display a list of actions.
     *
     * {@link PopupMenu#open} is used to create and open the popup menu.
     * With {@link PopupMenu#update} it is possible to update certain entries in the popup menu
     * (see examples below).
     *
     * @example
     *
     * // create a basic popup menu
     * popupMenu.open(
     *   {
 *     position: { x: 100, y: 100 },
 *     entries: [
 *       {
 *         id: 'entry-1',
 *         label: 'Entry 1',
 *         action: function(event, entry) {
 *           // do some stuff
 *         }
 *       },
 *       {
 *         id: 'entry-2',
 *         label: 'Entry 2'
 *       }
 *     ]
 *   }
     * );
     *
     * // create a more complex popup menu
     * popupMenu.open({
 *   position: { x: 100, y: 100 },
 *   entries: [
 *     {
 *       id: 'entry-1',
 *       label: 'Entry 1',
 *       action: function(event, entry) {
 *         if (entry.active) {
 *           // Removes the HTML class 'active' from the entry div, if it is clicked.
 *           popupMenu.update(entry, { active: false });
 *         } else {
*           // Adds the HTML class 'active' from the entry div, if it is clicked.
 *           popupMenu.update(entry, { active: true });
 *         }
 *       }
 *     }
 *   ]
 * });
     *
     * // With popupMenu.update() it is possbile to update a certain entry by id.
     * // This functionality can be used to add the HTML classes 'active' or
     * // 'disabled' to a certain entry div element. This can be useful in action
     * // handler functions (see complex example above).
     * popupMenu.update('header-entry-a', { active: true });
     * popupMenu.update('header-entry-a', { disabled: true });
     *
     * // It is also possible to remove these classes:
     * popupMenu.update('header-entry-a', { active: false });
     * popupMenu.update('header-entry-a', { disabled: false });
     *
     *
     * @param {EventBus} eventBus
     * @param {Sheet} sheet
     *
     * @class
     * @constructor
     */
    function PopupMenu(eventBus, sheet) {

      this._eventBus = eventBus;
      this._sheet = sheet;
    }

    PopupMenu.$inject = ['eventBus', 'sheet'];


    /**
     * Creates the popup menu, adds entries and attaches it to the DOM.
     *
     * @param {Object} menu
     * @param {Object} menu.position
     * @param {String} [menu.className] a custom HTML class name for the popup menu
     *
     * @param {Array.<Object>} menu.entries
     * @param {String} menu.entries[].id
     * @param {String} menu.entries[].content Either an embedded entries array or an object describing the entry
     * @param {String} menu.entries[].content.label
     * @param {String} [menu.entries[].content.className] a custom HTML class name for the entry div element
     * @param {Object} [menu.entries[].content.action] a handler function that will be called on a click on the entry
     *
     * @return {PopupMenu}
     */
    PopupMenu.prototype.open = function (menu) {

      var className = menu.className || 'popup-menu',
        position = menu.position,
        entries = menu.entries;

      if (!position) {
        throw new Error('the position argument is missing');
      }

      if (!entries) {
        throw new Error('the entries argument is missing');
      }

      // make sure, only one popup menu is open at a time
      if (this.isOpen()) {
        this.close();
      }

      var sheet = this._sheet,
        parent = document.body, //sheet.getContainer(),
        container = this._createContainer(className, position);

      this._createEntries(entries, container);

      this._attachContainer(container, parent);

      this._current = {
        container: container,
        menu: menu
      };

      return this;
    };


    /**
     * Removes the popup menu and unbinds the event handlers.
     */
    PopupMenu.prototype.close = function () {

      if (!this.isOpen()) {
        return;
      }

      this._unbindHandlers();
      domRemove(this._current.container);
      this._current = null;
    };


    /**
     * Determines, if an open popup menu exist.
     * @return {Boolean}
     */
    PopupMenu.prototype.isOpen = function () {
      return !!this._current;
    };


    /**
     * Trigger an action associated with an entry.
     *
     * @param {Object} event
     */
    PopupMenu.prototype.trigger = function (event) {

      // silence other actions
      event.preventDefault();

      var element = event.delegateTarget || event.target,
        entryId = domAttr(element, DATA_REF);

      var entry = this._getEntry(entryId);

      if (entry.action) {
        return entry.action.call(null, event, entry);
      }
    };


    /**
     * Updates the attributes of an entry instance.
     *
     * The properties `active` and `disabled` will be added to entries as class names.
     * This allows for state specific styling.
     *
     * @example
     *
     * popupMenu.update('header-entry-a', { active: true });
     * popupMenu.update('header-entry-a', { disabled: true });
     *
     * @param  {String|Object} entry the id of an entry or the entry instance itself
     * @param  {Object} updatedAttrs an object with the attributes that will be updated
     */
    PopupMenu.prototype.update = function (entry, updatedAttrs) {

      if (typeof entry === 'string') {
        entry = this._getEntry(entry);
      }

      assign(entry, updatedAttrs);

      // redraw the menu by reopening it
      this.open(this._current.menu);
    };


    /**
     * Gets an entry instance (either entry or headerEntry) by id.
     *
     * @param  {String} entryId
     *
     * @return {Object} entry instance
     */
    PopupMenu.prototype._getEntry = function (entryId) {

      var menu = this._current.menu;

      var searchFct = function (haystack, needle) {
        for (var i = 0; i < haystack.length; i++) {
          if (haystack[i].id === needle) {
            return haystack[i];
          }
          if (haystack[i].content.entries) {
            var found = searchFct(haystack[i].content.entries, needle);
            if (found) {
              return found;
            }
          }
        }
      };
      var entry = searchFct(menu.entries, entryId);

      if (!entry) {
        throw new Error('entry not found');
      }

      return entry;
    };


    /**
     * Creates the popup menu container.
     *
     * @param {String} event
     * @param {Object} position
     */
    PopupMenu.prototype._createContainer = function (className, position) {
      var container = domify('<nav class="dmn-context-menu">');

      assign(container.style, {
        position: 'absolute',
        left: position.x + 'px',
        top: position.y + 'px'
      });

      domClasses(container).add(className);

      return container;
    };


    /**
     * Attaches the container to the DOM and binds the event handlers.
     *
     * @param {Object} container
     * @param {Object} parent
     */
    PopupMenu.prototype._attachContainer = function (container, parent) {
      var self = this;

      // Event handler
      domDelegate.bind(container, '.entry', 'click', function (event) {
        self.trigger(event);
      });

      // Prevent default for mousedown events (so that selection does not get lost)
      domDelegate.bind(container, '.entry', 'mousedown', function (event) {
        event.preventDefault();
      });
      // Attach to DOM
      parent.appendChild(container);

      // Add Handler
      this._bindHandlers();
    };


    /**
     * Creates and attaches entries to the popup menu.
     *
     * @param {Array<Object>} entries an array of entry objects
     * @param {Object} container the parent DOM container
     * @param {String} className the class name of the entry container
     */
    PopupMenu.prototype._createEntries = function (entries, container) {

      var entriesContainer = domify('<ul>'),
        self = this;

      forEach(entries, function (entry) {
        self._createEntry(entry, entriesContainer);
      });

      domClasses(entriesContainer).add('dropdown-menu');

      container.appendChild(entriesContainer);
    };


    /**
     * Creates a single entry and attaches it to the specified DOM container.
     *
     * @param  {Object} entry
     * @param  {Object} container
     */
    PopupMenu.prototype._createEntry = function (entry, container) {

      if (!entry.id) {
        throw new Error('every entry must have the id property set');
      }

      var entryContainer = domify('<li>'),
        entryClasses = domClasses(entryContainer),
        link = domify('<a>'),
        linkClasses = domClasses(link);

      entryContainer.appendChild(link);

      entryClasses.add('entry');

      if (entry.content.className) {
        entryClasses.add(entry.content.className);
      }
      if (entry.content.linkClass) {
        linkClasses.add(entry.content.linkClass);
      }

      domAttr(entryContainer, DATA_REF, entry.id);

      // icon
      var icon = domify('<span>'),
        iconClasses = domClasses(icon);

      iconClasses.add('icon');
      if (entry.content.icon) {
        iconClasses.add(entry.content.icon);
      }
      link.appendChild(icon);

      // label
      var label = domify('<span>'),
        labelClasses = domClasses(label);
      labelClasses.add('label');
      link.appendChild(label);


      if (entry.content.entries) {
        // create a nested menu
        label.textContent = entry.content.label;
        entryClasses.add('dropdown');
        this._createEntries(entry.content.entries, entryContainer);
      } else {
        // create a normal entry
        if (entry.content.label) {
          label.textContent = entry.content.label;
        }

        if (entry.content.imageUrl) {
          entryContainer.appendChild(domify('<img src="' + entry.content.imageUrl + '" />'));
        }

        if (entry.content.active === true) {
          entryClasses.add('active');
        }

        if (entry.content.disabled === true) {
          entryClasses.add('disabled');
        }

      }

      container.appendChild(entryContainer);
    };


    /**
     * Binds the `close` method to 'contextPad.close' & 'canvas.viewbox.changed'.
     */
    PopupMenu.prototype._bindHandlers = function () {
      /*
       var eventBus = this._eventBus,
       self = this;

       function close() {
       self.close();
       }

       eventBus.once('contextPad.close', close);
       eventBus.once('canvas.viewbox.changed', close);
       */
    };


    /**
     * Unbinds the `close` method to 'contextPad.close' & 'canvas.viewbox.changed'.
     */
    PopupMenu.prototype._unbindHandlers = function () {
      /*
       var eventBus = this._eventBus,
       self = this;

       function close() {
       self.close();
       }

       eventBus.off('contextPad.close', close);
       eventBus.off('canvas.viewbox.changed', close);
       */
    };

    module.exports = PopupMenu;

  }, {
    "lodash/collection/forEach": 130,
    "lodash/object/assign": 219,
    "min-dom/lib/attr": 55,
    "min-dom/lib/classes": 56,
    "min-dom/lib/delegate": 57,
    "min-dom/lib/domify": 58,
    "min-dom/lib/remove": 62
  }],
  105: [function (require, module, exports) {
    'use strict';

    module.exports = {
      __init__: ['popupMenu'],
      popupMenu: ['type', require('./PopupMenu')]
    };

  }, {"./PopupMenu": 104}],
  106: [function (require, module, exports) {
    'use strict';

    var domify = require('min-dom/lib/domify');

    /**
     * Adds a header to the table containing the table name
     *
     * @param {EventBus} eventBus
     */
    function TableName(eventBus, sheet, tableName) {

      this.tableName = tableName;

      this.node = domify('<header><h3>' + this.tableName + '</h3></header');

      var self = this;
      eventBus.on('sheet.init', function (event) {
        sheet.getContainer().insertBefore(self.node, sheet.getRootElement());
        eventBus.fire('tableName.init', {node: self.node.querySelector('h3')});
      });
      eventBus.on('sheet.destroy', function (event) {
        sheet.getContainer().removeChild(self.node);
        eventBus.fire('tableName.destroy', {node: self.node.querySelector('h3')});
      });
    }

    TableName.$inject = ['eventBus', 'sheet', 'config.tableName'];

    module.exports = TableName;

    TableName.prototype.setName = function (newName) {
      this.tableName = newName;
      this.node.querySelector('h3').textContent = newName;
    };

    TableName.prototype.getName = function () {
      return this.tableName;
    };

    TableName.prototype.getNode = function () {
      return this.node.querySelector('h3');
    };

  }, {"min-dom/lib/domify": 58}],
  107: [function (require, module, exports) {
    'use strict';

    /**
     * Adds a dedicated column to the table dedicated to hold controls and meta information
     *
     * @param {EventBus} eventBus
     */
    function UtilityColumn(eventBus, sheet) {

      // add the row control row
      this.column = null;
      var self = this;
      eventBus.on('sheet.init', function (event) {

        eventBus.fire('utilityColumn.add', event);

        self.column = sheet.addColumn({
          id: 'utilityColumn'
        });

        eventBus.fire('utilityColumn.added', self.column);
      });
      eventBus.on('sheet.destroy', function (event) {

        eventBus.fire('utilityColumn.destroy', self.column);

        sheet.removeColumn({
          id: 'utilityColumn'
        });

        eventBus.fire('utilityColumn.destroyed', self.column);
      });
    }

    UtilityColumn.$inject = ['eventBus', 'sheet'];

    module.exports = UtilityColumn;


    UtilityColumn.prototype.getColumn = function () {
      return this.column;
    };

  }, {}],
  108: [function (require, module, exports) {
    'use strict';

    var domClasses = require('min-dom/lib/classes');

    function UtilityColumnRenderer(eventBus,
                                   utilityColumn) {

      eventBus.on('cell.render', function (event) {
        if (event.data.column === utilityColumn.getColumn() && !event.data.row.isFoot) {
          event.gfx.childNodes[0].textContent = event.data.content;
          domClasses(event.gfx).add(event.data.row.isHead ? 'hit' : 'number');
        }
      });
    }

    UtilityColumnRenderer.$inject = [
      'eventBus',
      'utilityColumn'
    ];

    module.exports = UtilityColumnRenderer;

  }, {"min-dom/lib/classes": 56}],
  109: [function (require, module, exports) {
    'use strict';

    var inherits = require('inherits');

    var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');

    /**
     * LineNumber specific modeling rule
     */
    function UtilityColumnRules(eventBus, utilityColumn) {
      RuleProvider.call(this, eventBus);

      this._utilityColumn = utilityColumn;
    }

    inherits(UtilityColumnRules, RuleProvider);

    UtilityColumnRules.$inject = ['eventBus', 'utilityColumn'];

    module.exports = UtilityColumnRules;

    UtilityColumnRules.prototype.init = function () {
      var self = this;
      this.addRule('cell.edit', function (context) {
        if (context.column === self._utilityColumn.getColumn()) {
          return false;
        }
      });

    };

  }, {"diagram-js/lib/features/rules/RuleProvider": 116, "inherits": 54}],
  110: [function (require, module, exports) {
    module.exports = {
      __init__: ['utilityColumn', 'utilityColumnRules', 'utilityColumnRenderer'],
      __depends__: [
        require('diagram-js/lib/features/rules')
      ],
      utilityColumn: ['type', require('./UtilityColumn')],
      utilityColumnRules: ['type', require('./UtilityColumnRules')],
      utilityColumnRenderer: ['type', require('./UtilityColumnRenderer')]
    };

  }, {"./UtilityColumn": 107, "./UtilityColumnRenderer": 108, "./UtilityColumnRules": 109, "diagram-js/lib/features/rules": 118}],
  111: [function (require, module, exports) {
    'use strict';

    var assign = require('lodash/object/assign'),
      inherits = require('inherits');

    function Base() {
      Object.defineProperty(this, 'businessObject', {
        writable: true
      });
    }

    function Table() {
      Base.call(this);
    }

    inherits(Table, Base);

    function Row() {
      Base.call(this);
    }

    inherits(Row, Base);

    function Column() {
      Base.call(this);
    }

    inherits(Column, Base);


    var types = {
      table: Table,
      row: Row,
      column: Column
    };

    /**
     * Creates a new model element of the specified type
     *
     * @method create
     *
     * @example
     *
     * var shape1 = Model.create('shape', { x: 10, y: 10, width: 100, height: 100 });
     * var shape2 = Model.create('shape', { x: 210, y: 210, width: 100, height: 100 });
     *
     * var connection = Model.create('connection', { waypoints: [ { x: 110, y: 55 }, {x: 210, y: 55 } ] });
     *
     * @param  {String} type lower-cased model name
     * @param  {Object} attrs attributes to initialize the new model instance with
     *
     * @return {Base} the new model instance
     */
    module.exports.create = function (type, attrs) {
      var Type = types[type];
      if (!Type) {
        throw new Error('unknown type: <' + type + '>');
      }
      return assign(new Type(), attrs);
    };


    module.exports.Table = Table;
    module.exports.Row = Row;
    module.exports.Column = Column;

  }, {"inherits": 54, "lodash/object/assign": 219}],
  112: [function (require, module, exports) {
    arguments[4][26][0].apply(exports, arguments)
  }, {"dup": 26, "lodash/collection/forEach": 130, "lodash/lang/isArray": 212, "lodash/lang/isFunction": 213, "lodash/lang/isNumber": 215}],
  113: [function (require, module, exports) {
    'use strict';

    var unique = require('lodash/array/unique'),
      isArray = require('lodash/lang/isArray'),
      assign = require('lodash/object/assign');

    var InternalEvent = require('../core/EventBus').Event;


    /**
     * A service that offers un- and redoable execution of commands.
     *
     * The command stack is responsible for executing modeling actions
     * in a un- and redoable manner. To do this it delegates the actual
     * command execution to {@link CommandHandler}s.
     *
     * Command handlers provide {@link CommandHandler#execute(ctx)} and
     * {@link CommandHandler#revert(ctx)} methods to un- and redo a command
     * identified by a command context.
     *
     *
     * ## Life-Cycle events
     *
     * In the process the command stack fires a number of life-cycle events
     * that other components to participate in the command execution.
     *
     *    * preExecute
     *    * execute
     *    * executed
     *    * postExecute
     *    * revert
     *    * reverted
     *
     * A special event is used for validating, whether a command can be
     * performed prior to its execution.
     *
     *    * canExecute
     *
     * Each of the events is fired as `commandStack.{eventName}` and
     * `commandStack.{commandName}.{eventName}`, respectively. This gives
     * components fine grained control on where to hook into.
     *
     * The event object fired transports `command`, the name of the
     * command and `context`, the command context.
     *
     *
     * ## Creating Command Handlers
     *
     * Command handlers should provide the {@link CommandHandler#execute(ctx)}
     * and {@link CommandHandler#revert(ctx)} methods to implement
     * redoing and undoing of a command. They must ensure undo is performed
     * properly in order not to break the undo chain.
     *
     * Command handlers may execute other modeling operations (and thus
     * commands) in their `preExecute` and `postExecute` phases. The command
     * stack will properly group all commands together into a logical unit
     * that may be re- and undone atomically.
     *
     * Command handlers must not execute other commands from within their
     * core implementation (`execute`, `revert`).
     *
     *
     * ## Change Tracking
     *
     * During the execution of the CommandStack it will keep track of all
     * elements that have been touched during the command's execution.
     *
     * At the end of the CommandStack execution it will notify interested
     * components via an 'elements.changed' event with all the dirty
     * elements.
     *
     * The event can be picked up by components that are interested in the fact
     * that elements have been changed. One use case for this is updating
     * their graphical representation after moving / resizing or deletion.
     *
     *
     * @param {EventBus} eventBus
     * @param {Injector} injector
     */
    function CommandStack(eventBus, injector) {

      /**
       * A map of all registered command handlers.
       *
       * @type {Object}
       */
      this._handlerMap = {};

      /**
       * A stack containing all re/undoable actions on the diagram
       *
       * @type {Array<Object>}
       */
      this._stack = [];

      /**
       * The current index on the stack
       *
       * @type {Number}
       */
      this._stackIdx = -1;

      /**
       * Current active commandStack execution
       *
       * @type {Object}
       */
      this._currentExecution = {
        actions: [],
        dirty: []
      };


      this._injector = injector;
      this._eventBus = eventBus;

      this._uid = 1;
    }

    CommandStack.$inject = ['eventBus', 'injector'];

    module.exports = CommandStack;


    /**
     * Execute a command
     *
     * @param {String} command the command to execute
     * @param {Object} context the environment to execute the command in
     */
    CommandStack.prototype.execute = function (command, context) {
      if (!command) {
        throw new Error('command required');
      }

      var action = {command: command, context: context};

      this._pushAction(action);
      this._internalExecute(action);
      this._popAction(action);
    };


    /**
     * Ask whether a given command can be executed.
     *
     * Implementors may hook into the mechanism on two ways:
     *
     *   * in event listeners:
     *
     *     Users may prevent the execution via an event listener.
     *     It must prevent the default action for `commandStack.(<command>.)canExecute` events.
     *
     *   * in command handlers:
     *
     *     If the method {@link CommandHandler#canExecute} is implemented in a handler
     *     it will be called to figure out whether the execution is allowed.
     *
     * @param  {String} command the command to execute
     * @param  {Object} context the environment to execute the command in
     *
     * @return {Boolean} true if the command can be executed
     */
    CommandStack.prototype.canExecute = function (command, context) {

      var action = {command: command, context: context};

      var handler = this._getHandler(command);

      if (!handler) {
        return false;
      }

      var result = this._fire(command, 'canExecute', action);

      // handler#canExecute will only be called if no listener
      // decided on a result already
      if (result === undefined && handler.canExecute) {
        result = handler.canExecute(context);
      }

      return result;
    };


    /**
     * Clear the command stack, erasing all undo / redo history
     */
    CommandStack.prototype.clear = function () {
      this._stack.length = 0;
      this._stackIdx = -1;

      this._fire('changed');
    };


    /**
     * Undo last command(s)
     */
    CommandStack.prototype.undo = function () {
      var action = this._getUndoAction(),
        next;

      if (action) {
        this._pushAction(action);

        while (action) {
          this._internalUndo(action);
          next = this._getUndoAction();

          if (!next || next.id !== action.id) {
            break;
          }

          action = next;
        }

        this._popAction();
      }
    };


    /**
     * Redo last command(s)
     */
    CommandStack.prototype.redo = function () {
      var action = this._getRedoAction(),
        next;

      if (action) {
        this._pushAction(action);

        while (action) {
          this._internalExecute(action, true);
          next = this._getRedoAction();

          if (!next || next.id !== action.id) {
            break;
          }

          action = next;
        }

        this._popAction();
      }
    };


    /**
     * Register a handler instance with the command stack
     *
     * @param {String} command
     * @param {CommandHandler} handler
     */
    CommandStack.prototype.register = function (command, handler) {
      this._setHandler(command, handler);
    };


    /**
     * Register a handler type with the command stack
     * by instantiating it and injecting its dependencies.
     *
     * @param {String} command
     * @param {Function} a constructor for a {@link CommandHandler}
     */
    CommandStack.prototype.registerHandler = function (command, handlerCls) {

      if (!command || !handlerCls) {
        throw new Error('command and handlerCls must be defined');
      }

      var handler = this._injector.instantiate(handlerCls);
      this.register(command, handler);
    };

    CommandStack.prototype.canUndo = function () {
      return !!this._getUndoAction();
    };

    CommandStack.prototype.canRedo = function () {
      return !!this._getRedoAction();
    };

////// stack access  //////////////////////////////////////

    CommandStack.prototype._getRedoAction = function () {
      return this._stack[this._stackIdx + 1];
    };


    CommandStack.prototype._getUndoAction = function () {
      return this._stack[this._stackIdx];
    };


////// internal functionality /////////////////////////////

    CommandStack.prototype._internalUndo = function (action) {
      var command = action.command,
        context = action.context;

      var handler = this._getHandler(command);

      this._fire(command, 'revert', action);

      this._markDirty(handler.revert(context));

      this._revertedAction(action);

      this._fire(command, 'reverted', action);
    };


    CommandStack.prototype._fire = function (command, qualifier, event) {
      if (arguments.length < 3) {
        event = qualifier;
        qualifier = null;
      }

      var names = qualifier ? [command + '.' + qualifier, qualifier] : [command],
        i, name, result;

      event = assign(new InternalEvent(), event);

      for (i = 0; !!(name = names[i]); i++) {
        result = this._eventBus.fire('commandStack.' + name, event);

        if (event.cancelBubble) {
          break;
        }
      }

      return result;
    };

    CommandStack.prototype._createId = function () {
      return this._uid++;
    };


    CommandStack.prototype._internalExecute = function (action, redo) {
      var command = action.command,
        context = action.context;

      var handler = this._getHandler(command);

      if (!handler) {
        throw new Error('no command handler registered for <' + command + '>');
      }

      this._pushAction(action);

      if (!redo) {
        this._fire(command, 'preExecute', action);

        if (handler.preExecute) {
          handler.preExecute(context);
        }
      }

      this._fire(command, 'execute', action);

      // execute
      this._markDirty(handler.execute(context));

      // log to stack
      this._executedAction(action, redo);

      this._fire(command, 'executed', action);

      if (!redo) {
        if (handler.postExecute) {
          handler.postExecute(context);
        }

        this._fire(command, 'postExecute', action);
      }

      this._popAction(action);
    };


    CommandStack.prototype._pushAction = function (action) {

      var execution = this._currentExecution,
        actions = execution.actions;

      var baseAction = actions[0];

      if (!action.id) {
        action.id = (baseAction && baseAction.id) || this._createId();
      }

      actions.push(action);
    };


    CommandStack.prototype._popAction = function () {
      var execution = this._currentExecution,
        actions = execution.actions,
        dirty = execution.dirty;

      actions.pop();

      if (!actions.length) {
        this._eventBus.fire('elements.changed', {elements: unique(dirty)});

        dirty.length = 0;

        this._fire('changed');
      }
    };


    CommandStack.prototype._markDirty = function (elements) {
      var execution = this._currentExecution;

      if (!elements) {
        return;
      }

      elements = isArray(elements) ? elements : [elements];

      execution.dirty = execution.dirty.concat(elements);
    };


    CommandStack.prototype._executedAction = function (action, redo) {
      var stackIdx = ++this._stackIdx;

      if (!redo) {
        this._stack.splice(stackIdx, this._stack.length, action);
      }
    };


    CommandStack.prototype._revertedAction = function (action) {
      this._stackIdx--;
    };


    CommandStack.prototype._getHandler = function (command) {
      return this._handlerMap[command];
    };

    CommandStack.prototype._setHandler = function (command, handler) {
      if (!command || !handler) {
        throw new Error('command and handler required');
      }

      if (this._handlerMap[command]) {
        throw new Error('overriding handler for command <' + command + '>');
      }

      this._handlerMap[command] = handler;
    };

  }, {"../core/EventBus": 115, "lodash/array/unique": 126, "lodash/lang/isArray": 212, "lodash/object/assign": 219}],
  114: [function (require, module, exports) {
    module.exports = {
      commandStack: ['type', require('./CommandStack')]
    };

  }, {"./CommandStack": 113}],
  115: [function (require, module, exports) {
    'use strict';

    var isFunction = require('lodash/lang/isFunction'),
      isArray = require('lodash/lang/isArray'),
      isNumber = require('lodash/lang/isNumber'),
      assign = require('lodash/object/assign');

    var DEFAULT_PRIORITY = 1000;


    /**
     * A general purpose event bus.
     *
     * This component is used to communicate across a diagram instance.
     * Other parts of a diagram can use it to listen to and broadcast events.
     *
     *
     * ## Registering for Events
     *
     * The event bus provides the {@link EventBus#on} and {@link EventBus#once}
     * methods to register for events. {@link EventBus#off} can be used to
     * remove event registrations. Listeners receive an instance of {@link Event}
     * as the first argument. It allows them to hook into the event execution.
     *
     * ```javascript
     *
     * // listen for event
     * eventBus.on('foo', function(event) {
 *
 *   // access event type
 *   event.type; // 'foo'
 *
 *   // stop propagation to other listeners
 *   event.stopPropagation();
 *
 *   // prevent event default
 *   event.preventDefault();
 * });
     *
     * // listen for event with custom payload
     * eventBus.on('bar', function(event, payload) {
 *   console.log(payload);
 * });
     *
     * // listen for event returning value
     * eventBus.on('foobar', function(event) {
 *
 *   // stop event propagation + prevent default
 *   return false;
 *
 *   // stop event propagation + return custom result
 *   return {
 *     complex: 'listening result'
 *   };
 * });
     *
     *
     * // listen with custom priority (default=1000, higher is better)
     * eventBus.on('priorityfoo', 1500, function(event) {
 *   console.log('invoked first!');
 * });
     * ```
     *
     *
     * ## Emitting Events
     *
     * Events can be emitted via the event bus using {@link EventBus#fire}.
     *
     * ```javascript
     *
     * // false indicates that the default action
     * // was prevented by listeners
     * if (eventBus.fire('foo') === false) {
 *   console.log('default has been prevented!');
 * };
     *
     *
     * // custom args + return value listener
     * eventBus.on('sum', function(event, a, b) {
 *   return a + b;
 * });
     *
     * // you can pass custom arguments + retrieve result values.
     * var sum = eventBus.fire('sum', 1, 2);
     * console.log(sum); // 3
     * ```
     */
    function EventBus() {
      this._listeners = {};

      // cleanup on destroy

      var self = this;

      // destroy on lowest priority to allow
      // message passing until the bitter end
      this.on('diagram.destroy', 1, function () {
        self._listeners = null;
      });
    }

    module.exports = EventBus;


    /**
     * Register an event listener for events with the given name.
     *
     * The callback will be invoked with `event, ...additionalArguments`
     * that have been passed to {@link EventBus#fire}.
     *
     * Returning false from a listener will prevent the events default action
     * (if any is specified). To stop an event from being processed further in
     * other listeners execute {@link Event#stopPropagation}.
     *
     * Returning anything but `undefined` from a listener will stop the listener propagation.
     *
     * @param {String|Array<String>} events
     * @param {Number} [priority=1000] the priority in which this listener is called, larger is higher
     * @param {Function} callback
     */
    EventBus.prototype.on = function (events, priority, callback) {

      events = isArray(events) ? events : [events];

      if (isFunction(priority)) {
        callback = priority;
        priority = DEFAULT_PRIORITY;
      }

      if (!isNumber(priority)) {
        throw new Error('priority must be a number');
      }

      var self = this,
        listener = {priority: priority, callback: callback};

      events.forEach(function (e) {
        self._addListener(e, listener);
      });
    };


    /**
     * Register an event listener that is executed only once.
     *
     * @param {String} event the event name to register for
     * @param {Function} callback the callback to execute
     */
    EventBus.prototype.once = function (event, callback) {

      var self = this;

      function wrappedCallback() {
        callback.apply(self, arguments);
        self.off(event, wrappedCallback);
      }

      this.on(event, wrappedCallback);
    };


    /**
     * Removes event listeners by event and callback.
     *
     * If no callback is given, all listeners for a given event name are being removed.
     *
     * @param {String} event
     * @param {Function} [callback]
     */
    EventBus.prototype.off = function (event, callback) {
      var listeners = this._getListeners(event),
        listener, idx;

      if (callback) {

        // move through listeners from back to front
        // and remove matching listeners
        for (idx = listeners.length - 1; !!(listener = listeners[idx]); idx--) {
          if (listener.callback === callback) {
            listeners.splice(idx, 1);
          }
        }
      } else {
        // clear listeners
        listeners.length = 0;
      }
    };


    /**
     * Fires a named event.
     *
     * @example
     *
     * // fire event by name
     * events.fire('foo');
     *
     * // fire event object with nested type
     * var event = { type: 'foo' };
     * events.fire(event);
     *
     * // fire event with explicit type
     * var event = { x: 10, y: 20 };
     * events.fire('element.moved', event);
     *
     * // pass additional arguments to the event
     * events.on('foo', function(event, bar) {
 *   alert(bar);
 * });
     *
     * events.fire({ type: 'foo' }, 'I am bar!');
     *
     * @param {String} [name] the optional event name
     * @param {Object} [event] the event object
     * @param {...Object} additional arguments to be passed to the callback functions
     *
     * @return {Boolean} the events return value, if specified or false if the
     *                   default action was prevented by listeners
     */
    EventBus.prototype.fire = function (type, data) {

      var event,
        originalType,
        listeners, idx, listener,
        returnValue,
        args;

      args = Array.prototype.slice.call(arguments);

      if (typeof type === 'object') {
        event = type;
        type = event.type;
      }

      if (!type) {
        throw new Error('no event type specified');
      }

      listeners = this._listeners[type];

      if (!listeners) {
        return;
      }

      // we make sure we fire instances of our home made
      // events here. We wrap them only once, though
      if (data instanceof Event) {
        // we are fine, we alread have an event
        event = data;
      } else {
        event = new Event();
        event.init(data);
      }

      // ensure we pass the event as the first parameter
      args[0] = event;

      // original event type (in case we delegate)
      originalType = event.type;

      try {

        // update event type before delegation
        if (type !== originalType) {
          event.type = type;
        }

        for (idx = 0; !!(listener = listeners[idx]); idx++) {

          // handle stopped propagation
          if (event.cancelBubble) {
            break;
          }

          try {
            // returning false prevents the default action
            returnValue = event.returnValue = listener.callback.apply(null, args);

            // stop propagation on return value
            if (returnValue !== undefined) {
              event.stopPropagation();
            }

            // prevent default on return false
            if (returnValue === false) {
              event.preventDefault();
            }
          } catch (e) {
            if (!this.handleError(e)) {
              console.error('unhandled error in event listener');
              console.error(e.stack);

              throw e;
            }
          }
        }
      } finally {
        // reset event type after delegation
        if (type !== originalType) {
          event.type = originalType;
        }
      }

      // set the return value to false if the event default
      // got prevented and no other return value exists
      if (returnValue === undefined && event.defaultPrevented) {
        returnValue = false;
      }

      return returnValue;
    };


    EventBus.prototype.handleError = function (error) {
      return this.fire('error', {error: error}) === false;
    };


    /*
     * Add new listener with a certain priority to the list
     * of listeners (for the given event).
     *
     * The semantics of listener registration / listener execution are
     * first register, first serve: New listeners will always be inserted
     * after existing listeners with the same priority.
     *
     * Example: Inserting two listeners with priority 1000 and 1300
     *
     *    * before: [ 1500, 1500, 1000, 1000 ]
     *    * after: [ 1500, 1500, (new=1300), 1000, 1000, (new=1000) ]
     *
     * @param {String} event
     * @param {Object} listener { priority, callback }
     */
    EventBus.prototype._addListener = function (event, newListener) {

      var listeners = this._getListeners(event),
        existingListener,
        idx;

      // ensure we order listeners by priority from
      // 0 (high) to n > 0 (low)
      for (idx = 0; !!(existingListener = listeners[idx]); idx++) {
        if (existingListener.priority < newListener.priority) {

          // prepend newListener at before existingListener
          listeners.splice(idx, 0, newListener);
          return;
        }
      }

      listeners.push(newListener);
    };


    EventBus.prototype._getListeners = function (name) {
      var listeners = this._listeners[name];

      if (!listeners) {
        this._listeners[name] = listeners = [];
      }

      return listeners;
    };


    /**
     * A event that is emitted via the event bus.
     */
    function Event() {
    }

    module.exports.Event = Event;

    Event.prototype.stopPropagation = function () {
      this.cancelBubble = true;
    };

    Event.prototype.preventDefault = function () {
      this.defaultPrevented = true;
    };

    Event.prototype.init = function (data) {
      assign(this, data || {});
    };

  }, {"lodash/lang/isArray": 212, "lodash/lang/isFunction": 213, "lodash/lang/isNumber": 215, "lodash/object/assign": 219}],
  116: [function (require, module, exports) {
    arguments[4][27][0].apply(exports, arguments)
  }, {"../../command/CommandInterceptor": 112, "dup": 27, "inherits": 54}],
  117: [function (require, module, exports) {
    'use strict';

    /**
     * A service that provides rules for certain diagram actions.
     *
     * @param {CommandStack} commandStack
     */
    function Rules(commandStack) {
      this._commandStack = commandStack;
    }

    Rules.$inject = ['commandStack'];

    module.exports = Rules;


    /**
     * This method can be queried to ask whether certain modeling actions
     * are allowed or not.
     *
     * @param  {String} action the action to be checked
     * @param  {Object} [context] the context to check the action in
     *
     * @return {Boolean} returns true, false or null depending on whether the
     *                   operation is allowed, not allowed or should be ignored.
     */
    Rules.prototype.allowed = function (action, context) {
      var allowed = this._commandStack.canExecute(action, context);

      // map undefined to true, i.e. no rules
      return allowed === undefined ? true : allowed;
    };
  }, {}],
  118: [function (require, module, exports) {
    module.exports = {
      __depends__: [require('../../command')],
      __init__: ['rules'],
      rules: ['type', require('./Rules')]
    };

  }, {"../../command": 114, "./Rules": 117}],
  119: [function (require, module, exports) {
    'use strict';

    function __preventDefault(event) {
      return event && event.preventDefault();
    }

    function __stopPropagation(event, immediate) {
      if (!event) {
        return;
      }

      if (event.stopPropagation) {
        event.stopPropagation();
      }

      if (immediate && event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }
    }


    function getOriginal(event) {
      return event.originalEvent || event.srcEvent;
    }

    module.exports.getOriginal = getOriginal;


    function stopEvent(event, immediate) {
      stopPropagation(event, immediate);
      preventDefault(event);
    }

    module.exports.stopEvent = stopEvent;


    function preventDefault(event) {
      __preventDefault(event);
      __preventDefault(getOriginal(event));
    }

    module.exports.preventDefault = preventDefault;


    function stopPropagation(event, immediate) {
      __stopPropagation(event, immediate);
      __stopPropagation(getOriginal(event), immediate);
    }

    module.exports.stopPropagation = stopPropagation;


    function toPoint(event) {

      if (event.pointers && event.pointers.length) {
        event = event.pointers[0];
      }

      if (event.touches && event.touches.length) {
        event = event.touches[0];
      }

      return event ? {
        x: event.clientX,
        y: event.clientY
      } : null;
    }

    module.exports.toPoint = toPoint;

  }, {}],
  120: [function (require, module, exports) {
    arguments[4][28][0].apply(exports, arguments)
  }, {"dup": 28}],
  121: [function (require, module, exports) {
    'use strict';

    var getOriginalEvent = require('./Event').getOriginal;

    var isMac = require('./Platform').isMac;


    function isPrimaryButton(event) {
      // button === 0 -> left áka primary mouse button
      return !(getOriginalEvent(event) || event).button;
    }

    module.exports.isPrimaryButton = isPrimaryButton;

    module.exports.isMac = isMac;

    module.exports.hasPrimaryModifier = function (event) {
      var originalEvent = getOriginalEvent(event) || event;

      if (!isPrimaryButton(event)) {
        return false;
      }

      // Use alt as primary modifier key for mac OS
      if (isMac()) {
        return originalEvent.altKey;
      } else {
        return originalEvent.ctrlKey;
      }
    };


    module.exports.hasSecondaryModifier = function (event) {
      var originalEvent = getOriginalEvent(event) || event;

      return isPrimaryButton(event) && originalEvent.shiftKey;
    };

  }, {"./Event": 119, "./Platform": 122}],
  122: [function (require, module, exports) {
    'use strict';

    module.exports.isMac = function isMac() {
      return (/mac/i).test(navigator.platform);
    };
  }, {}],
  123: [function (require, module, exports) {
    /*!
     * jQuery JavaScript Library v2.1.4
     * http://jquery.com/
     *
     * Includes Sizzle.js
     * http://sizzlejs.com/
     *
     * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
     * Released under the MIT license
     * http://jquery.org/license
     *
     * Date: 2015-04-28T16:01Z
     */

    (function (global, factory) {

      if (typeof module === "object" && typeof module.exports === "object") {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get jQuery.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var jQuery = require("jquery")(window);
        // See ticket #14549 for more info.
        module.exports = global.document ?
          factory(global, true) :
          function (w) {
            if (!w.document) {
              throw new Error("jQuery requires a window with a document");
            }
            return factory(w);
          };
      } else {
        factory(global);
      }

// Pass this if window is not defined yet
    }(typeof window !== "undefined" ? window : this, function (window, noGlobal) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//

      var arr = [];

      var slice = arr.slice;

      var concat = arr.concat;

      var push = arr.push;

      var indexOf = arr.indexOf;

      var class2type = {};

      var toString = class2type.toString;

      var hasOwn = class2type.hasOwnProperty;

      var support = {};


      var
      // Use the correct document accordingly with window argument (sandbox)
        document = window.document,

        version = "2.1.4",

      // Define a local copy of jQuery
        jQuery = function (selector, context) {
          // The jQuery object is actually just the init constructor 'enhanced'
          // Need init if jQuery is called (just allow error to be thrown if not included)
          return new jQuery.fn.init(selector, context);
        },

      // Support: Android<4.1
      // Make sure we trim BOM and NBSP
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

      // Matches dashed string for camelizing
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,

      // Used by jQuery.camelCase as callback to replace()
        fcamelCase = function (all, letter) {
          return letter.toUpperCase();
        };

      jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: version,

        constructor: jQuery,

        // Start with an empty selector
        selector: "",

        // The default length of a jQuery object is 0
        length: 0,

        toArray: function () {
          return slice.call(this);
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function (num) {
          return num != null ?

            // Return just the one element from the set
            ( num < 0 ? this[num + this.length] : this[num] ) :

            // Return all the elements in a clean array
            slice.call(this);
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function (elems) {

          // Build a new jQuery matched element set
          var ret = jQuery.merge(this.constructor(), elems);

          // Add the old object onto the stack (as a reference)
          ret.prevObject = this;
          ret.context = this.context;

          // Return the newly-formed element set
          return ret;
        },

        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        each: function (callback, args) {
          return jQuery.each(this, callback, args);
        },

        map: function (callback) {
          return this.pushStack(jQuery.map(this, function (elem, i) {
            return callback.call(elem, i, elem);
          }));
        },

        slice: function () {
          return this.pushStack(slice.apply(this, arguments));
        },

        first: function () {
          return this.eq(0);
        },

        last: function () {
          return this.eq(-1);
        },

        eq: function (i) {
          var len = this.length,
            j = +i + ( i < 0 ? len : 0 );
          return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },

        end: function () {
          return this.prevObject || this.constructor(null);
        },

        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: push,
        sort: arr.sort,
        splice: arr.splice
      };

      jQuery.extend = jQuery.fn.extend = function () {
        var options, name, src, copy, copyIsArray, clone,
          target = arguments[0] || {},
          i = 1,
          length = arguments.length,
          deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
          deep = target;

          // Skip the boolean and the target
          target = arguments[i] || {};
          i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
          target = {};
        }

        // Extend jQuery itself if only one argument is passed
        if (i === length) {
          target = this;
          i--;
        }

        for (; i < length; i++) {
          // Only deal with non-null/undefined values
          if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
              src = target[name];
              copy = options[name];

              // Prevent never-ending loop
              if (target === copy) {
                continue;
              }

              // Recurse if we're merging plain objects or arrays
              if (deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) )) {
                if (copyIsArray) {
                  copyIsArray = false;
                  clone = src && jQuery.isArray(src) ? src : [];

                } else {
                  clone = src && jQuery.isPlainObject(src) ? src : {};
                }

                // Never move original objects, clone them
                target[name] = jQuery.extend(deep, clone, copy);

                // Don't bring in undefined values
              } else if (copy !== undefined) {
                target[name] = copy;
              }
            }
          }
        }

        // Return the modified object
        return target;
      };

      jQuery.extend({
        // Unique for each copy of jQuery on the page
        expando: "jQuery" + ( version + Math.random() ).replace(/\D/g, ""),

        // Assume jQuery is ready without the ready module
        isReady: true,

        error: function (msg) {
          throw new Error(msg);
        },

        noop: function () {
        },

        isFunction: function (obj) {
          return jQuery.type(obj) === "function";
        },

        isArray: Array.isArray,

        isWindow: function (obj) {
          return obj != null && obj === obj.window;
        },

        isNumeric: function (obj) {
          // parseFloat NaNs numeric-cast false positives (null|true|false|"")
          // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
          // subtraction forces infinities to NaN
          // adding 1 corrects loss of precision from parseFloat (#15100)
          return !jQuery.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
        },

        isPlainObject: function (obj) {
          // Not plain objects:
          // - Any object or value whose internal [[Class]] property is not "[object Object]"
          // - DOM nodes
          // - window
          if (jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
            return false;
          }

          if (obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
          }

          // If the function hasn't returned already, we're confident that
          // |obj| is a plain object, created by {} or constructed with new Object
          return true;
        },

        isEmptyObject: function (obj) {
          var name;
          for (name in obj) {
            return false;
          }
          return true;
        },

        type: function (obj) {
          if (obj == null) {
            return obj + "";
          }
          // Support: Android<4.0, iOS<6 (functionish RegExp)
          return typeof obj === "object" || typeof obj === "function" ?
          class2type[toString.call(obj)] || "object" :
            typeof obj;
        },

        // Evaluates a script in a global context
        globalEval: function (code) {
          var script,
            indirect = eval;

          code = jQuery.trim(code);

          if (code) {
            // If the code includes a valid, prologue position
            // strict mode pragma, execute code by injecting a
            // script tag into the document.
            if (code.indexOf("use strict") === 1) {
              script = document.createElement("script");
              script.text = code;
              document.head.appendChild(script).parentNode.removeChild(script);
            } else {
              // Otherwise, avoid the DOM node creation, insertion
              // and removal by using an indirect global eval
              indirect(code);
            }
          }
        },

        // Convert dashed to camelCase; used by the css and data modules
        // Support: IE9-11+
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function (string) {
          return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },

        nodeName: function (elem, name) {
          return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },

        // args is for internal usage only
        each: function (obj, callback, args) {
          var value,
            i = 0,
            length = obj.length,
            isArray = isArraylike(obj);

          if (args) {
            if (isArray) {
              for (; i < length; i++) {
                value = callback.apply(obj[i], args);

                if (value === false) {
                  break;
                }
              }
            } else {
              for (i in obj) {
                value = callback.apply(obj[i], args);

                if (value === false) {
                  break;
                }
              }
            }

            // A special, fast, case for the most common use of each
          } else {
            if (isArray) {
              for (; i < length; i++) {
                value = callback.call(obj[i], i, obj[i]);

                if (value === false) {
                  break;
                }
              }
            } else {
              for (i in obj) {
                value = callback.call(obj[i], i, obj[i]);

                if (value === false) {
                  break;
                }
              }
            }
          }

          return obj;
        },

        // Support: Android<4.1
        trim: function (text) {
          return text == null ?
            "" :
            ( text + "" ).replace(rtrim, "");
        },

        // results is for internal usage only
        makeArray: function (arr, results) {
          var ret = results || [];

          if (arr != null) {
            if (isArraylike(Object(arr))) {
              jQuery.merge(ret,
                typeof arr === "string" ?
                  [arr] : arr
              );
            } else {
              push.call(ret, arr);
            }
          }

          return ret;
        },

        inArray: function (elem, arr, i) {
          return arr == null ? -1 : indexOf.call(arr, elem, i);
        },

        merge: function (first, second) {
          var len = +second.length,
            j = 0,
            i = first.length;

          for (; j < len; j++) {
            first[i++] = second[j];
          }

          first.length = i;

          return first;
        },

        grep: function (elems, callback, invert) {
          var callbackInverse,
            matches = [],
            i = 0,
            length = elems.length,
            callbackExpect = !invert;

          // Go through the array, only saving the items
          // that pass the validator function
          for (; i < length; i++) {
            callbackInverse = !callback(elems[i], i);
            if (callbackInverse !== callbackExpect) {
              matches.push(elems[i]);
            }
          }

          return matches;
        },

        // arg is for internal usage only
        map: function (elems, callback, arg) {
          var value,
            i = 0,
            length = elems.length,
            isArray = isArraylike(elems),
            ret = [];

          // Go through the array, translating each of the items to their new values
          if (isArray) {
            for (; i < length; i++) {
              value = callback(elems[i], i, arg);

              if (value != null) {
                ret.push(value);
              }
            }

            // Go through every key on the object,
          } else {
            for (i in elems) {
              value = callback(elems[i], i, arg);

              if (value != null) {
                ret.push(value);
              }
            }
          }

          // Flatten any nested arrays
          return concat.apply([], ret);
        },

        // A global GUID counter for objects
        guid: 1,

        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function (fn, context) {
          var tmp, args, proxy;

          if (typeof context === "string") {
            tmp = fn[context];
            context = fn;
            fn = tmp;
          }

          // Quick check to determine if target is callable, in the spec
          // this throws a TypeError, but we will just return undefined.
          if (!jQuery.isFunction(fn)) {
            return undefined;
          }

          // Simulated bind
          args = slice.call(arguments, 2);
          proxy = function () {
            return fn.apply(context || this, args.concat(slice.call(arguments)));
          };

          // Set the guid of unique handler to the same of original handler, so it can be removed
          proxy.guid = fn.guid = fn.guid || jQuery.guid++;

          return proxy;
        },

        now: Date.now,

        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support: support
      });

// Populate the class2type map
      jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
      });

      function isArraylike(obj) {

        // Support: iOS 8.2 (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var length = "length" in obj && obj.length,
          type = jQuery.type(obj);

        if (type === "function" || jQuery.isWindow(obj)) {
          return false;
        }

        if (obj.nodeType === 1 && length) {
          return true;
        }

        return type === "array" || length === 0 ||
          typeof length === "number" && length > 0 && ( length - 1 ) in obj;
      }

      var Sizzle =
        /*!
         * Sizzle CSS Selector Engine v2.2.0-pre
         * http://sizzlejs.com/
         *
         * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
         * Released under the MIT license
         * http://jquery.org/license
         *
         * Date: 2014-12-16
         */
        (function (window) {

          var i,
            support,
            Expr,
            getText,
            isXML,
            tokenize,
            compile,
            select,
            outermostContext,
            sortInput,
            hasDuplicate,

          // Local document vars
            setDocument,
            document,
            docElem,
            documentIsHTML,
            rbuggyQSA,
            rbuggyMatches,
            matches,
            contains,

          // Instance-specific data
            expando = "sizzle" + 1 * new Date(),
            preferredDoc = window.document,
            dirruns = 0,
            done = 0,
            classCache = createCache(),
            tokenCache = createCache(),
            compilerCache = createCache(),
            sortOrder = function (a, b) {
              if (a === b) {
                hasDuplicate = true;
              }
              return 0;
            },

          // General-purpose constants
            MAX_NEGATIVE = 1 << 31,

          // Instance methods
            hasOwn = ({}).hasOwnProperty,
            arr = [],
            pop = arr.pop,
            push_native = arr.push,
            push = arr.push,
            slice = arr.slice,
          // Use a stripped-down indexOf as it's faster than native
          // http://jsperf.com/thor-indexof-vs-for/5
            indexOf = function (list, elem) {
              var i = 0,
                len = list.length;
              for (; i < len; i++) {
                if (list[i] === elem) {
                  return i;
                }
              }
              return -1;
            },

            booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

          // Regular expressions

          // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
            whitespace = "[\\x20\\t\\r\\n\\f]",
          // http://www.w3.org/TR/css3-syntax/#characters
            characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

          // Loosely modeled on CSS identifier characters
          // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
          // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
            identifier = characterEncoding.replace("w", "w#"),

          // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
            attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
                // Operator (capture 2)
              "*([*^$|!~]?=)" + whitespace +
                // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
              "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
              "*\\]",

            pseudos = ":(" + characterEncoding + ")(?:\\((" +
                // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
                // 1. quoted (capture 3; capture 4 or capture 5)
              "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
                // 2. simple (capture 6)
              "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
                // 3. anything else (capture 2)
              ".*" +
              ")\\)|)",

          // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
            rwhitespace = new RegExp(whitespace + "+", "g"),
            rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

            rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
            rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),

            rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),

            rpseudo = new RegExp(pseudos),
            ridentifier = new RegExp("^" + identifier + "$"),

            matchExpr = {
              "ID": new RegExp("^#(" + characterEncoding + ")"),
              "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
              "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
              "ATTR": new RegExp("^" + attributes),
              "PSEUDO": new RegExp("^" + pseudos),
              "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
              "bool": new RegExp("^(?:" + booleans + ")$", "i"),
              // For use in libraries implementing .is()
              // We use this for POS matching in `select`
              "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
            },

            rinputs = /^(?:input|select|textarea|button)$/i,
            rheader = /^h\d$/i,

            rnative = /^[^{]+\{\s*\[native \w/,

          // Easily-parseable/retrievable ID or TAG or CLASS selectors
            rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

            rsibling = /[+~]/,
            rescape = /'|\\/g,

          // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
            runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
            funescape = function (_, escaped, escapedWhitespace) {
              var high = "0x" + escaped - 0x10000;
              // NaN means non-codepoint
              // Support: Firefox<24
              // Workaround erroneous numeric interpretation of +"0x"
              return high !== high || escapedWhitespace ?
                escaped :
                high < 0 ?
                  // BMP codepoint
                  String.fromCharCode(high + 0x10000) :
                  // Supplemental Plane codepoint (surrogate pair)
                  String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
            },

          // Used for iframes
          // See setDocument()
          // Removing the function wrapper causes a "Permission Denied"
          // error in IE
            unloadHandler = function () {
              setDocument();
            };

// Optimize for push.apply( _, NodeList )
          try {
            push.apply(
              (arr = slice.call(preferredDoc.childNodes)),
              preferredDoc.childNodes
            );
            // Support: Android<4.0
            // Detect silently failing push.apply
            arr[preferredDoc.childNodes.length].nodeType;
          } catch (e) {
            push = {
              apply: arr.length ?

                // Leverage slice if possible
                function (target, els) {
                  push_native.apply(target, slice.call(els));
                } :

                // Support: IE<9
                // Otherwise append directly
                function (target, els) {
                  var j = target.length,
                    i = 0;
                  // Can't trust NodeList.length
                  while ((target[j++] = els[i++])) {
                  }
                  target.length = j - 1;
                }
            };
          }

          function Sizzle(selector, context, results, seed) {
            var match, elem, m, nodeType,
            // QSA vars
              i, groups, old, nid, newContext, newSelector;

            if (( context ? context.ownerDocument || context : preferredDoc ) !== document) {
              setDocument(context);
            }

            context = context || document;
            results = results || [];
            nodeType = context.nodeType;

            if (typeof selector !== "string" || !selector ||
              nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

              return results;
            }

            if (!seed && documentIsHTML) {

              // Try to shortcut find operations when possible (e.g., not under DocumentFragment)
              if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
                // Speed-up: Sizzle("#ID")
                if ((m = match[1])) {
                  if (nodeType === 9) {
                    elem = context.getElementById(m);
                    // Check parentNode to catch when Blackberry 4.6 returns
                    // nodes that are no longer in the document (jQuery #6963)
                    if (elem && elem.parentNode) {
                      // Handle the case where IE, Opera, and Webkit return items
                      // by name instead of ID
                      if (elem.id === m) {
                        results.push(elem);
                        return results;
                      }
                    } else {
                      return results;
                    }
                  } else {
                    // Context is not a document
                    if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) &&
                      contains(context, elem) && elem.id === m) {
                      results.push(elem);
                      return results;
                    }
                  }

                  // Speed-up: Sizzle("TAG")
                } else if (match[2]) {
                  push.apply(results, context.getElementsByTagName(selector));
                  return results;

                  // Speed-up: Sizzle(".CLASS")
                } else if ((m = match[3]) && support.getElementsByClassName) {
                  push.apply(results, context.getElementsByClassName(m));
                  return results;
                }
              }

              // QSA path
              if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                nid = old = expando;
                newContext = context;
                newSelector = nodeType !== 1 && selector;

                // qSA works strangely on Element-rooted queries
                // We can work around this by specifying an extra ID on the root
                // and working up from there (Thanks to Andrew Dupont for the technique)
                // IE 8 doesn't work on object elements
                if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                  groups = tokenize(selector);

                  if ((old = context.getAttribute("id"))) {
                    nid = old.replace(rescape, "\\$&");
                  } else {
                    context.setAttribute("id", nid);
                  }
                  nid = "[id='" + nid + "'] ";

                  i = groups.length;
                  while (i--) {
                    groups[i] = nid + toSelector(groups[i]);
                  }
                  newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                  newSelector = groups.join(",");
                }

                if (newSelector) {
                  try {
                    push.apply(results,
                      newContext.querySelectorAll(newSelector)
                    );
                    return results;
                  } catch (qsaError) {
                  } finally {
                    if (!old) {
                      context.removeAttribute("id");
                    }
                  }
                }
              }
            }

            // All others
            return select(selector.replace(rtrim, "$1"), context, results, seed);
          }

          /**
           * Create key-value caches of limited size
           * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
           *  property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
           *  deleting the oldest entry
           */
          function createCache() {
            var keys = [];

            function cache(key, value) {
              // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
              if (keys.push(key + " ") > Expr.cacheLength) {
                // Only keep the most recent entries
                delete cache[keys.shift()];
              }
              return (cache[key + " "] = value);
            }

            return cache;
          }

          /**
           * Mark a function for special use by Sizzle
           * @param {Function} fn The function to mark
           */
          function markFunction(fn) {
            fn[expando] = true;
            return fn;
          }

          /**
           * Support testing using an element
           * @param {Function} fn Passed the created div and expects a boolean result
           */
          function assert(fn) {
            var div = document.createElement("div");

            try {
              return !!fn(div);
            } catch (e) {
              return false;
            } finally {
              // Remove from its parent by default
              if (div.parentNode) {
                div.parentNode.removeChild(div);
              }
              // release memory in IE
              div = null;
            }
          }

          /**
           * Adds the same handler for all of the specified attrs
           * @param {String} attrs Pipe-separated list of attributes
           * @param {Function} handler The method that will be applied
           */
          function addHandle(attrs, handler) {
            var arr = attrs.split("|"),
              i = attrs.length;

            while (i--) {
              Expr.attrHandle[arr[i]] = handler;
            }
          }

          /**
           * Checks document order of two siblings
           * @param {Element} a
           * @param {Element} b
           * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
           */
          function siblingCheck(a, b) {
            var cur = b && a,
              diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
                ( ~b.sourceIndex || MAX_NEGATIVE ) -
                ( ~a.sourceIndex || MAX_NEGATIVE );

            // Use IE sourceIndex if available on both nodes
            if (diff) {
              return diff;
            }

            // Check if b follows a
            if (cur) {
              while ((cur = cur.nextSibling)) {
                if (cur === b) {
                  return -1;
                }
              }
            }

            return a ? 1 : -1;
          }

          /**
           * Returns a function to use in pseudos for input types
           * @param {String} type
           */
          function createInputPseudo(type) {
            return function (elem) {
              var name = elem.nodeName.toLowerCase();
              return name === "input" && elem.type === type;
            };
          }

          /**
           * Returns a function to use in pseudos for buttons
           * @param {String} type
           */
          function createButtonPseudo(type) {
            return function (elem) {
              var name = elem.nodeName.toLowerCase();
              return (name === "input" || name === "button") && elem.type === type;
            };
          }

          /**
           * Returns a function to use in pseudos for positionals
           * @param {Function} fn
           */
          function createPositionalPseudo(fn) {
            return markFunction(function (argument) {
              argument = +argument;
              return markFunction(function (seed, matches) {
                var j,
                  matchIndexes = fn([], seed.length, argument),
                  i = matchIndexes.length;

                // Match elements found at the specified indexes
                while (i--) {
                  if (seed[(j = matchIndexes[i])]) {
                    seed[j] = !(matches[j] = seed[j]);
                  }
                }
              });
            });
          }

          /**
           * Checks a node for validity as a Sizzle context
           * @param {Element|Object=} context
           * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
           */
          function testContext(context) {
            return context && typeof context.getElementsByTagName !== "undefined" && context;
          }

// Expose support vars for convenience
          support = Sizzle.support = {};

          /**
           * Detects XML nodes
           * @param {Element|Object} elem An element or a document
           * @returns {Boolean} True iff elem is a non-HTML XML node
           */
          isXML = Sizzle.isXML = function (elem) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
          };

          /**
           * Sets document-related variables once based on the current document
           * @param {Element|Object} [doc] An element or document object to use to set the document
           * @returns {Object} Returns the current document
           */
          setDocument = Sizzle.setDocument = function (node) {
            var hasCompare, parent,
              doc = node ? node.ownerDocument || node : preferredDoc;

            // If no document and documentElement is available, return
            if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
              return document;
            }

            // Set our document
            document = doc;
            docElem = doc.documentElement;
            parent = doc.defaultView;

            // Support: IE>8
            // If iframe document is assigned to "document" variable and if iframe has been reloaded,
            // IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
            // IE6-8 do not support the defaultView property so parent will be undefined
            if (parent && parent !== parent.top) {
              // IE11 does not have attachEvent, so all must suffer
              if (parent.addEventListener) {
                parent.addEventListener("unload", unloadHandler, false);
              } else if (parent.attachEvent) {
                parent.attachEvent("onunload", unloadHandler);
              }
            }

            /* Support tests
             ---------------------------------------------------------------------- */
            documentIsHTML = !isXML(doc);

            /* Attributes
             ---------------------------------------------------------------------- */

            // Support: IE<8
            // Verify that getAttribute really returns attributes and not properties
            // (excepting IE8 booleans)
            support.attributes = assert(function (div) {
              div.className = "i";
              return !div.getAttribute("className");
            });

            /* getElement(s)By*
             ---------------------------------------------------------------------- */

            // Check if getElementsByTagName("*") returns only elements
            support.getElementsByTagName = assert(function (div) {
              div.appendChild(doc.createComment(""));
              return !div.getElementsByTagName("*").length;
            });

            // Support: IE<9
            support.getElementsByClassName = rnative.test(doc.getElementsByClassName);

            // Support: IE<10
            // Check if getElementById returns elements by name
            // The broken getElementById methods don't pick up programatically-set names,
            // so use a roundabout getElementsByName test
            support.getById = assert(function (div) {
              docElem.appendChild(div).id = expando;
              return !doc.getElementsByName || !doc.getElementsByName(expando).length;
            });

            // ID find and filter
            if (support.getById) {
              Expr.find["ID"] = function (id, context) {
                if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                  var m = context.getElementById(id);
                  // Check parentNode to catch when Blackberry 4.6 returns
                  // nodes that are no longer in the document #6963
                  return m && m.parentNode ? [m] : [];
                }
              };
              Expr.filter["ID"] = function (id) {
                var attrId = id.replace(runescape, funescape);
                return function (elem) {
                  return elem.getAttribute("id") === attrId;
                };
              };
            } else {
              // Support: IE6/7
              // getElementById is not reliable as a find shortcut
              delete Expr.find["ID"];

              Expr.filter["ID"] = function (id) {
                var attrId = id.replace(runescape, funescape);
                return function (elem) {
                  var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                  return node && node.value === attrId;
                };
              };
            }

            // Tag
            Expr.find["TAG"] = support.getElementsByTagName ?
              function (tag, context) {
                if (typeof context.getElementsByTagName !== "undefined") {
                  return context.getElementsByTagName(tag);

                  // DocumentFragment nodes don't have gEBTN
                } else if (support.qsa) {
                  return context.querySelectorAll(tag);
                }
              } :

              function (tag, context) {
                var elem,
                  tmp = [],
                  i = 0,
                // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
                  results = context.getElementsByTagName(tag);

                // Filter out possible comments
                if (tag === "*") {
                  while ((elem = results[i++])) {
                    if (elem.nodeType === 1) {
                      tmp.push(elem);
                    }
                  }

                  return tmp;
                }
                return results;
              };

            // Class
            Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
                if (documentIsHTML) {
                  return context.getElementsByClassName(className);
                }
              };

            /* QSA/matchesSelector
             ---------------------------------------------------------------------- */

            // QSA and matchesSelector support

            // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
            rbuggyMatches = [];

            // qSa(:focus) reports false when true (Chrome 21)
            // We allow this because of a bug in IE8/9 that throws an error
            // whenever `document.activeElement` is accessed on an iframe
            // So, we allow :focus to pass through QSA all the time to avoid the IE error
            // See http://bugs.jquery.com/ticket/13378
            rbuggyQSA = [];

            if ((support.qsa = rnative.test(doc.querySelectorAll))) {
              // Build QSA regex
              // Regex strategy adopted from Diego Perini
              assert(function (div) {
                // Select is set to empty string on purpose
                // This is to test IE's treatment of not explicitly
                // setting a boolean content attribute,
                // since its presence should be enough
                // http://bugs.jquery.com/ticket/12359
                docElem.appendChild(div).innerHTML = "<a id='" + expando + "'></a>" +
                  "<select id='" + expando + "-\f]' msallowcapture=''>" +
                  "<option selected=''></option></select>";

                // Support: IE8, Opera 11-12.16
                // Nothing should be selected when empty strings follow ^= or $= or *=
                // The test attribute must be unknown in Opera but "safe" for WinRT
                // http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
                if (div.querySelectorAll("[msallowcapture^='']").length) {
                  rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
                }

                // Support: IE8
                // Boolean attributes and "value" are not treated correctly
                if (!div.querySelectorAll("[selected]").length) {
                  rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
                }

                // Support: Chrome<29, Android<4.2+, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.7+
                if (!div.querySelectorAll("[id~=" + expando + "-]").length) {
                  rbuggyQSA.push("~=");
                }

                // Webkit/Opera - :checked should return selected option elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                // IE8 throws error here and will not see later tests
                if (!div.querySelectorAll(":checked").length) {
                  rbuggyQSA.push(":checked");
                }

                // Support: Safari 8+, iOS 8+
                // https://bugs.webkit.org/show_bug.cgi?id=136851
                // In-page `selector#id sibing-combinator selector` fails
                if (!div.querySelectorAll("a#" + expando + "+*").length) {
                  rbuggyQSA.push(".#.+[+~]");
                }
              });

              assert(function (div) {
                // Support: Windows 8 Native Apps
                // The type and name attributes are restricted during .innerHTML assignment
                var input = doc.createElement("input");
                input.setAttribute("type", "hidden");
                div.appendChild(input).setAttribute("name", "D");

                // Support: IE8
                // Enforce case-sensitivity of name attribute
                if (div.querySelectorAll("[name=d]").length) {
                  rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
                }

                // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                // IE8 throws error here and will not see later tests
                if (!div.querySelectorAll(":enabled").length) {
                  rbuggyQSA.push(":enabled", ":disabled");
                }

                // Opera 10-11 does not throw on post-comma invalid pseudos
                div.querySelectorAll("*,:x");
                rbuggyQSA.push(",.*:");
              });
            }

            if ((support.matchesSelector = rnative.test((matches = docElem.matches ||
                docElem.webkitMatchesSelector ||
                docElem.mozMatchesSelector ||
                docElem.oMatchesSelector ||
                docElem.msMatchesSelector)))) {

              assert(function (div) {
                // Check to see if it's possible to do matchesSelector
                // on a disconnected node (IE 9)
                support.disconnectedMatch = matches.call(div, "div");

                // This should fail with an exception
                // Gecko does not error, returns false instead
                matches.call(div, "[s!='']:x");
                rbuggyMatches.push("!=", pseudos);
              });
            }

            rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
            rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

            /* Contains
             ---------------------------------------------------------------------- */
            hasCompare = rnative.test(docElem.compareDocumentPosition);

            // Element contains another
            // Purposefully does not implement inclusive descendent
            // As in, an element does not contain itself
            contains = hasCompare || rnative.test(docElem.contains) ?
              function (a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a,
                  bup = b && b.parentNode;
                return a === bup || !!( bup && bup.nodeType === 1 && (
                    adown.contains ?
                      adown.contains(bup) :
                    a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
                  ));
              } :
              function (a, b) {
                if (b) {
                  while ((b = b.parentNode)) {
                    if (b === a) {
                      return true;
                    }
                  }
                }
                return false;
              };

            /* Sorting
             ---------------------------------------------------------------------- */

            // Document order sorting
            sortOrder = hasCompare ?
              function (a, b) {

                // Flag for duplicate removal
                if (a === b) {
                  hasDuplicate = true;
                  return 0;
                }

                // Sort on method existence if only one input has compareDocumentPosition
                var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                if (compare) {
                  return compare;
                }

                // Calculate position if both inputs belong to the same document
                compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
                  a.compareDocumentPosition(b) :

                  // Otherwise we know they are disconnected
                  1;

                // Disconnected nodes
                if (compare & 1 ||
                  (!support.sortDetached && b.compareDocumentPosition(a) === compare)) {

                  // Choose the first element that is related to our preferred document
                  if (a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
                    return -1;
                  }
                  if (b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
                    return 1;
                  }

                  // Maintain original order
                  return sortInput ?
                    ( indexOf(sortInput, a) - indexOf(sortInput, b) ) :
                    0;
                }

                return compare & 4 ? -1 : 1;
              } :
              function (a, b) {
                // Exit early if the nodes are identical
                if (a === b) {
                  hasDuplicate = true;
                  return 0;
                }

                var cur,
                  i = 0,
                  aup = a.parentNode,
                  bup = b.parentNode,
                  ap = [a],
                  bp = [b];

                // Parentless nodes are either documents or disconnected
                if (!aup || !bup) {
                  return a === doc ? -1 :
                    b === doc ? 1 :
                      aup ? -1 :
                        bup ? 1 :
                          sortInput ?
                            ( indexOf(sortInput, a) - indexOf(sortInput, b) ) :
                            0;

                  // If the nodes are siblings, we can do a quick check
                } else if (aup === bup) {
                  return siblingCheck(a, b);
                }

                // Otherwise we need full lists of their ancestors for comparison
                cur = a;
                while ((cur = cur.parentNode)) {
                  ap.unshift(cur);
                }
                cur = b;
                while ((cur = cur.parentNode)) {
                  bp.unshift(cur);
                }

                // Walk down the tree looking for a discrepancy
                while (ap[i] === bp[i]) {
                  i++;
                }

                return i ?
                  // Do a sibling check if the nodes have a common ancestor
                  siblingCheck(ap[i], bp[i]) :

                  // Otherwise nodes in our document sort first
                  ap[i] === preferredDoc ? -1 :
                    bp[i] === preferredDoc ? 1 :
                      0;
              };

            return doc;
          };

          Sizzle.matches = function (expr, elements) {
            return Sizzle(expr, null, null, elements);
          };

          Sizzle.matchesSelector = function (elem, expr) {
            // Set document vars if needed
            if (( elem.ownerDocument || elem ) !== document) {
              setDocument(elem);
            }

            // Make sure that attribute selectors are quoted
            expr = expr.replace(rattributeQuotes, "='$1']");

            if (support.matchesSelector && documentIsHTML &&
              ( !rbuggyMatches || !rbuggyMatches.test(expr) ) &&
              ( !rbuggyQSA || !rbuggyQSA.test(expr) )) {

              try {
                var ret = matches.call(elem, expr);

                // IE 9's matchesSelector returns false on disconnected nodes
                if (ret || support.disconnectedMatch ||
                    // As well, disconnected nodes are said to be in a document
                    // fragment in IE 9
                  elem.document && elem.document.nodeType !== 11) {
                  return ret;
                }
              } catch (e) {
              }
            }

            return Sizzle(expr, document, null, [elem]).length > 0;
          };

          Sizzle.contains = function (context, elem) {
            // Set document vars if needed
            if (( context.ownerDocument || context ) !== document) {
              setDocument(context);
            }
            return contains(context, elem);
          };

          Sizzle.attr = function (elem, name) {
            // Set document vars if needed
            if (( elem.ownerDocument || elem ) !== document) {
              setDocument(elem);
            }

            var fn = Expr.attrHandle[name.toLowerCase()],
            // Don't get fooled by Object.prototype properties (jQuery #13807)
              val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ?
                fn(elem, name, !documentIsHTML) :
                undefined;

            return val !== undefined ?
              val :
              support.attributes || !documentIsHTML ?
                elem.getAttribute(name) :
                (val = elem.getAttributeNode(name)) && val.specified ?
                  val.value :
                  null;
          };

          Sizzle.error = function (msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
          };

          /**
           * Document sorting and removing duplicates
           * @param {ArrayLike} results
           */
          Sizzle.uniqueSort = function (results) {
            var elem,
              duplicates = [],
              j = 0,
              i = 0;

            // Unless we *know* we can detect duplicates, assume their presence
            hasDuplicate = !support.detectDuplicates;
            sortInput = !support.sortStable && results.slice(0);
            results.sort(sortOrder);

            if (hasDuplicate) {
              while ((elem = results[i++])) {
                if (elem === results[i]) {
                  j = duplicates.push(i);
                }
              }
              while (j--) {
                results.splice(duplicates[j], 1);
              }
            }

            // Clear input after sorting to release objects
            // See https://github.com/jquery/sizzle/pull/225
            sortInput = null;

            return results;
          };

          /**
           * Utility function for retrieving the text value of an array of DOM nodes
           * @param {Array|Element} elem
           */
          getText = Sizzle.getText = function (elem) {
            var node,
              ret = "",
              i = 0,
              nodeType = elem.nodeType;

            if (!nodeType) {
              // If no nodeType, this is expected to be an array
              while ((node = elem[i++])) {
                // Do not traverse comment nodes
                ret += getText(node);
              }
            } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
              // Use textContent for elements
              // innerText usage removed for consistency of new lines (jQuery #11153)
              if (typeof elem.textContent === "string") {
                return elem.textContent;
              } else {
                // Traverse its children
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                  ret += getText(elem);
                }
              }
            } else if (nodeType === 3 || nodeType === 4) {
              return elem.nodeValue;
            }
            // Do not include comment or processing instruction nodes

            return ret;
          };

          Expr = Sizzle.selectors = {

            // Can be adjusted by the user
            cacheLength: 50,

            createPseudo: markFunction,

            match: matchExpr,

            attrHandle: {},

            find: {},

            relative: {
              ">": {dir: "parentNode", first: true},
              " ": {dir: "parentNode"},
              "+": {dir: "previousSibling", first: true},
              "~": {dir: "previousSibling"}
            },

            preFilter: {
              "ATTR": function (match) {
                match[1] = match[1].replace(runescape, funescape);

                // Move the given value to match[3] whether quoted or unquoted
                match[3] = ( match[3] || match[4] || match[5] || "" ).replace(runescape, funescape);

                if (match[2] === "~=") {
                  match[3] = " " + match[3] + " ";
                }

                return match.slice(0, 4);
              },

              "CHILD": function (match) {
                /* matches from matchExpr["CHILD"]
                 1 type (only|nth|...)
                 2 what (child|of-type)
                 3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                 4 xn-component of xn+y argument ([+-]?\d*n|)
                 5 sign of xn-component
                 6 x of xn-component
                 7 sign of y-component
                 8 y of y-component
                 */
                match[1] = match[1].toLowerCase();

                if (match[1].slice(0, 3) === "nth") {
                  // nth-* requires argument
                  if (!match[3]) {
                    Sizzle.error(match[0]);
                  }

                  // numeric x and y parameters for Expr.filter.CHILD
                  // remember that false/true cast respectively to 0/1
                  match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
                  match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

                  // other types prohibit arguments
                } else if (match[3]) {
                  Sizzle.error(match[0]);
                }

                return match;
              },

              "PSEUDO": function (match) {
                var excess,
                  unquoted = !match[6] && match[2];

                if (matchExpr["CHILD"].test(match[0])) {
                  return null;
                }

                // Accept quoted arguments as-is
                if (match[3]) {
                  match[2] = match[4] || match[5] || "";

                  // Strip excess characters from unquoted arguments
                } else if (unquoted && rpseudo.test(unquoted) &&
                    // Get excess from tokenize (recursively)
                  (excess = tokenize(unquoted, true)) &&
                    // advance to the next closing parenthesis
                  (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

                  // excess is a negative index
                  match[0] = match[0].slice(0, excess);
                  match[2] = unquoted.slice(0, excess);
                }

                // Return only captures needed by the pseudo filter method (type and argument)
                return match.slice(0, 3);
              }
            },

            filter: {

              "TAG": function (nodeNameSelector) {
                var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                return nodeNameSelector === "*" ?
                  function () {
                    return true;
                  } :
                  function (elem) {
                    return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                  };
              },

              "CLASS": function (className) {
                var pattern = classCache[className + " "];

                return pattern ||
                  (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) &&
                  classCache(className, function (elem) {
                    return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
                  });
              },

              "ATTR": function (name, operator, check) {
                return function (elem) {
                  var result = Sizzle.attr(elem, name);

                  if (result == null) {
                    return operator === "!=";
                  }
                  if (!operator) {
                    return true;
                  }

                  result += "";

                  return operator === "=" ? result === check :
                    operator === "!=" ? result !== check :
                      operator === "^=" ? check && result.indexOf(check) === 0 :
                        operator === "*=" ? check && result.indexOf(check) > -1 :
                          operator === "$=" ? check && result.slice(-check.length) === check :
                            operator === "~=" ? ( " " + result.replace(rwhitespace, " ") + " " ).indexOf(check) > -1 :
                              operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
                                false;
                };
              },

              "CHILD": function (type, what, argument, first, last) {
                var simple = type.slice(0, 3) !== "nth",
                  forward = type.slice(-4) !== "last",
                  ofType = what === "of-type";

                return first === 1 && last === 0 ?

                  // Shortcut for :nth-*(n)
                  function (elem) {
                    return !!elem.parentNode;
                  } :

                  function (elem, context, xml) {
                    var cache, outerCache, node, diff, nodeIndex, start,
                      dir = simple !== forward ? "nextSibling" : "previousSibling",
                      parent = elem.parentNode,
                      name = ofType && elem.nodeName.toLowerCase(),
                      useCache = !xml && !ofType;

                    if (parent) {

                      // :(first|last|only)-(child|of-type)
                      if (simple) {
                        while (dir) {
                          node = elem;
                          while ((node = node[dir])) {
                            if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                              return false;
                            }
                          }
                          // Reverse direction for :only-* (if we haven't yet done so)
                          start = dir = type === "only" && !start && "nextSibling";
                        }
                        return true;
                      }

                      start = [forward ? parent.firstChild : parent.lastChild];

                      // non-xml :nth-child(...) stores cache data on `parent`
                      if (forward && useCache) {
                        // Seek `elem` from a previously-cached index
                        outerCache = parent[expando] || (parent[expando] = {});
                        cache = outerCache[type] || [];
                        nodeIndex = cache[0] === dirruns && cache[1];
                        diff = cache[0] === dirruns && cache[2];
                        node = nodeIndex && parent.childNodes[nodeIndex];

                        while ((node = ++nodeIndex && node && node[dir] ||

                            // Fallback to seeking `elem` from the start
                          (diff = nodeIndex = 0) || start.pop())) {

                          // When found, cache indexes on `parent` and break
                          if (node.nodeType === 1 && ++diff && node === elem) {
                            outerCache[type] = [dirruns, nodeIndex, diff];
                            break;
                          }
                        }

                        // Use previously-cached element index if available
                      } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
                        diff = cache[1];

                        // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
                      } else {
                        // Use the same loop as above to seek `elem` from the start
                        while ((node = ++nodeIndex && node && node[dir] ||
                          (diff = nodeIndex = 0) || start.pop())) {

                          if (( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff) {
                            // Cache the index of each encountered element
                            if (useCache) {
                              (node[expando] || (node[expando] = {}))[type] = [dirruns, diff];
                            }

                            if (node === elem) {
                              break;
                            }
                          }
                        }
                      }

                      // Incorporate the offset, then check against cycle size
                      diff -= last;
                      return diff === first || ( diff % first === 0 && diff / first >= 0 );
                    }
                  };
              },

              "PSEUDO": function (pseudo, argument) {
                // pseudo-class names are case-insensitive
                // http://www.w3.org/TR/selectors/#pseudo-classes
                // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                // Remember that setFilters inherits from pseudos
                var args,
                  fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
                    Sizzle.error("unsupported pseudo: " + pseudo);

                // The user may use createPseudo to indicate that
                // arguments are needed to create the filter function
                // just as Sizzle does
                if (fn[expando]) {
                  return fn(argument);
                }

                // But maintain support for old signatures
                if (fn.length > 1) {
                  args = [pseudo, pseudo, "", argument];
                  return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ?
                    markFunction(function (seed, matches) {
                      var idx,
                        matched = fn(seed, argument),
                        i = matched.length;
                      while (i--) {
                        idx = indexOf(seed, matched[i]);
                        seed[idx] = !( matches[idx] = matched[i] );
                      }
                    }) :
                    function (elem) {
                      return fn(elem, 0, args);
                    };
                }

                return fn;
              }
            },

            pseudos: {
              // Potentially complex pseudos
              "not": markFunction(function (selector) {
                // Trim the selector passed to compile
                // to avoid treating leading and trailing
                // spaces as combinators
                var input = [],
                  results = [],
                  matcher = compile(selector.replace(rtrim, "$1"));

                return matcher[expando] ?
                  markFunction(function (seed, matches, context, xml) {
                    var elem,
                      unmatched = matcher(seed, null, xml, []),
                      i = seed.length;

                    // Match elements unmatched by `matcher`
                    while (i--) {
                      if ((elem = unmatched[i])) {
                        seed[i] = !(matches[i] = elem);
                      }
                    }
                  }) :
                  function (elem, context, xml) {
                    input[0] = elem;
                    matcher(input, null, xml, results);
                    // Don't keep the element (issue #299)
                    input[0] = null;
                    return !results.pop();
                  };
              }),

              "has": markFunction(function (selector) {
                return function (elem) {
                  return Sizzle(selector, elem).length > 0;
                };
              }),

              "contains": markFunction(function (text) {
                text = text.replace(runescape, funescape);
                return function (elem) {
                  return ( elem.textContent || elem.innerText || getText(elem) ).indexOf(text) > -1;
                };
              }),

              // "Whether an element is represented by a :lang() selector
              // is based solely on the element's language value
              // being equal to the identifier C,
              // or beginning with the identifier C immediately followed by "-".
              // The matching of C against the element's language value is performed case-insensitively.
              // The identifier C does not have to be a valid language name."
              // http://www.w3.org/TR/selectors/#lang-pseudo
              "lang": markFunction(function (lang) {
                // lang value must be a valid identifier
                if (!ridentifier.test(lang || "")) {
                  Sizzle.error("unsupported lang: " + lang);
                }
                lang = lang.replace(runescape, funescape).toLowerCase();
                return function (elem) {
                  var elemLang;
                  do {
                    if ((elemLang = documentIsHTML ?
                        elem.lang :
                      elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {

                      elemLang = elemLang.toLowerCase();
                      return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                    }
                  } while ((elem = elem.parentNode) && elem.nodeType === 1);
                  return false;
                };
              }),

              // Miscellaneous
              "target": function (elem) {
                var hash = window.location && window.location.hash;
                return hash && hash.slice(1) === elem.id;
              },

              "root": function (elem) {
                return elem === docElem;
              },

              "focus": function (elem) {
                return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
              },

              // Boolean properties
              "enabled": function (elem) {
                return elem.disabled === false;
              },

              "disabled": function (elem) {
                return elem.disabled === true;
              },

              "checked": function (elem) {
                // In CSS3, :checked should return both checked and selected elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                var nodeName = elem.nodeName.toLowerCase();
                return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
              },

              "selected": function (elem) {
                // Accessing this property makes selected-by-default
                // options in Safari work properly
                if (elem.parentNode) {
                  elem.parentNode.selectedIndex;
                }

                return elem.selected === true;
              },

              // Contents
              "empty": function (elem) {
                // http://www.w3.org/TR/selectors/#empty-pseudo
                // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
                //   but not by others (comment: 8; processing instruction: 7; etc.)
                // nodeType < 6 works because attributes (2) do not appear as children
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                  if (elem.nodeType < 6) {
                    return false;
                  }
                }
                return true;
              },

              "parent": function (elem) {
                return !Expr.pseudos["empty"](elem);
              },

              // Element/input types
              "header": function (elem) {
                return rheader.test(elem.nodeName);
              },

              "input": function (elem) {
                return rinputs.test(elem.nodeName);
              },

              "button": function (elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === "button" || name === "button";
              },

              "text": function (elem) {
                var attr;
                return elem.nodeName.toLowerCase() === "input" &&
                  elem.type === "text" &&

                    // Support: IE<8
                    // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                  ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
              },

              // Position-in-collection
              "first": createPositionalPseudo(function () {
                return [0];
              }),

              "last": createPositionalPseudo(function (matchIndexes, length) {
                return [length - 1];
              }),

              "eq": createPositionalPseudo(function (matchIndexes, length, argument) {
                return [argument < 0 ? argument + length : argument];
              }),

              "even": createPositionalPseudo(function (matchIndexes, length) {
                var i = 0;
                for (; i < length; i += 2) {
                  matchIndexes.push(i);
                }
                return matchIndexes;
              }),

              "odd": createPositionalPseudo(function (matchIndexes, length) {
                var i = 1;
                for (; i < length; i += 2) {
                  matchIndexes.push(i);
                }
                return matchIndexes;
              }),

              "lt": createPositionalPseudo(function (matchIndexes, length, argument) {
                var i = argument < 0 ? argument + length : argument;
                for (; --i >= 0;) {
                  matchIndexes.push(i);
                }
                return matchIndexes;
              }),

              "gt": createPositionalPseudo(function (matchIndexes, length, argument) {
                var i = argument < 0 ? argument + length : argument;
                for (; ++i < length;) {
                  matchIndexes.push(i);
                }
                return matchIndexes;
              })
            }
          };

          Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
          for (i in {radio: true, checkbox: true, file: true, password: true, image: true}) {
            Expr.pseudos[i] = createInputPseudo(i);
          }
          for (i in {submit: true, reset: true}) {
            Expr.pseudos[i] = createButtonPseudo(i);
          }

// Easy API for creating new setFilters
          function setFilters() {
          }

          setFilters.prototype = Expr.filters = Expr.pseudos;
          Expr.setFilters = new setFilters();

          tokenize = Sizzle.tokenize = function (selector, parseOnly) {
            var matched, match, tokens, type,
              soFar, groups, preFilters,
              cached = tokenCache[selector + " "];

            if (cached) {
              return parseOnly ? 0 : cached.slice(0);
            }

            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;

            while (soFar) {

              // Comma and first run
              if (!matched || (match = rcomma.exec(soFar))) {
                if (match) {
                  // Don't consume trailing commas as valid
                  soFar = soFar.slice(match[0].length) || soFar;
                }
                groups.push((tokens = []));
              }

              matched = false;

              // Combinators
              if ((match = rcombinators.exec(soFar))) {
                matched = match.shift();
                tokens.push({
                  value: matched,
                  // Cast descendant combinators to space
                  type: match[0].replace(rtrim, " ")
                });
                soFar = soFar.slice(matched.length);
              }

              // Filters
              for (type in Expr.filter) {
                if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
                  (match = preFilters[type](match)))) {
                  matched = match.shift();
                  tokens.push({
                    value: matched,
                    type: type,
                    matches: match
                  });
                  soFar = soFar.slice(matched.length);
                }
              }

              if (!matched) {
                break;
              }
            }

            // Return the length of the invalid excess
            // if we're just parsing
            // Otherwise, throw an error or return tokens
            return parseOnly ?
              soFar.length :
              soFar ?
                Sizzle.error(selector) :
                // Cache the tokens
                tokenCache(selector, groups).slice(0);
          };

          function toSelector(tokens) {
            var i = 0,
              len = tokens.length,
              selector = "";
            for (; i < len; i++) {
              selector += tokens[i].value;
            }
            return selector;
          }

          function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir,
              checkNonElements = base && dir === "parentNode",
              doneName = done++;

            return combinator.first ?
              // Check against closest ancestor/preceding element
              function (elem, context, xml) {
                while ((elem = elem[dir])) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    return matcher(elem, context, xml);
                  }
                }
              } :

              // Check against all ancestor/preceding elements
              function (elem, context, xml) {
                var oldCache, outerCache,
                  newCache = [dirruns, doneName];

                // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                if (xml) {
                  while ((elem = elem[dir])) {
                    if (elem.nodeType === 1 || checkNonElements) {
                      if (matcher(elem, context, xml)) {
                        return true;
                      }
                    }
                  }
                } else {
                  while ((elem = elem[dir])) {
                    if (elem.nodeType === 1 || checkNonElements) {
                      outerCache = elem[expando] || (elem[expando] = {});
                      if ((oldCache = outerCache[dir]) &&
                        oldCache[0] === dirruns && oldCache[1] === doneName) {

                        // Assign to newCache so results back-propagate to previous elements
                        return (newCache[2] = oldCache[2]);
                      } else {
                        // Reuse newcache so results back-propagate to previous elements
                        outerCache[dir] = newCache;

                        // A match means we're done; a fail means we have to keep checking
                        if ((newCache[2] = matcher(elem, context, xml))) {
                          return true;
                        }
                      }
                    }
                  }
                }
              };
          }

          function elementMatcher(matchers) {
            return matchers.length > 1 ?
              function (elem, context, xml) {
                var i = matchers.length;
                while (i--) {
                  if (!matchers[i](elem, context, xml)) {
                    return false;
                  }
                }
                return true;
              } :
              matchers[0];
          }

          function multipleContexts(selector, contexts, results) {
            var i = 0,
              len = contexts.length;
            for (; i < len; i++) {
              Sizzle(selector, contexts[i], results);
            }
            return results;
          }

          function condense(unmatched, map, filter, context, xml) {
            var elem,
              newUnmatched = [],
              i = 0,
              len = unmatched.length,
              mapped = map != null;

            for (; i < len; i++) {
              if ((elem = unmatched[i])) {
                if (!filter || filter(elem, context, xml)) {
                  newUnmatched.push(elem);
                  if (mapped) {
                    map.push(i);
                  }
                }
              }
            }

            return newUnmatched;
          }

          function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
              postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
              postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function (seed, results, context, xml) {
              var temp, i, elem,
                preMap = [],
                postMap = [],
                preexisting = results.length,

              // Get initial elements from seed or context
                elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),

              // Prefilter to get matcher input, preserving a map for seed-results synchronization
                matcherIn = preFilter && ( seed || !selector ) ?
                  condense(elems, preMap, preFilter, context, xml) :
                  elems,

                matcherOut = matcher ?
                  // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                  postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                    // ...intermediate processing is necessary
                    [] :

                    // ...otherwise use results directly
                    results :
                  matcherIn;

              // Find primary matches
              if (matcher) {
                matcher(matcherIn, matcherOut, context, xml);
              }

              // Apply postFilter
              if (postFilter) {
                temp = condense(matcherOut, postMap);
                postFilter(temp, [], context, xml);

                // Un-match failing elements by moving them back to matcherIn
                i = temp.length;
                while (i--) {
                  if ((elem = temp[i])) {
                    matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                  }
                }
              }

              if (seed) {
                if (postFinder || preFilter) {
                  if (postFinder) {
                    // Get the final matcherOut by condensing this intermediate into postFinder contexts
                    temp = [];
                    i = matcherOut.length;
                    while (i--) {
                      if ((elem = matcherOut[i])) {
                        // Restore matcherIn since elem is not yet a final match
                        temp.push((matcherIn[i] = elem));
                      }
                    }
                    postFinder(null, (matcherOut = []), temp, xml);
                  }

                  // Move matched elements from seed to results to keep them synchronized
                  i = matcherOut.length;
                  while (i--) {
                    if ((elem = matcherOut[i]) &&
                      (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {

                      seed[temp] = !(results[temp] = elem);
                    }
                  }
                }

                // Add elements to results, through postFinder if defined
              } else {
                matcherOut = condense(
                  matcherOut === results ?
                    matcherOut.splice(preexisting, matcherOut.length) :
                    matcherOut
                );
                if (postFinder) {
                  postFinder(null, results, matcherOut, xml);
                } else {
                  push.apply(results, matcherOut);
                }
              }
            });
          }

          function matcherFromTokens(tokens) {
            var checkContext, matcher, j,
              len = tokens.length,
              leadingRelative = Expr.relative[tokens[0].type],
              implicitRelative = leadingRelative || Expr.relative[" "],
              i = leadingRelative ? 1 : 0,

            // The foundational matcher ensures that elements are reachable from top-level context(s)
              matchContext = addCombinator(function (elem) {
                return elem === checkContext;
              }, implicitRelative, true),
              matchAnyContext = addCombinator(function (elem) {
                return indexOf(checkContext, elem) > -1;
              }, implicitRelative, true),
              matchers = [function (elem, context, xml) {
                var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                    (checkContext = context).nodeType ?
                      matchContext(elem, context, xml) :
                      matchAnyContext(elem, context, xml) );
                // Avoid hanging onto element (issue #299)
                checkContext = null;
                return ret;
              }];

            for (; i < len; i++) {
              if ((matcher = Expr.relative[tokens[i].type])) {
                matchers = [addCombinator(elementMatcher(matchers), matcher)];
              } else {
                matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

                // Return special upon seeing a positional matcher
                if (matcher[expando]) {
                  // Find the next relative operator (if any) for proper handling
                  j = ++i;
                  for (; j < len; j++) {
                    if (Expr.relative[tokens[j].type]) {
                      break;
                    }
                  }
                  return setMatcher(
                    i > 1 && elementMatcher(matchers),
                    i > 1 && toSelector(
                      // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                      tokens.slice(0, i - 1).concat({value: tokens[i - 2].type === " " ? "*" : ""})
                    ).replace(rtrim, "$1"),
                    matcher,
                    i < j && matcherFromTokens(tokens.slice(i, j)),
                    j < len && matcherFromTokens((tokens = tokens.slice(j))),
                    j < len && toSelector(tokens)
                  );
                }
                matchers.push(matcher);
              }
            }

            return elementMatcher(matchers);
          }

          function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0,
              byElement = elementMatchers.length > 0,
              superMatcher = function (seed, context, xml, results, outermost) {
                var elem, j, matcher,
                  matchedCount = 0,
                  i = "0",
                  unmatched = seed && [],
                  setMatched = [],
                  contextBackup = outermostContext,
                // We must always have either seed elements or outermost context
                  elems = seed || byElement && Expr.find["TAG"]("*", outermost),
                // Use integer dirruns iff this is the outermost matcher
                  dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                  len = elems.length;

                if (outermost) {
                  outermostContext = context !== document && context;
                }

                // Add elements passing elementMatchers directly to results
                // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
                // Support: IE<9, Safari
                // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                for (; i !== len && (elem = elems[i]) != null; i++) {
                  if (byElement && elem) {
                    j = 0;
                    while ((matcher = elementMatchers[j++])) {
                      if (matcher(elem, context, xml)) {
                        results.push(elem);
                        break;
                      }
                    }
                    if (outermost) {
                      dirruns = dirrunsUnique;
                    }
                  }

                  // Track unmatched elements for set filters
                  if (bySet) {
                    // They will have gone through all possible matchers
                    if ((elem = !matcher && elem)) {
                      matchedCount--;
                    }

                    // Lengthen the array for every element, matched or not
                    if (seed) {
                      unmatched.push(elem);
                    }
                  }
                }

                // Apply set filters to unmatched elements
                matchedCount += i;
                if (bySet && i !== matchedCount) {
                  j = 0;
                  while ((matcher = setMatchers[j++])) {
                    matcher(unmatched, setMatched, context, xml);
                  }

                  if (seed) {
                    // Reintegrate element matches to eliminate the need for sorting
                    if (matchedCount > 0) {
                      while (i--) {
                        if (!(unmatched[i] || setMatched[i])) {
                          setMatched[i] = pop.call(results);
                        }
                      }
                    }

                    // Discard index placeholder values to get only actual matches
                    setMatched = condense(setMatched);
                  }

                  // Add matches to results
                  push.apply(results, setMatched);

                  // Seedless set matches succeeding multiple successful matchers stipulate sorting
                  if (outermost && !seed && setMatched.length > 0 &&
                    ( matchedCount + setMatchers.length ) > 1) {

                    Sizzle.uniqueSort(results);
                  }
                }

                // Override manipulation of globals by nested matchers
                if (outermost) {
                  dirruns = dirrunsUnique;
                  outermostContext = contextBackup;
                }

                return unmatched;
              };

            return bySet ?
              markFunction(superMatcher) :
              superMatcher;
          }

          compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
            var i,
              setMatchers = [],
              elementMatchers = [],
              cached = compilerCache[selector + " "];

            if (!cached) {
              // Generate a function of recursive functions that can be used to check each element
              if (!match) {
                match = tokenize(selector);
              }
              i = match.length;
              while (i--) {
                cached = matcherFromTokens(match[i]);
                if (cached[expando]) {
                  setMatchers.push(cached);
                } else {
                  elementMatchers.push(cached);
                }
              }

              // Cache the compiled function
              cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

              // Save selector and tokenization
              cached.selector = selector;
            }
            return cached;
          };

          /**
           * A low-level selection function that works with Sizzle's compiled
           *  selector functions
           * @param {String|Function} selector A selector or a pre-compiled
           *  selector function built with Sizzle.compile
           * @param {Element} context
           * @param {Array} [results]
           * @param {Array} [seed] A set of elements to match against
           */
          select = Sizzle.select = function (selector, context, results, seed) {
            var i, tokens, token, type, find,
              compiled = typeof selector === "function" && selector,
              match = !seed && tokenize((selector = compiled.selector || selector));

            results = results || [];

            // Try to minimize operations if there is no seed and only one group
            if (match.length === 1) {

              // Take a shortcut and set the context if the root selector is an ID
              tokens = match[0] = match[0].slice(0);
              if (tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                support.getById && context.nodeType === 9 && documentIsHTML &&
                Expr.relative[tokens[1].type]) {

                context = ( Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [] )[0];
                if (!context) {
                  return results;

                  // Precompiled matchers will still verify ancestry, so step up a level
                } else if (compiled) {
                  context = context.parentNode;
                }

                selector = selector.slice(tokens.shift().value.length);
              }

              // Fetch a seed set for right-to-left matching
              i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
              while (i--) {
                token = tokens[i];

                // Abort if we hit a combinator
                if (Expr.relative[(type = token.type)]) {
                  break;
                }
                if ((find = Expr.find[type])) {
                  // Search, expanding context for leading sibling combinators
                  if ((seed = find(
                      token.matches[0].replace(runescape, funescape),
                      rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                    ))) {

                    // If seed is empty or no tokens remain, we can return early
                    tokens.splice(i, 1);
                    selector = seed.length && toSelector(tokens);
                    if (!selector) {
                      push.apply(results, seed);
                      return results;
                    }

                    break;
                  }
                }
              }
            }

            // Compile and execute a filtering function if one is not provided
            // Provide `match` to avoid retokenization if we modified the selector above
            ( compiled || compile(selector, match) )(
              seed,
              context,
              !documentIsHTML,
              results,
              rsibling.test(selector) && testContext(context.parentNode) || context
            );
            return results;
          };

// One-time assignments

// Sort stability
          support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
          support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
          setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
          support.sortDetached = assert(function (div1) {
            // Should return 1, but returns 4 (following)
            return div1.compareDocumentPosition(document.createElement("div")) & 1;
          });

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
          if (!assert(function (div) {
              div.innerHTML = "<a href='#'></a>";
              return div.firstChild.getAttribute("href") === "#";
            })) {
            addHandle("type|href|height|width", function (elem, name, isXML) {
              if (!isXML) {
                return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
              }
            });
          }

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
          if (!support.attributes || !assert(function (div) {
              div.innerHTML = "<input/>";
              div.firstChild.setAttribute("value", "");
              return div.firstChild.getAttribute("value") === "";
            })) {
            addHandle("value", function (elem, name, isXML) {
              if (!isXML && elem.nodeName.toLowerCase() === "input") {
                return elem.defaultValue;
              }
            });
          }

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
          if (!assert(function (div) {
              return div.getAttribute("disabled") == null;
            })) {
            addHandle(booleans, function (elem, name, isXML) {
              var val;
              if (!isXML) {
                return elem[name] === true ? name.toLowerCase() :
                  (val = elem.getAttributeNode(name)) && val.specified ?
                    val.value :
                    null;
              }
            });
          }

          return Sizzle;

        })(window);


      jQuery.find = Sizzle;
      jQuery.expr = Sizzle.selectors;
      jQuery.expr[":"] = jQuery.expr.pseudos;
      jQuery.unique = Sizzle.uniqueSort;
      jQuery.text = Sizzle.getText;
      jQuery.isXMLDoc = Sizzle.isXML;
      jQuery.contains = Sizzle.contains;


      var rneedsContext = jQuery.expr.match.needsContext;

      var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);


      var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
      function winnow(elements, qualifier, not) {
        if (jQuery.isFunction(qualifier)) {
          return jQuery.grep(elements, function (elem, i) {
            /* jshint -W018 */
            return !!qualifier.call(elem, i, elem) !== not;
          });

        }

        if (qualifier.nodeType) {
          return jQuery.grep(elements, function (elem) {
            return ( elem === qualifier ) !== not;
          });

        }

        if (typeof qualifier === "string") {
          if (risSimple.test(qualifier)) {
            return jQuery.filter(qualifier, elements, not);
          }

          qualifier = jQuery.filter(qualifier, elements);
        }

        return jQuery.grep(elements, function (elem) {
          return ( indexOf.call(qualifier, elem) >= 0 ) !== not;
        });
      }

      jQuery.filter = function (expr, elems, not) {
        var elem = elems[0];

        if (not) {
          expr = ":not(" + expr + ")";
        }

        return elems.length === 1 && elem.nodeType === 1 ?
          jQuery.find.matchesSelector(elem, expr) ? [elem] : [] :
          jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
            return elem.nodeType === 1;
          }));
      };

      jQuery.fn.extend({
        find: function (selector) {
          var i,
            len = this.length,
            ret = [],
            self = this;

          if (typeof selector !== "string") {
            return this.pushStack(jQuery(selector).filter(function () {
              for (i = 0; i < len; i++) {
                if (jQuery.contains(self[i], this)) {
                  return true;
                }
              }
            }));
          }

          for (i = 0; i < len; i++) {
            jQuery.find(selector, self[i], ret);
          }

          // Needed because $( selector, context ) becomes $( context ).find( selector )
          ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
          ret.selector = this.selector ? this.selector + " " + selector : selector;
          return ret;
        },
        filter: function (selector) {
          return this.pushStack(winnow(this, selector || [], false));
        },
        not: function (selector) {
          return this.pushStack(winnow(this, selector || [], true));
        },
        is: function (selector) {
          return !!winnow(
            this,

            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            typeof selector === "string" && rneedsContext.test(selector) ?
              jQuery(selector) :
            selector || [],
            false
          ).length;
        }
      });


// Initialize a jQuery object


// A central reference to the root jQuery(document)
      var rootjQuery,

      // A simple way to check for HTML strings
      // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
      // Strict HTML recognition (#11290: must start with <)
        rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

        init = jQuery.fn.init = function (selector, context) {
          var match, elem;

          // HANDLE: $(""), $(null), $(undefined), $(false)
          if (!selector) {
            return this;
          }

          // Handle HTML strings
          if (typeof selector === "string") {
            if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
              // Assume that strings that start and end with <> are HTML and skip the regex check
              match = [null, selector, null];

            } else {
              match = rquickExpr.exec(selector);
            }

            // Match html or make sure no context is specified for #id
            if (match && (match[1] || !context)) {

              // HANDLE: $(html) -> $(array)
              if (match[1]) {
                context = context instanceof jQuery ? context[0] : context;

                // Option to run scripts is true for back-compat
                // Intentionally let the error be thrown if parseHTML is not present
                jQuery.merge(this, jQuery.parseHTML(
                  match[1],
                  context && context.nodeType ? context.ownerDocument || context : document,
                  true
                ));

                // HANDLE: $(html, props)
                if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                  for (match in context) {
                    // Properties of context are called as methods if possible
                    if (jQuery.isFunction(this[match])) {
                      this[match](context[match]);

                      // ...and otherwise set as attributes
                    } else {
                      this.attr(match, context[match]);
                    }
                  }
                }

                return this;

                // HANDLE: $(#id)
              } else {
                elem = document.getElementById(match[2]);

                // Support: Blackberry 4.6
                // gEBID returns nodes no longer in the document (#6963)
                if (elem && elem.parentNode) {
                  // Inject the element directly into the jQuery object
                  this.length = 1;
                  this[0] = elem;
                }

                this.context = document;
                this.selector = selector;
                return this;
              }

              // HANDLE: $(expr, $(...))
            } else if (!context || context.jquery) {
              return ( context || rootjQuery ).find(selector);

              // HANDLE: $(expr, context)
              // (which is just equivalent to: $(context).find(expr)
            } else {
              return this.constructor(context).find(selector);
            }

            // HANDLE: $(DOMElement)
          } else if (selector.nodeType) {
            this.context = this[0] = selector;
            this.length = 1;
            return this;

            // HANDLE: $(function)
            // Shortcut for document ready
          } else if (jQuery.isFunction(selector)) {
            return typeof rootjQuery.ready !== "undefined" ?
              rootjQuery.ready(selector) :
              // Execute immediately if ready is not present
              selector(jQuery);
          }

          if (selector.selector !== undefined) {
            this.selector = selector.selector;
            this.context = selector.context;
          }

          return jQuery.makeArray(selector, this);
        };

// Give the init function the jQuery prototype for later instantiation
      init.prototype = jQuery.fn;

// Initialize central reference
      rootjQuery = jQuery(document);


      var rparentsprev = /^(?:parents|prev(?:Until|All))/,
      // Methods guaranteed to produce a unique set when starting from a unique set
        guaranteedUnique = {
          children: true,
          contents: true,
          next: true,
          prev: true
        };

      jQuery.extend({
        dir: function (elem, dir, until) {
          var matched = [],
            truncate = until !== undefined;

          while ((elem = elem[dir]) && elem.nodeType !== 9) {
            if (elem.nodeType === 1) {
              if (truncate && jQuery(elem).is(until)) {
                break;
              }
              matched.push(elem);
            }
          }
          return matched;
        },

        sibling: function (n, elem) {
          var matched = [];

          for (; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== elem) {
              matched.push(n);
            }
          }

          return matched;
        }
      });

      jQuery.fn.extend({
        has: function (target) {
          var targets = jQuery(target, this),
            l = targets.length;

          return this.filter(function () {
            var i = 0;
            for (; i < l; i++) {
              if (jQuery.contains(this, targets[i])) {
                return true;
              }
            }
          });
        },

        closest: function (selectors, context) {
          var cur,
            i = 0,
            l = this.length,
            matched = [],
            pos = rneedsContext.test(selectors) || typeof selectors !== "string" ?
              jQuery(selectors, context || this.context) :
              0;

          for (; i < l; i++) {
            for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
              // Always skip document fragments
              if (cur.nodeType < 11 && (pos ?
                pos.index(cur) > -1 :

                  // Don't pass non-elements to Sizzle
                cur.nodeType === 1 &&
                jQuery.find.matchesSelector(cur, selectors))) {

                matched.push(cur);
                break;
              }
            }
          }

          return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched);
        },

        // Determine the position of an element within the set
        index: function (elem) {

          // No argument, return index in parent
          if (!elem) {
            return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
          }

          // Index in selector
          if (typeof elem === "string") {
            return indexOf.call(jQuery(elem), this[0]);
          }

          // Locate the position of the desired element
          return indexOf.call(this,

            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem
          );
        },

        add: function (selector, context) {
          return this.pushStack(
            jQuery.unique(
              jQuery.merge(this.get(), jQuery(selector, context))
            )
          );
        },

        addBack: function (selector) {
          return this.add(selector == null ?
              this.prevObject : this.prevObject.filter(selector)
          );
        }
      });

      function sibling(cur, dir) {
        while ((cur = cur[dir]) && cur.nodeType !== 1) {
        }
        return cur;
      }

      jQuery.each({
        parent: function (elem) {
          var parent = elem.parentNode;
          return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function (elem) {
          return jQuery.dir(elem, "parentNode");
        },
        parentsUntil: function (elem, i, until) {
          return jQuery.dir(elem, "parentNode", until);
        },
        next: function (elem) {
          return sibling(elem, "nextSibling");
        },
        prev: function (elem) {
          return sibling(elem, "previousSibling");
        },
        nextAll: function (elem) {
          return jQuery.dir(elem, "nextSibling");
        },
        prevAll: function (elem) {
          return jQuery.dir(elem, "previousSibling");
        },
        nextUntil: function (elem, i, until) {
          return jQuery.dir(elem, "nextSibling", until);
        },
        prevUntil: function (elem, i, until) {
          return jQuery.dir(elem, "previousSibling", until);
        },
        siblings: function (elem) {
          return jQuery.sibling(( elem.parentNode || {} ).firstChild, elem);
        },
        children: function (elem) {
          return jQuery.sibling(elem.firstChild);
        },
        contents: function (elem) {
          return elem.contentDocument || jQuery.merge([], elem.childNodes);
        }
      }, function (name, fn) {
        jQuery.fn[name] = function (until, selector) {
          var matched = jQuery.map(this, fn, until);

          if (name.slice(-5) !== "Until") {
            selector = until;
          }

          if (selector && typeof selector === "string") {
            matched = jQuery.filter(selector, matched);
          }

          if (this.length > 1) {
            // Remove duplicates
            if (!guaranteedUnique[name]) {
              jQuery.unique(matched);
            }

            // Reverse order for parents* and prev-derivatives
            if (rparentsprev.test(name)) {
              matched.reverse();
            }
          }

          return this.pushStack(matched);
        };
      });
      var rnotwhite = (/\S+/g);


// String to Object options format cache
      var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
      function createOptions(options) {
        var object = optionsCache[options] = {};
        jQuery.each(options.match(rnotwhite) || [], function (_, flag) {
          object[flag] = true;
        });
        return object;
      }

      /*
       * Create a callback list using the following parameters:
       *
       *	options: an optional list of space-separated options that will change how
       *			the callback list behaves or a more traditional option object
       *
       * By default a callback list will act like an event callback list and can be
       * "fired" multiple times.
       *
       * Possible options:
       *
       *	once:			will ensure the callback list can only be fired once (like a Deferred)
       *
       *	memory:			will keep track of previous values and will call any callback added
       *					after the list has been fired right away with the latest "memorized"
       *					values (like a Deferred)
       *
       *	unique:			will ensure a callback can only be added once (no duplicate in the list)
       *
       *	stopOnFalse:	interrupt callings when a callback returns false
       *
       */
      jQuery.Callbacks = function (options) {

        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = typeof options === "string" ?
          ( optionsCache[options] || createOptions(options) ) :
          jQuery.extend({}, options);

        var // Last fire value (for non-forgettable lists)
          memory,
        // Flag to know if list was already fired
          fired,
        // Flag to know if list is currently firing
          firing,
        // First callback to fire (used internally by add and fireWith)
          firingStart,
        // End of the loop when firing
          firingLength,
        // Index of currently firing callback (modified by remove if needed)
          firingIndex,
        // Actual callback list
          list = [],
        // Stack of fire calls for repeatable lists
          stack = !options.once && [],
        // Fire callbacks
          fire = function (data) {
            memory = options.memory && data;
            fired = true;
            firingIndex = firingStart || 0;
            firingStart = 0;
            firingLength = list.length;
            firing = true;
            for (; list && firingIndex < firingLength; firingIndex++) {
              if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                memory = false; // To prevent further calls using add
                break;
              }
            }
            firing = false;
            if (list) {
              if (stack) {
                if (stack.length) {
                  fire(stack.shift());
                }
              } else if (memory) {
                list = [];
              } else {
                self.disable();
              }
            }
          },
        // Actual Callbacks object
          self = {
            // Add a callback or a collection of callbacks to the list
            add: function () {
              if (list) {
                // First, we save the current length
                var start = list.length;
                (function add(args) {
                  jQuery.each(args, function (_, arg) {
                    var type = jQuery.type(arg);
                    if (type === "function") {
                      if (!options.unique || !self.has(arg)) {
                        list.push(arg);
                      }
                    } else if (arg && arg.length && type !== "string") {
                      // Inspect recursively
                      add(arg);
                    }
                  });
                })(arguments);
                // Do we need to add the callbacks to the
                // current firing batch?
                if (firing) {
                  firingLength = list.length;
                  // With memory, if we're not firing then
                  // we should call right away
                } else if (memory) {
                  firingStart = start;
                  fire(memory);
                }
              }
              return this;
            },
            // Remove a callback from the list
            remove: function () {
              if (list) {
                jQuery.each(arguments, function (_, arg) {
                  var index;
                  while (( index = jQuery.inArray(arg, list, index) ) > -1) {
                    list.splice(index, 1);
                    // Handle firing indexes
                    if (firing) {
                      if (index <= firingLength) {
                        firingLength--;
                      }
                      if (index <= firingIndex) {
                        firingIndex--;
                      }
                    }
                  }
                });
              }
              return this;
            },
            // Check if a given callback is in the list.
            // If no argument is given, return whether or not list has callbacks attached.
            has: function (fn) {
              return fn ? jQuery.inArray(fn, list) > -1 : !!( list && list.length );
            },
            // Remove all callbacks from the list
            empty: function () {
              list = [];
              firingLength = 0;
              return this;
            },
            // Have the list do nothing anymore
            disable: function () {
              list = stack = memory = undefined;
              return this;
            },
            // Is it disabled?
            disabled: function () {
              return !list;
            },
            // Lock the list in its current state
            lock: function () {
              stack = undefined;
              if (!memory) {
                self.disable();
              }
              return this;
            },
            // Is it locked?
            locked: function () {
              return !stack;
            },
            // Call all callbacks with the given context and arguments
            fireWith: function (context, args) {
              if (list && ( !fired || stack )) {
                args = args || [];
                args = [context, args.slice ? args.slice() : args];
                if (firing) {
                  stack.push(args);
                } else {
                  fire(args);
                }
              }
              return this;
            },
            // Call all the callbacks with the given arguments
            fire: function () {
              self.fireWith(this, arguments);
              return this;
            },
            // To know if the callbacks have already been called at least once
            fired: function () {
              return !!fired;
            }
          };

        return self;
      };


      jQuery.extend({

        Deferred: function (func) {
          var tuples = [
              // action, add listener, listener list, final state
              ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
              ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
              ["notify", "progress", jQuery.Callbacks("memory")]
            ],
            state = "pending",
            promise = {
              state: function () {
                return state;
              },
              always: function () {
                deferred.done(arguments).fail(arguments);
                return this;
              },
              then: function (/* fnDone, fnFail, fnProgress */) {
                var fns = arguments;
                return jQuery.Deferred(function (newDefer) {
                  jQuery.each(tuples, function (i, tuple) {
                    var fn = jQuery.isFunction(fns[i]) && fns[i];
                    // deferred[ done | fail | progress ] for forwarding actions to newDefer
                    deferred[tuple[1]](function () {
                      var returned = fn && fn.apply(this, arguments);
                      if (returned && jQuery.isFunction(returned.promise)) {
                        returned.promise()
                          .done(newDefer.resolve)
                          .fail(newDefer.reject)
                          .progress(newDefer.notify);
                      } else {
                        newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                      }
                    });
                  });
                  fns = null;
                }).promise();
              },
              // Get a promise for this deferred
              // If obj is provided, the promise aspect is added to the object
              promise: function (obj) {
                return obj != null ? jQuery.extend(obj, promise) : promise;
              }
            },
            deferred = {};

          // Keep pipe for back-compat
          promise.pipe = promise.then;

          // Add list-specific methods
          jQuery.each(tuples, function (i, tuple) {
            var list = tuple[2],
              stateString = tuple[3];

            // promise[ done | fail | progress ] = list.add
            promise[tuple[1]] = list.add;

            // Handle state
            if (stateString) {
              list.add(function () {
                // state = [ resolved | rejected ]
                state = stateString;

                // [ reject_list | resolve_list ].disable; progress_list.lock
              }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
            }

            // deferred[ resolve | reject | notify ]
            deferred[tuple[0]] = function () {
              deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
              return this;
            };
            deferred[tuple[0] + "With"] = list.fireWith;
          });

          // Make the deferred a promise
          promise.promise(deferred);

          // Call given func if any
          if (func) {
            func.call(deferred, deferred);
          }

          // All done!
          return deferred;
        },

        // Deferred helper
        when: function (subordinate /* , ..., subordinateN */) {
          var i = 0,
            resolveValues = slice.call(arguments),
            length = resolveValues.length,

          // the count of uncompleted subordinates
            remaining = length !== 1 || ( subordinate && jQuery.isFunction(subordinate.promise) ) ? length : 0,

          // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
            deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

          // Update function for both resolve and progress values
            updateFunc = function (i, contexts, values) {
              return function (value) {
                contexts[i] = this;
                values[i] = arguments.length > 1 ? slice.call(arguments) : value;
                if (values === progressValues) {
                  deferred.notifyWith(contexts, values);
                } else if (!( --remaining )) {
                  deferred.resolveWith(contexts, values);
                }
              };
            },

            progressValues, progressContexts, resolveContexts;

          // Add listeners to Deferred subordinates; treat others as resolved
          if (length > 1) {
            progressValues = new Array(length);
            progressContexts = new Array(length);
            resolveContexts = new Array(length);
            for (; i < length; i++) {
              if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
                resolveValues[i].promise()
                  .done(updateFunc(i, resolveContexts, resolveValues))
                  .fail(deferred.reject)
                  .progress(updateFunc(i, progressContexts, progressValues));
              } else {
                --remaining;
              }
            }
          }

          // If we're not waiting on anything, resolve the master
          if (!remaining) {
            deferred.resolveWith(resolveContexts, resolveValues);
          }

          return deferred.promise();
        }
      });


// The deferred used on DOM ready
      var readyList;

      jQuery.fn.ready = function (fn) {
        // Add the callback
        jQuery.ready.promise().done(fn);

        return this;
      };

      jQuery.extend({
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,

        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,

        // Hold (or release) the ready event
        holdReady: function (hold) {
          if (hold) {
            jQuery.readyWait++;
          } else {
            jQuery.ready(true);
          }
        },

        // Handle when the DOM is ready
        ready: function (wait) {

          // Abort if there are pending holds or we're already ready
          if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
            return;
          }

          // Remember that the DOM is ready
          jQuery.isReady = true;

          // If a normal DOM Ready event fired, decrement, and wait if need be
          if (wait !== true && --jQuery.readyWait > 0) {
            return;
          }

          // If there are functions bound, to execute
          readyList.resolveWith(document, [jQuery]);

          // Trigger any bound ready events
          if (jQuery.fn.triggerHandler) {
            jQuery(document).triggerHandler("ready");
            jQuery(document).off("ready");
          }
        }
      });

      /**
       * The ready event handler and self cleanup method
       */
      function completed() {
        document.removeEventListener("DOMContentLoaded", completed, false);
        window.removeEventListener("load", completed, false);
        jQuery.ready();
      }

      jQuery.ready.promise = function (obj) {
        if (!readyList) {

          readyList = jQuery.Deferred();

          // Catch cases where $(document).ready() is called after the browser event has already occurred.
          // We once tried to use readyState "interactive" here, but it caused issues like the one
          // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
          if (document.readyState === "complete") {
            // Handle it asynchronously to allow scripts the opportunity to delay ready
            setTimeout(jQuery.ready);

          } else {

            // Use the handy event callback
            document.addEventListener("DOMContentLoaded", completed, false);

            // A fallback to window.onload, that will always work
            window.addEventListener("load", completed, false);
          }
        }
        return readyList.promise(obj);
      };

// Kick off the DOM ready check even if the user does not
      jQuery.ready.promise();


// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
      var access = jQuery.access = function (elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0,
          len = elems.length,
          bulk = key == null;

        // Sets many values
        if (jQuery.type(key) === "object") {
          chainable = true;
          for (i in key) {
            jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
          }

          // Sets one value
        } else if (value !== undefined) {
          chainable = true;

          if (!jQuery.isFunction(value)) {
            raw = true;
          }

          if (bulk) {
            // Bulk operations run against the entire set
            if (raw) {
              fn.call(elems, value);
              fn = null;

              // ...except when executing function values
            } else {
              bulk = fn;
              fn = function (elem, key, value) {
                return bulk.call(jQuery(elem), value);
              };
            }
          }

          if (fn) {
            for (; i < len; i++) {
              fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
            }
          }
        }

        return chainable ?
          elems :

          // Gets
          bulk ?
            fn.call(elems) :
            len ? fn(elems[0], key) : emptyGet;
      };


      /**
       * Determines whether an object can have data
       */
      jQuery.acceptData = function (owner) {
        // Accepts only:
        //  - Node
        //    - Node.ELEMENT_NODE
        //    - Node.DOCUMENT_NODE
        //  - Object
        //    - Any
        /* jshint -W018 */
        return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
      };


      function Data() {
        // Support: Android<4,
        // Old WebKit does not have Object.preventExtensions/freeze method,
        // return new empty object instead with no [[set]] accessor
        Object.defineProperty(this.cache = {}, 0, {
          get: function () {
            return {};
          }
        });

        this.expando = jQuery.expando + Data.uid++;
      }

      Data.uid = 1;
      Data.accepts = jQuery.acceptData;

      Data.prototype = {
        key: function (owner) {
          // We can accept data for non-element nodes in modern browsers,
          // but we should not, see #8335.
          // Always return the key for a frozen object.
          if (!Data.accepts(owner)) {
            return 0;
          }

          var descriptor = {},
          // Check if the owner object already has a cache key
            unlock = owner[this.expando];

          // If not, create one
          if (!unlock) {
            unlock = Data.uid++;

            // Secure it in a non-enumerable, non-writable property
            try {
              descriptor[this.expando] = {value: unlock};
              Object.defineProperties(owner, descriptor);

              // Support: Android<4
              // Fallback to a less secure definition
            } catch (e) {
              descriptor[this.expando] = unlock;
              jQuery.extend(owner, descriptor);
            }
          }

          // Ensure the cache object
          if (!this.cache[unlock]) {
            this.cache[unlock] = {};
          }

          return unlock;
        },
        set: function (owner, data, value) {
          var prop,
          // There may be an unlock assigned to this node,
          // if there is no entry for this "owner", create one inline
          // and set the unlock as though an owner entry had always existed
            unlock = this.key(owner),
            cache = this.cache[unlock];

          // Handle: [ owner, key, value ] args
          if (typeof data === "string") {
            cache[data] = value;

            // Handle: [ owner, { properties } ] args
          } else {
            // Fresh assignments by object are shallow copied
            if (jQuery.isEmptyObject(cache)) {
              jQuery.extend(this.cache[unlock], data);
              // Otherwise, copy the properties one-by-one to the cache object
            } else {
              for (prop in data) {
                cache[prop] = data[prop];
              }
            }
          }
          return cache;
        },
        get: function (owner, key) {
          // Either a valid cache is found, or will be created.
          // New caches will be created and the unlock returned,
          // allowing direct access to the newly created
          // empty data object. A valid owner object must be provided.
          var cache = this.cache[this.key(owner)];

          return key === undefined ?
            cache : cache[key];
        },
        access: function (owner, key, value) {
          var stored;
          // In cases where either:
          //
          //   1. No key was specified
          //   2. A string key was specified, but no value provided
          //
          // Take the "read" path and allow the get method to determine
          // which value to return, respectively either:
          //
          //   1. The entire cache object
          //   2. The data stored at the key
          //
          if (key === undefined ||
            ((key && typeof key === "string") && value === undefined)) {

            stored = this.get(owner, key);

            return stored !== undefined ?
              stored : this.get(owner, jQuery.camelCase(key));
          }

          // [*]When the key is not a string, or both a key and value
          // are specified, set or extend (existing objects) with either:
          //
          //   1. An object of properties
          //   2. A key and value
          //
          this.set(owner, key, value);

          // Since the "set" path can have two possible entry points
          // return the expected data based on which path was taken[*]
          return value !== undefined ? value : key;
        },
        remove: function (owner, key) {
          var i, name, camel,
            unlock = this.key(owner),
            cache = this.cache[unlock];

          if (key === undefined) {
            this.cache[unlock] = {};

          } else {
            // Support array or space separated string of keys
            if (jQuery.isArray(key)) {
              // If "name" is an array of keys...
              // When data is initially created, via ("key", "val") signature,
              // keys will be converted to camelCase.
              // Since there is no way to tell _how_ a key was added, remove
              // both plain key and camelCase key. #12786
              // This will only penalize the array argument path.
              name = key.concat(key.map(jQuery.camelCase));
            } else {
              camel = jQuery.camelCase(key);
              // Try the string as a key before any manipulation
              if (key in cache) {
                name = [key, camel];
              } else {
                // If a key with the spaces exists, use it.
                // Otherwise, create an array by matching non-whitespace
                name = camel;
                name = name in cache ?
                  [name] : ( name.match(rnotwhite) || [] );
              }
            }

            i = name.length;
            while (i--) {
              delete cache[name[i]];
            }
          }
        },
        hasData: function (owner) {
          return !jQuery.isEmptyObject(
            this.cache[owner[this.expando]] || {}
          );
        },
        discard: function (owner) {
          if (owner[this.expando]) {
            delete this.cache[owner[this.expando]];
          }
        }
      };
      var data_priv = new Data();

      var data_user = new Data();


//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

      var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        rmultiDash = /([A-Z])/g;

      function dataAttr(elem, key, data) {
        var name;

        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if (data === undefined && elem.nodeType === 1) {
          name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
          data = elem.getAttribute(name);

          if (typeof data === "string") {
            try {
              data = data === "true" ? true :
                data === "false" ? false :
                  data === "null" ? null :
                    // Only convert to a number if it doesn't change the string
                    +data + "" === data ? +data :
                      rbrace.test(data) ? jQuery.parseJSON(data) :
                        data;
            } catch (e) {
            }

            // Make sure we set the data so it isn't changed later
            data_user.set(elem, key, data);
          } else {
            data = undefined;
          }
        }
        return data;
      }

      jQuery.extend({
        hasData: function (elem) {
          return data_user.hasData(elem) || data_priv.hasData(elem);
        },

        data: function (elem, name, data) {
          return data_user.access(elem, name, data);
        },

        removeData: function (elem, name) {
          data_user.remove(elem, name);
        },

        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to data_priv methods, these can be deprecated.
        _data: function (elem, name, data) {
          return data_priv.access(elem, name, data);
        },

        _removeData: function (elem, name) {
          data_priv.remove(elem, name);
        }
      });

      jQuery.fn.extend({
        data: function (key, value) {
          var i, name, data,
            elem = this[0],
            attrs = elem && elem.attributes;

          // Gets all values
          if (key === undefined) {
            if (this.length) {
              data = data_user.get(elem);

              if (elem.nodeType === 1 && !data_priv.get(elem, "hasDataAttrs")) {
                i = attrs.length;
                while (i--) {

                  // Support: IE11+
                  // The attrs elements can be null (#14894)
                  if (attrs[i]) {
                    name = attrs[i].name;
                    if (name.indexOf("data-") === 0) {
                      name = jQuery.camelCase(name.slice(5));
                      dataAttr(elem, name, data[name]);
                    }
                  }
                }
                data_priv.set(elem, "hasDataAttrs", true);
              }
            }

            return data;
          }

          // Sets multiple values
          if (typeof key === "object") {
            return this.each(function () {
              data_user.set(this, key);
            });
          }

          return access(this, function (value) {
            var data,
              camelKey = jQuery.camelCase(key);

            // The calling jQuery object (element matches) is not empty
            // (and therefore has an element appears at this[ 0 ]) and the
            // `value` parameter was not undefined. An empty jQuery object
            // will result in `undefined` for elem = this[ 0 ] which will
            // throw an exception if an attempt to read a data cache is made.
            if (elem && value === undefined) {
              // Attempt to get data from the cache
              // with the key as-is
              data = data_user.get(elem, key);
              if (data !== undefined) {
                return data;
              }

              // Attempt to get data from the cache
              // with the key camelized
              data = data_user.get(elem, camelKey);
              if (data !== undefined) {
                return data;
              }

              // Attempt to "discover" the data in
              // HTML5 custom data-* attrs
              data = dataAttr(elem, camelKey, undefined);
              if (data !== undefined) {
                return data;
              }

              // We tried really hard, but the data doesn't exist.
              return;
            }

            // Set the data...
            this.each(function () {
              // First, attempt to store a copy or reference of any
              // data that might've been store with a camelCased key.
              var data = data_user.get(this, camelKey);

              // For HTML5 data-* attribute interop, we have to
              // store property names with dashes in a camelCase form.
              // This might not apply to all properties...*
              data_user.set(this, camelKey, value);

              // *... In the case of properties that might _actually_
              // have dashes, we need to also store a copy of that
              // unchanged property.
              if (key.indexOf("-") !== -1 && data !== undefined) {
                data_user.set(this, key, value);
              }
            });
          }, null, value, arguments.length > 1, null, true);
        },

        removeData: function (key) {
          return this.each(function () {
            data_user.remove(this, key);
          });
        }
      });


      jQuery.extend({
        queue: function (elem, type, data) {
          var queue;

          if (elem) {
            type = ( type || "fx" ) + "queue";
            queue = data_priv.get(elem, type);

            // Speed up dequeue by getting out quickly if this is just a lookup
            if (data) {
              if (!queue || jQuery.isArray(data)) {
                queue = data_priv.access(elem, type, jQuery.makeArray(data));
              } else {
                queue.push(data);
              }
            }
            return queue || [];
          }
        },

        dequeue: function (elem, type) {
          type = type || "fx";

          var queue = jQuery.queue(elem, type),
            startLength = queue.length,
            fn = queue.shift(),
            hooks = jQuery._queueHooks(elem, type),
            next = function () {
              jQuery.dequeue(elem, type);
            };

          // If the fx queue is dequeued, always remove the progress sentinel
          if (fn === "inprogress") {
            fn = queue.shift();
            startLength--;
          }

          if (fn) {

            // Add a progress sentinel to prevent the fx queue from being
            // automatically dequeued
            if (type === "fx") {
              queue.unshift("inprogress");
            }

            // Clear up the last queue stop function
            delete hooks.stop;
            fn.call(elem, next, hooks);
          }

          if (!startLength && hooks) {
            hooks.empty.fire();
          }
        },

        // Not public - generate a queueHooks object, or return the current one
        _queueHooks: function (elem, type) {
          var key = type + "queueHooks";
          return data_priv.get(elem, key) || data_priv.access(elem, key, {
              empty: jQuery.Callbacks("once memory").add(function () {
                data_priv.remove(elem, [type + "queue", key]);
              })
            });
        }
      });

      jQuery.fn.extend({
        queue: function (type, data) {
          var setter = 2;

          if (typeof type !== "string") {
            data = type;
            type = "fx";
            setter--;
          }

          if (arguments.length < setter) {
            return jQuery.queue(this[0], type);
          }

          return data === undefined ?
            this :
            this.each(function () {
              var queue = jQuery.queue(this, type, data);

              // Ensure a hooks for this queue
              jQuery._queueHooks(this, type);

              if (type === "fx" && queue[0] !== "inprogress") {
                jQuery.dequeue(this, type);
              }
            });
        },
        dequeue: function (type) {
          return this.each(function () {
            jQuery.dequeue(this, type);
          });
        },
        clearQueue: function (type) {
          return this.queue(type || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function (type, obj) {
          var tmp,
            count = 1,
            defer = jQuery.Deferred(),
            elements = this,
            i = this.length,
            resolve = function () {
              if (!( --count )) {
                defer.resolveWith(elements, [elements]);
              }
            };

          if (typeof type !== "string") {
            obj = type;
            type = undefined;
          }
          type = type || "fx";

          while (i--) {
            tmp = data_priv.get(elements[i], type + "queueHooks");
            if (tmp && tmp.empty) {
              count++;
              tmp.empty.add(resolve);
            }
          }
          resolve();
          return defer.promise(obj);
        }
      });
      var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

      var cssExpand = ["Top", "Right", "Bottom", "Left"];

      var isHidden = function (elem, el) {
        // isHidden might be called from jQuery#filter function;
        // in that case, element will be second argument
        elem = el || elem;
        return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
      };

      var rcheckableType = (/^(?:checkbox|radio)$/i);


      (function () {
        var fragment = document.createDocumentFragment(),
          div = fragment.appendChild(document.createElement("div")),
          input = document.createElement("input");

        // Support: Safari<=5.1
        // Check state lost if the name is set (#11217)
        // Support: Windows Web Apps (WWA)
        // `name` and `type` must use .setAttribute for WWA (#14901)
        input.setAttribute("type", "radio");
        input.setAttribute("checked", "checked");
        input.setAttribute("name", "t");

        div.appendChild(input);

        // Support: Safari<=5.1, Android<4.2
        // Older WebKit doesn't clone checked state correctly in fragments
        support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;

        // Support: IE<=11+
        // Make sure textarea (and checkbox) defaultValue is properly cloned
        div.innerHTML = "<textarea>x</textarea>";
        support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
      })();
      var strundefined = typeof undefined;


      support.focusinBubbles = "onfocusin" in window;


      var
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

      function returnTrue() {
        return true;
      }

      function returnFalse() {
        return false;
      }

      function safeActiveElement() {
        try {
          return document.activeElement;
        } catch (err) {
        }
      }

      /*
       * Helper functions for managing events -- not part of the public interface.
       * Props to Dean Edwards' addEvent library for many of the ideas.
       */
      jQuery.event = {

        global: {},

        add: function (elem, types, handler, data, selector) {

          var handleObjIn, eventHandle, tmp,
            events, t, handleObj,
            special, handlers, type, namespaces, origType,
            elemData = data_priv.get(elem);

          // Don't attach events to noData or text/comment nodes (but allow plain objects)
          if (!elemData) {
            return;
          }

          // Caller can pass in an object of custom data in lieu of the handler
          if (handler.handler) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
            selector = handleObjIn.selector;
          }

          // Make sure that the handler has a unique ID, used to find/remove it later
          if (!handler.guid) {
            handler.guid = jQuery.guid++;
          }

          // Init the element's event structure and main handler, if this is the first
          if (!(events = elemData.events)) {
            events = elemData.events = {};
          }
          if (!(eventHandle = elemData.handle)) {
            eventHandle = elemData.handle = function (e) {
              // Discard the second event of a jQuery.event.trigger() and
              // when an event is called after a page has unloaded
              return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
                jQuery.event.dispatch.apply(elem, arguments) : undefined;
            };
          }

          // Handle multiple events separated by a space
          types = ( types || "" ).match(rnotwhite) || [""];
          t = types.length;
          while (t--) {
            tmp = rtypenamespace.exec(types[t]) || [];
            type = origType = tmp[1];
            namespaces = ( tmp[2] || "" ).split(".").sort();

            // There *must* be a type, no attaching namespace-only handlers
            if (!type) {
              continue;
            }

            // If event changes its type, use the special event handlers for the changed type
            special = jQuery.event.special[type] || {};

            // If selector defined, determine special event api type, otherwise given type
            type = ( selector ? special.delegateType : special.bindType ) || type;

            // Update special based on newly reset type
            special = jQuery.event.special[type] || {};

            // handleObj is passed to all event handlers
            handleObj = jQuery.extend({
              type: type,
              origType: origType,
              data: data,
              handler: handler,
              guid: handler.guid,
              selector: selector,
              needsContext: selector && jQuery.expr.match.needsContext.test(selector),
              namespace: namespaces.join(".")
            }, handleObjIn);

            // Init the event handler queue if we're the first
            if (!(handlers = events[type])) {
              handlers = events[type] = [];
              handlers.delegateCount = 0;

              // Only use addEventListener if the special events handler returns false
              if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                if (elem.addEventListener) {
                  elem.addEventListener(type, eventHandle, false);
                }
              }
            }

            if (special.add) {
              special.add.call(elem, handleObj);

              if (!handleObj.handler.guid) {
                handleObj.handler.guid = handler.guid;
              }
            }

            // Add to the element's handler list, delegates in front
            if (selector) {
              handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
              handlers.push(handleObj);
            }

            // Keep track of which events have ever been used, for event optimization
            jQuery.event.global[type] = true;
          }

        },

        // Detach an event or set of events from an element
        remove: function (elem, types, handler, selector, mappedTypes) {

          var j, origCount, tmp,
            events, t, handleObj,
            special, handlers, type, namespaces, origType,
            elemData = data_priv.hasData(elem) && data_priv.get(elem);

          if (!elemData || !(events = elemData.events)) {
            return;
          }

          // Once for each type.namespace in types; type may be omitted
          types = ( types || "" ).match(rnotwhite) || [""];
          t = types.length;
          while (t--) {
            tmp = rtypenamespace.exec(types[t]) || [];
            type = origType = tmp[1];
            namespaces = ( tmp[2] || "" ).split(".").sort();

            // Unbind all events (on this namespace, if provided) for the element
            if (!type) {
              for (type in events) {
                jQuery.event.remove(elem, type + types[t], handler, selector, true);
              }
              continue;
            }

            special = jQuery.event.special[type] || {};
            type = ( selector ? special.delegateType : special.bindType ) || type;
            handlers = events[type] || [];
            tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

            // Remove matching events
            origCount = j = handlers.length;
            while (j--) {
              handleObj = handlers[j];

              if (( mappedTypes || origType === handleObj.origType ) &&
                ( !handler || handler.guid === handleObj.guid ) &&
                ( !tmp || tmp.test(handleObj.namespace) ) &&
                ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector )) {
                handlers.splice(j, 1);

                if (handleObj.selector) {
                  handlers.delegateCount--;
                }
                if (special.remove) {
                  special.remove.call(elem, handleObj);
                }
              }
            }

            // Remove generic event handler if we removed something and no more handlers exist
            // (avoids potential for endless recursion during removal of special event handlers)
            if (origCount && !handlers.length) {
              if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                jQuery.removeEvent(elem, type, elemData.handle);
              }

              delete events[type];
            }
          }

          // Remove the expando if it's no longer used
          if (jQuery.isEmptyObject(events)) {
            delete elemData.handle;
            data_priv.remove(elem, "events");
          }
        },

        trigger: function (event, data, elem, onlyHandlers) {

          var i, cur, tmp, bubbleType, ontype, handle, special,
            eventPath = [elem || document],
            type = hasOwn.call(event, "type") ? event.type : event,
            namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

          cur = tmp = elem = elem || document;

          // Don't do events on text and comment nodes
          if (elem.nodeType === 3 || elem.nodeType === 8) {
            return;
          }

          // focus/blur morphs to focusin/out; ensure we're not firing them right now
          if (rfocusMorph.test(type + jQuery.event.triggered)) {
            return;
          }

          if (type.indexOf(".") >= 0) {
            // Namespaced trigger; create a regexp to match event type in handle()
            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
          }
          ontype = type.indexOf(":") < 0 && "on" + type;

          // Caller can pass in a jQuery.Event object, Object, or just an event type string
          event = event[jQuery.expando] ?
            event :
            new jQuery.Event(type, typeof event === "object" && event);

          // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
          event.isTrigger = onlyHandlers ? 2 : 3;
          event.namespace = namespaces.join(".");
          event.namespace_re = event.namespace ?
            new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
            null;

          // Clean up the event in case it is being reused
          event.result = undefined;
          if (!event.target) {
            event.target = elem;
          }

          // Clone any incoming data and prepend the event, creating the handler arg list
          data = data == null ?
            [event] :
            jQuery.makeArray(data, [event]);

          // Allow special events to draw outside the lines
          special = jQuery.event.special[type] || {};
          if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
            return;
          }

          // Determine event propagation path in advance, per W3C events spec (#9951)
          // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
          if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

            bubbleType = special.delegateType || type;
            if (!rfocusMorph.test(bubbleType + type)) {
              cur = cur.parentNode;
            }
            for (; cur; cur = cur.parentNode) {
              eventPath.push(cur);
              tmp = cur;
            }

            // Only add window if we got to document (e.g., not plain obj or detached DOM)
            if (tmp === (elem.ownerDocument || document)) {
              eventPath.push(tmp.defaultView || tmp.parentWindow || window);
            }
          }

          // Fire handlers on the event path
          i = 0;
          while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {

            event.type = i > 1 ?
              bubbleType :
            special.bindType || type;

            // jQuery handler
            handle = ( data_priv.get(cur, "events") || {} )[event.type] && data_priv.get(cur, "handle");
            if (handle) {
              handle.apply(cur, data);
            }

            // Native handler
            handle = ontype && cur[ontype];
            if (handle && handle.apply && jQuery.acceptData(cur)) {
              event.result = handle.apply(cur, data);
              if (event.result === false) {
                event.preventDefault();
              }
            }
          }
          event.type = type;

          // If nobody prevented the default action, do it now
          if (!onlyHandlers && !event.isDefaultPrevented()) {

            if ((!special._default || special._default.apply(eventPath.pop(), data) === false) &&
              jQuery.acceptData(elem)) {

              // Call a native DOM method on the target with the same name name as the event.
              // Don't do default actions on window, that's where global variables be (#6170)
              if (ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem)) {

                // Don't re-trigger an onFOO event when we call its FOO() method
                tmp = elem[ontype];

                if (tmp) {
                  elem[ontype] = null;
                }

                // Prevent re-triggering of the same event, since we already bubbled it above
                jQuery.event.triggered = type;
                elem[type]();
                jQuery.event.triggered = undefined;

                if (tmp) {
                  elem[ontype] = tmp;
                }
              }
            }
          }

          return event.result;
        },

        dispatch: function (event) {

          // Make a writable jQuery.Event from the native event object
          event = jQuery.event.fix(event);

          var i, j, ret, matched, handleObj,
            handlerQueue = [],
            args = slice.call(arguments),
            handlers = ( data_priv.get(this, "events") || {} )[event.type] || [],
            special = jQuery.event.special[event.type] || {};

          // Use the fix-ed jQuery.Event rather than the (read-only) native event
          args[0] = event;
          event.delegateTarget = this;

          // Call the preDispatch hook for the mapped type, and let it bail if desired
          if (special.preDispatch && special.preDispatch.call(this, event) === false) {
            return;
          }

          // Determine handlers
          handlerQueue = jQuery.event.handlers.call(this, event, handlers);

          // Run delegates first; they may want to stop propagation beneath us
          i = 0;
          while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
            event.currentTarget = matched.elem;

            j = 0;
            while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {

              // Triggered event must either 1) have no namespace, or 2) have namespace(s)
              // a subset or equal to those in the bound event (both can have no namespace).
              if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {

                event.handleObj = handleObj;
                event.data = handleObj.data;

                ret = ( (jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler )
                  .apply(matched.elem, args);

                if (ret !== undefined) {
                  if ((event.result = ret) === false) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }
              }
            }
          }

          // Call the postDispatch hook for the mapped type
          if (special.postDispatch) {
            special.postDispatch.call(this, event);
          }

          return event.result;
        },

        handlers: function (event, handlers) {
          var i, matches, sel, handleObj,
            handlerQueue = [],
            delegateCount = handlers.delegateCount,
            cur = event.target;

          // Find delegate handlers
          // Black-hole SVG <use> instance trees (#13180)
          // Avoid non-left-click bubbling in Firefox (#3861)
          if (delegateCount && cur.nodeType && (!event.button || event.type !== "click")) {

            for (; cur !== this; cur = cur.parentNode || this) {

              // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
              if (cur.disabled !== true || event.type !== "click") {
                matches = [];
                for (i = 0; i < delegateCount; i++) {
                  handleObj = handlers[i];

                  // Don't conflict with Object.prototype properties (#13203)
                  sel = handleObj.selector + " ";

                  if (matches[sel] === undefined) {
                    matches[sel] = handleObj.needsContext ?
                    jQuery(sel, this).index(cur) >= 0 :
                      jQuery.find(sel, this, null, [cur]).length;
                  }
                  if (matches[sel]) {
                    matches.push(handleObj);
                  }
                }
                if (matches.length) {
                  handlerQueue.push({elem: cur, handlers: matches});
                }
              }
            }
          }

          // Add the remaining (directly-bound) handlers
          if (delegateCount < handlers.length) {
            handlerQueue.push({elem: this, handlers: handlers.slice(delegateCount)});
          }

          return handlerQueue;
        },

        // Includes some event props shared by KeyEvent and MouseEvent
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

        fixHooks: {},

        keyHooks: {
          props: "char charCode key keyCode".split(" "),
          filter: function (event, original) {

            // Add which for key events
            if (event.which == null) {
              event.which = original.charCode != null ? original.charCode : original.keyCode;
            }

            return event;
          }
        },

        mouseHooks: {
          props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
          filter: function (event, original) {
            var eventDoc, doc, body,
              button = original.button;

            // Calculate pageX/Y if missing and clientX/Y available
            if (event.pageX == null && original.clientX != null) {
              eventDoc = event.target.ownerDocument || document;
              doc = eventDoc.documentElement;
              body = eventDoc.body;

              event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
              event.pageY = original.clientY + ( doc && doc.scrollTop || body && body.scrollTop || 0 ) - ( doc && doc.clientTop || body && body.clientTop || 0 );
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if (!event.which && button !== undefined) {
              event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
            }

            return event;
          }
        },

        fix: function (event) {
          if (event[jQuery.expando]) {
            return event;
          }

          // Create a writable copy of the event object and normalize some properties
          var i, prop, copy,
            type = event.type,
            originalEvent = event,
            fixHook = this.fixHooks[type];

          if (!fixHook) {
            this.fixHooks[type] = fixHook =
              rmouseEvent.test(type) ? this.mouseHooks :
                rkeyEvent.test(type) ? this.keyHooks :
                {};
          }
          copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

          event = new jQuery.Event(originalEvent);

          i = copy.length;
          while (i--) {
            prop = copy[i];
            event[prop] = originalEvent[prop];
          }

          // Support: Cordova 2.5 (WebKit) (#13255)
          // All events should have a target; Cordova deviceready doesn't
          if (!event.target) {
            event.target = document;
          }

          // Support: Safari 6.0+, Chrome<28
          // Target should not be a text node (#504, #13143)
          if (event.target.nodeType === 3) {
            event.target = event.target.parentNode;
          }

          return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },

        special: {
          load: {
            // Prevent triggered image.load events from bubbling to window.load
            noBubble: true
          },
          focus: {
            // Fire native event if possible so blur/focus sequence is correct
            trigger: function () {
              if (this !== safeActiveElement() && this.focus) {
                this.focus();
                return false;
              }
            },
            delegateType: "focusin"
          },
          blur: {
            trigger: function () {
              if (this === safeActiveElement() && this.blur) {
                this.blur();
                return false;
              }
            },
            delegateType: "focusout"
          },
          click: {
            // For checkbox, fire native event so checked state will be right
            trigger: function () {
              if (this.type === "checkbox" && this.click && jQuery.nodeName(this, "input")) {
                this.click();
                return false;
              }
            },

            // For cross-browser consistency, don't fire native .click() on links
            _default: function (event) {
              return jQuery.nodeName(event.target, "a");
            }
          },

          beforeunload: {
            postDispatch: function (event) {

              // Support: Firefox 20+
              // Firefox doesn't alert if the returnValue field is not set.
              if (event.result !== undefined && event.originalEvent) {
                event.originalEvent.returnValue = event.result;
              }
            }
          }
        },

        simulate: function (type, elem, event, bubble) {
          // Piggyback on a donor event to simulate a different one.
          // Fake originalEvent to avoid donor's stopPropagation, but if the
          // simulated event prevents default then we do the same on the donor.
          var e = jQuery.extend(
            new jQuery.Event(),
            event,
            {
              type: type,
              isSimulated: true,
              originalEvent: {}
            }
          );
          if (bubble) {
            jQuery.event.trigger(e, null, elem);
          } else {
            jQuery.event.dispatch.call(elem, e);
          }
          if (e.isDefaultPrevented()) {
            event.preventDefault();
          }
        }
      };

      jQuery.removeEvent = function (elem, type, handle) {
        if (elem.removeEventListener) {
          elem.removeEventListener(type, handle, false);
        }
      };

      jQuery.Event = function (src, props) {
        // Allow instantiation without the 'new' keyword
        if (!(this instanceof jQuery.Event)) {
          return new jQuery.Event(src, props);
        }

        // Event object
        if (src && src.type) {
          this.originalEvent = src;
          this.type = src.type;

          // Events bubbling up the document may have been marked as prevented
          // by a handler lower down the tree; reflect the correct value.
          this.isDefaultPrevented = src.defaultPrevented ||
          src.defaultPrevented === undefined &&
            // Support: Android<4.0
          src.returnValue === false ?
            returnTrue :
            returnFalse;

          // Event type
        } else {
          this.type = src;
        }

        // Put explicitly provided properties onto the event object
        if (props) {
          jQuery.extend(this, props);
        }

        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || jQuery.now();

        // Mark it as fixed
        this[jQuery.expando] = true;
      };

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
      jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,

        preventDefault: function () {
          var e = this.originalEvent;

          this.isDefaultPrevented = returnTrue;

          if (e && e.preventDefault) {
            e.preventDefault();
          }
        },
        stopPropagation: function () {
          var e = this.originalEvent;

          this.isPropagationStopped = returnTrue;

          if (e && e.stopPropagation) {
            e.stopPropagation();
          }
        },
        stopImmediatePropagation: function () {
          var e = this.originalEvent;

          this.isImmediatePropagationStopped = returnTrue;

          if (e && e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
          }

          this.stopPropagation();
        }
      };

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
      jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
      }, function (orig, fix) {
        jQuery.event.special[orig] = {
          delegateType: fix,
          bindType: fix,

          handle: function (event) {
            var ret,
              target = this,
              related = event.relatedTarget,
              handleObj = event.handleObj;

            // For mousenter/leave call the handler if related is outside the target.
            // NB: No relatedTarget if the mouse left/entered the browser window
            if (!related || (related !== target && !jQuery.contains(target, related))) {
              event.type = handleObj.origType;
              ret = handleObj.handler.apply(this, arguments);
              event.type = fix;
            }
            return ret;
          }
        };
      });

// Support: Firefox, Chrome, Safari
// Create "bubbling" focus and blur events
      if (!support.focusinBubbles) {
        jQuery.each({focus: "focusin", blur: "focusout"}, function (orig, fix) {

          // Attach a single capturing handler on the document while someone wants focusin/focusout
          var handler = function (event) {
            jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
          };

          jQuery.event.special[fix] = {
            setup: function () {
              var doc = this.ownerDocument || this,
                attaches = data_priv.access(doc, fix);

              if (!attaches) {
                doc.addEventListener(orig, handler, true);
              }
              data_priv.access(doc, fix, ( attaches || 0 ) + 1);
            },
            teardown: function () {
              var doc = this.ownerDocument || this,
                attaches = data_priv.access(doc, fix) - 1;

              if (!attaches) {
                doc.removeEventListener(orig, handler, true);
                data_priv.remove(doc, fix);

              } else {
                data_priv.access(doc, fix, attaches);
              }
            }
          };
        });
      }

      jQuery.fn.extend({

        on: function (types, selector, data, fn, /*INTERNAL*/ one) {
          var origFn, type;

          // Types can be a map of types/handlers
          if (typeof types === "object") {
            // ( types-Object, selector, data )
            if (typeof selector !== "string") {
              // ( types-Object, data )
              data = data || selector;
              selector = undefined;
            }
            for (type in types) {
              this.on(type, selector, data, types[type], one);
            }
            return this;
          }

          if (data == null && fn == null) {
            // ( types, fn )
            fn = selector;
            data = selector = undefined;
          } else if (fn == null) {
            if (typeof selector === "string") {
              // ( types, selector, fn )
              fn = data;
              data = undefined;
            } else {
              // ( types, data, fn )
              fn = data;
              data = selector;
              selector = undefined;
            }
          }
          if (fn === false) {
            fn = returnFalse;
          } else if (!fn) {
            return this;
          }

          if (one === 1) {
            origFn = fn;
            fn = function (event) {
              // Can use an empty set, since event contains the info
              jQuery().off(event);
              return origFn.apply(this, arguments);
            };
            // Use same guid so caller can remove using origFn
            fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
          }
          return this.each(function () {
            jQuery.event.add(this, types, fn, data, selector);
          });
        },
        one: function (types, selector, data, fn) {
          return this.on(types, selector, data, fn, 1);
        },
        off: function (types, selector, fn) {
          var handleObj, type;
          if (types && types.preventDefault && types.handleObj) {
            // ( event )  dispatched jQuery.Event
            handleObj = types.handleObj;
            jQuery(types.delegateTarget).off(
              handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
              handleObj.selector,
              handleObj.handler
            );
            return this;
          }
          if (typeof types === "object") {
            // ( types-object [, selector] )
            for (type in types) {
              this.off(type, selector, types[type]);
            }
            return this;
          }
          if (selector === false || typeof selector === "function") {
            // ( types [, fn] )
            fn = selector;
            selector = undefined;
          }
          if (fn === false) {
            fn = returnFalse;
          }
          return this.each(function () {
            jQuery.event.remove(this, types, fn, selector);
          });
        },

        trigger: function (type, data) {
          return this.each(function () {
            jQuery.event.trigger(type, data, this);
          });
        },
        triggerHandler: function (type, data) {
          var elem = this[0];
          if (elem) {
            return jQuery.event.trigger(type, data, elem, true);
          }
        }
      });


      var
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        rtagName = /<([\w:]+)/,
        rhtml = /<|&#?\w+;/,
        rnoInnerhtml = /<(?:script|style|link)/i,
      // checked="checked" or checked
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
        rscriptType = /^$|\/(?:java|ecma)script/i,
        rscriptTypeMasked = /^true\/(.*)/,
        rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

      // We have to close these tags to support XHTML (#13200)
        wrapMap = {

          // Support: IE9
          option: [1, "<select multiple='multiple'>", "</select>"],

          thead: [1, "<table>", "</table>"],
          col: [2, "<table><colgroup>", "</colgroup></table>"],
          tr: [2, "<table><tbody>", "</tbody></table>"],
          td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

          _default: [0, "", ""]
        };

// Support: IE9
      wrapMap.optgroup = wrapMap.option;

      wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
      wrapMap.th = wrapMap.td;

// Support: 1.x compatibility
// Manipulating tables requires a tbody
      function manipulationTarget(elem, content) {
        return jQuery.nodeName(elem, "table") &&
        jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr") ?

        elem.getElementsByTagName("tbody")[0] ||
        elem.appendChild(elem.ownerDocument.createElement("tbody")) :
          elem;
      }

// Replace/restore the type attribute of script elements for safe DOM manipulation
      function disableScript(elem) {
        elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
        return elem;
      }

      function restoreScript(elem) {
        var match = rscriptTypeMasked.exec(elem.type);

        if (match) {
          elem.type = match[1];
        } else {
          elem.removeAttribute("type");
        }

        return elem;
      }

// Mark scripts as having already been evaluated
      function setGlobalEval(elems, refElements) {
        var i = 0,
          l = elems.length;

        for (; i < l; i++) {
          data_priv.set(
            elems[i], "globalEval", !refElements || data_priv.get(refElements[i], "globalEval")
          );
        }
      }

      function cloneCopyEvent(src, dest) {
        var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

        if (dest.nodeType !== 1) {
          return;
        }

        // 1. Copy private data: events, handlers, etc.
        if (data_priv.hasData(src)) {
          pdataOld = data_priv.access(src);
          pdataCur = data_priv.set(dest, pdataOld);
          events = pdataOld.events;

          if (events) {
            delete pdataCur.handle;
            pdataCur.events = {};

            for (type in events) {
              for (i = 0, l = events[type].length; i < l; i++) {
                jQuery.event.add(dest, type, events[type][i]);
              }
            }
          }
        }

        // 2. Copy user data
        if (data_user.hasData(src)) {
          udataOld = data_user.access(src);
          udataCur = jQuery.extend({}, udataOld);

          data_user.set(dest, udataCur);
        }
      }

      function getAll(context, tag) {
        var ret = context.getElementsByTagName ? context.getElementsByTagName(tag || "*") :
          context.querySelectorAll ? context.querySelectorAll(tag || "*") :
            [];

        return tag === undefined || tag && jQuery.nodeName(context, tag) ?
          jQuery.merge([context], ret) :
          ret;
      }

// Fix IE bugs, see support tests
      function fixInput(src, dest) {
        var nodeName = dest.nodeName.toLowerCase();

        // Fails to persist the checked state of a cloned checkbox or radio button.
        if (nodeName === "input" && rcheckableType.test(src.type)) {
          dest.checked = src.checked;

          // Fails to return the selected option to the default selected state when cloning options
        } else if (nodeName === "input" || nodeName === "textarea") {
          dest.defaultValue = src.defaultValue;
        }
      }

      jQuery.extend({
        clone: function (elem, dataAndEvents, deepDataAndEvents) {
          var i, l, srcElements, destElements,
            clone = elem.cloneNode(true),
            inPage = jQuery.contains(elem.ownerDocument, elem);

          // Fix IE cloning issues
          if (!support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc(elem)) {

            // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
            destElements = getAll(clone);
            srcElements = getAll(elem);

            for (i = 0, l = srcElements.length; i < l; i++) {
              fixInput(srcElements[i], destElements[i]);
            }
          }

          // Copy the events from the original to the clone
          if (dataAndEvents) {
            if (deepDataAndEvents) {
              srcElements = srcElements || getAll(elem);
              destElements = destElements || getAll(clone);

              for (i = 0, l = srcElements.length; i < l; i++) {
                cloneCopyEvent(srcElements[i], destElements[i]);
              }
            } else {
              cloneCopyEvent(elem, clone);
            }
          }

          // Preserve script evaluation history
          destElements = getAll(clone, "script");
          if (destElements.length > 0) {
            setGlobalEval(destElements, !inPage && getAll(elem, "script"));
          }

          // Return the cloned set
          return clone;
        },

        buildFragment: function (elems, context, scripts, selection) {
          var elem, tmp, tag, wrap, contains, j,
            fragment = context.createDocumentFragment(),
            nodes = [],
            i = 0,
            l = elems.length;

          for (; i < l; i++) {
            elem = elems[i];

            if (elem || elem === 0) {

              // Add nodes directly
              if (jQuery.type(elem) === "object") {
                // Support: QtWebKit, PhantomJS
                // push.apply(_, arraylike) throws on ancient WebKit
                jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

                // Convert non-html into a text node
              } else if (!rhtml.test(elem)) {
                nodes.push(context.createTextNode(elem));

                // Convert html into DOM nodes
              } else {
                tmp = tmp || fragment.appendChild(context.createElement("div"));

                // Deserialize a standard representation
                tag = ( rtagName.exec(elem) || ["", ""] )[1].toLowerCase();
                wrap = wrapMap[tag] || wrapMap._default;
                tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];

                // Descend through wrappers to the right content
                j = wrap[0];
                while (j--) {
                  tmp = tmp.lastChild;
                }

                // Support: QtWebKit, PhantomJS
                // push.apply(_, arraylike) throws on ancient WebKit
                jQuery.merge(nodes, tmp.childNodes);

                // Remember the top-level container
                tmp = fragment.firstChild;

                // Ensure the created nodes are orphaned (#12392)
                tmp.textContent = "";
              }
            }
          }

          // Remove wrapper from fragment
          fragment.textContent = "";

          i = 0;
          while ((elem = nodes[i++])) {

            // #4087 - If origin and destination elements are the same, and this is
            // that element, do not do anything
            if (selection && jQuery.inArray(elem, selection) !== -1) {
              continue;
            }

            contains = jQuery.contains(elem.ownerDocument, elem);

            // Append to fragment
            tmp = getAll(fragment.appendChild(elem), "script");

            // Preserve script evaluation history
            if (contains) {
              setGlobalEval(tmp);
            }

            // Capture executables
            if (scripts) {
              j = 0;
              while ((elem = tmp[j++])) {
                if (rscriptType.test(elem.type || "")) {
                  scripts.push(elem);
                }
              }
            }
          }

          return fragment;
        },

        cleanData: function (elems) {
          var data, elem, type, key,
            special = jQuery.event.special,
            i = 0;

          for (; (elem = elems[i]) !== undefined; i++) {
            if (jQuery.acceptData(elem)) {
              key = elem[data_priv.expando];

              if (key && (data = data_priv.cache[key])) {
                if (data.events) {
                  for (type in data.events) {
                    if (special[type]) {
                      jQuery.event.remove(elem, type);

                      // This is a shortcut to avoid jQuery.event.remove's overhead
                    } else {
                      jQuery.removeEvent(elem, type, data.handle);
                    }
                  }
                }
                if (data_priv.cache[key]) {
                  // Discard any remaining `private` data
                  delete data_priv.cache[key];
                }
              }
            }
            // Discard any remaining `user` data
            delete data_user.cache[elem[data_user.expando]];
          }
        }
      });

      jQuery.fn.extend({
        text: function (value) {
          return access(this, function (value) {
            return value === undefined ?
              jQuery.text(this) :
              this.empty().each(function () {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                  this.textContent = value;
                }
              });
          }, null, value, arguments.length);
        },

        append: function () {
          return this.domManip(arguments, function (elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.appendChild(elem);
            }
          });
        },

        prepend: function () {
          return this.domManip(arguments, function (elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.insertBefore(elem, target.firstChild);
            }
          });
        },

        before: function () {
          return this.domManip(arguments, function (elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this);
            }
          });
        },

        after: function () {
          return this.domManip(arguments, function (elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this.nextSibling);
            }
          });
        },

        remove: function (selector, keepData /* Internal Use Only */) {
          var elem,
            elems = selector ? jQuery.filter(selector, this) : this,
            i = 0;

          for (; (elem = elems[i]) != null; i++) {
            if (!keepData && elem.nodeType === 1) {
              jQuery.cleanData(getAll(elem));
            }

            if (elem.parentNode) {
              if (keepData && jQuery.contains(elem.ownerDocument, elem)) {
                setGlobalEval(getAll(elem, "script"));
              }
              elem.parentNode.removeChild(elem);
            }
          }

          return this;
        },

        empty: function () {
          var elem,
            i = 0;

          for (; (elem = this[i]) != null; i++) {
            if (elem.nodeType === 1) {

              // Prevent memory leaks
              jQuery.cleanData(getAll(elem, false));

              // Remove any remaining nodes
              elem.textContent = "";
            }
          }

          return this;
        },

        clone: function (dataAndEvents, deepDataAndEvents) {
          dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
          deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

          return this.map(function () {
            return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
          });
        },

        html: function (value) {
          return access(this, function (value) {
            var elem = this[0] || {},
              i = 0,
              l = this.length;

            if (value === undefined && elem.nodeType === 1) {
              return elem.innerHTML;
            }

            // See if we can take a shortcut and just use innerHTML
            if (typeof value === "string" && !rnoInnerhtml.test(value) && !wrapMap[( rtagName.exec(value) || ["", ""] )[1].toLowerCase()]) {

              value = value.replace(rxhtmlTag, "<$1></$2>");

              try {
                for (; i < l; i++) {
                  elem = this[i] || {};

                  // Remove element nodes and prevent memory leaks
                  if (elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem, false));
                    elem.innerHTML = value;
                  }
                }

                elem = 0;

                // If using innerHTML throws an exception, use the fallback method
              } catch (e) {
              }
            }

            if (elem) {
              this.empty().append(value);
            }
          }, null, value, arguments.length);
        },

        replaceWith: function () {
          var arg = arguments[0];

          // Make the changes, replacing each context element with the new content
          this.domManip(arguments, function (elem) {
            arg = this.parentNode;

            jQuery.cleanData(getAll(this));

            if (arg) {
              arg.replaceChild(elem, this);
            }
          });

          // Force removal if there was no new content (e.g., from empty arguments)
          return arg && (arg.length || arg.nodeType) ? this : this.remove();
        },

        detach: function (selector) {
          return this.remove(selector, true);
        },

        domManip: function (args, callback) {

          // Flatten any nested arrays
          args = concat.apply([], args);

          var fragment, first, scripts, hasScripts, node, doc,
            i = 0,
            l = this.length,
            set = this,
            iNoClone = l - 1,
            value = args[0],
            isFunction = jQuery.isFunction(value);

          // We can't cloneNode fragments that contain checked, in WebKit
          if (isFunction ||
            ( l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value) )) {
            return this.each(function (index) {
              var self = set.eq(index);
              if (isFunction) {
                args[0] = value.call(this, index, self.html());
              }
              self.domManip(args, callback);
            });
          }

          if (l) {
            fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, this);
            first = fragment.firstChild;

            if (fragment.childNodes.length === 1) {
              fragment = first;
            }

            if (first) {
              scripts = jQuery.map(getAll(fragment, "script"), disableScript);
              hasScripts = scripts.length;

              // Use the original fragment for the last item instead of the first because it can end up
              // being emptied incorrectly in certain situations (#8070).
              for (; i < l; i++) {
                node = fragment;

                if (i !== iNoClone) {
                  node = jQuery.clone(node, true, true);

                  // Keep references to cloned scripts for later restoration
                  if (hasScripts) {
                    // Support: QtWebKit
                    // jQuery.merge because push.apply(_, arraylike) throws
                    jQuery.merge(scripts, getAll(node, "script"));
                  }
                }

                callback.call(this[i], node, i);
              }

              if (hasScripts) {
                doc = scripts[scripts.length - 1].ownerDocument;

                // Reenable scripts
                jQuery.map(scripts, restoreScript);

                // Evaluate executable scripts on first document insertion
                for (i = 0; i < hasScripts; i++) {
                  node = scripts[i];
                  if (rscriptType.test(node.type || "") && !data_priv.access(node, "globalEval") && jQuery.contains(doc, node)) {

                    if (node.src) {
                      // Optional AJAX dependency, but won't run scripts if not present
                      if (jQuery._evalUrl) {
                        jQuery._evalUrl(node.src);
                      }
                    } else {
                      jQuery.globalEval(node.textContent.replace(rcleanScript, ""));
                    }
                  }
                }
              }
            }
          }

          return this;
        }
      });

      jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
      }, function (name, original) {
        jQuery.fn[name] = function (selector) {
          var elems,
            ret = [],
            insert = jQuery(selector),
            last = insert.length - 1,
            i = 0;

          for (; i <= last; i++) {
            elems = i === last ? this : this.clone(true);
            jQuery(insert[i])[original](elems);

            // Support: QtWebKit
            // .get() because push.apply(_, arraylike) throws
            push.apply(ret, elems.get());
          }

          return this.pushStack(ret);
        };
      });


      var iframe,
        elemdisplay = {};

      /**
       * Retrieve the actual display of a element
       * @param {String} name nodeName of the element
       * @param {Object} doc Document object
       */
// Called only from within defaultDisplay
      function actualDisplay(name, doc) {
        var style,
          elem = jQuery(doc.createElement(name)).appendTo(doc.body),

        // getDefaultComputedStyle might be reliably used only on attached element
          display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle(elem[0]) ) ?

            // Use of this method is a temporary fix (more like optimization) until something better comes along,
            // since it was removed from specification and supported only in FF
            style.display : jQuery.css(elem[0], "display");

        // We don't have any data stored on the element,
        // so use "detach" method as fast way to get rid of the element
        elem.detach();

        return display;
      }

      /**
       * Try to determine the default display value of an element
       * @param {String} nodeName
       */
      function defaultDisplay(nodeName) {
        var doc = document,
          display = elemdisplay[nodeName];

        if (!display) {
          display = actualDisplay(nodeName, doc);

          // If the simple way fails, read from inside an iframe
          if (display === "none" || !display) {

            // Use the already-created iframe if possible
            iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement);

            // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
            doc = iframe[0].contentDocument;

            // Support: IE
            doc.write();
            doc.close();

            display = actualDisplay(nodeName, doc);
            iframe.detach();
          }

          // Store the correct default display
          elemdisplay[nodeName] = display;
        }

        return display;
      }

      var rmargin = (/^margin/);

      var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

      var getStyles = function (elem) {
        // Support: IE<=11+, Firefox<=30+ (#15098, #14150)
        // IE throws on elements created in popups
        // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
        if (elem.ownerDocument.defaultView.opener) {
          return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
        }

        return window.getComputedStyle(elem, null);
      };


      function curCSS(elem, name, computed) {
        var width, minWidth, maxWidth, ret,
          style = elem.style;

        computed = computed || getStyles(elem);

        // Support: IE9
        // getPropertyValue is only needed for .css('filter') (#12537)
        if (computed) {
          ret = computed.getPropertyValue(name) || computed[name];
        }

        if (computed) {

          if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
            ret = jQuery.style(elem, name);
          }

          // Support: iOS < 6
          // A tribute to the "awesome hack by Dean Edwards"
          // iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
          // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
          if (rnumnonpx.test(ret) && rmargin.test(name)) {

            // Remember the original values
            width = style.width;
            minWidth = style.minWidth;
            maxWidth = style.maxWidth;

            // Put in the new values to get a computed value out
            style.minWidth = style.maxWidth = style.width = ret;
            ret = computed.width;

            // Revert the changed values
            style.width = width;
            style.minWidth = minWidth;
            style.maxWidth = maxWidth;
          }
        }

        return ret !== undefined ?
          // Support: IE
          // IE returns zIndex value as an integer.
        ret + "" :
          ret;
      }


      function addGetHookIf(conditionFn, hookFn) {
        // Define the hook, we'll check on the first run if it's really needed.
        return {
          get: function () {
            if (conditionFn()) {
              // Hook not needed (or it's not possible to use it due
              // to missing dependency), remove it.
              delete this.get;
              return;
            }

            // Hook needed; redefine it so that the support test is not executed again.
            return (this.get = hookFn).apply(this, arguments);
          }
        };
      }


      (function () {
        var pixelPositionVal, boxSizingReliableVal,
          docElem = document.documentElement,
          container = document.createElement("div"),
          div = document.createElement("div");

        if (!div.style) {
          return;
        }

        // Support: IE9-11+
        // Style of cloned element affects source element cloned (#8908)
        div.style.backgroundClip = "content-box";
        div.cloneNode(true).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";

        container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
          "position:absolute";
        container.appendChild(div);

        // Executing both pixelPosition & boxSizingReliable tests require only one layout
        // so they're executed at the same time to save the second computation.
        function computePixelPositionAndBoxSizingReliable() {
          div.style.cssText =
            // Support: Firefox<29, Android 2.3
            // Vendor-prefix box-sizing
            "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
            "box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
            "border:1px;padding:1px;width:4px;position:absolute";
          div.innerHTML = "";
          docElem.appendChild(container);

          var divStyle = window.getComputedStyle(div, null);
          pixelPositionVal = divStyle.top !== "1%";
          boxSizingReliableVal = divStyle.width === "4px";

          docElem.removeChild(container);
        }

        // Support: node.js jsdom
        // Don't assume that getComputedStyle is a property of the global object
        if (window.getComputedStyle) {
          jQuery.extend(support, {
            pixelPosition: function () {

              // This test is executed only once but we still do memoizing
              // since we can use the boxSizingReliable pre-computing.
              // No need to check if the test was already performed, though.
              computePixelPositionAndBoxSizingReliable();
              return pixelPositionVal;
            },
            boxSizingReliable: function () {
              if (boxSizingReliableVal == null) {
                computePixelPositionAndBoxSizingReliable();
              }
              return boxSizingReliableVal;
            },
            reliableMarginRight: function () {

              // Support: Android 2.3
              // Check if div with explicit width and no margin-right incorrectly
              // gets computed margin-right based on width of container. (#3333)
              // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
              // This support function is only executed once so no memoizing is needed.
              var ret,
                marginDiv = div.appendChild(document.createElement("div"));

              // Reset CSS: box-sizing; display; margin; border; padding
              marginDiv.style.cssText = div.style.cssText =
                // Support: Firefox<29, Android 2.3
                // Vendor-prefix box-sizing
                "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
                "box-sizing:content-box;display:block;margin:0;border:0;padding:0";
              marginDiv.style.marginRight = marginDiv.style.width = "0";
              div.style.width = "1px";
              docElem.appendChild(container);

              ret = !parseFloat(window.getComputedStyle(marginDiv, null).marginRight);

              docElem.removeChild(container);
              div.removeChild(marginDiv);

              return ret;
            }
          });
        }
      })();


// A method for quickly swapping in/out CSS properties to get correct calculations.
      jQuery.swap = function (elem, options, callback, args) {
        var ret, name,
          old = {};

        // Remember the old values, and insert the new ones
        for (name in options) {
          old[name] = elem.style[name];
          elem.style[name] = options[name];
        }

        ret = callback.apply(elem, args || []);

        // Revert the old values
        for (name in options) {
          elem.style[name] = old[name];
        }

        return ret;
      };


      var
      // Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
      // See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
        rdisplayswap = /^(none|table(?!-c[ea]).+)/,
        rnumsplit = new RegExp("^(" + pnum + ")(.*)$", "i"),
        rrelNum = new RegExp("^([+-])=(" + pnum + ")", "i"),

        cssShow = {position: "absolute", visibility: "hidden", display: "block"},
        cssNormalTransform = {
          letterSpacing: "0",
          fontWeight: "400"
        },

        cssPrefixes = ["Webkit", "O", "Moz", "ms"];

// Return a css property mapped to a potentially vendor prefixed property
      function vendorPropName(style, name) {

        // Shortcut for names that are not vendor prefixed
        if (name in style) {
          return name;
        }

        // Check for vendor prefixed names
        var capName = name[0].toUpperCase() + name.slice(1),
          origName = name,
          i = cssPrefixes.length;

        while (i--) {
          name = cssPrefixes[i] + capName;
          if (name in style) {
            return name;
          }
        }

        return origName;
      }

      function setPositiveNumber(elem, value, subtract) {
        var matches = rnumsplit.exec(value);
        return matches ?
          // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max(0, matches[1] - ( subtract || 0 )) + ( matches[2] || "px" ) :
          value;
      }

      function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
        var i = extra === ( isBorderBox ? "border" : "content" ) ?
            // If we already have the right measurement, avoid augmentation
            4 :
            // Otherwise initialize for horizontal or vertical properties
            name === "width" ? 1 : 0,

          val = 0;

        for (; i < 4; i += 2) {
          // Both box models exclude margin, so add it if we want it
          if (extra === "margin") {
            val += jQuery.css(elem, extra + cssExpand[i], true, styles);
          }

          if (isBorderBox) {
            // border-box includes padding, so remove it if we want content
            if (extra === "content") {
              val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
            }

            // At this point, extra isn't border nor margin, so remove border
            if (extra !== "margin") {
              val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            }
          } else {
            // At this point, extra isn't content, so add padding
            val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

            // At this point, extra isn't content nor padding, so add border
            if (extra !== "padding") {
              val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            }
          }
        }

        return val;
      }

      function getWidthOrHeight(elem, name, extra) {

        // Start with offset property, which is equivalent to the border-box value
        var valueIsBorderBox = true,
          val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
          styles = getStyles(elem),
          isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";

        // Some non-html elements return undefined for offsetWidth, so check for null/undefined
        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
        if (val <= 0 || val == null) {
          // Fall back to computed then uncomputed css if necessary
          val = curCSS(elem, name, styles);
          if (val < 0 || val == null) {
            val = elem.style[name];
          }

          // Computed unit is not pixels. Stop here and return.
          if (rnumnonpx.test(val)) {
            return val;
          }

          // Check for style in case a browser which returns unreliable values
          // for getComputedStyle silently falls back to the reliable elem.style
          valueIsBorderBox = isBorderBox &&
            ( support.boxSizingReliable() || val === elem.style[name] );

          // Normalize "", auto, and prepare for extra
          val = parseFloat(val) || 0;
        }

        // Use the active box-sizing model to add/subtract irrelevant styles
        return ( val +
            augmentWidthOrHeight(
              elem,
              name,
              extra || ( isBorderBox ? "border" : "content" ),
              valueIsBorderBox,
              styles
            )
          ) + "px";
      }

      function showHide(elements, show) {
        var display, elem, hidden,
          values = [],
          index = 0,
          length = elements.length;

        for (; index < length; index++) {
          elem = elements[index];
          if (!elem.style) {
            continue;
          }

          values[index] = data_priv.get(elem, "olddisplay");
          display = elem.style.display;
          if (show) {
            // Reset the inline display of this element to learn if it is
            // being hidden by cascaded rules or not
            if (!values[index] && display === "none") {
              elem.style.display = "";
            }

            // Set elements which have been overridden with display: none
            // in a stylesheet to whatever the default browser style is
            // for such an element
            if (elem.style.display === "" && isHidden(elem)) {
              values[index] = data_priv.access(elem, "olddisplay", defaultDisplay(elem.nodeName));
            }
          } else {
            hidden = isHidden(elem);

            if (display !== "none" || !hidden) {
              data_priv.set(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
            }
          }
        }

        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        for (index = 0; index < length; index++) {
          elem = elements[index];
          if (!elem.style) {
            continue;
          }
          if (!show || elem.style.display === "none" || elem.style.display === "") {
            elem.style.display = show ? values[index] || "" : "none";
          }
        }

        return elements;
      }

      jQuery.extend({

        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
          opacity: {
            get: function (elem, computed) {
              if (computed) {

                // We should always get a number back from opacity
                var ret = curCSS(elem, "opacity");
                return ret === "" ? "1" : ret;
              }
            }
          }
        },

        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
          "columnCount": true,
          "fillOpacity": true,
          "flexGrow": true,
          "flexShrink": true,
          "fontWeight": true,
          "lineHeight": true,
          "opacity": true,
          "order": true,
          "orphans": true,
          "widows": true,
          "zIndex": true,
          "zoom": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
          "float": "cssFloat"
        },

        // Get and set the style property on a DOM Node
        style: function (elem, name, value, extra) {

          // Don't set styles on text and comment nodes
          if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
            return;
          }

          // Make sure that we're working with the right name
          var ret, type, hooks,
            origName = jQuery.camelCase(name),
            style = elem.style;

          name = jQuery.cssProps[origName] || ( jQuery.cssProps[origName] = vendorPropName(style, origName) );

          // Gets hook for the prefixed version, then unprefixed version
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

          // Check if we're setting a value
          if (value !== undefined) {
            type = typeof value;

            // Convert "+=" or "-=" to relative numbers (#7345)
            if (type === "string" && (ret = rrelNum.exec(value))) {
              value = ( ret[1] + 1 ) * ret[2] + parseFloat(jQuery.css(elem, name));
              // Fixes bug #9237
              type = "number";
            }

            // Make sure that null and NaN values aren't set (#7116)
            if (value == null || value !== value) {
              return;
            }

            // If a number, add 'px' to the (except for certain CSS properties)
            if (type === "number" && !jQuery.cssNumber[origName]) {
              value += "px";
            }

            // Support: IE9-11+
            // background-* props affect original clone's values
            if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
              style[name] = "inherit";
            }

            // If a hook was provided, use that value, otherwise just set the specified value
            if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
              style[name] = value;
            }

          } else {
            // If a hook was provided get the non-computed value from there
            if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
              return ret;
            }

            // Otherwise just get the value from the style object
            return style[name];
          }
        },

        css: function (elem, name, extra, styles) {
          var val, num, hooks,
            origName = jQuery.camelCase(name);

          // Make sure that we're working with the right name
          name = jQuery.cssProps[origName] || ( jQuery.cssProps[origName] = vendorPropName(elem.style, origName) );

          // Try prefixed name followed by the unprefixed name
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

          // If a hook was provided get the computed value from there
          if (hooks && "get" in hooks) {
            val = hooks.get(elem, true, extra);
          }

          // Otherwise, if a way to get the computed value exists, use that
          if (val === undefined) {
            val = curCSS(elem, name, styles);
          }

          // Convert "normal" to computed value
          if (val === "normal" && name in cssNormalTransform) {
            val = cssNormalTransform[name];
          }

          // Make numeric if forced or a qualifier was provided and val looks numeric
          if (extra === "" || extra) {
            num = parseFloat(val);
            return extra === true || jQuery.isNumeric(num) ? num || 0 : val;
          }
          return val;
        }
      });

      jQuery.each(["height", "width"], function (i, name) {
        jQuery.cssHooks[name] = {
          get: function (elem, computed, extra) {
            if (computed) {

              // Certain elements can have dimension info if we invisibly show them
              // but it must have a current display style that would benefit
              return rdisplayswap.test(jQuery.css(elem, "display")) && elem.offsetWidth === 0 ?
                jQuery.swap(elem, cssShow, function () {
                  return getWidthOrHeight(elem, name, extra);
                }) :
                getWidthOrHeight(elem, name, extra);
            }
          },

          set: function (elem, value, extra) {
            var styles = extra && getStyles(elem);
            return setPositiveNumber(elem, value, extra ?
                augmentWidthOrHeight(
                  elem,
                  name,
                  extra,
                  jQuery.css(elem, "boxSizing", false, styles) === "border-box",
                  styles
                ) : 0
            );
          }
        };
      });

// Support: Android 2.3
      jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight,
        function (elem, computed) {
          if (computed) {
            return jQuery.swap(elem, {"display": "inline-block"},
              curCSS, [elem, "marginRight"]);
          }
        }
      );

// These hooks are used by animate to expand properties
      jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
      }, function (prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
          expand: function (value) {
            var i = 0,
              expanded = {},

            // Assumes a single number if not a string
              parts = typeof value === "string" ? value.split(" ") : [value];

            for (; i < 4; i++) {
              expanded[prefix + cssExpand[i] + suffix] =
                parts[i] || parts[i - 2] || parts[0];
            }

            return expanded;
          }
        };

        if (!rmargin.test(prefix)) {
          jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
      });

      jQuery.fn.extend({
        css: function (name, value) {
          return access(this, function (elem, name, value) {
            var styles, len,
              map = {},
              i = 0;

            if (jQuery.isArray(name)) {
              styles = getStyles(elem);
              len = name.length;

              for (; i < len; i++) {
                map[name[i]] = jQuery.css(elem, name[i], false, styles);
              }

              return map;
            }

            return value !== undefined ?
              jQuery.style(elem, name, value) :
              jQuery.css(elem, name);
          }, name, value, arguments.length > 1);
        },
        show: function () {
          return showHide(this, true);
        },
        hide: function () {
          return showHide(this);
        },
        toggle: function (state) {
          if (typeof state === "boolean") {
            return state ? this.show() : this.hide();
          }

          return this.each(function () {
            if (isHidden(this)) {
              jQuery(this).show();
            } else {
              jQuery(this).hide();
            }
          });
        }
      });


      function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
      }

      jQuery.Tween = Tween;

      Tween.prototype = {
        constructor: Tween,
        init: function (elem, options, prop, end, easing, unit) {
          this.elem = elem;
          this.prop = prop;
          this.easing = easing || "swing";
          this.options = options;
          this.start = this.now = this.cur();
          this.end = end;
          this.unit = unit || ( jQuery.cssNumber[prop] ? "" : "px" );
        },
        cur: function () {
          var hooks = Tween.propHooks[this.prop];

          return hooks && hooks.get ?
            hooks.get(this) :
            Tween.propHooks._default.get(this);
        },
        run: function (percent) {
          var eased,
            hooks = Tween.propHooks[this.prop];

          if (this.options.duration) {
            this.pos = eased = jQuery.easing[this.easing](
              percent, this.options.duration * percent, 0, 1, this.options.duration
            );
          } else {
            this.pos = eased = percent;
          }
          this.now = ( this.end - this.start ) * eased + this.start;

          if (this.options.step) {
            this.options.step.call(this.elem, this.now, this);
          }

          if (hooks && hooks.set) {
            hooks.set(this);
          } else {
            Tween.propHooks._default.set(this);
          }
          return this;
        }
      };

      Tween.prototype.init.prototype = Tween.prototype;

      Tween.propHooks = {
        _default: {
          get: function (tween) {
            var result;

            if (tween.elem[tween.prop] != null &&
              (!tween.elem.style || tween.elem.style[tween.prop] == null)) {
              return tween.elem[tween.prop];
            }

            // Passing an empty string as a 3rd parameter to .css will automatically
            // attempt a parseFloat and fallback to a string if the parse fails.
            // Simple values such as "10px" are parsed to Float;
            // complex values such as "rotate(1rad)" are returned as-is.
            result = jQuery.css(tween.elem, tween.prop, "");
            // Empty strings, null, undefined and "auto" are converted to 0.
            return !result || result === "auto" ? 0 : result;
          },
          set: function (tween) {
            // Use step hook for back compat.
            // Use cssHook if its there.
            // Use .style if available and use plain properties where available.
            if (jQuery.fx.step[tween.prop]) {
              jQuery.fx.step[tween.prop](tween);
            } else if (tween.elem.style && ( tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop] )) {
              jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
            } else {
              tween.elem[tween.prop] = tween.now;
            }
          }
        }
      };

// Support: IE9
// Panic based approach to setting things on disconnected nodes
      Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function (tween) {
          if (tween.elem.nodeType && tween.elem.parentNode) {
            tween.elem[tween.prop] = tween.now;
          }
        }
      };

      jQuery.easing = {
        linear: function (p) {
          return p;
        },
        swing: function (p) {
          return 0.5 - Math.cos(p * Math.PI) / 2;
        }
      };

      jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
      jQuery.fx.step = {};


      var
        fxNow, timerId,
        rfxtypes = /^(?:toggle|show|hide)$/,
        rfxnum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i"),
        rrun = /queueHooks$/,
        animationPrefilters = [defaultPrefilter],
        tweeners = {
          "*": [function (prop, value) {
            var tween = this.createTween(prop, value),
              target = tween.cur(),
              parts = rfxnum.exec(value),
              unit = parts && parts[3] || ( jQuery.cssNumber[prop] ? "" : "px" ),

            // Starting value computation is required for potential unit mismatches
              start = ( jQuery.cssNumber[prop] || unit !== "px" && +target ) &&
                rfxnum.exec(jQuery.css(tween.elem, prop)),
              scale = 1,
              maxIterations = 20;

            if (start && start[3] !== unit) {
              // Trust units reported by jQuery.css
              unit = unit || start[3];

              // Make sure we update the tween properties later on
              parts = parts || [];

              // Iteratively approximate from a nonzero starting point
              start = +target || 1;

              do {
                // If previous iteration zeroed out, double until we get *something*.
                // Use string for doubling so we don't accidentally see scale as unchanged below
                scale = scale || ".5";

                // Adjust and apply
                start = start / scale;
                jQuery.style(tween.elem, prop, start + unit);

                // Update scale, tolerating zero or NaN from tween.cur(),
                // break the loop if scale is unchanged or perfect, or if we've just had enough
              } while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations);
            }

            // Update tween properties
            if (parts) {
              start = tween.start = +start || +target || 0;
              tween.unit = unit;
              // If a +=/-= token was provided, we're doing a relative animation
              tween.end = parts[1] ?
              start + ( parts[1] + 1 ) * parts[2] :
                +parts[2];
            }

            return tween;
          }]
        };

// Animations created synchronously will run synchronously
      function createFxNow() {
        setTimeout(function () {
          fxNow = undefined;
        });
        return ( fxNow = jQuery.now() );
      }

// Generate parameters to create a standard animation
      function genFx(type, includeWidth) {
        var which,
          i = 0,
          attrs = {height: type};

        // If we include width, step value is 1 to do all cssExpand values,
        // otherwise step value is 2 to skip over Left and Right
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4; i += 2 - includeWidth) {
          which = cssExpand[i];
          attrs["margin" + which] = attrs["padding" + which] = type;
        }

        if (includeWidth) {
          attrs.opacity = attrs.width = type;
        }

        return attrs;
      }

      function createTween(value, prop, animation) {
        var tween,
          collection = ( tweeners[prop] || [] ).concat(tweeners["*"]),
          index = 0,
          length = collection.length;
        for (; index < length; index++) {
          if ((tween = collection[index].call(animation, prop, value))) {

            // We're done with this property
            return tween;
          }
        }
      }

      function defaultPrefilter(elem, props, opts) {
        /* jshint validthis: true */
        var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
          anim = this,
          orig = {},
          style = elem.style,
          hidden = elem.nodeType && isHidden(elem),
          dataShow = data_priv.get(elem, "fxshow");

        // Handle queue: false promises
        if (!opts.queue) {
          hooks = jQuery._queueHooks(elem, "fx");
          if (hooks.unqueued == null) {
            hooks.unqueued = 0;
            oldfire = hooks.empty.fire;
            hooks.empty.fire = function () {
              if (!hooks.unqueued) {
                oldfire();
              }
            };
          }
          hooks.unqueued++;

          anim.always(function () {
            // Ensure the complete handler is called before this completes
            anim.always(function () {
              hooks.unqueued--;
              if (!jQuery.queue(elem, "fx").length) {
                hooks.empty.fire();
              }
            });
          });
        }

        // Height/width overflow pass
        if (elem.nodeType === 1 && ( "height" in props || "width" in props )) {
          // Make sure that nothing sneaks out
          // Record all 3 overflow attributes because IE9-10 do not
          // change the overflow attribute when overflowX and
          // overflowY are set to the same value
          opts.overflow = [style.overflow, style.overflowX, style.overflowY];

          // Set display property to inline-block for height/width
          // animations on inline elements that are having width/height animated
          display = jQuery.css(elem, "display");

          // Test default display if display is currently "none"
          checkDisplay = display === "none" ?
          data_priv.get(elem, "olddisplay") || defaultDisplay(elem.nodeName) : display;

          if (checkDisplay === "inline" && jQuery.css(elem, "float") === "none") {
            style.display = "inline-block";
          }
        }

        if (opts.overflow) {
          style.overflow = "hidden";
          anim.always(function () {
            style.overflow = opts.overflow[0];
            style.overflowX = opts.overflow[1];
            style.overflowY = opts.overflow[2];
          });
        }

        // show/hide pass
        for (prop in props) {
          value = props[prop];
          if (rfxtypes.exec(value)) {
            delete props[prop];
            toggle = toggle || value === "toggle";
            if (value === ( hidden ? "hide" : "show" )) {

              // If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
              if (value === "show" && dataShow && dataShow[prop] !== undefined) {
                hidden = true;
              } else {
                continue;
              }
            }
            orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);

            // Any non-fx value stops us from restoring the original display value
          } else {
            display = undefined;
          }
        }

        if (!jQuery.isEmptyObject(orig)) {
          if (dataShow) {
            if ("hidden" in dataShow) {
              hidden = dataShow.hidden;
            }
          } else {
            dataShow = data_priv.access(elem, "fxshow", {});
          }

          // Store state if its toggle - enables .stop().toggle() to "reverse"
          if (toggle) {
            dataShow.hidden = !hidden;
          }
          if (hidden) {
            jQuery(elem).show();
          } else {
            anim.done(function () {
              jQuery(elem).hide();
            });
          }
          anim.done(function () {
            var prop;

            data_priv.remove(elem, "fxshow");
            for (prop in orig) {
              jQuery.style(elem, prop, orig[prop]);
            }
          });
          for (prop in orig) {
            tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);

            if (!( prop in dataShow )) {
              dataShow[prop] = tween.start;
              if (hidden) {
                tween.end = tween.start;
                tween.start = prop === "width" || prop === "height" ? 1 : 0;
              }
            }
          }

          // If this is a noop like .hide().hide(), restore an overwritten display value
        } else if ((display === "none" ? defaultDisplay(elem.nodeName) : display) === "inline") {
          style.display = display;
        }
      }

      function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;

        // camelCase, specialEasing and expand cssHook pass
        for (index in props) {
          name = jQuery.camelCase(index);
          easing = specialEasing[name];
          value = props[index];
          if (jQuery.isArray(value)) {
            easing = value[1];
            value = props[index] = value[0];
          }

          if (index !== name) {
            props[name] = value;
            delete props[index];
          }

          hooks = jQuery.cssHooks[name];
          if (hooks && "expand" in hooks) {
            value = hooks.expand(value);
            delete props[name];

            // Not quite $.extend, this won't overwrite existing keys.
            // Reusing 'index' because we have the correct "name"
            for (index in value) {
              if (!( index in props )) {
                props[index] = value[index];
                specialEasing[index] = easing;
              }
            }
          } else {
            specialEasing[name] = easing;
          }
        }
      }

      function Animation(elem, properties, options) {
        var result,
          stopped,
          index = 0,
          length = animationPrefilters.length,
          deferred = jQuery.Deferred().always(function () {
            // Don't match elem in the :animated selector
            delete tick.elem;
          }),
          tick = function () {
            if (stopped) {
              return false;
            }
            var currentTime = fxNow || createFxNow(),
              remaining = Math.max(0, animation.startTime + animation.duration - currentTime),
            // Support: Android 2.3
            // Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
              temp = remaining / animation.duration || 0,
              percent = 1 - temp,
              index = 0,
              length = animation.tweens.length;

            for (; index < length; index++) {
              animation.tweens[index].run(percent);
            }

            deferred.notifyWith(elem, [animation, percent, remaining]);

            if (percent < 1 && length) {
              return remaining;
            } else {
              deferred.resolveWith(elem, [animation]);
              return false;
            }
          },
          animation = deferred.promise({
            elem: elem,
            props: jQuery.extend({}, properties),
            opts: jQuery.extend(true, {specialEasing: {}}, options),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function (prop, end) {
              var tween = jQuery.Tween(elem, animation.opts, prop, end,
                animation.opts.specialEasing[prop] || animation.opts.easing);
              animation.tweens.push(tween);
              return tween;
            },
            stop: function (gotoEnd) {
              var index = 0,
              // If we are going to the end, we want to run all the tweens
              // otherwise we skip this part
                length = gotoEnd ? animation.tweens.length : 0;
              if (stopped) {
                return this;
              }
              stopped = true;
              for (; index < length; index++) {
                animation.tweens[index].run(1);
              }

              // Resolve when we played the last frame; otherwise, reject
              if (gotoEnd) {
                deferred.resolveWith(elem, [animation, gotoEnd]);
              } else {
                deferred.rejectWith(elem, [animation, gotoEnd]);
              }
              return this;
            }
          }),
          props = animation.props;

        propFilter(props, animation.opts.specialEasing);

        for (; index < length; index++) {
          result = animationPrefilters[index].call(animation, elem, props, animation.opts);
          if (result) {
            return result;
          }
        }

        jQuery.map(props, createTween, animation);

        if (jQuery.isFunction(animation.opts.start)) {
          animation.opts.start.call(elem, animation);
        }

        jQuery.fx.timer(
          jQuery.extend(tick, {
            elem: elem,
            anim: animation,
            queue: animation.opts.queue
          })
        );

        // attach callbacks from options
        return animation.progress(animation.opts.progress)
          .done(animation.opts.done, animation.opts.complete)
          .fail(animation.opts.fail)
          .always(animation.opts.always);
      }

      jQuery.Animation = jQuery.extend(Animation, {

        tweener: function (props, callback) {
          if (jQuery.isFunction(props)) {
            callback = props;
            props = ["*"];
          } else {
            props = props.split(" ");
          }

          var prop,
            index = 0,
            length = props.length;

          for (; index < length; index++) {
            prop = props[index];
            tweeners[prop] = tweeners[prop] || [];
            tweeners[prop].unshift(callback);
          }
        },

        prefilter: function (callback, prepend) {
          if (prepend) {
            animationPrefilters.unshift(callback);
          } else {
            animationPrefilters.push(callback);
          }
        }
      });

      jQuery.speed = function (speed, easing, fn) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
          complete: fn || !fn && easing ||
          jQuery.isFunction(speed) && speed,
          duration: speed,
          easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
        };

        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
          opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

        // Normalize opt.queue - true/undefined/null -> "fx"
        if (opt.queue == null || opt.queue === true) {
          opt.queue = "fx";
        }

        // Queueing
        opt.old = opt.complete;

        opt.complete = function () {
          if (jQuery.isFunction(opt.old)) {
            opt.old.call(this);
          }

          if (opt.queue) {
            jQuery.dequeue(this, opt.queue);
          }
        };

        return opt;
      };

      jQuery.fn.extend({
        fadeTo: function (speed, to, easing, callback) {

          // Show any hidden elements after setting opacity to 0
          return this.filter(isHidden).css("opacity", 0).show()

            // Animate to the value specified
            .end().animate({opacity: to}, speed, easing, callback);
        },
        animate: function (prop, speed, easing, callback) {
          var empty = jQuery.isEmptyObject(prop),
            optall = jQuery.speed(speed, easing, callback),
            doAnimation = function () {
              // Operate on a copy of prop so per-property easing won't be lost
              var anim = Animation(this, jQuery.extend({}, prop), optall);

              // Empty animations, or finishing resolves immediately
              if (empty || data_priv.get(this, "finish")) {
                anim.stop(true);
              }
            };
          doAnimation.finish = doAnimation;

          return empty || optall.queue === false ?
            this.each(doAnimation) :
            this.queue(optall.queue, doAnimation);
        },
        stop: function (type, clearQueue, gotoEnd) {
          var stopQueue = function (hooks) {
            var stop = hooks.stop;
            delete hooks.stop;
            stop(gotoEnd);
          };

          if (typeof type !== "string") {
            gotoEnd = clearQueue;
            clearQueue = type;
            type = undefined;
          }
          if (clearQueue && type !== false) {
            this.queue(type || "fx", []);
          }

          return this.each(function () {
            var dequeue = true,
              index = type != null && type + "queueHooks",
              timers = jQuery.timers,
              data = data_priv.get(this);

            if (index) {
              if (data[index] && data[index].stop) {
                stopQueue(data[index]);
              }
            } else {
              for (index in data) {
                if (data[index] && data[index].stop && rrun.test(index)) {
                  stopQueue(data[index]);
                }
              }
            }

            for (index = timers.length; index--;) {
              if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                timers[index].anim.stop(gotoEnd);
                dequeue = false;
                timers.splice(index, 1);
              }
            }

            // Start the next in the queue if the last step wasn't forced.
            // Timers currently will call their complete callbacks, which
            // will dequeue but only if they were gotoEnd.
            if (dequeue || !gotoEnd) {
              jQuery.dequeue(this, type);
            }
          });
        },
        finish: function (type) {
          if (type !== false) {
            type = type || "fx";
          }
          return this.each(function () {
            var index,
              data = data_priv.get(this),
              queue = data[type + "queue"],
              hooks = data[type + "queueHooks"],
              timers = jQuery.timers,
              length = queue ? queue.length : 0;

            // Enable finishing flag on private data
            data.finish = true;

            // Empty the queue first
            jQuery.queue(this, type, []);

            if (hooks && hooks.stop) {
              hooks.stop.call(this, true);
            }

            // Look for any active animations, and finish them
            for (index = timers.length; index--;) {
              if (timers[index].elem === this && timers[index].queue === type) {
                timers[index].anim.stop(true);
                timers.splice(index, 1);
              }
            }

            // Look for any animations in the old queue and finish them
            for (index = 0; index < length; index++) {
              if (queue[index] && queue[index].finish) {
                queue[index].finish.call(this);
              }
            }

            // Turn off finishing flag
            delete data.finish;
          });
        }
      });

      jQuery.each(["toggle", "show", "hide"], function (i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function (speed, easing, callback) {
          return speed == null || typeof speed === "boolean" ?
            cssFn.apply(this, arguments) :
            this.animate(genFx(name, true), speed, easing, callback);
        };
      });

// Generate shortcuts for custom animations
      jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: {opacity: "show"},
        fadeOut: {opacity: "hide"},
        fadeToggle: {opacity: "toggle"}
      }, function (name, props) {
        jQuery.fn[name] = function (speed, easing, callback) {
          return this.animate(props, speed, easing, callback);
        };
      });

      jQuery.timers = [];
      jQuery.fx.tick = function () {
        var timer,
          i = 0,
          timers = jQuery.timers;

        fxNow = jQuery.now();

        for (; i < timers.length; i++) {
          timer = timers[i];
          // Checks the timer has not already been removed
          if (!timer() && timers[i] === timer) {
            timers.splice(i--, 1);
          }
        }

        if (!timers.length) {
          jQuery.fx.stop();
        }
        fxNow = undefined;
      };

      jQuery.fx.timer = function (timer) {
        jQuery.timers.push(timer);
        if (timer()) {
          jQuery.fx.start();
        } else {
          jQuery.timers.pop();
        }
      };

      jQuery.fx.interval = 13;

      jQuery.fx.start = function () {
        if (!timerId) {
          timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
        }
      };

      jQuery.fx.stop = function () {
        clearInterval(timerId);
        timerId = null;
      };

      jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
      };


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
      jQuery.fn.delay = function (time, type) {
        time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
        type = type || "fx";

        return this.queue(type, function (next, hooks) {
          var timeout = setTimeout(next, time);
          hooks.stop = function () {
            clearTimeout(timeout);
          };
        });
      };


      (function () {
        var input = document.createElement("input"),
          select = document.createElement("select"),
          opt = select.appendChild(document.createElement("option"));

        input.type = "checkbox";

        // Support: iOS<=5.1, Android<=4.2+
        // Default value for a checkbox should be "on"
        support.checkOn = input.value !== "";

        // Support: IE<=11+
        // Must access selectedIndex to make default options select
        support.optSelected = opt.selected;

        // Support: Android<=2.3
        // Options inside disabled selects are incorrectly marked as disabled
        select.disabled = true;
        support.optDisabled = !opt.disabled;

        // Support: IE<=11+
        // An input loses its value after becoming a radio
        input = document.createElement("input");
        input.value = "t";
        input.type = "radio";
        support.radioValue = input.value === "t";
      })();


      var nodeHook, boolHook,
        attrHandle = jQuery.expr.attrHandle;

      jQuery.fn.extend({
        attr: function (name, value) {
          return access(this, jQuery.attr, name, value, arguments.length > 1);
        },

        removeAttr: function (name) {
          return this.each(function () {
            jQuery.removeAttr(this, name);
          });
        }
      });

      jQuery.extend({
        attr: function (elem, name, value) {
          var hooks, ret,
            nType = elem.nodeType;

          // don't get/set attributes on text, comment and attribute nodes
          if (!elem || nType === 3 || nType === 8 || nType === 2) {
            return;
          }

          // Fallback to prop when attributes are not supported
          if (typeof elem.getAttribute === strundefined) {
            return jQuery.prop(elem, name, value);
          }

          // All attributes are lowercase
          // Grab necessary hook if one is defined
          if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            name = name.toLowerCase();
            hooks = jQuery.attrHooks[name] ||
              ( jQuery.expr.match.bool.test(name) ? boolHook : nodeHook );
          }

          if (value !== undefined) {

            if (value === null) {
              jQuery.removeAttr(elem, name);

            } else if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
              return ret;

            } else {
              elem.setAttribute(name, value + "");
              return value;
            }

          } else if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;

          } else {
            ret = jQuery.find.attr(elem, name);

            // Non-existent attributes return null, we normalize to undefined
            return ret == null ?
              undefined :
              ret;
          }
        },

        removeAttr: function (elem, value) {
          var name, propName,
            i = 0,
            attrNames = value && value.match(rnotwhite);

          if (attrNames && elem.nodeType === 1) {
            while ((name = attrNames[i++])) {
              propName = jQuery.propFix[name] || name;

              // Boolean attributes get special treatment (#10870)
              if (jQuery.expr.match.bool.test(name)) {
                // Set corresponding property to false
                elem[propName] = false;
              }

              elem.removeAttribute(name);
            }
          }
        },

        attrHooks: {
          type: {
            set: function (elem, value) {
              if (!support.radioValue && value === "radio" &&
                jQuery.nodeName(elem, "input")) {
                var val = elem.value;
                elem.setAttribute("type", value);
                if (val) {
                  elem.value = val;
                }
                return value;
              }
            }
          }
        }
      });

// Hooks for boolean attributes
      boolHook = {
        set: function (elem, value, name) {
          if (value === false) {
            // Remove boolean attributes when set to false
            jQuery.removeAttr(elem, name);
          } else {
            elem.setAttribute(name, name);
          }
          return name;
        }
      };
      jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;

        attrHandle[name] = function (elem, name, isXML) {
          var ret, handle;
          if (!isXML) {
            // Avoid an infinite loop by temporarily removing this function from the getter
            handle = attrHandle[name];
            attrHandle[name] = ret;
            ret = getter(elem, name, isXML) != null ?
              name.toLowerCase() :
              null;
            attrHandle[name] = handle;
          }
          return ret;
        };
      });


      var rfocusable = /^(?:input|select|textarea|button)$/i;

      jQuery.fn.extend({
        prop: function (name, value) {
          return access(this, jQuery.prop, name, value, arguments.length > 1);
        },

        removeProp: function (name) {
          return this.each(function () {
            delete this[jQuery.propFix[name] || name];
          });
        }
      });

      jQuery.extend({
        propFix: {
          "for": "htmlFor",
          "class": "className"
        },

        prop: function (elem, name, value) {
          var ret, hooks, notxml,
            nType = elem.nodeType;

          // Don't get/set properties on text, comment and attribute nodes
          if (!elem || nType === 3 || nType === 8 || nType === 2) {
            return;
          }

          notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

          if (notxml) {
            // Fix name and attach hooks
            name = jQuery.propFix[name] || name;
            hooks = jQuery.propHooks[name];
          }

          if (value !== undefined) {
            return hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ?
              ret :
              ( elem[name] = value );

          } else {
            return hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null ?
              ret :
              elem[name];
          }
        },

        propHooks: {
          tabIndex: {
            get: function (elem) {
              return elem.hasAttribute("tabindex") || rfocusable.test(elem.nodeName) || elem.href ?
                elem.tabIndex :
                -1;
            }
          }
        }
      });

      if (!support.optSelected) {
        jQuery.propHooks.selected = {
          get: function (elem) {
            var parent = elem.parentNode;
            if (parent && parent.parentNode) {
              parent.parentNode.selectedIndex;
            }
            return null;
          }
        };
      }

      jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
      ], function () {
        jQuery.propFix[this.toLowerCase()] = this;
      });


      var rclass = /[\t\r\n\f]/g;

      jQuery.fn.extend({
        addClass: function (value) {
          var classes, elem, cur, clazz, j, finalValue,
            proceed = typeof value === "string" && value,
            i = 0,
            len = this.length;

          if (jQuery.isFunction(value)) {
            return this.each(function (j) {
              jQuery(this).addClass(value.call(this, j, this.className));
            });
          }

          if (proceed) {
            // The disjunction here is for better compressibility (see removeClass)
            classes = ( value || "" ).match(rnotwhite) || [];

            for (; i < len; i++) {
              elem = this[i];
              cur = elem.nodeType === 1 && ( elem.className ?
                    ( " " + elem.className + " " ).replace(rclass, " ") :
                    " "
                );

              if (cur) {
                j = 0;
                while ((clazz = classes[j++])) {
                  if (cur.indexOf(" " + clazz + " ") < 0) {
                    cur += clazz + " ";
                  }
                }

                // only assign if different to avoid unneeded rendering.
                finalValue = jQuery.trim(cur);
                if (elem.className !== finalValue) {
                  elem.className = finalValue;
                }
              }
            }
          }

          return this;
        },

        removeClass: function (value) {
          var classes, elem, cur, clazz, j, finalValue,
            proceed = arguments.length === 0 || typeof value === "string" && value,
            i = 0,
            len = this.length;

          if (jQuery.isFunction(value)) {
            return this.each(function (j) {
              jQuery(this).removeClass(value.call(this, j, this.className));
            });
          }
          if (proceed) {
            classes = ( value || "" ).match(rnotwhite) || [];

            for (; i < len; i++) {
              elem = this[i];
              // This expression is here for better compressibility (see addClass)
              cur = elem.nodeType === 1 && ( elem.className ?
                    ( " " + elem.className + " " ).replace(rclass, " ") :
                    ""
                );

              if (cur) {
                j = 0;
                while ((clazz = classes[j++])) {
                  // Remove *all* instances
                  while (cur.indexOf(" " + clazz + " ") >= 0) {
                    cur = cur.replace(" " + clazz + " ", " ");
                  }
                }

                // Only assign if different to avoid unneeded rendering.
                finalValue = value ? jQuery.trim(cur) : "";
                if (elem.className !== finalValue) {
                  elem.className = finalValue;
                }
              }
            }
          }

          return this;
        },

        toggleClass: function (value, stateVal) {
          var type = typeof value;

          if (typeof stateVal === "boolean" && type === "string") {
            return stateVal ? this.addClass(value) : this.removeClass(value);
          }

          if (jQuery.isFunction(value)) {
            return this.each(function (i) {
              jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
            });
          }

          return this.each(function () {
            if (type === "string") {
              // Toggle individual class names
              var className,
                i = 0,
                self = jQuery(this),
                classNames = value.match(rnotwhite) || [];

              while ((className = classNames[i++])) {
                // Check each className given, space separated list
                if (self.hasClass(className)) {
                  self.removeClass(className);
                } else {
                  self.addClass(className);
                }
              }

              // Toggle whole class name
            } else if (type === strundefined || type === "boolean") {
              if (this.className) {
                // store className if set
                data_priv.set(this, "__className__", this.className);
              }

              // If the element has a class name or if we're passed `false`,
              // then remove the whole classname (if there was one, the above saved it).
              // Otherwise bring back whatever was previously saved (if anything),
              // falling back to the empty string if nothing was stored.
              this.className = this.className || value === false ? "" : data_priv.get(this, "__className__") || "";
            }
          });
        },

        hasClass: function (selector) {
          var className = " " + selector + " ",
            i = 0,
            l = this.length;
          for (; i < l; i++) {
            if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) {
              return true;
            }
          }

          return false;
        }
      });


      var rreturn = /\r/g;

      jQuery.fn.extend({
        val: function (value) {
          var hooks, ret, isFunction,
            elem = this[0];

          if (!arguments.length) {
            if (elem) {
              hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

              if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                return ret;
              }

              ret = elem.value;

              return typeof ret === "string" ?
                // Handle most common string cases
                ret.replace(rreturn, "") :
                // Handle cases where value is null/undef or number
                ret == null ? "" : ret;
            }

            return;
          }

          isFunction = jQuery.isFunction(value);

          return this.each(function (i) {
            var val;

            if (this.nodeType !== 1) {
              return;
            }

            if (isFunction) {
              val = value.call(this, i, jQuery(this).val());
            } else {
              val = value;
            }

            // Treat null/undefined as ""; convert numbers to string
            if (val == null) {
              val = "";

            } else if (typeof val === "number") {
              val += "";

            } else if (jQuery.isArray(val)) {
              val = jQuery.map(val, function (value) {
                return value == null ? "" : value + "";
              });
            }

            hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

            // If set returns undefined, fall back to normal setting
            if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
              this.value = val;
            }
          });
        }
      });

      jQuery.extend({
        valHooks: {
          option: {
            get: function (elem) {
              var val = jQuery.find.attr(elem, "value");
              return val != null ?
                val :
                // Support: IE10-11+
                // option.text throws exceptions (#14686, #14858)
                jQuery.trim(jQuery.text(elem));
            }
          },
          select: {
            get: function (elem) {
              var value, option,
                options = elem.options,
                index = elem.selectedIndex,
                one = elem.type === "select-one" || index < 0,
                values = one ? null : [],
                max = one ? index + 1 : options.length,
                i = index < 0 ?
                  max :
                  one ? index : 0;

              // Loop through all the selected options
              for (; i < max; i++) {
                option = options[i];

                // IE6-9 doesn't update selected after form reset (#2551)
                if (( option.selected || i === index ) &&
                    // Don't return options that are disabled or in a disabled optgroup
                  ( support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
                  ( !option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup") )) {

                  // Get the specific value for the option
                  value = jQuery(option).val();

                  // We don't need an array for one selects
                  if (one) {
                    return value;
                  }

                  // Multi-Selects return an array
                  values.push(value);
                }
              }

              return values;
            },

            set: function (elem, value) {
              var optionSet, option,
                options = elem.options,
                values = jQuery.makeArray(value),
                i = options.length;

              while (i--) {
                option = options[i];
                if ((option.selected = jQuery.inArray(option.value, values) >= 0)) {
                  optionSet = true;
                }
              }

              // Force browsers to behave consistently when non-matching value is set
              if (!optionSet) {
                elem.selectedIndex = -1;
              }
              return values;
            }
          }
        }
      });

// Radios and checkboxes getter/setter
      jQuery.each(["radio", "checkbox"], function () {
        jQuery.valHooks[this] = {
          set: function (elem, value) {
            if (jQuery.isArray(value)) {
              return ( elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0 );
            }
          }
        };
        if (!support.checkOn) {
          jQuery.valHooks[this].get = function (elem) {
            return elem.getAttribute("value") === null ? "on" : elem.value;
          };
        }
      });


// Return jQuery for attributes-only inclusion


      jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
      "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
      "change select submit keydown keypress keyup error contextmenu").split(" "), function (i, name) {

        // Handle event binding
        jQuery.fn[name] = function (data, fn) {
          return arguments.length > 0 ?
            this.on(name, null, data, fn) :
            this.trigger(name);
        };
      });

      jQuery.fn.extend({
        hover: function (fnOver, fnOut) {
          return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        },

        bind: function (types, data, fn) {
          return this.on(types, null, data, fn);
        },
        unbind: function (types, fn) {
          return this.off(types, null, fn);
        },

        delegate: function (selector, types, data, fn) {
          return this.on(types, selector, data, fn);
        },
        undelegate: function (selector, types, fn) {
          // ( namespace ) or ( selector, types [, fn] )
          return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        }
      });


      var nonce = jQuery.now();

      var rquery = (/\?/);


// Support: Android 2.3
// Workaround failure to string-cast null input
      jQuery.parseJSON = function (data) {
        return JSON.parse(data + "");
      };


// Cross-browser xml parsing
      jQuery.parseXML = function (data) {
        var xml, tmp;
        if (!data || typeof data !== "string") {
          return null;
        }

        // Support: IE9
        try {
          tmp = new DOMParser();
          xml = tmp.parseFromString(data, "text/xml");
        } catch (e) {
          xml = undefined;
        }

        if (!xml || xml.getElementsByTagName("parsererror").length) {
          jQuery.error("Invalid XML: " + data);
        }
        return xml;
      };


      var
        rhash = /#.*$/,
        rts = /([?&])_=[^&]*/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
      // #7653, #8125, #8152: local protocol detection
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,
        rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

      /* Prefilters
       * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
       * 2) These are called:
       *    - BEFORE asking for a transport
       *    - AFTER param serialization (s.data is a string if s.processData is true)
       * 3) key is the dataType
       * 4) the catchall symbol "*" can be used
       * 5) execution will start with transport dataType and THEN continue down to "*" if needed
       */
        prefilters = {},

      /* Transports bindings
       * 1) key is the dataType
       * 2) the catchall symbol "*" can be used
       * 3) selection will start with transport dataType and THEN go to "*" if needed
       */
        transports = {},

      // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
        allTypes = "*/".concat("*"),

      // Document location
        ajaxLocation = window.location.href,

      // Segment location into parts
        ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
      function addToPrefiltersOrTransports(structure) {

        // dataTypeExpression is optional and defaults to "*"
        return function (dataTypeExpression, func) {

          if (typeof dataTypeExpression !== "string") {
            func = dataTypeExpression;
            dataTypeExpression = "*";
          }

          var dataType,
            i = 0,
            dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];

          if (jQuery.isFunction(func)) {
            // For each dataType in the dataTypeExpression
            while ((dataType = dataTypes[i++])) {
              // Prepend if requested
              if (dataType[0] === "+") {
                dataType = dataType.slice(1) || "*";
                (structure[dataType] = structure[dataType] || []).unshift(func);

                // Otherwise append
              } else {
                (structure[dataType] = structure[dataType] || []).push(func);
              }
            }
          }
        };
      }

// Base inspection function for prefilters and transports
      function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

        var inspected = {},
          seekingTransport = ( structure === transports );

        function inspect(dataType) {
          var selected;
          inspected[dataType] = true;
          jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
            var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
            if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
              options.dataTypes.unshift(dataTypeOrTransport);
              inspect(dataTypeOrTransport);
              return false;
            } else if (seekingTransport) {
              return !( selected = dataTypeOrTransport );
            }
          });
          return selected;
        }

        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
      }

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
      function ajaxExtend(target, src) {
        var key, deep,
          flatOptions = jQuery.ajaxSettings.flatOptions || {};

        for (key in src) {
          if (src[key] !== undefined) {
            ( flatOptions[key] ? target : ( deep || (deep = {}) ) )[key] = src[key];
          }
        }
        if (deep) {
          jQuery.extend(true, target, deep);
        }

        return target;
      }

      /* Handles responses to an ajax request:
       * - finds the right dataType (mediates between content-type and expected dataType)
       * - returns the corresponding response
       */
      function ajaxHandleResponses(s, jqXHR, responses) {

        var ct, type, finalDataType, firstDataType,
          contents = s.contents,
          dataTypes = s.dataTypes;

        // Remove auto dataType and get content-type in the process
        while (dataTypes[0] === "*") {
          dataTypes.shift();
          if (ct === undefined) {
            ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
          }
        }

        // Check if we're dealing with a known content-type
        if (ct) {
          for (type in contents) {
            if (contents[type] && contents[type].test(ct)) {
              dataTypes.unshift(type);
              break;
            }
          }
        }

        // Check to see if we have a response for the expected dataType
        if (dataTypes[0] in responses) {
          finalDataType = dataTypes[0];
        } else {
          // Try convertible dataTypes
          for (type in responses) {
            if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
              finalDataType = type;
              break;
            }
            if (!firstDataType) {
              firstDataType = type;
            }
          }
          // Or just use first one
          finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if (finalDataType) {
          if (finalDataType !== dataTypes[0]) {
            dataTypes.unshift(finalDataType);
          }
          return responses[finalDataType];
        }
      }

      /* Chain conversions given the request and the original response
       * Also sets the responseXXX fields on the jqXHR instance
       */
      function ajaxConvert(s, response, jqXHR, isSuccess) {
        var conv2, current, conv, tmp, prev,
          converters = {},
        // Work with a copy of dataTypes in case we need to modify it for conversion
          dataTypes = s.dataTypes.slice();

        // Create converters map with lowercased keys
        if (dataTypes[1]) {
          for (conv in s.converters) {
            converters[conv.toLowerCase()] = s.converters[conv];
          }
        }

        current = dataTypes.shift();

        // Convert to each sequential dataType
        while (current) {

          if (s.responseFields[current]) {
            jqXHR[s.responseFields[current]] = response;
          }

          // Apply the dataFilter if provided
          if (!prev && isSuccess && s.dataFilter) {
            response = s.dataFilter(response, s.dataType);
          }

          prev = current;
          current = dataTypes.shift();

          if (current) {

            // There's only work to do if current dataType is non-auto
            if (current === "*") {

              current = prev;

              // Convert response if prev dataType is non-auto and differs from current
            } else if (prev !== "*" && prev !== current) {

              // Seek a direct converter
              conv = converters[prev + " " + current] || converters["* " + current];

              // If none found, seek a pair
              if (!conv) {
                for (conv2 in converters) {

                  // If conv2 outputs current
                  tmp = conv2.split(" ");
                  if (tmp[1] === current) {

                    // If prev can be converted to accepted input
                    conv = converters[prev + " " + tmp[0]] ||
                      converters["* " + tmp[0]];
                    if (conv) {
                      // Condense equivalence converters
                      if (conv === true) {
                        conv = converters[conv2];

                        // Otherwise, insert the intermediate dataType
                      } else if (converters[conv2] !== true) {
                        current = tmp[0];
                        dataTypes.unshift(tmp[1]);
                      }
                      break;
                    }
                  }
                }
              }

              // Apply converter (if not an equivalence)
              if (conv !== true) {

                // Unless errors are allowed to bubble, catch and return them
                if (conv && s["throws"]) {
                  response = conv(response);
                } else {
                  try {
                    response = conv(response);
                  } catch (e) {
                    return {state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current};
                  }
                }
              }
            }
          }
        }

        return {state: "success", data: response};
      }

      jQuery.extend({

        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},

        ajaxSettings: {
          url: ajaxLocation,
          type: "GET",
          isLocal: rlocalProtocol.test(ajaxLocParts[1]),
          global: true,
          processData: true,
          async: true,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          /*
           timeout: 0,
           data: null,
           dataType: null,
           username: null,
           password: null,
           cache: null,
           throws: false,
           traditional: false,
           headers: {},
           */

          accepts: {
            "*": allTypes,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
          },

          contents: {
            xml: /xml/,
            html: /html/,
            json: /json/
          },

          responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
          },

          // Data converters
          // Keys separate source (or catchall "*") and destination types with a single space
          converters: {

            // Convert anything to text
            "* text": String,

            // Text to html (true = no transformation)
            "text html": true,

            // Evaluate text as a json expression
            "text json": jQuery.parseJSON,

            // Parse text as xml
            "text xml": jQuery.parseXML
          },

          // For options that shouldn't be deep extended:
          // you can add your own custom options here if
          // and when you create one that shouldn't be
          // deep extended (see ajaxExtend)
          flatOptions: {
            url: true,
            context: true
          }
        },

        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function (target, settings) {
          return settings ?

            // Building a settings object
            ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

            // Extending ajaxSettings
            ajaxExtend(jQuery.ajaxSettings, target);
        },

        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),

        // Main method
        ajax: function (url, options) {

          // If url is an object, simulate pre-1.5 signature
          if (typeof url === "object") {
            options = url;
            url = undefined;
          }

          // Force options to be an object
          options = options || {};

          var transport,
          // URL without anti-cache param
            cacheURL,
          // Response headers
            responseHeadersString,
            responseHeaders,
          // timeout handle
            timeoutTimer,
          // Cross-domain detection vars
            parts,
          // To know if global events are to be dispatched
            fireGlobals,
          // Loop variable
            i,
          // Create the final options object
            s = jQuery.ajaxSetup({}, options),
          // Callbacks context
            callbackContext = s.context || s,
          // Context for global events is callbackContext if it is a DOM node or jQuery collection
            globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
              jQuery(callbackContext) :
              jQuery.event,
          // Deferreds
            deferred = jQuery.Deferred(),
            completeDeferred = jQuery.Callbacks("once memory"),
          // Status-dependent callbacks
            statusCode = s.statusCode || {},
          // Headers (they are sent all at once)
            requestHeaders = {},
            requestHeadersNames = {},
          // The jqXHR state
            state = 0,
          // Default abort message
            strAbort = "canceled",
          // Fake xhr
            jqXHR = {
              readyState: 0,

              // Builds headers hashtable if needed
              getResponseHeader: function (key) {
                var match;
                if (state === 2) {
                  if (!responseHeaders) {
                    responseHeaders = {};
                    while ((match = rheaders.exec(responseHeadersString))) {
                      responseHeaders[match[1].toLowerCase()] = match[2];
                    }
                  }
                  match = responseHeaders[key.toLowerCase()];
                }
                return match == null ? null : match;
              },

              // Raw string
              getAllResponseHeaders: function () {
                return state === 2 ? responseHeadersString : null;
              },

              // Caches the header
              setRequestHeader: function (name, value) {
                var lname = name.toLowerCase();
                if (!state) {
                  name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                  requestHeaders[name] = value;
                }
                return this;
              },

              // Overrides response content-type header
              overrideMimeType: function (type) {
                if (!state) {
                  s.mimeType = type;
                }
                return this;
              },

              // Status-dependent callbacks
              statusCode: function (map) {
                var code;
                if (map) {
                  if (state < 2) {
                    for (code in map) {
                      // Lazy-add the new callback in a way that preserves old ones
                      statusCode[code] = [statusCode[code], map[code]];
                    }
                  } else {
                    // Execute the appropriate callbacks
                    jqXHR.always(map[jqXHR.status]);
                  }
                }
                return this;
              },

              // Cancel the request
              abort: function (statusText) {
                var finalText = statusText || strAbort;
                if (transport) {
                  transport.abort(finalText);
                }
                done(0, finalText);
                return this;
              }
            };

          // Attach deferreds
          deferred.promise(jqXHR).complete = completeDeferred.add;
          jqXHR.success = jqXHR.done;
          jqXHR.error = jqXHR.fail;

          // Remove hash character (#7531: and string promotion)
          // Add protocol if not provided (prefilters might expect it)
          // Handle falsy url in the settings object (#10093: consistency with old signature)
          // We also use the url parameter if available
          s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace(rhash, "")
            .replace(rprotocol, ajaxLocParts[1] + "//");

          // Alias method option to type as per ticket #12004
          s.type = options.method || options.type || s.method || s.type;

          // Extract dataTypes list
          s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [""];

          // A cross-domain request is in order when we have a protocol:host:port mismatch
          if (s.crossDomain == null) {
            parts = rurl.exec(s.url.toLowerCase());
            s.crossDomain = !!( parts &&
              ( parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] ||
              ( parts[3] || ( parts[1] === "http:" ? "80" : "443" ) ) !==
              ( ajaxLocParts[3] || ( ajaxLocParts[1] === "http:" ? "80" : "443" ) ) )
            );
          }

          // Convert data if not already a string
          if (s.data && s.processData && typeof s.data !== "string") {
            s.data = jQuery.param(s.data, s.traditional);
          }

          // Apply prefilters
          inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

          // If request was aborted inside a prefilter, stop there
          if (state === 2) {
            return jqXHR;
          }

          // We can fire global events as of now if asked to
          // Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
          fireGlobals = jQuery.event && s.global;

          // Watch for a new set of requests
          if (fireGlobals && jQuery.active++ === 0) {
            jQuery.event.trigger("ajaxStart");
          }

          // Uppercase the type
          s.type = s.type.toUpperCase();

          // Determine if request has content
          s.hasContent = !rnoContent.test(s.type);

          // Save the URL in case we're toying with the If-Modified-Since
          // and/or If-None-Match header later on
          cacheURL = s.url;

          // More options handling for requests with no content
          if (!s.hasContent) {

            // If data is available, append data to url
            if (s.data) {
              cacheURL = ( s.url += ( rquery.test(cacheURL) ? "&" : "?" ) + s.data );
              // #9682: remove data so that it's not used in an eventual retry
              delete s.data;
            }

            // Add anti-cache in url if needed
            if (s.cache === false) {
              s.url = rts.test(cacheURL) ?

                // If there is already a '_' parameter, set its value
                cacheURL.replace(rts, "$1_=" + nonce++) :

                // Otherwise add one to the end
              cacheURL + ( rquery.test(cacheURL) ? "&" : "?" ) + "_=" + nonce++;
            }
          }

          // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
          if (s.ifModified) {
            if (jQuery.lastModified[cacheURL]) {
              jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
            }
            if (jQuery.etag[cacheURL]) {
              jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
            }
          }

          // Set the correct header, if data is being sent
          if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
            jqXHR.setRequestHeader("Content-Type", s.contentType);
          }

          // Set the Accepts header for the server, depending on the dataType
          jqXHR.setRequestHeader(
            "Accept",
            s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
            s.accepts[s.dataTypes[0]] + ( s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
              s.accepts["*"]
          );

          // Check for headers option
          for (i in s.headers) {
            jqXHR.setRequestHeader(i, s.headers[i]);
          }

          // Allow custom headers/mimetypes and early abort
          if (s.beforeSend && ( s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2 )) {
            // Abort if not done already and return
            return jqXHR.abort();
          }

          // Aborting is no longer a cancellation
          strAbort = "abort";

          // Install callbacks on deferreds
          for (i in {success: 1, error: 1, complete: 1}) {
            jqXHR[i](s[i]);
          }

          // Get transport
          transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

          // If no transport, we auto-abort
          if (!transport) {
            done(-1, "No Transport");
          } else {
            jqXHR.readyState = 1;

            // Send global event
            if (fireGlobals) {
              globalEventContext.trigger("ajaxSend", [jqXHR, s]);
            }
            // Timeout
            if (s.async && s.timeout > 0) {
              timeoutTimer = setTimeout(function () {
                jqXHR.abort("timeout");
              }, s.timeout);
            }

            try {
              state = 1;
              transport.send(requestHeaders, done);
            } catch (e) {
              // Propagate exception as error if not done
              if (state < 2) {
                done(-1, e);
                // Simply rethrow otherwise
              } else {
                throw e;
              }
            }
          }

          // Callback for when everything is done
          function done(status, nativeStatusText, responses, headers) {
            var isSuccess, success, error, response, modified,
              statusText = nativeStatusText;

            // Called once
            if (state === 2) {
              return;
            }

            // State is "done" now
            state = 2;

            // Clear timeout if it exists
            if (timeoutTimer) {
              clearTimeout(timeoutTimer);
            }

            // Dereference transport for early garbage collection
            // (no matter how long the jqXHR object will be used)
            transport = undefined;

            // Cache response headers
            responseHeadersString = headers || "";

            // Set readyState
            jqXHR.readyState = status > 0 ? 4 : 0;

            // Determine if successful
            isSuccess = status >= 200 && status < 300 || status === 304;

            // Get response data
            if (responses) {
              response = ajaxHandleResponses(s, jqXHR, responses);
            }

            // Convert no matter what (that way responseXXX fields are always set)
            response = ajaxConvert(s, response, jqXHR, isSuccess);

            // If successful, handle type chaining
            if (isSuccess) {

              // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
              if (s.ifModified) {
                modified = jqXHR.getResponseHeader("Last-Modified");
                if (modified) {
                  jQuery.lastModified[cacheURL] = modified;
                }
                modified = jqXHR.getResponseHeader("etag");
                if (modified) {
                  jQuery.etag[cacheURL] = modified;
                }
              }

              // if no content
              if (status === 204 || s.type === "HEAD") {
                statusText = "nocontent";

                // if not modified
              } else if (status === 304) {
                statusText = "notmodified";

                // If we have data, let's convert it
              } else {
                statusText = response.state;
                success = response.data;
                error = response.error;
                isSuccess = !error;
              }
            } else {
              // Extract error from statusText and normalize for non-aborts
              error = statusText;
              if (status || !statusText) {
                statusText = "error";
                if (status < 0) {
                  status = 0;
                }
              }
            }

            // Set data for the fake xhr object
            jqXHR.status = status;
            jqXHR.statusText = ( nativeStatusText || statusText ) + "";

            // Success/Error
            if (isSuccess) {
              deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
            } else {
              deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
            }

            // Status-dependent callbacks
            jqXHR.statusCode(statusCode);
            statusCode = undefined;

            if (fireGlobals) {
              globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError",
                [jqXHR, s, isSuccess ? success : error]);
            }

            // Complete
            completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

            if (fireGlobals) {
              globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
              // Handle the global AJAX counter
              if (!( --jQuery.active )) {
                jQuery.event.trigger("ajaxStop");
              }
            }
          }

          return jqXHR;
        },

        getJSON: function (url, data, callback) {
          return jQuery.get(url, data, callback, "json");
        },

        getScript: function (url, callback) {
          return jQuery.get(url, undefined, callback, "script");
        }
      });

      jQuery.each(["get", "post"], function (i, method) {
        jQuery[method] = function (url, data, callback, type) {
          // Shift arguments if data argument was omitted
          if (jQuery.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = undefined;
          }

          return jQuery.ajax({
            url: url,
            type: method,
            dataType: type,
            data: data,
            success: callback
          });
        };
      });


      jQuery._evalUrl = function (url) {
        return jQuery.ajax({
          url: url,
          type: "GET",
          dataType: "script",
          async: false,
          global: false,
          "throws": true
        });
      };


      jQuery.fn.extend({
        wrapAll: function (html) {
          var wrap;

          if (jQuery.isFunction(html)) {
            return this.each(function (i) {
              jQuery(this).wrapAll(html.call(this, i));
            });
          }

          if (this[0]) {

            // The elements to wrap the target around
            wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

            if (this[0].parentNode) {
              wrap.insertBefore(this[0]);
            }

            wrap.map(function () {
              var elem = this;

              while (elem.firstElementChild) {
                elem = elem.firstElementChild;
              }

              return elem;
            }).append(this);
          }

          return this;
        },

        wrapInner: function (html) {
          if (jQuery.isFunction(html)) {
            return this.each(function (i) {
              jQuery(this).wrapInner(html.call(this, i));
            });
          }

          return this.each(function () {
            var self = jQuery(this),
              contents = self.contents();

            if (contents.length) {
              contents.wrapAll(html);

            } else {
              self.append(html);
            }
          });
        },

        wrap: function (html) {
          var isFunction = jQuery.isFunction(html);

          return this.each(function (i) {
            jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
          });
        },

        unwrap: function () {
          return this.parent().each(function () {
            if (!jQuery.nodeName(this, "body")) {
              jQuery(this).replaceWith(this.childNodes);
            }
          }).end();
        }
      });


      jQuery.expr.filters.hidden = function (elem) {
        // Support: Opera <= 12.12
        // Opera reports offsetWidths and offsetHeights less than zero on some elements
        return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
      };
      jQuery.expr.filters.visible = function (elem) {
        return !jQuery.expr.filters.hidden(elem);
      };


      var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i;

      function buildParams(prefix, obj, traditional, add) {
        var name;

        if (jQuery.isArray(obj)) {
          // Serialize array item.
          jQuery.each(obj, function (i, v) {
            if (traditional || rbracket.test(prefix)) {
              // Treat each array item as a scalar.
              add(prefix, v);

            } else {
              // Item is non-scalar (array or object), encode its numeric index.
              buildParams(prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add);
            }
          });

        } else if (!traditional && jQuery.type(obj) === "object") {
          // Serialize object item.
          for (name in obj) {
            buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
          }

        } else {
          // Serialize scalar item.
          add(prefix, obj);
        }
      }

// Serialize an array of form elements or a set of
// key/values into a query string
      jQuery.param = function (a, traditional) {
        var prefix,
          s = [],
          add = function (key, value) {
            // If value is a function, invoke it and return its value
            value = jQuery.isFunction(value) ? value() : ( value == null ? "" : value );
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
          };

        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if (traditional === undefined) {
          traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if (jQuery.isArray(a) || ( a.jquery && !jQuery.isPlainObject(a) )) {
          // Serialize the form elements
          jQuery.each(a, function () {
            add(this.name, this.value);
          });

        } else {
          // If traditional, encode the "old" way (the way 1.3.2 or older
          // did it), otherwise encode params recursively.
          for (prefix in a) {
            buildParams(prefix, a[prefix], traditional, add);
          }
        }

        // Return the resulting serialization
        return s.join("&").replace(r20, "+");
      };

      jQuery.fn.extend({
        serialize: function () {
          return jQuery.param(this.serializeArray());
        },
        serializeArray: function () {
          return this.map(function () {
            // Can add propHook for "elements" to filter or add form elements
            var elements = jQuery.prop(this, "elements");
            return elements ? jQuery.makeArray(elements) : this;
          })
            .filter(function () {
              var type = this.type;

              // Use .is( ":disabled" ) so that fieldset[disabled] works
              return this.name && !jQuery(this).is(":disabled") &&
                rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) &&
                ( this.checked || !rcheckableType.test(type) );
            })
            .map(function (i, elem) {
              var val = jQuery(this).val();

              return val == null ?
                null :
                jQuery.isArray(val) ?
                  jQuery.map(val, function (val) {
                    return {name: elem.name, value: val.replace(rCRLF, "\r\n")};
                  }) :
                {name: elem.name, value: val.replace(rCRLF, "\r\n")};
            }).get();
        }
      });


      jQuery.ajaxSettings.xhr = function () {
        try {
          return new XMLHttpRequest();
        } catch (e) {
        }
      };

      var xhrId = 0,
        xhrCallbacks = {},
        xhrSuccessStatus = {
          // file protocol always yields status code 0, assume 200
          0: 200,
          // Support: IE9
          // #1450: sometimes IE returns 1223 when it should be 204
          1223: 204
        },
        xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE9
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
      if (window.attachEvent) {
        window.attachEvent("onunload", function () {
          for (var key in xhrCallbacks) {
            xhrCallbacks[key]();
          }
        });
      }

      support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
      support.ajax = xhrSupported = !!xhrSupported;

      jQuery.ajaxTransport(function (options) {
        var callback;

        // Cross domain only allowed if supported through XMLHttpRequest
        if (support.cors || xhrSupported && !options.crossDomain) {
          return {
            send: function (headers, complete) {
              var i,
                xhr = options.xhr(),
                id = ++xhrId;

              xhr.open(options.type, options.url, options.async, options.username, options.password);

              // Apply custom fields if provided
              if (options.xhrFields) {
                for (i in options.xhrFields) {
                  xhr[i] = options.xhrFields[i];
                }
              }

              // Override mime type if needed
              if (options.mimeType && xhr.overrideMimeType) {
                xhr.overrideMimeType(options.mimeType);
              }

              // X-Requested-With header
              // For cross-domain requests, seeing as conditions for a preflight are
              // akin to a jigsaw puzzle, we simply never set it to be sure.
              // (it can always be set on a per-request basis or even using ajaxSetup)
              // For same-domain requests, won't change header if already provided.
              if (!options.crossDomain && !headers["X-Requested-With"]) {
                headers["X-Requested-With"] = "XMLHttpRequest";
              }

              // Set headers
              for (i in headers) {
                xhr.setRequestHeader(i, headers[i]);
              }

              // Callback
              callback = function (type) {
                return function () {
                  if (callback) {
                    delete xhrCallbacks[id];
                    callback = xhr.onload = xhr.onerror = null;

                    if (type === "abort") {
                      xhr.abort();
                    } else if (type === "error") {
                      complete(
                        // file: protocol always yields status 0; see #8605, #14207
                        xhr.status,
                        xhr.statusText
                      );
                    } else {
                      complete(
                        xhrSuccessStatus[xhr.status] || xhr.status,
                        xhr.statusText,
                        // Support: IE9
                        // Accessing binary-data responseText throws an exception
                        // (#11426)
                        typeof xhr.responseText === "string" ? {
                          text: xhr.responseText
                        } : undefined,
                        xhr.getAllResponseHeaders()
                      );
                    }
                  }
                };
              };

              // Listen to events
              xhr.onload = callback();
              xhr.onerror = callback("error");

              // Create the abort callback
              callback = xhrCallbacks[id] = callback("abort");

              try {
                // Do send the request (this may raise an exception)
                xhr.send(options.hasContent && options.data || null);
              } catch (e) {
                // #14683: Only rethrow if this hasn't been notified as an error yet
                if (callback) {
                  throw e;
                }
              }
            },

            abort: function () {
              if (callback) {
                callback();
              }
            }
          };
        }
      });


// Install script dataType
      jQuery.ajaxSetup({
        accepts: {
          script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
          script: /(?:java|ecma)script/
        },
        converters: {
          "text script": function (text) {
            jQuery.globalEval(text);
            return text;
          }
        }
      });

// Handle cache's special case and crossDomain
      jQuery.ajaxPrefilter("script", function (s) {
        if (s.cache === undefined) {
          s.cache = false;
        }
        if (s.crossDomain) {
          s.type = "GET";
        }
      });

// Bind script tag hack transport
      jQuery.ajaxTransport("script", function (s) {
        // This transport only deals with cross domain requests
        if (s.crossDomain) {
          var script, callback;
          return {
            send: function (_, complete) {
              script = jQuery("<script>").prop({
                async: true,
                charset: s.scriptCharset,
                src: s.url
              }).on(
                "load error",
                callback = function (evt) {
                  script.remove();
                  callback = null;
                  if (evt) {
                    complete(evt.type === "error" ? 404 : 200, evt.type);
                  }
                }
              );
              document.head.appendChild(script[0]);
            },
            abort: function () {
              if (callback) {
                callback();
              }
            }
          };
        }
      });


      var oldCallbacks = [],
        rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
      jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
          var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
          this[callback] = true;
          return callback;
        }
      });

// Detect, normalize options and install callbacks for jsonp requests
      jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

        var callbackName, overwritten, responseContainer,
          jsonProp = s.jsonp !== false && ( rjsonp.test(s.url) ?
                "url" :
              typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data"
            );

        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if (jsonProp || s.dataTypes[0] === "jsonp") {

          // Get callback name, remembering preexisting value associated with it
          callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ?
            s.jsonpCallback() :
            s.jsonpCallback;

          // Insert callback into url or form data
          if (jsonProp) {
            s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
          } else if (s.jsonp !== false) {
            s.url += ( rquery.test(s.url) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
          }

          // Use data converter to retrieve json after script execution
          s.converters["script json"] = function () {
            if (!responseContainer) {
              jQuery.error(callbackName + " was not called");
            }
            return responseContainer[0];
          };

          // force json dataType
          s.dataTypes[0] = "json";

          // Install callback
          overwritten = window[callbackName];
          window[callbackName] = function () {
            responseContainer = arguments;
          };

          // Clean-up function (fires after converters)
          jqXHR.always(function () {
            // Restore preexisting value
            window[callbackName] = overwritten;

            // Save back as free
            if (s[callbackName]) {
              // make sure that re-using the options doesn't screw things around
              s.jsonpCallback = originalSettings.jsonpCallback;

              // save the callback name for future use
              oldCallbacks.push(callbackName);
            }

            // Call if it was a function and we have a response
            if (responseContainer && jQuery.isFunction(overwritten)) {
              overwritten(responseContainer[0]);
            }

            responseContainer = overwritten = undefined;
          });

          // Delegate to script
          return "script";
        }
      });


// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
      jQuery.parseHTML = function (data, context, keepScripts) {
        if (!data || typeof data !== "string") {
          return null;
        }
        if (typeof context === "boolean") {
          keepScripts = context;
          context = false;
        }
        context = context || document;

        var parsed = rsingleTag.exec(data),
          scripts = !keepScripts && [];

        // Single tag
        if (parsed) {
          return [context.createElement(parsed[1])];
        }

        parsed = jQuery.buildFragment([data], context, scripts);

        if (scripts && scripts.length) {
          jQuery(scripts).remove();
        }

        return jQuery.merge([], parsed.childNodes);
      };


// Keep a copy of the old load method
      var _load = jQuery.fn.load;

      /**
       * Load a url into a page
       */
      jQuery.fn.load = function (url, params, callback) {
        if (typeof url !== "string" && _load) {
          return _load.apply(this, arguments);
        }

        var selector, type, response,
          self = this,
          off = url.indexOf(" ");

        if (off >= 0) {
          selector = jQuery.trim(url.slice(off));
          url = url.slice(0, off);
        }

        // If it's a function
        if (jQuery.isFunction(params)) {

          // We assume that it's the callback
          callback = params;
          params = undefined;

          // Otherwise, build a param string
        } else if (params && typeof params === "object") {
          type = "POST";
        }

        // If we have elements to modify, make the request
        if (self.length > 0) {
          jQuery.ajax({
            url: url,

            // if "type" variable is undefined, then "GET" method will be used
            type: type,
            dataType: "html",
            data: params
          }).done(function (responseText) {

            // Save response for use in complete callback
            response = arguments;

            self.html(selector ?

              // If a selector was specified, locate the right elements in a dummy div
              // Exclude scripts to avoid IE 'Permission Denied' errors
              jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :

              // Otherwise use the full result
              responseText);

          }).complete(callback && function (jqXHR, status) {
              self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
            });
        }

        return this;
      };


// Attach a bunch of functions for handling common AJAX events
      jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (i, type) {
        jQuery.fn[type] = function (fn) {
          return this.on(type, fn);
        };
      });


      jQuery.expr.filters.animated = function (elem) {
        return jQuery.grep(jQuery.timers, function (fn) {
          return elem === fn.elem;
        }).length;
      };


      var docElem = window.document.documentElement;

      /**
       * Gets a window from an element
       */
      function getWindow(elem) {
        return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
      }

      jQuery.offset = {
        setOffset: function (elem, options, i) {
          var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
            position = jQuery.css(elem, "position"),
            curElem = jQuery(elem),
            props = {};

          // Set position first, in-case top/left are set even on static elem
          if (position === "static") {
            elem.style.position = "relative";
          }

          curOffset = curElem.offset();
          curCSSTop = jQuery.css(elem, "top");
          curCSSLeft = jQuery.css(elem, "left");
          calculatePosition = ( position === "absolute" || position === "fixed" ) &&
            ( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

          // Need to be able to calculate position if either
          // top or left is auto and position is either absolute or fixed
          if (calculatePosition) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;

          } else {
            curTop = parseFloat(curCSSTop) || 0;
            curLeft = parseFloat(curCSSLeft) || 0;
          }

          if (jQuery.isFunction(options)) {
            options = options.call(elem, i, curOffset);
          }

          if (options.top != null) {
            props.top = ( options.top - curOffset.top ) + curTop;
          }
          if (options.left != null) {
            props.left = ( options.left - curOffset.left ) + curLeft;
          }

          if ("using" in options) {
            options.using.call(elem, props);

          } else {
            curElem.css(props);
          }
        }
      };

      jQuery.fn.extend({
        offset: function (options) {
          if (arguments.length) {
            return options === undefined ?
              this :
              this.each(function (i) {
                jQuery.offset.setOffset(this, options, i);
              });
          }

          var docElem, win,
            elem = this[0],
            box = {top: 0, left: 0},
            doc = elem && elem.ownerDocument;

          if (!doc) {
            return;
          }

          docElem = doc.documentElement;

          // Make sure it's not a disconnected DOM node
          if (!jQuery.contains(docElem, elem)) {
            return box;
          }

          // Support: BlackBerry 5, iOS 3 (original iPhone)
          // If we don't have gBCR, just use 0,0 rather than error
          if (typeof elem.getBoundingClientRect !== strundefined) {
            box = elem.getBoundingClientRect();
          }
          win = getWindow(doc);
          return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
          };
        },

        position: function () {
          if (!this[0]) {
            return;
          }

          var offsetParent, offset,
            elem = this[0],
            parentOffset = {top: 0, left: 0};

          // Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
          if (jQuery.css(elem, "position") === "fixed") {
            // Assume getBoundingClientRect is there when computed position is fixed
            offset = elem.getBoundingClientRect();

          } else {
            // Get *real* offsetParent
            offsetParent = this.offsetParent();

            // Get correct offsets
            offset = this.offset();
            if (!jQuery.nodeName(offsetParent[0], "html")) {
              parentOffset = offsetParent.offset();
            }

            // Add offsetParent borders
            parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true);
            parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true);
          }

          // Subtract parent offsets and element margins
          return {
            top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
            left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
          };
        },

        offsetParent: function () {
          return this.map(function () {
            var offsetParent = this.offsetParent || docElem;

            while (offsetParent && ( !jQuery.nodeName(offsetParent, "html") && jQuery.css(offsetParent, "position") === "static" )) {
              offsetParent = offsetParent.offsetParent;
            }

            return offsetParent || docElem;
          });
        }
      });

// Create scrollLeft and scrollTop methods
      jQuery.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (method, prop) {
        var top = "pageYOffset" === prop;

        jQuery.fn[method] = function (val) {
          return access(this, function (elem, method, val) {
            var win = getWindow(elem);

            if (val === undefined) {
              return win ? win[prop] : elem[method];
            }

            if (win) {
              win.scrollTo(
                !top ? val : window.pageXOffset,
                top ? val : window.pageYOffset
              );

            } else {
              elem[method] = val;
            }
          }, method, val, arguments.length, null);
        };
      });

// Support: Safari<7+, Chrome<37+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
      jQuery.each(["top", "left"], function (i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition,
          function (elem, computed) {
            if (computed) {
              computed = curCSS(elem, prop);
              // If curCSS returns percentage, fallback to offset
              return rnumnonpx.test(computed) ?
              jQuery(elem).position()[prop] + "px" :
                computed;
            }
          }
        );
      });


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
      jQuery.each({Height: "height", Width: "width"}, function (name, type) {
        jQuery.each({padding: "inner" + name, content: type, "": "outer" + name}, function (defaultExtra, funcName) {
          // Margin is only for outerHeight, outerWidth
          jQuery.fn[funcName] = function (margin, value) {
            var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
              extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

            return access(this, function (elem, type, value) {
              var doc;

              if (jQuery.isWindow(elem)) {
                // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                // isn't a whole lot we can do. See pull request at this URL for discussion:
                // https://github.com/jquery/jquery/pull/764
                return elem.document.documentElement["client" + name];
              }

              // Get document width or height
              if (elem.nodeType === 9) {
                doc = elem.documentElement;

                // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
                // whichever is greatest
                return Math.max(
                  elem.body["scroll" + name], doc["scroll" + name],
                  elem.body["offset" + name], doc["offset" + name],
                  doc["client" + name]
                );
              }

              return value === undefined ?
                // Get width or height on the element, requesting but not forcing parseFloat
                jQuery.css(elem, type, extra) :

                // Set width or height on the element
                jQuery.style(elem, type, value, extra);
            }, type, chainable ? margin : undefined, chainable, null);
          };
        });
      });


// The number of elements contained in the matched element set
      jQuery.fn.size = function () {
        return this.length;
      };

      jQuery.fn.andSelf = jQuery.fn.addBack;


// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

      if (typeof define === "function" && define.amd) {
        define("jquery", [], function () {
          return jQuery;
        });
      }


      var
      // Map over jQuery in case of overwrite
        _jQuery = window.jQuery,

      // Map over the $ in case of overwrite
        _$ = window.$;

      jQuery.noConflict = function (deep) {
        if (window.$ === jQuery) {
          window.$ = _$;
        }

        if (deep && window.jQuery === jQuery) {
          window.jQuery = _jQuery;
        }

        return jQuery;
      };

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
      if (typeof noGlobal === strundefined) {
        window.jQuery = window.$ = jQuery;
      }


      return jQuery;

    }));

  }, {}],
  124: [function (require, module, exports) {
    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array ? array.length : 0;
      return length ? array[length - 1] : undefined;
    }

    module.exports = last;

  }, {}],
  125: [function (require, module, exports) {
    var baseCallback = require('../internal/baseCallback'),
      baseUniq = require('../internal/baseUniq'),
      isIterateeCall = require('../internal/isIterateeCall'),
      sortedUniq = require('../internal/sortedUniq');

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurence of each element
     * is kept. Providing `true` for `isSorted` performs a faster search algorithm
     * for sorted arrays. If an iteratee function is provided it is invoked for
     * each element in the array to generate the criterion by which uniqueness
     * is computed. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, array).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {boolean} [isSorted] Specify the array is sorted.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new duplicate-value-free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     *
     * // using `isSorted`
     * _.uniq([1, 1, 2], true);
     * // => [1, 2]
     *
     * // using an iteratee function
     * _.uniq([1, 2.5, 1.5, 2], function(n) {
 *   return this.floor(n);
 * }, Math);
     * // => [1, 2.5]
     *
     * // using the `_.property` callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (isSorted != null && typeof isSorted != 'boolean') {
        thisArg = iteratee;
        iteratee = isIterateeCall(array, isSorted, thisArg) ? undefined : isSorted;
        isSorted = false;
      }
      iteratee = iteratee == null ? iteratee : baseCallback(iteratee, thisArg, 3);
      return (isSorted)
        ? sortedUniq(array, iteratee)
        : baseUniq(array, iteratee);
    }

    module.exports = uniq;

  }, {"../internal/baseCallback": 148, "../internal/baseUniq": 179, "../internal/isIterateeCall": 200, "../internal/sortedUniq": 208}],
  126: [function (require, module, exports) {
    module.exports = require('./uniq');

  }, {"./uniq": 125}],
  127: [function (require, module, exports) {
    var arrayEvery = require('../internal/arrayEvery'),
      baseCallback = require('../internal/baseCallback'),
      baseEvery = require('../internal/baseEvery'),
      isArray = require('../lang/isArray'),
      isIterateeCall = require('../internal/isIterateeCall');

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * The predicate is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'active': false },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.every(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
        predicate = undefined;
      }
      if (typeof predicate != 'function' || thisArg !== undefined) {
        predicate = baseCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    module.exports = every;

  }, {
    "../internal/arrayEvery": 140,
    "../internal/baseCallback": 148,
    "../internal/baseEvery": 155,
    "../internal/isIterateeCall": 200,
    "../lang/isArray": 212
  }],
  128: [function (require, module, exports) {
    var arrayFilter = require('../internal/arrayFilter'),
      baseCallback = require('../internal/baseCallback'),
      baseFilter = require('../internal/baseFilter'),
      isArray = require('../lang/isArray');

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.filter([4, 5, 6], function(n) {
 *   return n % 2 == 0;
 * });
     * // => [4, 6]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.filter(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.filter(users, 'active'), 'user');
     * // => ['barney']
     */
    function filter(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = baseCallback(predicate, thisArg, 3);
      return func(collection, predicate);
    }

    module.exports = filter;

  }, {"../internal/arrayFilter": 141, "../internal/baseCallback": 148, "../internal/baseFilter": 156, "../lang/isArray": 212}],
  129: [function (require, module, exports) {
    var baseEach = require('../internal/baseEach'),
      createFind = require('../internal/createFind');

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.result(_.find(users, function(chr) {
 *   return chr.age < 40;
 * }), 'user');
     * // => 'barney'
     *
     * // using the `_.matches` callback shorthand
     * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.result(_.find(users, 'active', false), 'user');
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.result(_.find(users, 'active'), 'user');
     * // => 'barney'
     */
    var find = createFind(baseEach);

    module.exports = find;

  }, {"../internal/baseEach": 153, "../internal/createFind": 188}],
  130: [function (require, module, exports) {
    var arrayEach = require('../internal/arrayEach'),
      baseEach = require('../internal/baseEach'),
      createForEach = require('../internal/createForEach');

    /**
     * Iterates over elements of `collection` invoking `iteratee` for each element.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection). Iteratee functions may exit iteration early
     * by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length" property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEach(function(n) {
 *   console.log(n);
 * }).value();
     * // => logs each value from left to right and returns the array
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
 *   console.log(n, key);
 * });
     * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
     */
    var forEach = createForEach(arrayEach, baseEach);

    module.exports = forEach;

  }, {"../internal/arrayEach": 138, "../internal/baseEach": 153, "../internal/createForEach": 189}],
  131: [function (require, module, exports) {
    var arrayEachRight = require('../internal/arrayEachRight'),
      baseEachRight = require('../internal/baseEachRight'),
      createForEach = require('../internal/createForEach');

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEachRight(function(n) {
 *   console.log(n);
 * }).value();
     * // => logs each value from right to left and returns the array
     */
    var forEachRight = createForEach(arrayEachRight, baseEachRight);

    module.exports = forEachRight;

  }, {"../internal/arrayEachRight": 139, "../internal/baseEachRight": 154, "../internal/createForEach": 189}],
  132: [function (require, module, exports) {
    var arrayMap = require('../internal/arrayMap'),
      baseCallback = require('../internal/baseCallback'),
      baseMap = require('../internal/baseMap'),
      isArray = require('../lang/isArray');

    /**
     * Creates an array of values by running each element in `collection` through
     * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
     * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
     * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
     * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
     * `sum`, `uniq`, and `words`
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function timesThree(n) {
 *   return n * 3;
 * }
     *
     * _.map([1, 2], timesThree);
     * // => [3, 6]
     *
     * _.map({ 'a': 1, 'b': 2 }, timesThree);
     * // => [3, 6] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee, thisArg) {
      var func = isArray(collection) ? arrayMap : baseMap;
      iteratee = baseCallback(iteratee, thisArg, 3);
      return func(collection, iteratee);
    }

    module.exports = map;

  }, {"../internal/arrayMap": 142, "../internal/baseCallback": 148, "../internal/baseMap": 170, "../lang/isArray": 212}],
  133: [function (require, module, exports) {
    var arrayReduce = require('../internal/arrayReduce'),
      baseEach = require('../internal/baseEach'),
      createReduce = require('../internal/createReduce');

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` through `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not provided the first element of `collection` is used as the initial
     * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `sortByAll`,
     * and `sortByOrder`
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.reduce([1, 2], function(total, n) {
 *   return total + n;
 * });
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
 *   result[key] = n * 3;
 *   return result;
 * }, {});
     * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
     */
    var reduce = createReduce(arrayReduce, baseEach);

    module.exports = reduce;

  }, {"../internal/arrayReduce": 144, "../internal/baseEach": 153, "../internal/createReduce": 190}],
  134: [function (require, module, exports) {
    var baseCallback = require('../internal/baseCallback'),
      baseMap = require('../internal/baseMap'),
      baseSortBy = require('../internal/baseSortBy'),
      compareAscending = require('../internal/compareAscending'),
      isIterateeCall = require('../internal/isIterateeCall');

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through `iteratee`. This method performs
     * a stable sort, that is, it preserves the original sort order of equal elements.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * _.sortBy([1, 2, 3], function(n) {
 *   return Math.sin(n);
 * });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(n) {
 *   return this.sin(n);
 * }, Math);
     * // => [3, 1, 2]
     *
     * var users = [
     *   { 'user': 'fred' },
     *   { 'user': 'pebbles' },
     *   { 'user': 'barney' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.sortBy(users, 'user'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function sortBy(collection, iteratee, thisArg) {
      if (collection == null) {
        return [];
      }
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      var index = -1;
      iteratee = baseCallback(iteratee, thisArg, 3);

      var result = baseMap(collection, function (value, key, collection) {
        return {'criteria': iteratee(value, key, collection), 'index': ++index, 'value': value};
      });
      return baseSortBy(result, compareAscending);
    }

    module.exports = sortBy;

  }, {
    "../internal/baseCallback": 148,
    "../internal/baseMap": 170,
    "../internal/baseSortBy": 177,
    "../internal/compareAscending": 183,
    "../internal/isIterateeCall": 200
  }],
  135: [function (require, module, exports) {
    var baseDelay = require('../internal/baseDelay'),
      restParam = require('./restParam');

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
 *   console.log(text);
 * }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    var defer = restParam(function (func, args) {
      return baseDelay(func, 1, args);
    });

    module.exports = defer;

  }, {"../internal/baseDelay": 151, "./restParam": 136}],
  136: [function (require, module, exports) {
    /** Used as the `TypeError` message for "Functions" methods. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /* Native method references for those with the same name as other `lodash` methods. */
    var nativeMax = Math.max;

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as an array.
     *
     * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function restParam(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
      return function () {
        var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          rest = Array(length);

        while (++index < length) {
          rest[index] = args[start + index];
        }
        switch (start) {
          case 0:
            return func.call(this, rest);
          case 1:
            return func.call(this, args[0], rest);
          case 2:
            return func.call(this, args[0], args[1], rest);
        }
        var otherArgs = Array(start + 1);
        index = -1;
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = rest;
        return func.apply(this, otherArgs);
      };
    }

    module.exports = restParam;

  }, {}],
  137: [function (require, module, exports) {
    (function (global) {
      var cachePush = require('./cachePush'),
        getNative = require('./getNative');

      /** Native method references. */
      var Set = getNative(global, 'Set');

      /* Native method references for those with the same name as other `lodash` methods. */
      var nativeCreate = getNative(Object, 'create');

      /**
       *
       * Creates a cache object to store unique values.
       *
       * @private
       * @param {Array} [values] The values to cache.
       */
      function SetCache(values) {
        var length = values ? values.length : 0;

        this.data = {'hash': nativeCreate(null), 'set': new Set};
        while (length--) {
          this.push(values[length]);
        }
      }

// Add functions to the `Set` cache.
      SetCache.prototype.push = cachePush;

      module.exports = SetCache;

    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  }, {"./cachePush": 182, "./getNative": 196}],
  138: [function (require, module, exports) {
    /**
     * A specialized version of `_.forEach` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
        length = array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    module.exports = arrayEach;

  }, {}],
  139: [function (require, module, exports) {
    /**
     * A specialized version of `_.forEachRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEachRight(array, iteratee) {
      var length = array.length;

      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }

    module.exports = arrayEachRight;

  }, {}],
  140: [function (require, module, exports) {
    /**
     * A specialized version of `_.every` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     */
    function arrayEvery(array, predicate) {
      var index = -1,
        length = array.length;

      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }
      return true;
    }

    module.exports = arrayEvery;

  }, {}],
  141: [function (require, module, exports) {
    /**
     * A specialized version of `_.filter` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    module.exports = arrayFilter;

  }, {}],
  142: [function (require, module, exports) {
    /**
     * A specialized version of `_.map` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
        length = array.length,
        result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    module.exports = arrayMap;

  }, {}],
  143: [function (require, module, exports) {
    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
        length = values.length,
        offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    module.exports = arrayPush;

  }, {}],
  144: [function (require, module, exports) {
    /**
     * A specialized version of `_.reduce` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the first element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduce(array, iteratee, accumulator, initFromArray) {
      var index = -1,
        length = array.length;

      if (initFromArray && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }

    module.exports = arrayReduce;

  }, {}],
  145: [function (require, module, exports) {
    /**
     * A specialized version of `_.some` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
        length = array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    module.exports = arraySome;

  }, {}],
  146: [function (require, module, exports) {
    var keys = require('../object/keys');

    /**
     * A specialized version of `_.assign` for customizing assigned values without
     * support for argument juggling, multiple sources, and `this` binding `customizer`
     * functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     */
    function assignWith(object, source, customizer) {
      var index = -1,
        props = keys(source),
        length = props.length;

      while (++index < length) {
        var key = props[index],
          value = object[key],
          result = customizer(value, source[key], key, object, source);

        if ((result === result ? (result !== value) : (value === value)) ||
          (value === undefined && !(key in object))) {
          object[key] = result;
        }
      }
      return object;
    }

    module.exports = assignWith;

  }, {"../object/keys": 220}],
  147: [function (require, module, exports) {
    var baseCopy = require('./baseCopy'),
      keys = require('../object/keys');

    /**
     * The base implementation of `_.assign` without support for argument juggling,
     * multiple sources, and `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return source == null
        ? object
        : baseCopy(source, keys(source), object);
    }

    module.exports = baseAssign;

  }, {"../object/keys": 220, "./baseCopy": 150}],
  148: [function (require, module, exports) {
    var baseMatches = require('./baseMatches'),
      baseMatchesProperty = require('./baseMatchesProperty'),
      bindCallback = require('./bindCallback'),
      identity = require('../utility/identity'),
      property = require('../utility/property');

    /**
     * The base implementation of `_.callback` which supports specifying the
     * number of arguments to provide to `func`.
     *
     * @private
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function baseCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (type == 'function') {
        return thisArg === undefined
          ? func
          : bindCallback(func, thisArg, argCount);
      }
      if (func == null) {
        return identity;
      }
      if (type == 'object') {
        return baseMatches(func);
      }
      return thisArg === undefined
        ? property(func)
        : baseMatchesProperty(func, thisArg);
    }

    module.exports = baseCallback;

  }, {"../utility/identity": 225, "../utility/property": 226, "./baseMatches": 171, "./baseMatchesProperty": 172, "./bindCallback": 180}],
  149: [function (require, module, exports) {
    /**
     * The base implementation of `compareAscending` which compares values and
     * sorts them in ascending order without guaranteeing a stable sort.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {number} Returns the sort order indicator for `value`.
     */
    function baseCompareAscending(value, other) {
      if (value !== other) {
        var valIsNull = value === null,
          valIsUndef = value === undefined,
          valIsReflexive = value === value;

        var othIsNull = other === null,
          othIsUndef = other === undefined,
          othIsReflexive = other === other;

        if ((value > other && !othIsNull) || !valIsReflexive ||
          (valIsNull && !othIsUndef && othIsReflexive) ||
          (valIsUndef && othIsReflexive)) {
          return 1;
        }
        if ((value < other && !valIsNull) || !othIsReflexive ||
          (othIsNull && !valIsUndef && valIsReflexive) ||
          (othIsUndef && valIsReflexive)) {
          return -1;
        }
      }
      return 0;
    }

    module.exports = baseCompareAscending;

  }, {}],
  150: [function (require, module, exports) {
    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @returns {Object} Returns `object`.
     */
    function baseCopy(source, props, object) {
      object || (object = {});

      var index = -1,
        length = props.length;

      while (++index < length) {
        var key = props[index];
        object[key] = source[key];
      }
      return object;
    }

    module.exports = baseCopy;

  }, {}],
  151: [function (require, module, exports) {
    /** Used as the `TypeError` message for "Functions" methods. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts an index
     * of where to slice the arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The arguments provide to `func`.
     * @returns {number} Returns the timer id.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function () {
        func.apply(undefined, args);
      }, wait);
    }

    module.exports = baseDelay;

  }, {}],
  152: [function (require, module, exports) {
    var baseIndexOf = require('./baseIndexOf'),
      cacheIndexOf = require('./cacheIndexOf'),
      createCache = require('./createCache');

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /**
     * The base implementation of `_.difference` which accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values) {
      var length = array ? array.length : 0,
        result = [];

      if (!length) {
        return result;
      }
      var index = -1,
        indexOf = baseIndexOf,
        isCommon = true,
        cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
        valuesLength = values.length;

      if (cache) {
        indexOf = cacheIndexOf;
        isCommon = false;
        values = cache;
      }
      outer:
        while (++index < length) {
          var value = array[index];

          if (isCommon && value === value) {
            var valuesIndex = valuesLength;
            while (valuesIndex--) {
              if (values[valuesIndex] === value) {
                continue outer;
              }
            }
            result.push(value);
          }
          else if (indexOf(values, value, 0) < 0) {
            result.push(value);
          }
        }
      return result;
    }

    module.exports = baseDifference;

  }, {"./baseIndexOf": 166, "./cacheIndexOf": 181, "./createCache": 187}],
  153: [function (require, module, exports) {
    var baseForOwn = require('./baseForOwn'),
      createBaseEach = require('./createBaseEach');

    /**
     * The base implementation of `_.forEach` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    module.exports = baseEach;

  }, {"./baseForOwn": 162, "./createBaseEach": 185}],
  154: [function (require, module, exports) {
    var baseForOwnRight = require('./baseForOwnRight'),
      createBaseEach = require('./createBaseEach');

    /**
     * The base implementation of `_.forEachRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    module.exports = baseEachRight;

  }, {"./baseForOwnRight": 163, "./createBaseEach": 185}],
  155: [function (require, module, exports) {
    var baseEach = require('./baseEach');

    /**
     * The base implementation of `_.every` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function (value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    module.exports = baseEvery;

  }, {"./baseEach": 153}],
  156: [function (require, module, exports) {
    var baseEach = require('./baseEach');

    /**
     * The base implementation of `_.filter` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function (value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    module.exports = baseFilter;

  }, {"./baseEach": 153}],
  157: [function (require, module, exports) {
    /**
     * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
     * without support for callback shorthands and `this` binding, which iterates
     * over `collection` using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function} predicate The function invoked per iteration.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @param {boolean} [retKey] Specify returning the key of the found element
     *  instead of the element itself.
     * @returns {*} Returns the found element or its key, else `undefined`.
     */
    function baseFind(collection, predicate, eachFunc, retKey) {
      var result;
      eachFunc(collection, function (value, key, collection) {
        if (predicate(value, key, collection)) {
          result = retKey ? key : value;
          return false;
        }
      });
      return result;
    }

    module.exports = baseFind;

  }, {}],
  158: [function (require, module, exports) {
    /**
     * The base implementation of `_.findIndex` and `_.findLastIndex` without
     * support for callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to search.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseFindIndex(array, predicate, fromRight) {
      var length = array.length,
        index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length)) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    module.exports = baseFindIndex;

  }, {}],
  159: [function (require, module, exports) {
    var arrayPush = require('./arrayPush'),
      isArguments = require('../lang/isArguments'),
      isArray = require('../lang/isArray'),
      isArrayLike = require('./isArrayLike'),
      isObjectLike = require('./isObjectLike');

    /**
     * The base implementation of `_.flatten` with added support for restricting
     * flattening and specifying the start index.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, isDeep, isStrict, result) {
      result || (result = []);

      var index = -1,
        length = array.length;

      while (++index < length) {
        var value = array[index];
        if (isObjectLike(value) && isArrayLike(value) &&
          (isStrict || isArray(value) || isArguments(value))) {
          if (isDeep) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, isDeep, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    module.exports = baseFlatten;

  }, {"../lang/isArguments": 211, "../lang/isArray": 212, "./arrayPush": 143, "./isArrayLike": 198, "./isObjectLike": 203}],
  160: [function (require, module, exports) {
    var createBaseFor = require('./createBaseFor');

    /**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` invoking `iteratee` for
     * each property. Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    module.exports = baseFor;

  }, {"./createBaseFor": 186}],
  161: [function (require, module, exports) {
    var baseFor = require('./baseFor'),
      keysIn = require('../object/keysIn');

    /**
     * The base implementation of `_.forIn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForIn(object, iteratee) {
      return baseFor(object, iteratee, keysIn);
    }

    module.exports = baseForIn;

  }, {"../object/keysIn": 221, "./baseFor": 160}],
  162: [function (require, module, exports) {
    var baseFor = require('./baseFor'),
      keys = require('../object/keys');

    /**
     * The base implementation of `_.forOwn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return baseFor(object, iteratee, keys);
    }

    module.exports = baseForOwn;

  }, {"../object/keys": 220, "./baseFor": 160}],
  163: [function (require, module, exports) {
    var baseForRight = require('./baseForRight'),
      keys = require('../object/keys');

    /**
     * The base implementation of `_.forOwnRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return baseForRight(object, iteratee, keys);
    }

    module.exports = baseForOwnRight;

  }, {"../object/keys": 220, "./baseForRight": 164}],
  164: [function (require, module, exports) {
    var createBaseFor = require('./createBaseFor');

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    module.exports = baseForRight;

  }, {"./createBaseFor": 186}],
  165: [function (require, module, exports) {
    var toObject = require('./toObject');

    /**
     * The base implementation of `get` without support for string paths
     * and default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path of the property to get.
     * @param {string} [pathKey] The key representation of path.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path, pathKey) {
      if (object == null) {
        return;
      }
      if (pathKey !== undefined && pathKey in toObject(object)) {
        path = [pathKey];
      }
      var index = 0,
        length = path.length;

      while (object != null && index < length) {
        object = object[path[index++]];
      }
      return (index && index == length) ? object : undefined;
    }

    module.exports = baseGet;

  }, {"./toObject": 209}],
  166: [function (require, module, exports) {
    var indexOfNaN = require('./indexOfNaN');

    /**
     * The base implementation of `_.indexOf` without support for binary searches.
     *
     * @private
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return indexOfNaN(array, fromIndex);
      }
      var index = fromIndex - 1,
        length = array.length;

      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    module.exports = baseIndexOf;

  }, {"./indexOfNaN": 197}],
  167: [function (require, module, exports) {
    var baseIsEqualDeep = require('./baseIsEqualDeep'),
      isObject = require('../lang/isObject'),
      isObjectLike = require('./isObjectLike');

    /**
     * The base implementation of `_.isEqual` without support for `this` binding
     * `customizer` functions.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
    }

    module.exports = baseIsEqual;

  }, {"../lang/isObject": 216, "./baseIsEqualDeep": 168, "./isObjectLike": 203}],
  168: [function (require, module, exports) {
    var equalArrays = require('./equalArrays'),
      equalByTag = require('./equalByTag'),
      equalObjects = require('./equalObjects'),
      isArray = require('../lang/isArray'),
      isTypedArray = require('../lang/isTypedArray');

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      objectTag = '[object Object]';

    /** Used for native method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objToString = objectProto.toString;

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `value` objects.
     * @param {Array} [stackB=[]] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = arrayTag,
        othTag = arrayTag;

      if (!objIsArr) {
        objTag = objToString.call(object);
        if (objTag == argsTag) {
          objTag = objectTag;
        } else if (objTag != objectTag) {
          objIsArr = isTypedArray(object);
        }
      }
      if (!othIsArr) {
        othTag = objToString.call(other);
        if (othTag == argsTag) {
          othTag = objectTag;
        } else if (othTag != objectTag) {
          othIsArr = isTypedArray(other);
        }
      }
      var objIsObj = objTag == objectTag,
        othIsObj = othTag == objectTag,
        isSameTag = objTag == othTag;

      if (isSameTag && !(objIsArr || objIsObj)) {
        return equalByTag(object, other, objTag);
      }
      if (!isLoose) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
        }
      }
      if (!isSameTag) {
        return false;
      }
      // Assume cyclic values are equal.
      // For more information on detecting circular references see https://es5.github.io/#JO.
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == object) {
          return stackB[length] == other;
        }
      }
      // Add `object` and `other` to the stack of traversed objects.
      stackA.push(object);
      stackB.push(other);

      var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

      stackA.pop();
      stackB.pop();

      return result;
    }

    module.exports = baseIsEqualDeep;

  }, {"../lang/isArray": 212, "../lang/isTypedArray": 218, "./equalArrays": 191, "./equalByTag": 192, "./equalObjects": 193}],
  169: [function (require, module, exports) {
    var baseIsEqual = require('./baseIsEqual'),
      toObject = require('./toObject');

    /**
     * The base implementation of `_.isMatch` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} matchData The propery names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, matchData, customizer) {
      var index = matchData.length,
        length = index,
        noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = toObject(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
            ? data[1] !== object[data[0]]
            : !(data[0] in object)
        ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
          objValue = object[key],
          srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var result = customizer ? customizer(objValue, srcValue, key) : undefined;
          if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
            return false;
          }
        }
      }
      return true;
    }

    module.exports = baseIsMatch;

  }, {"./baseIsEqual": 167, "./toObject": 209}],
  170: [function (require, module, exports) {
    var baseEach = require('./baseEach'),
      isArrayLike = require('./isArrayLike');

    /**
     * The base implementation of `_.map` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
        result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function (value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    module.exports = baseMap;

  }, {"./baseEach": 153, "./isArrayLike": 198}],
  171: [function (require, module, exports) {
    var baseIsMatch = require('./baseIsMatch'),
      getMatchData = require('./getMatchData'),
      toObject = require('./toObject');

    /**
     * The base implementation of `_.matches` which does not clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        var key = matchData[0][0],
          value = matchData[0][1];

        return function (object) {
          if (object == null) {
            return false;
          }
          return object[key] === value && (value !== undefined || (key in toObject(object)));
        };
      }
      return function (object) {
        return baseIsMatch(object, matchData);
      };
    }

    module.exports = baseMatches;

  }, {"./baseIsMatch": 169, "./getMatchData": 195, "./toObject": 209}],
  172: [function (require, module, exports) {
    var baseGet = require('./baseGet'),
      baseIsEqual = require('./baseIsEqual'),
      baseSlice = require('./baseSlice'),
      isArray = require('../lang/isArray'),
      isKey = require('./isKey'),
      isStrictComparable = require('./isStrictComparable'),
      last = require('../array/last'),
      toObject = require('./toObject'),
      toPath = require('./toPath');

    /**
     * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to compare.
     * @returns {Function} Returns the new function.
     */
    function baseMatchesProperty(path, srcValue) {
      var isArr = isArray(path),
        isCommon = isKey(path) && isStrictComparable(srcValue),
        pathKey = (path + '');

      path = toPath(path);
      return function (object) {
        if (object == null) {
          return false;
        }
        var key = pathKey;
        object = toObject(object);
        if ((isArr || !isCommon) && !(key in object)) {
          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
          if (object == null) {
            return false;
          }
          key = last(path);
          object = toObject(object);
        }
        return object[key] === srcValue
          ? (srcValue !== undefined || (key in object))
          : baseIsEqual(srcValue, object[key], undefined, true);
      };
    }

    module.exports = baseMatchesProperty;

  }, {
    "../array/last": 124,
    "../lang/isArray": 212,
    "./baseGet": 165,
    "./baseIsEqual": 167,
    "./baseSlice": 176,
    "./isKey": 201,
    "./isStrictComparable": 204,
    "./toObject": 209,
    "./toPath": 210
  }],
  173: [function (require, module, exports) {
    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     */
    function baseProperty(key) {
      return function (object) {
        return object == null ? undefined : object[key];
      };
    }

    module.exports = baseProperty;

  }, {}],
  174: [function (require, module, exports) {
    var baseGet = require('./baseGet'),
      toPath = require('./toPath');

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     */
    function basePropertyDeep(path) {
      var pathKey = (path + '');
      path = toPath(path);
      return function (object) {
        return baseGet(object, path, pathKey);
      };
    }

    module.exports = basePropertyDeep;

  }, {"./baseGet": 165, "./toPath": 210}],
  175: [function (require, module, exports) {
    /**
     * The base implementation of `_.reduce` and `_.reduceRight` without support
     * for callback shorthands and `this` binding, which iterates over `collection`
     * using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} accumulator The initial value.
     * @param {boolean} initFromCollection Specify using the first or last element
     *  of `collection` as the initial value.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @returns {*} Returns the accumulated value.
     */
    function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
      eachFunc(collection, function (value, index, collection) {
        accumulator = initFromCollection
          ? (initFromCollection = false, value)
          : iteratee(accumulator, value, index, collection);
      });
      return accumulator;
    }

    module.exports = baseReduce;

  }, {}],
  176: [function (require, module, exports) {
    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
        length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    module.exports = baseSlice;

  }, {}],
  177: [function (require, module, exports) {
    /**
     * The base implementation of `_.sortBy` which uses `comparer` to define
     * the sort order of `array` and replaces criteria objects with their
     * corresponding values.
     *
     * @private
     * @param {Array} array The array to sort.
     * @param {Function} comparer The function to define sort order.
     * @returns {Array} Returns `array`.
     */
    function baseSortBy(array, comparer) {
      var length = array.length;

      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }

    module.exports = baseSortBy;

  }, {}],
  178: [function (require, module, exports) {
    /**
     * Converts `value` to a string if it's not one. An empty string is returned
     * for `null` or `undefined` values.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      return value == null ? '' : (value + '');
    }

    module.exports = baseToString;

  }, {}],
  179: [function (require, module, exports) {
    var baseIndexOf = require('./baseIndexOf'),
      cacheIndexOf = require('./cacheIndexOf'),
      createCache = require('./createCache');

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The function invoked per iteration.
     * @returns {Array} Returns the new duplicate-value-free array.
     */
    function baseUniq(array, iteratee) {
      var index = -1,
        indexOf = baseIndexOf,
        length = array.length,
        isCommon = true,
        isLarge = isCommon && length >= LARGE_ARRAY_SIZE,
        seen = isLarge ? createCache() : null,
        result = [];

      if (seen) {
        indexOf = cacheIndexOf;
        isCommon = false;
      } else {
        isLarge = false;
        seen = iteratee ? [] : result;
      }
      outer:
        while (++index < length) {
          var value = array[index],
            computed = iteratee ? iteratee(value, index, array) : value;

          if (isCommon && value === value) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed);
            }
            result.push(value);
          }
          else if (indexOf(seen, computed, 0) < 0) {
            if (iteratee || isLarge) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
      return result;
    }

    module.exports = baseUniq;

  }, {"./baseIndexOf": 166, "./cacheIndexOf": 181, "./createCache": 187}],
  180: [function (require, module, exports) {
    var identity = require('../utility/identity');

    /**
     * A specialized version of `baseCallback` which only supports `this` binding
     * and specifying the number of arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function bindCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      if (thisArg === undefined) {
        return func;
      }
      switch (argCount) {
        case 1:
          return function (value) {
            return func.call(thisArg, value);
          };
        case 3:
          return function (value, index, collection) {
            return func.call(thisArg, value, index, collection);
          };
        case 4:
          return function (accumulator, value, index, collection) {
            return func.call(thisArg, accumulator, value, index, collection);
          };
        case 5:
          return function (value, other, key, object, source) {
            return func.call(thisArg, value, other, key, object, source);
          };
      }
      return function () {
        return func.apply(thisArg, arguments);
      };
    }

    module.exports = bindCallback;

  }, {"../utility/identity": 225}],
  181: [function (require, module, exports) {
    var isObject = require('../lang/isObject');

    /**
     * Checks if `value` is in `cache` mimicking the return signature of
     * `_.indexOf` by returning `0` if the value is found, else `-1`.
     *
     * @private
     * @param {Object} cache The cache to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns `0` if `value` is found, else `-1`.
     */
    function cacheIndexOf(cache, value) {
      var data = cache.data,
        result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

      return result ? 0 : -1;
    }

    module.exports = cacheIndexOf;

  }, {"../lang/isObject": 216}],
  182: [function (require, module, exports) {
    var isObject = require('../lang/isObject');

    /**
     * Adds `value` to the cache.
     *
     * @private
     * @name push
     * @memberOf SetCache
     * @param {*} value The value to cache.
     */
    function cachePush(value) {
      var data = this.data;
      if (typeof value == 'string' || isObject(value)) {
        data.set.add(value);
      } else {
        data.hash[value] = true;
      }
    }

    module.exports = cachePush;

  }, {"../lang/isObject": 216}],
  183: [function (require, module, exports) {
    var baseCompareAscending = require('./baseCompareAscending');

    /**
     * Used by `_.sortBy` to compare transformed elements of a collection and stable
     * sort them in ascending order.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @returns {number} Returns the sort order indicator for `object`.
     */
    function compareAscending(object, other) {
      return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
    }

    module.exports = compareAscending;

  }, {"./baseCompareAscending": 149}],
  184: [function (require, module, exports) {
    var bindCallback = require('./bindCallback'),
      isIterateeCall = require('./isIterateeCall'),
      restParam = require('../function/restParam');

    /**
     * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return restParam(function (object, sources) {
        var index = -1,
          length = object == null ? 0 : sources.length,
          customizer = length > 2 ? sources[length - 2] : undefined,
          guard = length > 2 ? sources[2] : undefined,
          thisArg = length > 1 ? sources[length - 1] : undefined;

        if (typeof customizer == 'function') {
          customizer = bindCallback(customizer, thisArg, 5);
          length -= 2;
        } else {
          customizer = typeof thisArg == 'function' ? thisArg : undefined;
          length -= (customizer ? 1 : 0);
        }
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, customizer);
          }
        }
        return object;
      });
    }

    module.exports = createAssigner;

  }, {"../function/restParam": 136, "./bindCallback": 180, "./isIterateeCall": 200}],
  185: [function (require, module, exports) {
    var getLength = require('./getLength'),
      isLength = require('./isLength'),
      toObject = require('./toObject');

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function (collection, iteratee) {
        var length = collection ? getLength(collection) : 0;
        if (!isLength(length)) {
          return eachFunc(collection, iteratee);
        }
        var index = fromRight ? length : -1,
          iterable = toObject(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    module.exports = createBaseEach;

  }, {"./getLength": 194, "./isLength": 202, "./toObject": 209}],
  186: [function (require, module, exports) {
    var toObject = require('./toObject');

    /**
     * Creates a base function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function (object, iteratee, keysFunc) {
        var iterable = toObject(object),
          props = keysFunc(object),
          length = props.length,
          index = fromRight ? length : -1;

        while ((fromRight ? index-- : ++index < length)) {
          var key = props[index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    module.exports = createBaseFor;

  }, {"./toObject": 209}],
  187: [function (require, module, exports) {
    (function (global) {
      var SetCache = require('./SetCache'),
        getNative = require('./getNative');

      /** Native method references. */
      var Set = getNative(global, 'Set');

      /* Native method references for those with the same name as other `lodash` methods. */
      var nativeCreate = getNative(Object, 'create');

      /**
       * Creates a `Set` cache object to optimize linear searches of large arrays.
       *
       * @private
       * @param {Array} [values] The values to cache.
       * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
       */
      function createCache(values) {
        return (nativeCreate && Set) ? new SetCache(values) : null;
      }

      module.exports = createCache;

    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  }, {"./SetCache": 137, "./getNative": 196}],
  188: [function (require, module, exports) {
    var baseCallback = require('./baseCallback'),
      baseFind = require('./baseFind'),
      baseFindIndex = require('./baseFindIndex'),
      isArray = require('../lang/isArray');

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */
    function createFind(eachFunc, fromRight) {
      return function (collection, predicate, thisArg) {
        predicate = baseCallback(predicate, thisArg, 3);
        if (isArray(collection)) {
          var index = baseFindIndex(collection, predicate, fromRight);
          return index > -1 ? collection[index] : undefined;
        }
        return baseFind(collection, predicate, eachFunc);
      };
    }

    module.exports = createFind;

  }, {"../lang/isArray": 212, "./baseCallback": 148, "./baseFind": 157, "./baseFindIndex": 158}],
  189: [function (require, module, exports) {
    var bindCallback = require('./bindCallback'),
      isArray = require('../lang/isArray');

    /**
     * Creates a function for `_.forEach` or `_.forEachRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createForEach(arrayFunc, eachFunc) {
      return function (collection, iteratee, thisArg) {
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee)
          : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
      };
    }

    module.exports = createForEach;

  }, {"../lang/isArray": 212, "./bindCallback": 180}],
  190: [function (require, module, exports) {
    var baseCallback = require('./baseCallback'),
      baseReduce = require('./baseReduce'),
      isArray = require('../lang/isArray');

    /**
     * Creates a function for `_.reduce` or `_.reduceRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createReduce(arrayFunc, eachFunc) {
      return function (collection, iteratee, accumulator, thisArg) {
        var initFromArray = arguments.length < 3;
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee, accumulator, initFromArray)
          : baseReduce(collection, baseCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
      };
    }

    module.exports = createReduce;

  }, {"../lang/isArray": 212, "./baseCallback": 148, "./baseReduce": 175}],
  191: [function (require, module, exports) {
    var arraySome = require('./arraySome');

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing arrays.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var index = -1,
        arrLength = array.length,
        othLength = other.length;

      if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
        return false;
      }
      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
          othValue = other[index],
          result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

        if (result !== undefined) {
          if (result) {
            continue;
          }
          return false;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (isLoose) {
          if (!arraySome(other, function (othValue) {
              return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
            })) {
            return false;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
          return false;
        }
      }
      return true;
    }

    module.exports = equalArrays;

  }, {"./arraySome": 145}],
  192: [function (require, module, exports) {
    /** `Object#toString` result references. */
    var boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      numberTag = '[object Number]',
      regexpTag = '[object RegExp]',
      stringTag = '[object String]';

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag) {
      switch (tag) {
        case boolTag:
        case dateTag:
          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
          return +object == +other;

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case numberTag:
          // Treat `NaN` vs. `NaN` as equal.
          return (object != +object)
            ? other != +other
            : object == +other;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings primitives and string
          // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
          return object == (other + '');
      }
      return false;
    }

    module.exports = equalByTag;

  }, {}],
  193: [function (require, module, exports) {
    var keys = require('../object/keys');

    /** Used for native method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objProps = keys(object),
        objLength = objProps.length,
        othProps = keys(other),
        othLength = othProps.length;

      if (objLength != othLength && !isLoose) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var skipCtor = isLoose;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
          othValue = other[key],
          result = customizer ? customizer(isLoose ? othValue : objValue, isLoose ? objValue : othValue, key) : undefined;

        // Recursively compare objects (susceptible to call stack limits).
        if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
          return false;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (!skipCtor) {
        var objCtor = object.constructor,
          othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
          ('constructor' in object && 'constructor' in other) && !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          return false;
        }
      }
      return true;
    }

    module.exports = equalObjects;

  }, {"../object/keys": 220}],
  194: [function (require, module, exports) {
    var baseProperty = require('./baseProperty');

    /**
     * Gets the "length" property value of `object`.
     *
     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
     * that affects Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {*} Returns the "length" value.
     */
    var getLength = baseProperty('length');

    module.exports = getLength;

  }, {"./baseProperty": 173}],
  195: [function (require, module, exports) {
    var isStrictComparable = require('./isStrictComparable'),
      pairs = require('../object/pairs');

    /**
     * Gets the propery names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = pairs(object),
        length = result.length;

      while (length--) {
        result[length][2] = isStrictComparable(result[length][1]);
      }
      return result;
    }

    module.exports = getMatchData;

  }, {"../object/pairs": 223, "./isStrictComparable": 204}],
  196: [function (require, module, exports) {
    var isNative = require('../lang/isNative');

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = object == null ? undefined : object[key];
      return isNative(value) ? value : undefined;
    }

    module.exports = getNative;

  }, {"../lang/isNative": 214}],
  197: [function (require, module, exports) {
    /**
     * Gets the index at which the first occurrence of `NaN` is found in `array`.
     *
     * @private
     * @param {Array} array The array to search.
     * @param {number} fromIndex The index to search from.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {number} Returns the index of the matched `NaN`, else `-1`.
     */
    function indexOfNaN(array, fromIndex, fromRight) {
      var length = array.length,
        index = fromIndex + (fromRight ? 0 : -1);

      while ((fromRight ? index-- : ++index < length)) {
        var other = array[index];
        if (other !== other) {
          return index;
        }
      }
      return -1;
    }

    module.exports = indexOfNaN;

  }, {}],
  198: [function (require, module, exports) {
    var getLength = require('./getLength'),
      isLength = require('./isLength');

    /**
     * Checks if `value` is array-like.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     */
    function isArrayLike(value) {
      return value != null && isLength(getLength(value));
    }

    module.exports = isArrayLike;

  }, {"./getLength": 194, "./isLength": 202}],
  199: [function (require, module, exports) {
    /** Used to detect unsigned integer values. */
    var reIsUint = /^\d+$/;

    /**
     * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
     * of an array-like value.
     */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return value > -1 && value % 1 == 0 && value < length;
    }

    module.exports = isIndex;

  }, {}],
  200: [function (require, module, exports) {
    var isArrayLike = require('./isArrayLike'),
      isIndex = require('./isIndex'),
      isObject = require('../lang/isObject');

    /**
     * Checks if the provided arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)) {
        var other = object[index];
        return value === value ? (value === other) : (other !== other);
      }
      return false;
    }

    module.exports = isIterateeCall;

  }, {"../lang/isObject": 216, "./isArrayLike": 198, "./isIndex": 199}],
  201: [function (require, module, exports) {
    var isArray = require('../lang/isArray'),
      toObject = require('./toObject');

    /** Used to match property names within property paths. */
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/;

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      var type = typeof value;
      if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
        return true;
      }
      if (isArray(value)) {
        return false;
      }
      var result = !reIsDeepProp.test(value);
      return result || (object != null && value in toObject(object));
    }

    module.exports = isKey;

  }, {"../lang/isArray": 212, "./toObject": 209}],
  202: [function (require, module, exports) {
    /**
     * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
     * of an array-like value.
     */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     */
    function isLength(value) {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    module.exports = isLength;

  }, {}],
  203: [function (require, module, exports) {
    /**
     * Checks if `value` is object-like.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     */
    function isObjectLike(value) {
      return !!value && typeof value == 'object';
    }

    module.exports = isObjectLike;

  }, {}],
  204: [function (require, module, exports) {
    var isObject = require('../lang/isObject');

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    module.exports = isStrictComparable;

  }, {"../lang/isObject": 216}],
  205: [function (require, module, exports) {
    var toObject = require('./toObject');

    /**
     * A specialized version of `_.pick` which picks `object` properties specified
     * by `props`.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} props The property names to pick.
     * @returns {Object} Returns the new object.
     */
    function pickByArray(object, props) {
      object = toObject(object);

      var index = -1,
        length = props.length,
        result = {};

      while (++index < length) {
        var key = props[index];
        if (key in object) {
          result[key] = object[key];
        }
      }
      return result;
    }

    module.exports = pickByArray;

  }, {"./toObject": 209}],
  206: [function (require, module, exports) {
    var baseForIn = require('./baseForIn');

    /**
     * A specialized version of `_.pick` which picks `object` properties `predicate`
     * returns truthy for.
     *
     * @private
     * @param {Object} object The source object.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Object} Returns the new object.
     */
    function pickByCallback(object, predicate) {
      var result = {};
      baseForIn(object, function (value, key, object) {
        if (predicate(value, key, object)) {
          result[key] = value;
        }
      });
      return result;
    }

    module.exports = pickByCallback;

  }, {"./baseForIn": 161}],
  207: [function (require, module, exports) {
    var isArguments = require('../lang/isArguments'),
      isArray = require('../lang/isArray'),
      isIndex = require('./isIndex'),
      isLength = require('./isLength'),
      keysIn = require('../object/keysIn');

    /** Used for native method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * A fallback implementation of `Object.keys` which creates an array of the
     * own enumerable property names of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function shimKeys(object) {
      var props = keysIn(object),
        propsLength = props.length,
        length = propsLength && object.length;

      var allowIndexes = !!length && isLength(length) &&
        (isArray(object) || isArguments(object));

      var index = -1,
        result = [];

      while (++index < propsLength) {
        var key = props[index];
        if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
          result.push(key);
        }
      }
      return result;
    }

    module.exports = shimKeys;

  }, {"../lang/isArguments": 211, "../lang/isArray": 212, "../object/keysIn": 221, "./isIndex": 199, "./isLength": 202}],
  208: [function (require, module, exports) {
    /**
     * An implementation of `_.uniq` optimized for sorted arrays without support
     * for callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The function invoked per iteration.
     * @returns {Array} Returns the new duplicate-value-free array.
     */
    function sortedUniq(array, iteratee) {
      var seen,
        index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

      while (++index < length) {
        var value = array[index],
          computed = iteratee ? iteratee(value, index, array) : value;

        if (!index || seen !== computed) {
          seen = computed;
          result[++resIndex] = value;
        }
      }
      return result;
    }

    module.exports = sortedUniq;

  }, {}],
  209: [function (require, module, exports) {
    var isObject = require('../lang/isObject');

    /**
     * Converts `value` to an object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Object} Returns the object.
     */
    function toObject(value) {
      return isObject(value) ? value : Object(value);
    }

    module.exports = toObject;

  }, {"../lang/isObject": 216}],
  210: [function (require, module, exports) {
    var baseToString = require('./baseToString'),
      isArray = require('../lang/isArray');

    /** Used to match property names within property paths. */
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

    /** Used to match backslashes in property paths. */
    var reEscapeChar = /\\(\\)?/g;

    /**
     * Converts `value` to property path array if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array} Returns the property path array.
     */
    function toPath(value) {
      if (isArray(value)) {
        return value;
      }
      var result = [];
      baseToString(value).replace(rePropName, function (match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    }

    module.exports = toPath;

  }, {"../lang/isArray": 212, "./baseToString": 178}],
  211: [function (require, module, exports) {
    var isArrayLike = require('../internal/isArrayLike'),
      isObjectLike = require('../internal/isObjectLike');

    /** Used for native method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Native method references. */
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;

    /**
     * Checks if `value` is classified as an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return isObjectLike(value) && isArrayLike(value) &&
        hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
    }

    module.exports = isArguments;

  }, {"../internal/isArrayLike": 198, "../internal/isObjectLike": 203}],
  212: [function (require, module, exports) {
    var getNative = require('../internal/getNative'),
      isLength = require('../internal/isLength'),
      isObjectLike = require('../internal/isObjectLike');

    /** `Object#toString` result references. */
    var arrayTag = '[object Array]';

    /** Used for native method references. */
    var objectProto = Object.prototype;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objToString = objectProto.toString;

    /* Native method references for those with the same name as other `lodash` methods. */
    var nativeIsArray = getNative(Array, 'isArray');

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(function() { return arguments; }());
     * // => false
     */
    var isArray = nativeIsArray || function (value) {
        return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
      };

    module.exports = isArray;

  }, {"../internal/getNative": 196, "../internal/isLength": 202, "../internal/isObjectLike": 203}],
  213: [function (require, module, exports) {
    var isObject = require('./isObject');

    /** `Object#toString` result references. */
    var funcTag = '[object Function]';

    /** Used for native method references. */
    var objectProto = Object.prototype;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objToString = objectProto.toString;

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in older versions of Chrome and Safari which return 'function' for regexes
      // and Safari 8 equivalents which return 'object' for typed array constructors.
      return isObject(value) && objToString.call(value) == funcTag;
    }

    module.exports = isFunction;

  }, {"./isObject": 216}],
  214: [function (require, module, exports) {
    var isFunction = require('./isFunction'),
      isObjectLike = require('../internal/isObjectLike');

    /** Used to detect host constructors (Safari > 5). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for native method references. */
    var objectProto = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var fnToString = Function.prototype.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
        .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * Checks if `value` is a native function.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (value == null) {
        return false;
      }
      if (isFunction(value)) {
        return reIsNative.test(fnToString.call(value));
      }
      return isObjectLike(value) && reIsHostCtor.test(value);
    }

    module.exports = isNative;

  }, {"../internal/isObjectLike": 203, "./isFunction": 213}],
  215: [function (require, module, exports) {
    var isObjectLike = require('../internal/isObjectLike');

    /** `Object#toString` result references. */
    var numberTag = '[object Number]';

    /** Used for native method references. */
    var objectProto = Object.prototype;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objToString = objectProto.toString;

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
     * as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isNumber(8.4);
     * // => true
     *
     * _.isNumber(NaN);
     * // => true
     *
     * _.isNumber('8.4');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag);
    }

    module.exports = isNumber;

  }, {"../internal/isObjectLike": 203}],
  216: [function (require, module, exports) {
    /**
     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // Avoid a V8 JIT bug in Chrome 19-20.
      // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    module.exports = isObject;

  }, {}],
  217: [function (require, module, exports) {
    var isObjectLike = require('../internal/isObjectLike');

    /** `Object#toString` result references. */
    var stringTag = '[object String]';

    /** Used for native method references. */
    var objectProto = Object.prototype;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objToString = objectProto.toString;

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
    }

    module.exports = isString;

  }, {"../internal/isObjectLike": 203}],
  218: [function (require, module, exports) {
    var isLength = require('../internal/isLength'),
      isObjectLike = require('../internal/isObjectLike');

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

    var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
      typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
        typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
          typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
            typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
      typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
        typedArrayTags[dateTag] = typedArrayTags[errorTag] =
          typedArrayTags[funcTag] = typedArrayTags[mapTag] =
            typedArrayTags[numberTag] = typedArrayTags[objectTag] =
              typedArrayTags[regexpTag] = typedArrayTags[setTag] =
                typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

    /** Used for native method references. */
    var objectProto = Object.prototype;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objToString = objectProto.toString;

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    function isTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
    }

    module.exports = isTypedArray;

  }, {"../internal/isLength": 202, "../internal/isObjectLike": 203}],
  219: [function (require, module, exports) {
    var assignWith = require('../internal/assignWith'),
      baseAssign = require('../internal/baseAssign'),
      createAssigner = require('../internal/createAssigner');

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources overwrite property assignments of previous sources.
     * If `customizer` is provided it is invoked to produce the assigned values.
     * The `customizer` is bound to `thisArg` and invoked with five arguments:
     * (objectValue, sourceValue, key, object, source).
     *
     * **Note:** This method mutates `object` and is based on
     * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using a customizer callback
     * var defaults = _.partialRight(_.assign, function(value, other) {
 *   return _.isUndefined(value) ? other : value;
 * });
     *
     * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var assign = createAssigner(function (object, source, customizer) {
      return customizer
        ? assignWith(object, source, customizer)
        : baseAssign(object, source);
    });

    module.exports = assign;

  }, {"../internal/assignWith": 146, "../internal/baseAssign": 147, "../internal/createAssigner": 184}],
  220: [function (require, module, exports) {
    var getNative = require('../internal/getNative'),
      isArrayLike = require('../internal/isArrayLike'),
      isObject = require('../lang/isObject'),
      shimKeys = require('../internal/shimKeys');

    /* Native method references for those with the same name as other `lodash` methods. */
    var nativeKeys = getNative(Object, 'keys');

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    var keys = !nativeKeys ? shimKeys : function (object) {
      var Ctor = object == null ? undefined : object.constructor;
      if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
        (typeof object != 'function' && isArrayLike(object))) {
        return shimKeys(object);
      }
      return isObject(object) ? nativeKeys(object) : [];
    };

    module.exports = keys;

  }, {"../internal/getNative": 196, "../internal/isArrayLike": 198, "../internal/shimKeys": 207, "../lang/isObject": 216}],
  221: [function (require, module, exports) {
    var isArguments = require('../lang/isArguments'),
      isArray = require('../lang/isArray'),
      isIndex = require('../internal/isIndex'),
      isLength = require('../internal/isLength'),
      isObject = require('../lang/isObject');

    /** Used for native method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      if (object == null) {
        return [];
      }
      if (!isObject(object)) {
        object = Object(object);
      }
      var length = object.length;
      length = (length && isLength(length) &&
        (isArray(object) || isArguments(object)) && length) || 0;

      var Ctor = object.constructor,
        index = -1,
        isProto = typeof Ctor == 'function' && Ctor.prototype === object,
        result = Array(length),
        skipIndexes = length > 0;

      while (++index < length) {
        result[index] = (index + '');
      }
      for (var key in object) {
        if (!(skipIndexes && isIndex(key, length)) && !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    module.exports = keysIn;

  }, {
    "../internal/isIndex": 199,
    "../internal/isLength": 202,
    "../lang/isArguments": 211,
    "../lang/isArray": 212,
    "../lang/isObject": 216
  }],
  222: [function (require, module, exports) {
    var arrayMap = require('../internal/arrayMap'),
      baseDifference = require('../internal/baseDifference'),
      baseFlatten = require('../internal/baseFlatten'),
      bindCallback = require('../internal/bindCallback'),
      keysIn = require('./keysIn'),
      pickByArray = require('../internal/pickByArray'),
      pickByCallback = require('../internal/pickByCallback'),
      restParam = require('../function/restParam');

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that are not omitted.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to omit, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.omit(object, 'age');
     * // => { 'user': 'fred' }
     *
     * _.omit(object, _.isNumber);
     * // => { 'user': 'fred' }
     */
    var omit = restParam(function (object, props) {
      if (object == null) {
        return {};
      }
      if (typeof props[0] != 'function') {
        var props = arrayMap(baseFlatten(props), String);
        return pickByArray(object, baseDifference(keysIn(object), props));
      }
      var predicate = bindCallback(props[0], props[1], 3);
      return pickByCallback(object, function (value, key, object) {
        return !predicate(value, key, object);
      });
    });

    module.exports = omit;

  }, {
    "../function/restParam": 136,
    "../internal/arrayMap": 142,
    "../internal/baseDifference": 152,
    "../internal/baseFlatten": 159,
    "../internal/bindCallback": 180,
    "../internal/pickByArray": 205,
    "../internal/pickByCallback": 206,
    "./keysIn": 221
  }],
  223: [function (require, module, exports) {
    var keys = require('./keys'),
      toObject = require('../internal/toObject');

    /**
     * Creates a two dimensional array of the key-value pairs for `object`,
     * e.g. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
     */
    function pairs(object) {
      object = toObject(object);

      var index = -1,
        props = keys(object),
        length = props.length,
        result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    module.exports = pairs;

  }, {"../internal/toObject": 209, "./keys": 220}],
  224: [function (require, module, exports) {
    var baseFlatten = require('../internal/baseFlatten'),
      bindCallback = require('../internal/bindCallback'),
      pickByArray = require('../internal/pickByArray'),
      pickByCallback = require('../internal/pickByCallback'),
      restParam = require('../function/restParam');

    /**
     * Creates an object composed of the picked `object` properties. Property
     * names may be specified as individual arguments or as arrays of property
     * names. If `predicate` is provided it is invoked for each property of `object`
     * picking the properties `predicate` returns truthy for. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.pick(object, 'user');
     * // => { 'user': 'fred' }
     *
     * _.pick(object, _.isString);
     * // => { 'user': 'fred' }
     */
    var pick = restParam(function (object, props) {
      if (object == null) {
        return {};
      }
      return typeof props[0] == 'function'
        ? pickByCallback(object, bindCallback(props[0], props[1], 3))
        : pickByArray(object, baseFlatten(props));
    });

    module.exports = pick;

  }, {
    "../function/restParam": 136,
    "../internal/baseFlatten": 159,
    "../internal/bindCallback": 180,
    "../internal/pickByArray": 205,
    "../internal/pickByCallback": 206
  }],
  225: [function (require, module, exports) {
    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    module.exports = identity;

  }, {}],
  226: [function (require, module, exports) {
    var baseProperty = require('../internal/baseProperty'),
      basePropertyDeep = require('../internal/basePropertyDeep'),
      isKey = require('../internal/isKey');

    /**
     * Creates a function that returns the property value at `path` on a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': 2 } } },
     *   { 'a': { 'b': { 'c': 1 } } }
     * ];
     *
     * _.map(objects, _.property('a.b.c'));
     * // => [2, 1]
     *
     * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
    }

    module.exports = property;

  }, {"../internal/baseProperty": 173, "../internal/basePropertyDeep": 174, "../internal/isKey": 201}]
}, {}, [1]);
