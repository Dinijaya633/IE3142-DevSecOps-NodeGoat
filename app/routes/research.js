const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require("needle");
const {
    environmentalScripts
} = require("../../config/config");

function ResearchHandler(db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

        this.displayResearch = (req, res) => {

        if (req.query.symbol) {
            // Fix for A10 - SSRF - validate url against allowlist before fetching
            const allowedHosts = ["finance.yahoo.com"];
            const userUrl = req.query.url;

            let parsedUrl;
            try {
                parsedUrl = new URL(userUrl);
            } catch (e) {
                return res.status(400).send("Invalid URL");
            }

            if (parsedUrl.protocol !== "https:" || !allowedHosts.includes(parsedUrl.hostname)) {
                return res.status(400).send("URL not permitted");
            }

            const url = userUrl + encodeURIComponent(req.query.symbol);

            return needle.get(url, (error, newResponse, body) => {
                if (!error && newResponse.statusCode === 200) {
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                }
                res.write("<h1>The following is the stock information you requested.</h1>\n\n");
                res.write("\n\n");
                if (body) {
                    res.write(body);
                }
                return res.end();
            });
        }

        return res.render("research", {
            environmentalScripts
        });
    };
}

module.exports = ResearchHandler;
