const _ = require('lodash');
const expect = require('expect.js');
const {Testimonial} = require('../../lib/testimonial');
const {TESTIMONIAL_RATING} = require('../../lib/constants');

describe('testimonial', () => {

   it('handles non data', () => {
      const testimonial = new Testimonial(null);

      expect(testimonial.testimonials).to.eql([]);
      expect(testimonial).to.have.property('rating', 0);
      expect(testimonial).to.have.property('count', 0);
   });

   it('handles empty data', () => {
      const testimonial = new Testimonial([]);

      expect(testimonial.testimonials).to.eql([]);
      expect(testimonial).to.have.property('rating', 0);
      expect(testimonial).to.have.property('count', 0);
   });

   it('calculates the rating to one decimal place', () => {
      const testimonial = new Testimonial([
         { [TESTIMONIAL_RATING]: 1 },
         { [TESTIMONIAL_RATING]: 3 },
         { [TESTIMONIAL_RATING]: 4 },
      ]);

      expect(testimonial).to.have.property('rating', 2.7);
      expect(testimonial).to.have.property('count', 3);
   });

});
