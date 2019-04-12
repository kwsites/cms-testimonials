const _ = require('lodash');
const expect = require('expect.js');
const fields = require("../../lib/fields");

describe('fields', () => {

   it('creates field names for contact fields', () => {
      expect(fields.contactField('Foo').name).to.be('contact-foo');
      expect(fields.contactField('Foo Bar').name).to.be('contact-foo-bar');
   });

   it('optionally adds autocomplete properties', () => {
      expect(fields.contactField('Hello').hasOwnProperty('autocomplete')).to.be(false);
      expect(fields.contactField('Hello', 'blah').autocomplete).to.be('blah');
   });

});
