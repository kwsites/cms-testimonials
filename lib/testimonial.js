const _ = require('lodash');
const {TESTIMONIAL_RATING} = require('./constants');

module.exports.Testimonial = class Testimonial {

   constructor (testimonials) {
      this.testimonials = testimonials || [];
      this.count = this.testimonials.length;
      this.rating = Math.round((_.meanBy(this.testimonials, TESTIMONIAL_RATING) || 0) * 10) / 10;
   }

};
