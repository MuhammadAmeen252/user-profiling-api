import { faker } from '@faker-js/faker';

export const generateRandomUser = (index:number) => {
    const user = {
        name: faker.internet.userName(),
        email: `${index}${faker.internet.email()}`,
        password: faker.internet.password(),
        addresses: [
            {
                addressLine1: faker.location.streetAddress(),
                addressLine2: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                country: faker.location.country(),
            },
        ],
        phoneNumber: '03182544098'
    };
    return user;
};