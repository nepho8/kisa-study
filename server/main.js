import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup
    Meteor.setInterval(timerFunction, 2000);
});

function timerFunction() {
    console.log("run");
    
}