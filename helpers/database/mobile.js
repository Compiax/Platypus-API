var mongoose = require('mongoose');
var Bills = require('../../models/bills');
var Users = require('../../models/users');
var Items = require('../../models/items');
var MTypes = mongoose.Types;
var debug = require('debug')('platypus-api:controllers:mobile');

module.exports.generateBillID = function () {
	var alphabet = 'abcdefghjklmnopqrstvwxyz';
	var numbers = '0123456789';
	var bill_id_temp = "";

	for (var i = 0; i < 5; i++) {
		var char_or_int = (Math.floor(Math.random() * 2));

		if (char_or_int === 0) {
			var alphabet_index = (Math.floor(Math.random() * 24));
			bill_id_temp = bill_id_temp + alphabet.charAt(alphabet_index);
		} else {
			var numbers_index = (Math.floor(Math.random() * 10));
			bill_id_temp = bill_id_temp + numbers.charAt(numbers_index);
		}
	}

	Bills.find({
		bill_id: bill_id_temp
	}).exec(function (err, res) {
		if (res.length || err != null) {
			console.log('Error: Session ID exists!');
			return false;
		}
	});
	return bill_id_temp;
};

function getUserId(num) {
	var new_uid = (num + 1).toString();

	if (new_uid.length < 2) {
		new_uid = 'u0' + new_uid;
	} else {
		new_uid = 'u' + new_uid;
	}
	return new_uid;
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
			var nickname = nname;
			var user_color = ucolor;
			var user_id = session_id + getUserId(user_count);
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

			bill_session.save(function (err) {
				if (err) return handleError(err);
				user.save(function (err) {
					if (err) return handleError(err);
				});
			});
			debug("Added obj: " + bill_session.users[user_count - 1]);
			resolve(user_id);
		});
	});
}