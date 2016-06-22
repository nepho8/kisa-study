import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
var Qrcodesvg = require("qrcodesvg");
var BitcoinAddress = require("bitcoin-address");

import './main.html';

UI.registerHelper('qrcode', function(id, text) {
    if (text) {
        $('#' + id).html(text);
    }
});

Template.hello.onCreated(function helloOnCreated() {
    Wallet = new Meteor.Collection('Wallet');
    mywallet = Meteor.subscribe('mywallet');
});

Template.hello.rendered = function helloOnRendered() {
    if (!this._rendered) {
        this._rendered = true;
        console.log('Template onLoad');
        //$('#wallet_qrcode').html();
    }
};

Template.hello.helpers({
    wallet_address_qr() {
        if (mywallet.ready()) {
            var address = Wallet.findOne({})._id;
            var qrcode = new Qrcodesvg("bitcoin:" + address, 200, {
                "ecclevel": 2
            });
            var data = qrcode.generate({
                "method": "classic",
                "fill-colors": ["skyblue", "pink", "hotpink"]
            }, {
                "stroke-width": 1
            });
            return data;
        }
    },
    wallet_address() {
        if (mywallet.ready())
            return Wallet.findOne({})._id;
    },
    wallet_history() {
        if(mywallet.ready()) {
            if(Session.get('wallet_history')) {
                return Session.get('wallet_history');
            }
            var walletAddress = Wallet.findOne({})._id;
            walletAddress = '15VScaUh8f9iP86y3GZGDgoh54dW5f7H1W';
            Meteor.call('walletHistory', walletAddress, function(error, result) {
                if(result) {
                    console.log('result', result);
                    Session.set('wallet_history', result);
                }
            });
        }
    }
});

Template.hello.events({
    'click #send' (event, instance) {
        console.log('send');
        console.log($('#send_address').val());
        console.log($('#send_balance').val());

        var send_address = $('#send_address').val();
        var send_balance = $('#send_balance').val();

        if(BitcoinAddress.validate(send_address)) {
            console.log('pass');
        } else {
            alert('올바른 비트코인 주소를 입력해주세요.');
            return;
        }

        if(isNaN(send_balance) || !(send_balance >= 0.0001)) {
            alert('올바른 금액을 입력해주세요.');
            return;
        }

        var privateKey = Wallet.findOne().privateKey;
        console.log('privateKey', privateKey);
    },
    'click a[name=history]' (event, instance) {
        console.log('clicked');
        console.log(event.currentTarget.innerHTML);
        console.log(instance);

        
    }
});
