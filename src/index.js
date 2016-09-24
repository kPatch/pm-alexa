// This code sample shows how to call and receive external rest service data, within your skill Lambda code.

// var AWS = require('aws-sdk');

var https = require('https');

exports.handler = function( event, context ) {
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

                var post_options = { 
                    host:  'rmwum5l4zc.execute-api.us-east-1.amazonaws.com', 
                    port: '443', 
                    path: '/prod/stateresource', 
                    method: 'POST', 
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Content-Length': Buffer.byteLength(JSON.stringify(post_data)) 
                    } };
                      var post_req = https.request(post_options, function(res) { 
                        res.setEncoding('utf8'); 
                        var returnData = ""; 
                        res.on('data', function (chunk) { 
                            returnData += chunk; 
                        }); 
                        res.on('end', function () {
                            // returnData: {"usstate":"Delaware","attributes":[{"population":900000},{"rank":45}]}

                            pop = JSON.parse(returnData).attributes[0].population;

                            say = "The population of " + myState + " is " + pop;

                            // add the state to a session.attributes array
                            if (!sessionAttributes.requestList) {
                                sessionAttributes.requestList = [];
                            }
                            sessionAttributes.requestList.push(myState);

                            // This line concludes the lambda call.  Move this line to within any asynchronous callbacks that return and use data.
                            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });

                        }); 
                       });
                  post_req.write(JSON.stringify(post_data));
                 post_req.end();

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