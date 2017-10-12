var mongoose	= require('mongoose');
var Bills 		= require('../../models/bills');
var Users 		= require('../../models/users');
var Items 		= require('../../models/items');
var dbutils		= require('./dbutils');
var MTypes		= mongoose.Types;
var debug			= require('debug')('platypus-api:helpers:bill');

/**
 * Function that receives the user data (Nickname and profile color) entered
 * when a user requests a new session. A new user is created. A new bill and
 * session are also created. The new user is then added to the bill.
 * @param {request} req req used by Express.js to fetch data from the client.
 * @param {response} res res used by Express.js to send responses back to the
 *                       client.
 * @param {object} next
 * @return JSON object containing session ID and user ID
 */
module.exports.createSession = function () {
	return new Promise(function (resolve, reject) {
		debug("Running Bill.Create Session");
		var b_id = dbutils.generateBillID();
		var user_added = "";

		var bill = new Bills({
			_id: new MTypes.ObjectId(),
			bill_id: b_id,
			bill_image: "",
			users_count: 0,
			items_count: 0,
			users: [],
			bill_items: [],
			bill_total: 0,
			bill_total_claimed: 0,
			bill_owner: ""
		});

		bill.save(function (err) {
			if (err) {
				/**
				 *  TODO: Create Error class for db errors
				 */
				debug(err);
			}
				resolve (b_id);
		});
	});
}

/**
 * This function is called to add a new user to the database for the current
 * bill session.
 * @param {bill_id} session_id This is the unique session ID to find the correct
 *                             Session to add the user to.
 * @param {String} nname This is the name of the new user.
 * @param {String} ucolor The color selected by the user
 */
module.exports.addUserToDB = function(session_id, nname, ucolor) {
	return new Promise(function (resolve, reject) {
		var finalid = null;
		Bills.findOne({ bill_id: session_id },
			function (err, doc) {
				if (err || doc === null) {
					console.log("Bill not found!");
					// TODO: Fix error handling
					return 0;
				}

				var bill_session = doc;
				var user_count = bill_session.users_count;
				var nickname = nname;
				var user_color = ucolor;
				var user_id = session_id + dbutils.getUserId(user_count);
				var user_owner = (user_count == 0);

				debug(user_count);
				debug("Adding user: uid = " + user_id + ", uOwner = " + user_owner + ", uNickname = " + nickname + ", uColor = " + user_color);

				var user = new Users({
					_id: new MTypes.ObjectId(),
					u_id: user_id,
					u_owner: Boolean,
					u_nickname: nickname,
					u_color: user_color
				});

				bill_session.users.push(user);
				var subdoc = bill_session.users[user_count];
				subdoc.isNew;
				bill_session.users_count = user_count + 1;
				bill_session.bill_owner = user_id;

				bill_session.save(function (err) {
					if (err) return handleError(err);
					user.save(function (err) {
						if (err) return handleError(err);
					});
				});
				debug("Added obj: " + bill_session.users[user_count - 1]);
				resolve(user_id);
			}
		);
	});
}

module.exports.removeUserFromDB = function(user_id, session_id) {
	debug("removing user " + user_id + " from session " + session_id);
	return new Promise(function (resolve) {
		var isRemoved = false;
		Bills.findOne({
			bill_id: session_id
		}, function (err, doc) {
			if (err || doc === null) {
				console.log("Bill not found!");
				// TODO: Fix error handling
				return 0;
			}

			var bill_session = doc;
			var user_count = bill_session.users_count;

			//@TODO: confirm that the following line removes the user from the DB
			bill_session.users.update({u_id: user_id}, {$unset: {field: 1}});
			isRemoved = true;
			resolve(isRemoved);
		})
	});
}

module.exports.populateItems = function(items, session_id) {
  Bills.findOne({
    bill_id: session_id
  }, function (err, doc) {
    items.forEach(function (iter) {
      debug("Loop runs");
      var itid = session_id + dbutils.getItemId(doc.items_count);
      var item = new Items({
        _id: new MTypes.ObjectId(),
        i_id: itid,
        i_name: iter.desc,
        i_quantity: iter.quantity,
        i_price: iter.price
      });
      doc.bill_items.push(item);
      var subdoc = doc.bill_items[doc.items_count];
      subdoc.isNew;
      doc.items_count += 1;
      doc.bill_total += item.i_price*item.i_quantity;
      item.save(function (err) {
        if (err){
					debug("Item Error: ");
					debug(err);
					return handleError(err);
				}
      });
    });
    doc.save(function (err) {
      if (err){
				debug("Bill Error: ");
				debug(err);
				return handleError(err);
			}
    });
    debug("Added item: " + doc.items_count);
    debug(doc.bill_items);
  });
}

