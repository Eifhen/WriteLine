"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function activityLog(type, entityName, entityMethod, object) {
    if (entityMethod) {
        console.log('info', `El ${type} ${entityName} ha ejecutado el metodo ${entityMethod}`, object);
    }
    else if (entityMethod === undefined) {
        console.log("info", `El ${type} ${entityName} se ha ejecutado`);
    }
}
exports.default = activityLog;
