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
export class UserObject extends UserObjectInput {
  @Field(() => ID)
  id: string;
}
