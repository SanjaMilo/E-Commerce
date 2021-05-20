import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@exaple.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'John Doe',
        email: 'john@exaple.com',
        password: bcrypt.hashSync('123456', 10), 
        // no need for isAdmin: false, because we set that by default to be false
    },
    {
        name: 'Jane Doe',
        email: 'jane@exaple.com',
        password: bcrypt.hashSync('123456', 10), 
    },
];

export default users;