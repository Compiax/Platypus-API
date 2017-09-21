var Bills     = require('../../models/bills');

module.exports.generateBillID = function () {
    var alphabet = 'abcdefghjklmnopqrstvwxyz';
    var numbers = '0123456789';
    var bill_id_temp = "";

    for (var i = 0; i < 5; i++) {
        var char_or_int = (Math.floor(Math.random() * 2));

        if (char_or_int === 0) {
            var alphabet_index = (Math.floor(Math.random() * 24));
            bill_id_temp = bill_id_temp + alphabet.charAt(alphabet_index);
        }
        else {
            var numbers_index = (Math.floor(Math.random() * 10));
            bill_id_temp = bill_id_temp + numbers.charAt(numbers_index);
        }
    }

    Bills.find({ bill_id : bill_id_temp}).exec(function(err, res) {
        if (res.length || err != null) {
            console.log('Error: Session ID exists!');
            return false;
        }
    });
    return bill_id_temp;
};

module.exports.getUserId = function (num) {
    var new_uid = (num + 1).toString();

    if (new_uid.length < 2) {
        new_uid = 'u0' + new_uid;
    }
    else {
        new_uid = 'u' + new_uid;
    }
    return new_uid;
}