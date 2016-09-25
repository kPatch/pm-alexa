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


    var say = "";
    var shouldEndSession = false;
    var sessionAttributes = {};
    var myState = "";
    var pop = 0;
    var rank = 0;

    if (event.session.attributes) {
        sessionAttributes = event.session.attributes;
    }

    if (event.request.type === "LaunchRequest") {
        say = "Welcome to State Pop!  Say the name of a U.S. State.";
        context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });

    } else {
        var IntentName = event.request.intent.name;

        if (IntentName === "StateRequestIntent") {

            if (event.request.intent.slots.usstate.value) {

                myState = event.request.intent.slots.usstate.value;


                // call external rest service over https post
                var post_data = {"usstate": myState};  

                t.put("/1/cards/57e6dd7efbe06fd411473922",  { name: "Emily is Cranky"}, function(err, data) {
  					if (err) throw err;
  					console.log(data.desc);

  					// pop = JSON.parse(returnData).desc;
  					pop = data.desc;

                   	say = "Trello Says: " + pop;

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