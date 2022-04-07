import { Resolver } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => Boolean)
  isWorking(): boolean {
    return true;
  }
}
