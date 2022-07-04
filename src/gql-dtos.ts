export class UserLocationObject {
  country: string;

  city: string;
}

export class UserObjectInput {
  name: string;

  location: UserLocationObject;
}

export class UpdateUserObjectInput extends UserObjectInput {}

export class UserObject {
  id: string;

  name: string;

  location: UserLocationObject;
}
