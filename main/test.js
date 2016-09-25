var Trello = require("node-trello");


var t = new Trello("8cc8628f4181942ea4378ceca1392edd", "ffdc187503d539ff47650c12ef89db14d37bb85263c919803efe2f920456f1c7");

var newCard = {
	name: "nameTestIrvin",
	desc: "descTest",
	idList: "57e6c7b4c816a7f374bd8c12",
	pos: 'top'
};

// t.post("/1/cards/", newCard, function(err, data) {
// 	if (err) {
// 		// throw err;
//         console.log(err.responseBody);
// 	} else {
//         console.log(data.name);
//     }                	
// });


// t.post("/1/cards/", newCard, function(err, data) {
//     if (err) {
//         // throw err;
//         console.log(err.responseBody);
//         pop = err.responseBody;

//         // say = "Error " + name + "with description" + desc + " was successfully created in Trello!";

//         // add the state to a session.attributes array
//         //if (!sessionAttributes.requestList) {
//             //sessionAttributes.requestList = [];
//         //}
//         //sessionAttributes.requestList.push(myState);

//         // This line concludes the lambda call.  Move this line to within any asynchronous callbacks that return and use data.
//         // context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
//     }
//     else {
//         console.log(data.name);

//         pop = data.name;

//         // say = "Card " + name + "with description" + desc + " was successfully created in Trello!";

//         // add the state to a session.attributes array
//         //if (!sessionAttributes.requestList) {
//             //sessionAttributes.requestList = [];
//         //}
//         //sessionAttributes.requestList.push(name);

//         // This line concludes the lambda call.  Move this line to within any asynchronous callbacks that return and use data.
//         // context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
//     }


// });


t.put('/1/cards/57e6dd7efbe06fd411473922', {name: 'Emily is learning'}, function(err, data) {
    if (err) {
        // throw err;
        console.log("ERROR: " + err.responseBody);
        pop = err.responseBody;

        // say = "Card name has been changed to" + name + "successfully!";

        // // add the state to a session.attributes array
        // if (!sessionAttributes.requestList) {
        //     sessionAttributes.requestList = [];
        // }
        // sessionAttributes.requestList.push(name);

        // // This line concludes the lambda call.  Move this line to within any asynchronous callbacks that return and use data.
        // context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
    }
    else {
        console.log(data.name);

        // pop = data.name;

        // say = "Card name has been changed to" + name + "successfully!";

        // // add the state to a session.attributes array
        // if (!sessionAttributes.requestList) {
        //     sessionAttributes.requestList = [];
        // }
        // sessionAttributes.requestList.push(name);

        // // This line concludes the lambda call.  Move this line to within any asynchronous callbacks that return and use data.
        // context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
    }
});