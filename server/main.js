import { Meteor } from 'meteor/meteor';

var accessKey = "80d1b821dcb89f965452de4ebbf7ae";
var secretKey = "55e2b5ac1bb4a0486b477926efa8bc";
client = new CoinStack(accessKey, secretKey);

Wallets = new Meteor.Collection('wallets');

Meteor.publish("wallets", function () {
  return Wallets.find({});
});

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.setInterval(function(){
    console.log("hell ro world");

    updateWallet();
  }, 2000);
});

function updateWallet(){
  var balance = client.getBalanceSync("12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX");
  console.log("balance: " + CoinStack.Math.toBitcoin(balance));

  Wallets.upsert({
    _id:"12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX"
  }, {
    $set: {
      _id:"12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX",
      balance:balance
    }
  });
}
