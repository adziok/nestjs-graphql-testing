import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import {
  UpdateUserObjectInput,
  UserCreatedSubscriptionInput,
  UserDeletedNotification,
  UserObject,
  UserObjectInput,
} from './gql-dtos';
import { AppService } from './app.service';
import {
  pubSub,
  USER_CREATED_SUB,
  USER_REMOVED_SUB,
} from './subscriptions-consts';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Subscription(() => UserObject, {
    filter: (
      payload: UserObject,
      variables: { filter: UserCreatedSubscriptionInput },
    ) => payload.name.includes(variables.filter.onlyIfNameContains),
    resolve: (payload) => payload,
  })
  userCreated(@Args('filter') filter: UserCreatedSubscriptionInput) {
    return pubSub.asyncIterator(USER_CREATED_SUB);
  }

  @Subscription(() => UserDeletedNotification)
  userDeleted() {
    return pubSub.asyncIterator(USER_REMOVED_SUB);
  }

  @Query(() => Boolean)
  isWorking(): boolean {
    return true;
  }

  @Mutation(() => String)
  createUser(@Args('input') userDto: UserObjectInput): Promise<string> {
    return this.appService.createUser(userDto);
  }

  @Mutation(() => String)
  updateUser(
    @Args('userId') userId: string,
    @Args('input') userDto: UpdateUserObjectInput,
  ): string {
    return this.appService.updateUser(userId, userDto);
  }

  @Mutation(() => String)
  deleteUser(@Args('userId') userId: string): string {
    return this.appService.deleteUser(userId);
  }

  @Query(() => [UserObject])
  listUsers(): UserObject[] {
    return this.appService.listUsers();
  }
}
