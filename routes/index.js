var express = require("express");
var router = express.Router();
var plotly = require('plotly')("maxisses", "vDdJG91O2qeXQupMTk6I");

// get into watson natural language clf for GoT Special
let NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');
let naturalLanguageClassifier = new NaturalLanguageClassifierV1({
    iam_apikey: "ME1iSBz_j_rXdCKdFytUzS8dCqokgmeR6G4y5_GQcZAV"
});

// fetch the url of the service to call when generating text
var gpt2serviceurl = process.env.GPT2SERVICEURL

// Main Route
router.get("/", function(req, res){
    res.redirect("/about");
});

router.get("/about", function(req, res){
    res.render("about");
});

let predictions = []
let plotmeta = []
router.get("/got", function(req, res){
    res.render("got", {predictions: predictions, plotmeta:plotmeta});
});

router.post("/got", function(req, res){
    let texttoclf = req.body.texttoclf;
    naturalLanguageClassifier.classify({
        text: texttoclf,
        classifier_id: '1da3bfx691-nlc-286' },
        function(err, response) {
        if (err){
            console.log('error:', err);
            let watson = "nothing to display"
        }else{
            let watson = JSON.parse(JSON.stringify(response, null, 2))
            console.log(watson)
            predictions.unshift(watson)
            
            var data = [
                {
                  x: [watson.classes[0].class_name, watson.classes[1].class_name, watson.classes[2].class_name,watson.classes[3].class_name, watson.classes[4].class_name, watson.classes[5].class_name,watson.classes[6].class_name, watson.classes[7].class_name, watson.classes[8].class_name,watson.classes[9].class_name],
                  y: [watson.classes[0].confidence, watson.classes[1].confidence, watson.classes[2].confidence,watson.classes[3].confidence, watson.classes[4].confidence, watson.classes[5].confidence,watson.classes[6].confidence, watson.classes[7].confidence, watson.classes[8].confidence,watson.classes[9].confidence],
                  type: "bar"
                }
                ];

                var layout= {
                    plot_bgcolor:"#e9ecef",
                    paper_bgcolor: "#e9ecef"
                };

                var graphOptions = {layout: layout, filename: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), fileopt: "overwrite"};
                console.log(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
                plotly.plot(data, graphOptions, function (err, msg) {
                    plotmeta.unshift(msg)
                    console.log(msg);
                    
                });
        }
    });
    setTimeout((function() {res.render("got", {predictions:predictions, plotmeta:plotmeta})}), 4000);
});

router.get("/gotgpt2", function(req, res){
    res.render("gotgpt2", {gpt2serviceurl: gpt2serviceurl});
});

router.get("/healthz", function(req, res){
    // comes with passport
    res.writeHead(200);
})

module.exports = router;