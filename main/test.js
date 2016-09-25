var Trello = require("node-trello");


var t = new Trello("8cc8628f4181942ea4378ceca1392edd", "ffdc187503d539ff47650c12ef89db14d37bb85263c919803efe2f920456f1c7");

                var newCard = {
                	name: "nameTestIrvin",
                	desc: "descTest",
                	idList: "57e6c7b4c816a7f374bd8c12",
                	pos: 'top'
                };

                t.post("/1/cards/", newCard, function(err, data) {
                	if (err) {
                		throw err;
                	}

                	console.log(data.name);

                });