module.exports = class UserDto {
  email;
  id;
  isActivated;
  roleName;
  address;
  firstName;
  lastName;

  constructor(model, roleName) {
    this.email = model.email
    this.id = model.id
    this.isActivated = model.isActivated
    this.firstName = model.firstName
    this.lastName = model.lastName
    this.address = model.address
    this.roleName = roleName
  }
}
