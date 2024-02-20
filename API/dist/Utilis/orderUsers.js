"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderUsers = void 0;
/**
  Este método sirve para ordenar los usuarios que existen en una lista
  de chats, la idea es que el primer usuario de cada chat sea el admin
  @param chats - IChatModel[]
  @return IChatModel[] - Arreglo de chats con los usuarios ordenados por admin
*/
function OrderChatsUsers(chats) {
    return chats.map(chat => {
        var _a;
        const admin = (_a = chat.groupAdmin) === null || _a === void 0 ? void 0 : _a.id;
        if (admin && chat.isGroupChat) {
            const adminIndex = chat.users.findIndex(m => m._id.equals(admin));
            if (adminIndex !== -1) {
                const adminUser = chat.users.splice(adminIndex, 1)[0];
                chat.users.unshift(adminUser);
            }
        }
        return chat;
    });
}
exports.default = OrderChatsUsers;
/**
  Este método sirve para ordenar por admin los usuarios que
  existen en un chat expecifico
  
  @params chat - IChatModel
  @return IChatModel - Chat con los usuarios ordenados por admin
 */
function OrderUsers(chat) {
    var _a;
    const admin = (_a = chat.groupAdmin) === null || _a === void 0 ? void 0 : _a.id;
    if (admin && chat.isGroupChat) {
        const adminIndex = chat.users.findIndex(m => m._id.equals(admin));
        if (adminIndex !== -1) {
            const adminUser = chat.users.splice(adminIndex, 1)[0];
            chat.users.unshift(adminUser);
        }
    }
    return chat;
}
exports.OrderUsers = OrderUsers;
