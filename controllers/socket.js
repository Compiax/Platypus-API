/**
 * @file This file implements the defined routes for use by the mobile
 * componant.
 */
var debug = require('debug')('platypus-api:controllers:mobile');
var io = require('socket.io').listen(3002);
var Bills = require('../models/bills');
var Users = require('../models/users');
var Items = require('../models/items');
var Claims = require('../models/claims');
var mobileHelper = require('../helpers/database');
var bill_model = new Bills;
var user_model = new Users;
var item_model = new Items;
var claim_model = new Claims;
var mongoose = require('mongoose');
var MTypes = mongoose.Types;

var its = [	{price: '36.00', quantity: '3', desc: "Add Portion Chi", id: '1'},
						{price: '24.00', quantity: '1', desc: "S/Wich Bacon, A", id: '2'},
						{price: '36.00', quantity: '1', desc: "Trami Chic P/De", id: '3'},
						{price: '38.00', quantity: '1', desc: "Bacon Avo & Pep", id: '4'},
						{price: '35.00', quantity: '1', desc: "Cheese Burger", id: '5'},
						{price: '55.00', quantity: '1', desc: "Chic Schnitzel", id: '6'},
						{price: '10.00', quantity: '1', desc: "Tea Rooibos", id: '7'},
						{price: '20.00', quantity: '1', desc: "Americano Dbl", id: '8'},
						{price: '32.00', quantity: '2', desc: "330Ml Coke", id: '9'},
						{price: '16.00', quantity: '1', desc: "200Ml Tonic Wat", id: '10'},
						{price: '7.00', quantity: '1', desc: "Lime Cordial", id: '11'}];

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
	var userAmountPrev = 0;
	debug("ClaimItem: SessionID: " + data.session_id + " UserID: " + data.user_id + " ItemID: " + data.item_id);
	Users.findOne({
		u_id: data.user_id
	}).populate({
		path: 'item_claimed'
	}).exec(function (err, user) {
		for (item in user.item_claimed) {
			if (item.item_id == data.item_id) {
				userAmountPrev = item.quantity;
				item.quantity = data.quantity;
				bill.save();
				claimed = true;
			}
		}
		if (!claimed) {
			var claim = new Claims({
				_id: new MTypes.ObjectId(),
				item_id: data.item_id,
				quantity: data.quantity
			});
			user.item_claimed.push(claim);
			var subdoc = user.item_claimed[user.item_claimed.length - 1];
			subdoc.isNew;
			claim.save(function (err) {
				if (err) return handleError(err);
			});
			user.save();
		}
	});
	// Bills.findOne({bill_id: data.session_id.toLowerCase()}).populate({path:'users'}).exec(function (err, bill) {
	//     debug(bill.users[bill.users.length -1]);
	// });
	Items.findOne({
		i_id: data.item_id
	}, function (err, doc) {
		if (doc) {
			doc.i_quantity = doc.i_quantity - (data.quantity - userAmountPrev);
			doc.save(function (err) {
				if (!err) {
					sendItem(doc, data.session_id.toLowerCase());
				}
			});
		}
	});
};

function unclaimItem(data) {
	Items.findOne({
		i_id: data.item_id
	}, function (err, doc) {
		doc.i_quantity = doc.i_quantity + 1;
		doc.save();
	});
};

function deleteItem() {
	mobileHelper.bill.deleteItem();
}

function getItemId(num) {
	var new_iID = (num + 1).toString();

	if (new_iID.length < 2) {
		new_iID = 'i0' + new_iID;
	} else {
		new_iID = 'i' + new_iID;
	}
	return new_iID;
}

function createItem(data) {
	debug("createItem: SessionID: " + data.session_id + "price, name, quantity");
	mobileHelper.bill.addItemToDB(data.session_id, data.price, data.name, data.quantity).then(function (item_response) {
		mobileHelper.bill.calculateTotal.then(function(bill_total) {
			mobileHelper.bill.calculateClaimedTotal.then(function(bill_total_claimed) {
				sendItem(item_response, data.session_id, bill_total, bill_total_claimed);
			});
		});
	});
}

function editItem(data) {
	debug("editItem: SessionID: " + data.session_id + " Price: " + data.price + " Name: " + data.name + " Quantity: " + data.quantity + " ItemID: " + data.item_id);
}

function sendItem(item, session_id) {
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