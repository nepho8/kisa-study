import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Wallets = new Meteor.Collection('wallets');

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
  Meteor.subscribe("wallets");
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  balance() {
   return CoinStack.Math.toBitcoin( Wallets.findOne({}).balance );
  }
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    //instance.counter.set(instance.counter.get() + 1);

    var privateKey = CoinStack.ECKey.createKey();
    $('#qrcode').qrcode({width: 256,height: 256,text: privateKey});
  },
});
