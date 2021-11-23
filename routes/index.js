var express = require("express");
var router = express.Router();
var plotly = require('plotly')("maxisses", "vDdJG91O2qeXQupMTk6I");

// get into watson natural language clf for GoT Special
const NaturalLanguageClassifierV1 = require('ibm-watson/natural-language-classifier/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageClassifier = new NaturalLanguageClassifierV1({
    authenticator: new IamAuthenticator({
      apikey: 'cMkcbd0Wz_qGlDHybPYlqsUNJpqnM80hNIwre-mFPGLg',
    }),
    serviceUrl: 'https://api.us-south.natural-language-classifier.watson.cloud.ibm.com/instances/5e28bcf8-775d-44ac-a8dd-6d57d6e25792',
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
    const classifyParams = {
        text: texttoclf,
        classifierId: '1da3bfx691-nlc-286',
      };
      
    naturalLanguageClassifier.classify(classifyParams)
        .then(response => {
            const classification = response.result;
            let watson = JSON.parse(JSON.stringify(classification, null, 2))
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
        })
        .catch(err => {
            console.log('error:', err);
        });
/*     naturalLanguageClassifier.classify({
        text: texttoclf,
        classifier_id: '1da3bfx691-nlc-286'},
        function(err, response) {
        if (err){
            console.log(texttoclf)
            console.log('error:', err);
            console.log('response:', response);
            let watson = "nothing to display"
        }else{
            let watson = JSON.stringify(response, null, 2)
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
    }); */
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