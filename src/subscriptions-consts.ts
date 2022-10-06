import {PubSub} from "graphql-subscriptions";

export const pubSub = new PubSub();

export const USER_CREATED_SUB = 'userCreated';
export const USER_REMOVED_SUB = 'USER_REMOVED_SUB';