var assert = require('assert');
var request = require('supertest');

module.exports.test = function(){
  describe('session creation =>', function() {
    describe('POST /mobile/createSession =>', function() {
      var agent = request.agent(app);

      it('Create session test', function(done) {
        agent
          .post('/mobile/createSession')
          .send({
            username: 'testuser',
            color: 'RGB(255,255,255)'
          })
          .type('form')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res){
            if (err) return done(err);
            done();
          });

          //assert.equals(response.data.attributes.session_id, "")
      });
    });
  });
};
