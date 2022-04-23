import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql';

@InputType('CountryObjectInput')
@ObjectType()
export class CountryObject {
  @Field()
  name: string;

  @Field()
  code: string;
}

@InputType('UserLocationObjectInput')
@ObjectType()
export class UserLocationObject {
  @Field(() => CountryObject)
  country: CountryObject;

  @Field({ nullable: true })
  city: string;
}

@InputType('UserBestFriendObjectInput')
@ObjectType()
export class UserBestFriendObject {
  @Field()
  name: string;

  @Field(() => UserLocationObject)
  location: UserLocationObject;
}

@InputType()
export class UserObjectInput {
  @Field()
  name: string;

  @Field(() => UserLocationObject)
  location: UserLocationObject;

  @Field(() => UserBestFriendObject)
  bestFriend: UserBestFriendObject;
}

@InputType()
export class UpdateUserObjectInput extends PartialType(UserObjectInput) {}

@ObjectType()
export class UserObject {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => UserBestFriendObject)
  bestFriend: UserBestFriendObject;

  @Field(() => UserLocationObject)
  location: UserLocationObject;
}
