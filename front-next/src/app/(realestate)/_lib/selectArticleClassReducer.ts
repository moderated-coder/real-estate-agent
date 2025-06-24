export const selectArticleClassReducer = (state: string, action: { type: string }) => {
  switch (action.type) {
    case "SELECT_VILLA":
    case "SELECT_OFFICETEL":
    case "SELECT_ONE_ROOM":
    case "SELECT_ALL":
      return action.type;
    default:
      return state;
  }
};
