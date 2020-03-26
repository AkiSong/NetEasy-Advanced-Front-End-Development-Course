import chatLog from './chatlog'
import statusMessage from './statusMessage'
import username from './username'
import {combineReducers} from 'redux'

export default combineReducers({
  statusMessage,
  username,
  chatLog
});


// export default function(state={}, action={}) {
//   return {
//     chatLog: chatLog(state.chatLog, action.chatLog),
//     chatLog: statusMessage(state.chatLog, action.chatLog),
//     chatLog: username(state.chatLog, action.chatLog)
//   };
// }