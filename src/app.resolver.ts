import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { UpdateUserObjectInput, UserObject, UserObjectInput } from './gql-dtos';
import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => Boolean)
  isWorking(): boolean {
    return true;
  }

  @Mutation(() => String)
  createUser(@Args('input') userDto: UserObjectInput): string {
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
