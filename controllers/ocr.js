/**
 * @file This file implements the defined routes for use by the OCR componant
 */
var config      = require('config');
var debug       = require('debug')('platypus-api:controllers:ocr');
var fs          = require('fs');
var request     = require('request');

var its =   [{price: '43.50', quantity: '5', desc: "Cheese Burger", id: '6'},
{price: '24.90', quantity: '2', desc: "Milkshake", id: '1'},
{price: '18.00', quantity: '3', desc: "Filter Coffee", id: '2'},
{price: '25.90', quantity: '2', desc: "Toasted Cheese", id: '3'},
{price: '5.90', quantity: '1', desc: "Extra Bacon", id: '4'},
{price: '32.90', quantity: '1', desc: "Chicken Wrap", id: '5'}];

/**
 * @TODO Once this method is correctly implemented complete documentation.
 * @param {request} req req used by Express.js to fetch data from the client.
 * @param {response} res res used by Express.js to send responses back to the
 *                       client.
 * @param {object} next
 * @return JSON object containing Bill information
 */
debug('Exporting method: @todo');
module.exports.detect = function(target_path, bill) {
  return new Promise(function(resolve, reject){
    var ocr_module = config.servers.ocr.host;
    var ocr_port = config.servers.ocr.port;
    var response = {
      data: {
        type: 'ocr',
        id: 0,
        attributes: {
          session_id: bill,
          items: null
        }
      }
    };
    var formData = {
      file: fs.createReadStream(target_path),
    };
    request.post({url:'http://192.168.1.110' + /*+ ocr_module +*/ ':' + ocr_port + '/', formData: formData, json: true}, function optionalCallback(err, httpResponse, body) {
      if (err) {
        debug(httpResponse);
        reject(err);
      }
      debug("Body: ");
      debug(body);
      // if(body.type == 'success') {
      //   response.data.attributes.items = body.attributes.data;
      // }
      // else{
        response.data.attributes.items = its;
      //}

      debug('Sending response (status: 200)');
      resolve(response);
    });
  });
}