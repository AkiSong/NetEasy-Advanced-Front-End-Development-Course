function chatlog(state=[], action) {
  const { type, payload } = action;
  switch (type) {
    case 'ADD_CHAT':
      return [...state, payload]
    default:
      return state
  }
}

export default chatlog