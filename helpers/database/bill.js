var mongoose = require('mongoose');
var Bills = require('../../models/bills');
var Users = require('../../models/users');
var Items = require('../../models/items');
var MTypes = mongoose.Types;
var debug = require('debug')('platypus-api:controllers:mobile');

module.exports.populateItems = function(items, session_id) {
  Bills.findOne({
    bill_id: session_id
  }, function (err, doc) {
    items.forEach(function (iter) {
      debug("Loop runs");
      var itid = session_id + getItemId(doc.items_count);
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
        debug("Item Error: ");
        debug(err);
        if (err) return handleError(err);
      });
    });
    doc.save(function (err) {
      debug("Bill Error: ");
      debug(err);
      if (err) return handleError(err);
    });
    debug("Added item: " + doc.items_count);
    debug(doc.bill_items);
  });
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

module.exports.addItemToDB = function(session_id, price, name, quantity) {
	return new Promise(function (resolve, reject) {
		debug("SessionID" + session_id);
		Bills.findOne({
			bill_id: session_id
		}, function (err, doc) {
			if (doc != null) {
				var itid = session_id + getItemId(doc.items_count + 1);
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
		var itid = session_id + getItemId();
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