module.exports.addItemToDB = function(session_id, price, name, quantity) {
	return new Promise(function (resolve, reject) {
		debug("SessionID" + session_id);
		Bills.findOne({
			bill_id: session_id
		}, function (err, doc) {
			if (doc != null) {
				var itid = session_id + dbutils.getItemId(doc.items_count + 1);
				var item = new Items({
					_id: new MTypes.ObjectId(),
					i_id: itid,
					i_name: name,
					i_quantity: quantity,
					i_price: price
				});
				doc.bill_items.push(item);
				debug(doc.bill_items[doc.items_count]);
				var subdoc = doc.bill_items[doc.items_count];
				subdoc.isNew;
				doc.items_count += 1;
				doc.save(function (err) {
					if (err) return handleError(err);
					item.save(function (err) {
						if (err) return handleError(err);
					});
				});
				debug("Added item: " + doc.items_count);
				resolve(item);
			}
		});
	});
}

module.exports.deleteItem = function(data) {
	debug("deleteItem: SessionID: " + data.session_id + " ItemID: " + data.item_id);
	Bills.findOne({
		bill_id: session_id
	}, function (err, doc) {
		var itid = session_id + dbutils.getItemId();
		var item = new Items({
			_id: new MTypes.ObjectId(),
			i_id: itid,
			i_name: name,
			i_quantity: quantity,
			i_price: price
		});
		doc.bill_items.push(item);
		var subdoc = doc.bill_items[doc.items_count];
		subdoc.isNew;
		doc.items_count += 1;
		doc.save(function (err) {
			if (err) return handleError(err);
			item.save(function (err) {
				if (err) return handleError(err);
			});
		});
		debug("Added item: " + doc.items_count);
		resolve(item);
	});
}

module.exports.calculateTotal = function(session_id) {
	return new Promise(function(resolve) {
		Bills.findOne({
			bill_id: session_id
		}, function (err, doc) {
			doc.bill_total = 0;
			doc.bill_items.forEach(function (iter) {
				doc.bill_total += iter.i_price*iter.i_quantity;
			});
			doc.save(function (err) {
				debug("Bill Save Error: ");
				debug(err);
				if (err) return handleError(err);
				resolve(doc.bill_total);
			});
			debug("Summed prices: " + doc.bill_total);
			debug(doc.bill_total);
		});
	});
}

module.exports.calculateClaimedTotal = function(session_id) {
	return new Promise(function(resolve) {
		Bills.findOne({
			bill_id: session_id
		}, function (err, doc) {
			doc.bill_total_claimed = 0;
			doc.bill_items.forEach(function (billItem) {
				Claims.findOne({
					item_id : billItem.i_id
				}, function(err, claimedItem) {
					doc.bill_total_claimed += billItem.i_price*claimedItem.quantity;
				});
			});
			doc.save(function (err) {
				debug("Bill Save Error: ");
				debug(err);
				if (err) return handleError(err);
				resolve(doc.bill_total_claimed);
			});
			debug("Summed claims prices: " + doc.bill_total_claimed);
		});
	});
}

module.exports.calculateUnclaimedTotal = function(session_id) {
	var total = calculateUnclaimedTotal(session_id);
	var claimed = calculateTotal(session_id);
	var unclaimed = total - claimed;
	Bills.findOne({
		bill_id: session_id
	}, function (err, doc) {
		doc.bill_total_unclaimed = unclaimed;
		doc.save(function (err) {
			debug("Bill save error: ");
			debug(err);
			if (err) return handleError(err);
			resolve(doc.bill_total_unclaimed);
		});
		debug("Calculated and stored unclaimed total: " + doc.bill_total_unclaimed);
	});
}

module.exports.fetchBillData = function(session_id) {
	return new Promise(function (resolve) {
		Bills.findOne({
			bill_id: session_id
		}).populate({
			path: 'bill_items'
		}).populate({
			path: 'users'
		}).exec(function (err, doc) {
			debug("session Data:");
			debug(doc);
			var response = {
				data: {
					type: 'session_data',
					id: 0,
					attributes: {
						bill: doc
					}
				}
			};
			resolve(response);
		});
	});
}

module.exports.fetchBillItems = function(session_id) {
	return new Promise(function (resolve) {
		Bills.findOne({
			bill_id: session_id
		}).populate({
			path: 'bill_items'
		}).exec(function (err, doc) {
			debug("session items:");
			debug(doc);
			var response = {
				data: {
					type: 'bill_items',
					id: 0,
					attributes: {
						items: doc.bill_items
					}
				}
			};
			resolve(response);
		});
	});
}

module.exports.fetchBillUsers = function(session_id) {
	return new Promise(function (resolve) {
		Bills.findOne({
			bill_id: session_id
		}).populate({
			path: 'users'
		}).exec(function (err, doc) {
			debug("session users:");
			debug(doc);
			var response = {
				data: {
					type: 'bill_users',
					id: 0,
					attributes: {
						users: doc.users
					}
				}
			};
			resolve(response);
		});
	});
}

module.exports.fetchBillOwner = function(session_id) {
	return new Promise(function (resolve) {
		Bills.findOne({
			bill_id: session_id
		}).populate({
			path: 'users'
		}).exec(function (err, doc) {
			debug("session owner:");
			debug(doc);
			var response = {
				data: {
					type: 'bill_users',
					id: 0,
					attributes: {
						owner: doc.users[0]
					}
				}
			};
			resolve(response);
		});
	});
}
