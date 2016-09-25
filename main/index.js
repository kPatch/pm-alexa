var https = require('https');
var Trello = require("node-trello");


// var t = new Trello("8cc8628f4181942ea4378ceca1392edd", "ffdc187503d539ff47650c12ef89db14d37bb85263c919803efe2f920456f1c7");

// t.get("/1/members/me", function(err, data) {
//   if (err) throw err;
//   console.log(data);
// });
 
// // URL arguments are passed in as an object. 
// t.get("/1/members/me", { cards: "open" }, function(err, data) {
//   if (err) throw err;
//   console.log(data);
// });

// t.put("/1/cards/57e6dd7efbe06fd411473922",  { name: "Emily is Cranky"}, function(err, data) {
//   if (err) throw err;
//   console.log(data.desc);
// });


exports.handler = function( event, context ) {

	var t = new Trello("8cc8628f4181942ea4378ceca1392edd", "ffdc187503d539ff47650c12ef89db14d37bb85263c919803efe2f920456f1c7");


    var say 	= "";
    var shouldEndSession 	= false;
    var sessionAttributes 	= {};
    var name 	= "";
    var idList 	= "";
    var desc 	= "";
    var pop 	= 0;
    var rank 	= 0;

    if (event.session.attributes) {
        sessionAttributes = event.session.attributes;
    }

    if (event.request.type === "LaunchRequest") {
        say = "Welcome to Project Manager Alexa. How can I help?";
        context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });

    } else {
        var IntentName = event.request.intent.name;

        if (IntentName === "CreateCardIntent") {

            if (event.request.intent.slots.name.value && event.request.intent.slots.idlist.value && event.request.intent.slots.desc.value) {

                name 	= event.request.intent.slots.name.value;
                idList 	= event.request.intent.slots.idlist.value;
                desc 	= event.request.intent.slots.desc.value;


                if(idList.toUpperCase() === 'TO DO'){
                	idList = '57e73caa9d25aeb9ab64db24'; // To Do
                } else if(idList.toUpperCase() === 'DEVELOPMENT') {

                } else if(idList.toUpperCase() === 'TESTING') {

                } else if(idList.toUpperCase() === 'DONE') {

                } else {
                	idList = '57e73caa9d25aeb9ab64db24'; //Development
                }

                var newCard = {
                	name: name,
                	desc: desc,
                	idList: idList,
                	pos: 'top'
                };

                t.post("/1/cards/", newCard, function(err, data) {
                	if (err) {
                		throw err;
                	}

                	console.log(data.name);

  					pop = data.name;

                   	say = "Card with name: " + pop + " was successfully created in Trello!";

                    // add the state to a session.attributes array
                    if (!sessionAttributes.requestList) {
                        sessionAttributes.requestList = [];
                    }
                    sessionAttributes.requestList.push(myState);

                    // This line concludes the lambda call.  Move this line to within any asynchronous callbacks that return and use data.
                    context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });

                });
            }

        } else if (IntentName === "AMAZON.StopIntent" || IntentName === "AMAZON.CancelIntent") {
            say = "You asked for " + sessionAttributes.requestList.toString() + ". Thanks for playing!";
            shouldEndSession = true;
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });


        } else if (IntentName === "AMAZON.HelpIntent" ) {
            say = "Just say the name of a U.S. State, such as Massachusetts or California."
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });

        }
    }
};


function buildSpeechletResponse(say, shouldEndSession) {
    return {
        outputSpeech: {
            type: "SSML",
            ssml: "<speak>" + say + "</speak>"
        },
        reprompt: {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>Please try again. " + say + "</speak>"
            }
        },
        card: {
            type: "Simple",
            title: "My Card Title",
            content: "My Card Content, displayed on the Alexa App or alexa.amazon.com"
        },
        shouldEndSession: shouldEndSession
    };
}