const _ = require('lodash');

const { contactField, rangeField, textAreaField, isContactField } = require("./lib/fields");

module.exports = {
   extend: 'apostrophe-pieces',
   name: 'cms-testimonial',
   label: 'Testimonial',
   pluralLabel: 'Testimonials',

   targetJoinType: '',

   subscriberModule: 'hot-subscriber',

   subscriberSourceKey: 'contact-event-source',
   subscriberSourceValue: 'Testimonial',

   addFields: [
      contactField('Name', 'name'),
      contactField('Email', 'email'),
      contactField('Phone', 'tel', false),

      // set to false when the user chooses to unsubscribe
      {
         name: 'contact-create-subscriber',
         type: 'boolean',
         label: 'Subscribe to the blog',
         def: false,
         // contextualOnly: true,
      },

      textAreaField('testimonial-content', 'Testimonial', true),
      rangeField('testimonial-rating', 'Rating', true),

      {
         name: '_target',
         type: 'joinByOne',
         filters: {
            projection: {
               title: 1,
            },
         },
      },

   ],

   arrangeFields: [
      {
         label: 'Testimonial',
         name: 'testimonial',
         fields: ['_target', 'title', 'testimonial-content', 'testimonial-rating'],
      },
      {
         label: 'Contact',
         name: 'contact',
         fields: ['contact-name', 'contact-email', 'contact-phone', 'contact-create-subscriber'],
      },
      {
         label: 'Admin',
         name: 'admin',
         fields: ['slug', 'published', 'tags'],
      },
   ],

   afterConstruct (self) {

      self.setSubmitSchema();
   },

   construct (self, options) {

      _.find(options.addFields, _.matchesProperty('name', '_target')).withType = options.targetJoinType;
      _.find(options.addFields, _.matchesProperty('name', 'published')).def = false;

      self.createSubscriber = function (req, piece, opt, callback) {
         setImmediate(callback);
      };

      self.setSubmitSchema = function () {

         const contactFieldNames = _.map(self.schema, 'name').filter(isUserEditable);

         self.submitSchema = self.apos.schemas.subset(self.schema, [...contactFieldNames]);
         self.udpateSchema = self.apos.schemas.subset(self.schema, ['slug', ...contactFieldNames]);

      };

      self.afterInsert = _.wrap(self.afterInsert, (superFn, req, piece, insertOptions, callback) => {
         superFn(req, piece, insertOptions, (err, data) => {

            if (!err && piece['contact-create-subscriber']) {
               return self.createSubscriber(req, _.reduce(piece, contactFieldsCollector, {}), insertOptions, callback);
            }

            setImmediate(callback);

         });

      });

      self.beforeInsert = (req, piece, insertOptions, callback) => {
         piece.slug = self.apos.utils.generateId();

         callback();
      };

      self.beforeSave = (req, piece, options, callback) => {

         // TODO: option to update the linked piece with the new
         // TODO: rating if published state is changing

         callback();
      };
   }

};

function isUserEditable (fieldName) {
   return /^(contact|testimonial)-/.test(fieldName);
}

function contactFieldsCollector (collector, value, name) {
   if (isContactField(name)) {
      collector[name] = value;
   }

   return collector;
}
