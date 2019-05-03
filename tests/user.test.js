import 'cross-fetch/polyfill';
import ApolloBoost, {
  gql
} from 'apollo-boost';
import prisma from '../src/prisma';
import bcrypt from 'bcryptjs';

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
});

beforeEach(async () => {
  const user = await prisma.mutation.createUser({
    data: {
      name: 'Dzenifer Lopez',
      email: 'dzenifromdblok@test.com',
      password: bcrypt.hashSync('bezanija')
    }
  });
});

test('Should create a new user', async () => {
  const createUser = gql `
    mutation {
      createUser(
        data: {
          name: "Kamenko Katic"
          email: "kamenko@test.com"
          password: "bezanija"
        }
      ) {
        token
        user {
          id
          name
        }
      }
    }
  `;
  const response = await client.mutate({
    mutation: createUser
  });

  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id
  });

  expect(exists).toBe(true);
});