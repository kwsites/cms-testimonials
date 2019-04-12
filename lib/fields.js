const _ = require('lodash');

function fieldConfig (type, name, label, required, autocomplete) {
   const config = {
      type,
      name,
      label,
      required: !!required
   };

   if (autocomplete) {
      config.autocomplete = autocomplete;
   }

   return config;
}

function contactField (label, autocomplete, required = true) {
   return fieldConfig('string', `contact-${ _.kebabCase(label) }`, label, required, autocomplete);
}

function stringField (name, label, required, autocomplete) {
   return fieldConfig('string', name, label, required, autocomplete);
}

function rangeField (name, label, required, min = 1, max = 5, step = 1) {
   return {
      ...fieldConfig('range', name, label, required),
      min,
      max,
      step,
   };
}

function textAreaField (name, label, required, autocomplete) {
   return {
      ...stringField(name, label, required, autocomplete),
      textarea: true,
   };
}

function isContactField (name) {
   return !!name && ((typeof name === 'string' && /^contact-/.test(name)) || isContactField(name.name));
}


module.exports = {

   contactField,

   rangeField,

   stringField,

   textAreaField,

   fieldConfig,

   isContactField,

};
