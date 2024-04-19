const { trimStr } = require('./utils');
let users = [];

const findUser = (user) => {
  const userName = trimStr(user.name);
  const room = trimStr(user.room);

  return users.find((user) => 
    trimStr(user.name) === userName && trimStr(user.room) === room
  );
}

const addUser = (user) => {

  const isExist = findUser(user);

  !isExist && users.push(user);

  const currentUser = isExist || user;

  return { isExist: !!isExist, user: currentUser };
}

const getRoomUsers = (room) => users.filter((user) => trimStr(user.room) === trimStr(room));


module.exports = { addUser, findUser, getRoomUsers };