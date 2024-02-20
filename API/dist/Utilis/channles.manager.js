"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupChatOperations = void 0;
var GroupChatOperations;
(function (GroupChatOperations) {
    GroupChatOperations["ADD"] = "ADD";
    GroupChatOperations["DELETE"] = "DELETE";
    GroupChatOperations["UPDATE"] = "UPDATE";
})(GroupChatOperations || (exports.GroupChatOperations = GroupChatOperations = {}));
function ChannelManager() {
    const JOINED_CHATS = {};
    const AddCurrentConnection = (connection_id) => {
        // Si el objeto en el key está vacío entonces agregamos un array vacío
        if (!JOINED_CHATS[connection_id]) {
            JOINED_CHATS[connection_id] = [];
        }
    };
    const ValidateBeforeJoinToRoom = (connection_id, room, guid, isCreating, callback) => {
        // verifica si la conección actul se encuentra subscrita 
        // a un determinado room/chat
        if (JOINED_CHATS[connection_id] && JOINED_CHATS[connection_id].find((m) => m.chatId === room)) {
            if (isCreating) {
                console.log(`User ${guid} #${connection_id} has already created this room/chat ${room}`);
            }
            else {
                console.log(`User ${guid} #${connection_id} is already joined to room/chat ${room}`);
            }
        }
        else {
            // Si el objeto en el key está vacío entonces agregamos un array vacío
            if (!JOINED_CHATS[connection_id]) {
                JOINED_CHATS[connection_id] = [];
            }
            JOINED_CHATS[connection_id].push({
                guid,
                chatId: room
            });
            //console.log("JOINED_CHATS =>",JOINED_CHATS);
            // tras estas condiciones permite al usuario logeado conectarse con un room
            // lo que le va a permitir emitir mensajes a dicho room
            callback();
        }
    };
    const GetCurrentConnections = () => {
        return Object.keys(JOINED_CHATS);
    };
    const GetRoomsByGUID = (user_guid) => {
        const transformedObject = {};
        // Iterar sobre el objeto original
        for (const userId in JOINED_CHATS) {
            // Obtener el array de chatIds para este userId
            const chatIdArray = JOINED_CHATS[userId];
            // Iterar sobre cada entrada del array de chatIds
            chatIdArray.forEach(entry => {
                // Obtener el guid y chatId
                const { guid, chatId } = entry;
                if (guid === user_guid) {
                    // Si ya existe una entrada para este guid, agregamos el chatId al array existente
                    if (transformedObject[guid]) {
                        transformedObject[guid].push(chatId);
                    }
                    else {
                        // Si no existe una entrada para este guid, creamos un nuevo array con el chatId
                        transformedObject[guid] = [chatId];
                    }
                }
            });
        }
        return transformedObject;
    };
    return {
        JOINED_CHATS,
        ValidateBeforeJoinToRoom,
        GetRoomsByGUID,
        GetCurrentConnections,
        AddCurrentConnection
    };
}
exports.default = ChannelManager;
