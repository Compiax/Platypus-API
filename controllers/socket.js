/**
 * @file This file implements the defined routes for use by the mobile
 * componant.
 */
var debug       = require('debug')('platypus-api:controllers:mobile');
var io          = require('socket.io').listen(3002);
var Bills       = require('../models/bills');
var Users       = require('../models/users');
var Items       = require('../models/items');
var Claims      = require('../models/claims');
var bill_model  = new Bills;
var user_model  = new Users;
var item_model  = new Items;
var claim_model  = new Claims;
var mongoose    = require('mongoose');
var MTypes      = mongoose.Types;

var its =   [{price: '43.50', quantity: '5', desc: "Cheese Burger", id: '6'},
{price: '24.90', quantity: '2', desc: "Milkshake", id: '1'},
{price: '18.00', quantity: '3', desc: "Filter Coffee", id: '2'},
{price: '25.90', quantity: '2', desc: "Toasted Cheese", id: '3'},
{price: '5.90', quantity: '1', desc: "Extra Bacon", id: '4'},
{price: '32.90', quantity: '1', desc: "Chicken Wrap", id: '5'}];

debug('Exporting method: connectSessionSocket');
/**
 * Function that receives the user data (Nickname and profile color) entered
 * when a user requests a new session.
 * @param {request} req req used by Express.js to fetch data from the client.
 * @param {response} res res used by Express.js to send responses back to the
 *                       client.
 * @param {object} next
 * @return JSON object containing session ID and user ID
 */


var socket;
io.on('connection', function (sock) {
    socket = sock;
    listenerHandler();
});

function listenerHandler() {
    socket.on('claimItem', claimItem);
    socket.on('unclaimItem', unclaimItem);
    socket.on('createItem', createItem);
    socket.on('deleteItem', deleteItem);
    socket.on('editItem', editItem);
}

function claimItem(data) {
    var claimed = false;
    debug("ClaimItem: SessionID: " + data.session_id + " UserID: " + data.user_id + " ItemID: " + data.item_id);
    Users.findOne({u_id: data.user_id}).populate({path:'item_claimed'}).exec(function (err, user) {
        for(item in user.item_claimed){
            if(item.item_id == data.item_id){
                item.quantity = data.quantity;
                bill.save();
                claimed = true;
            }
        }
        if (!claimed) {
            var claim = new Claims({
                _id         : new MTypes.ObjectId(),
                item_id: data.item_id,
                quantity: data.quantity
            });
            user.item_claimed.push(claim);
            var subdoc = user.item_claimed[user.item_claimed.length-1];
            subdoc.isNew;
            claim.save(function(err){
                if (err) return handleError(err);
            });
            user.save();
        }
    });
    Bills.findOne({bill_id: data.session_id.toLowerCase()}).populate({path:'users'}).exec(function (err, bill) {
        debug(bill.users[bill.users.length -1]);
    });
    Items.findOne({i_id: data.item_id},function(err,doc){
        if(doc){
            doc.i_quantity = doc.i_quantity-1;
            doc.save(function(err){
                if(!err){
                    sendItem(doc, data.session_id.toLowerCase());
                }
            });
        }
    });
};

function unclaimItem(data) {
    Items.findOne({i_id: data.item_id},function(err,doc){
        doc.i_quantity = doc.i_quantity+1;
        doc.save();
    });
};

function getItemId(num) {
    var new_iID = (num + 1).toString();

    if (new_iID.length < 2) {
        new_iID = 'i0' + new_iID;
    }
    else {
        new_iID = 'i' + new_iID;
    }
    return new_iID;
}

function addItemToDB(session_id, price, name, quantity) {
    return new Promise(function (resolve, reject) {
        debug("SessionID" + session_id);
        Bills.findOne({bill_id: session_id}, function(err, doc){
            if(doc != null) {
                var itid = session_id+getItemId(doc.items_count+1);
                var item = new Items({
                    _id           : new MTypes.ObjectId(),
                    i_id       : itid,
                    i_name     : name,
                    i_quantity : quantity,
                    i_price    : price
                });
                doc.bill_items.push(item);
                debug(doc.bill_items[doc.items_count]);
                var subdoc = doc.bill_items[doc.items_count];
                subdoc.isNew;
                doc.items_count += 1;
                doc.save(function (err) {
                    if (err) return handleError(err);
                    item.save(function(err){
                    if (err) return handleError(err);
                    });
                });
                debug("Added item: " + doc.items_count);
                resolve(item);
            }
        });
    });
  }

function createItem(data) {
    debug("createItem: SessionID: "+data.session_id + "price, name, quantity");
    addItemToDB(data.session_id, data.price, data.name, data.quantity).then(function (item_response) {
        sendItem(item_response, data.session_id);
    });
}

function deleteItem(data) {
    debug("deleteItem: SessionID: "+data.session_id+" ItemID: "+data.item_id);
    Bills.findOne({bill_id: session_id}, function(err, doc){
        var itid = session_id+getItemId();
        var item = new Items({
            _id           : new MTypes.ObjectId(),
            i_id       : itid,
            i_name     : name,
            i_quantity : quantity,
            i_price    : price
        });
        doc.bill_items.push(item);
        var subdoc = doc.bill_items[doc.items_count];
        subdoc.isNew;
        doc.items_count += 1;
        doc.save(function (err) {
            if (err) return handleError(err);
            item.save(function(err){
            if (err) return handleError(err);
            });
        });
        debug("Added item: " + doc.items_count);
        resolve(item);
    });
}

function editItem(data) {
    debug("editItem: SessionID: "+data.session_id+" Price: "+data.price+" Name: "+data.name+" Quantity: "+data.quantity+" ItemID: "+data.item_id);
}

function sendItem (item, session_id) {
    debug("Sending Item for session: " + session_id);
    debug(item);
    var emItem = calculateQuantity(item);
    var response = {
        data: {
          type: 'new_item',
          id: 0,
          attributes: {
            session_id: session_id,
            item: emItem
          }
        }
      };
    io.emit("sendItem", response);
}

function calculateQuantity(item) {
    return item;
}



// io.sockets.on('connection', function (socket) {
// socket.emit('news', { hello: 'world' });
// socket.on('item', function (data) {
//     console.log(data);
// });
// });