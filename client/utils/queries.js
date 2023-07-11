export const GetUserByName = (name) => {
  const query = `*[_type == 'user' && userName == '${name}']`;
  return query;
};

export const getAllUsers = () => {
  const query = `*[_type == 'user']`;
  return query;
};
