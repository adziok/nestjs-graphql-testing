import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql';



@InputType('UserLocationObjectInput')
@ObjectType()
export class UserLocationObject {
  @Field()
  country: string;

  @Field({ nullable: true })
  city: string;
}

@InputType()
export class UserObjectInput {
  @Field()
  name: string;

  @Field(() => UserLocationObject)
  location: UserLocationObject;
}

@InputType()
export class UpdateUserObjectInput extends PartialType(UserObjectInput) {}

@ObjectType()
export class UserObject {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => UserLocationObject)
  location: UserLocationObject;
}

@ObjectType()
export class UserCreatedNotification {
  @Field(() => ID)
  id: string;
}

@ObjectType()
export class UserDeletedNotification {
  @Field(() => ID)
  id: string;
}

@InputType()
export class UserCreatedSubscriptionInput  {
  @Field()
  onlyIfNameContains: string
}