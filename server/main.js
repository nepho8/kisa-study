import { Meteor } from 'meteor/meteor';

var accessKey = "80d1b821dcb89f965452de4ebbf7ae";
var secretKey = "55e2b5ac1bb4a0486b477926efa8bc";
client = new CoinStack(accessKey, secretKey);

Meteor.startup(function() {
    // code to run on server at startup
    Wallet = new Meteor.Collection('Wallet');
    Exchange = new Meteor.Collection('Exchange');
    var privateKey = CoinStack.ECKey.createKey();
    var walletAddress = CoinStack.ECKey.deriveAddress(privateKey);
    Wallet.insert({
        _id: walletAddress,
        privateKey: privateKey,
        createAt: new Date()
    });

    Meteor.setInterval(updateBTCPrice, 7000);
    Meteor.setInterval(updateBTCBalance, 5000);

    Meteor.publish('mywallet', function tasksPublication() {
        return Wallet.find({}, { sort: { createAt: 1 }, limit: 1 });
    });
});

function updateBTCPrice() {
    var url = 'https://api.bithumb.com/public/ticker';
    var result = Meteor.http.get(url, {timeout:30000});
    if(result.statusCode==200) {
        var respJson = JSON.parse(result.content);
        //console.log('response received: ', respJson.data);
        Exchange.upsert('bithumb', respJson.data);
    } else {
        console.log('Response issue: ', result.statusCode);
        var errorJson = JSON.parse(result.content);
        throw new Meteor.Error(result.statusCode, errorJson.error);
    }
}

function updateBTCBalance() {
    var walletAddress = Wallet.findOne({}, { sort: { createAt: 1 } })._id;
    var walletBalance = client.getBalanceSync(walletAddress);
    console.log(walletAddress);

    Wallet.update(walletAddress, { '$set': {
        balance: walletBalance
    }});
}

Meteor.methods({
    walletHistory: function(walletAddress) {
        console.log('walletAddress', walletAddress);
        var result = client.getTransactionsSync(walletAddress);
        return result;
    },
    walletHistoryDetail: function(transactionId) {
        console.log('walletHistoryDetail', transactionId);
    }
});
