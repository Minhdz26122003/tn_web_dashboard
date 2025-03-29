class AccountModel {
  constructor(
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
    status
  ) {
    this.uid = uid;
    this.username = username;
    this.email = email;
    this.password = password;
    this.phonenum = phonenum;
    this.address = address;
    this.fullname = fullname;
    this.birthday = birthday;
    this.avatar = avatar;
    this.gender = gender;
    this.status = status;
  }
}

export default AccountModel;
