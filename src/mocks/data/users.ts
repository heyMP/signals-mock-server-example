import { User } from '../../types.js';
import { faker } from '@faker-js/faker';

let users: User[] = [];

for (const _ of Array(10)) {
  const id = faker.string.uuid();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const isActive = faker.datatype.boolean();

  users.push({ id, firstName, lastName, isActive });
}

export { users };
