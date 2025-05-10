class AccountModel {
  constructor({
    uid,
    username,
    email,
    password,
    phonenum,
    address,
    fullname,
    birthday,
    avatar,
    gender,
    status,
  }) {
    Object.assign(this, {
      uid,
      username,
      email,
      password,
      phonenum,
      address,
      fullname,
      birthday,
      avatar,
      gender,
      status,
    });
  }
}

export default AccountModel;
