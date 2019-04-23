const _ = require('lodash');
const {spy} = require('sinon');
const expect = require('expect.js');
const {TESTIMONIAL_RATING} = require("../../lib/constants");

describe('main', () => {

   const moogBundle = require('../../index');
   let apos, unique, self, options, base;

   function givenTheModuleIsCreated (overrides = {}) {
      Object.keys(moogBundle).filter(key => typeof moogBundle[key] === 'function').forEach(key => {
         self[key] = moogBundle[key];
      });

      options.addFields = [
         {
            name: 'slug',
         },
         {
            name: 'title',
         },
         {
            name: 'published',
            def: true,
         },
         ...options.addFields,
      ];

      _.assign(options, overrides);

      self.construct.call(self, self, options);
      self.schema = options.addFields.reduce((all, field) => {
         if (!all[field.name]) {
            all.push(all[field.name] = field);
         }
         return all;
      }, []).slice();
      self.afterConstruct(self);
   }

   function givenFindResultsIn (err, data) {
      self.find = spy((req, query) => ({
         toArray (callback) {
            callback(err, data);
         }
      }));
   }

   beforeEach(() => {
      unique = 1;
      apos = {

         schemas: {

            subset (schema, names) {
            }

         },

         utils: {
            generateId () {
               return 'id-' + unique++;
            }
         }

      };

      options = _.cloneDeep(moogBundle);
      self = {
         apos,
         options,
      };

   });

   it('uses the targetJoinType option to set the join type', () => {
      givenTheModuleIsCreated({targetJoinType: 'foo'});

      expect(_.find(options.addFields, _.matchesProperty('name', '_target')))
         .to.have.property('withType', 'foo');
   });

   it('defaults to not publish on creation', () => {
      givenTheModuleIsCreated();

      expect(_.find(options.addFields, _.matchesProperty('name', 'published')))
         .to.have.property('def', false);
   });

   it('finds testimonials for a specific target', () => {
      givenTheModuleIsCreated();
      givenFindResultsIn(null, [
         {[TESTIMONIAL_RATING]: 4},
         {[TESTIMONIAL_RATING]: 5},
      ]);

      const handler = spy();
      self.forTarget({is: 'req'}, 'foo-bar', {is: 'opt'}, handler);

      expect(self.find.calledWith({is: 'req'}, {targetId: 'foo-bar'})).to.be(true);
      expect(handler.called).to.be(true);
      expect(handler.firstCall.lastArg).to.have.property('count', 2);
   });

});
