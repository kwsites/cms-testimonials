const _ = require('lodash');
const expect = require('expect.js');

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

   beforeEach(() => {
      unique = 1;
      apos = {

         schemas: {

            subset (schema, names) {}

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
      givenTheModuleIsCreated({ targetJoinType: 'foo' });

      expect(_.find(options.addFields, _.matchesProperty('name', '_target')))
         .to.have.property('withType', 'foo');
   });

   it('defaults to not publish on creation', () => {
      givenTheModuleIsCreated();

      expect(_.find(options.addFields, _.matchesProperty('name', 'published')))
         .to.have.property('def', false);
   });

});
