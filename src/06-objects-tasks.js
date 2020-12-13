/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.height * this.width;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  isElement: null,
  isId: null,
  isClass: null,
  isAttr: null,
  isPseudoClass: null,
  isPseudoElement: null,
  selectors: [],

  element(value) {
    if (this.isElement) this.clearDuplicationError();
    if (
      this.isId
      || this.isClass
      || this.isAttr
      || this.isPseudoClass
      || this.isPseudoElement
    ) this.clearOrderError();
    const cssBuilder = Object.create(cssSelectorBuilder);
    cssBuilder.selectors = [];
    cssBuilder.isElement = true;
    cssBuilder.selectors.push(value);
    return cssBuilder;
  },

  id(value) {
    if (this.isId) this.clearDuplicationError();
    if (
      this.isClass
      || this.isAttr
      || this.isPseudoClass
      || this.isPseudoElement
    ) this.clearOrderError();
    const css1Builder = Object.create(cssSelectorBuilder);
    css1Builder.selectors = [];
    if (this.isElement) css1Builder.selectors = this.selectors;
    css1Builder.isId = true;
    css1Builder.selectors.push('#', value);
    return css1Builder;
  },

  class(value) {
    if (
      this.isAttr
      || this.isPseudoClass
      || this.isPseudoElement
    ) this.clearOrderError();
    this.isClass = true;
    this.selectors.push('.', value);
    return this;
  },

  attr(value) {
    if (
      this.isPseudoClass
      || this.isPseudoElement
    ) this.clearOrderError();
    this.isAttr = true;
    this.selectors.push('[', value, ']');
    return this;
  },

  pseudoClass(value) {
    if (
      this.isPseudoElement
    ) this.clearOrderError();
    this.isPseudoClass = true;
    this.selectors.push(':', value);
    return this;
  },

  pseudoElement(value) {
    if (this.isPseudoElement) this.clearDuplicationError();
    this.isPseudoElement = true;
    this.selectors.push('::', value);
    return this;
  },

  stringify() {
    const emmet = this.selectors.join('');
    this.isElement = null;
    this.isId = null;
    this.isClass = null;
    this.isAttr = null;
    this.isPseudoClass = null;
    this.isPseudoElement = null;
    this.selectors.length = 0;
    return emmet;
  },

  combine(...args) {
    // throw new Error('Not implemented');
    const arr = [...args].map((item) => {
      if (typeof item === 'object') return item.stringify();
      return ` ${item} `;
    });
    this.selectors = [...arr];
    return this;
  },

  clearDuplicationError() {
    this.isElement = null;
    this.isId = null;
    this.isClass = null;
    this.isAttr = null;
    this.isPseudoClass = null;
    this.isPseudoElement = null;
    this.selectors = [];
    throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  },

  clearOrderError() {
    this.isElement = null;
    this.isId = null;
    this.isClass = null;
    this.isAttr = null;
    this.isPseudoClass = null;
    this.isPseudoElement = null;
    this.selectors = [];
    throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
