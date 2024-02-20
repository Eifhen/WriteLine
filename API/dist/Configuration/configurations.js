"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentStates = void 0;
const dotenv = require("dotenv");
const path = require('path');
var EnvironmentStates;
(function (EnvironmentStates) {
    EnvironmentStates["DEVELOPMENT"] = "development";
    EnvironmentStates["PRODUCTION"] = "production";
})(EnvironmentStates || (exports.EnvironmentStates = EnvironmentStates = {}));
function Configuration() {
    dotenv.config();
    process.env.NODE_ENV = EnvironmentStates.PRODUCTION; // development || production
    const envPath = path.resolve(__dirname, '../..');
    if (process.env.NODE_ENV === EnvironmentStates.PRODUCTION) {
        dotenv.config({ path: path.resolve(envPath, '.env.production') });
    }
    else {
        dotenv.config({ path: path.resolve(envPath, '.env.development') });
    }
    function DeployConfigurations(app, express) {
        const __dirname1 = path.resolve();
        const uiPath = path.join(__dirname1, '../UI/dist');
        const uiProyectPath = path.resolve(__dirname1, "..", "UI", "dist", "index.html");
        // console.log("paths dirname 1 =>", __dirname1);
        // console.log("paths uiPath  =>", uiPath);
        // console.log("paths uiProyectPath  =>", uiProyectPath);
        if (process.env.NODE_ENV === EnvironmentStates.PRODUCTION) {
            app.use(express.static(uiPath));
            app.get("*", (req, res) => {
                // Servimos el archivo index.html cuando se haga un request
                res.sendFile(uiProyectPath);
            });
        }
        else {
            app.get("/", (req, res) => {
                res.send("API is Running Successfully");
            });
        }
    }
    return {
        port: process.env.PORT,
        enviroment: process.env.NODE_ENV,
        connectionString: process.env.CONNECTION_STRING,
        apikey: process.env.WRITELINE_APIKEY,
        apikeyHeader: process.env.API_KEY_HEADER,
        autorizationHeader: process.env.AUTORIZATION_HEADER,
        autenticationKey: process.env.AUTENTICATION_KEY,
        autorizationKey: process.env.AUTORIZATION_KEY,
        tk_key: process.env.TK_KEY,
        Deploy: DeployConfigurations,
    };
}
exports.default = Configuration;
