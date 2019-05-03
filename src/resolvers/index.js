import {
  extractFragmentReplacements
} from 'prisma-binding'
import Query from './query'
import auth from './mutation/auth'
import user from './mutation/user'
import ad from './mutation/ad'
import rim from './mutation/rim'
import tire from './mutation/tire'
import Subscription
from './subscription'
import User from './user'

const resolvers = {
  Query,
  Mutation: {
    ...auth,
    ...user,
    ...ad,
    ...rim,
    ...tire
  },
  // Subscription,
  User
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export {
  resolvers,
  fragmentReplacements
}