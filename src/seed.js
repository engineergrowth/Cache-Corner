const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const clearTables = async () => {
    await prisma.cartItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
};

const usersData = [
    {
        signup_date: new Date('2021-12-15'),
        password: 'password1',
        email: 'user1@email.com',
        phone: '123-456-7890',
        first_name: 'John',
        last_name: 'Doe',
        address: '110 main street',
        addressLine2: 'apt1',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90015',
    },
    {
        signup_date: new Date('2021-12-16'),
        password: 'password2',
        email: 'user2@email.com',
        phone: '234-567-8901',
        first_name: 'Jason',
        last_name: 'Smith',
        address: '220 oak street',
        addressLine2: 'apt2',
        city: 'San Francisco',
        state: 'CA',
        zip: '94158',
    },
];

const productsData = [
    {
        price: 699.99,
        image_url: 'image1.jpg',
        post_date: new Date('2022-12-15'),
        description: 'High-end smartphone',
        title: 'Smartphone X',
        category: 'Electronic Product',
        is_available: true,
    },
    {
        price: 1299.99,
        image_url: 'image2.jpg',
        post_date: new Date('2022-12-16'),
        description: 'Professional laptop',
        title: 'Laptop Pro',
        category: 'Electronic Product',
        is_available: true,
    },
];

const ordersData = [
    {
        total_amount: 1999.98,
        date_ordered: new Date('2023-11-15'),
        is_open: true,
    },
    {
        total_amount: 74.98,
        date_ordered: new Date('2023-11-16'),
        is_open: true,
    },
];

const cartItemsData = [
    {
        created_at: new Date('2023-11-10'),
        updated_at: new Date('2023-11-12'),
        price: 699.99,
        quantity: 1,
    },
    {
        created_at: new Date('2023-11-11'),
        updated_at: new Date('2023-11-13'),
        price: 1299.99,
        quantity: 1,
    },
];

const seedUsers = async () => {
    await prisma.user.createMany({
        data: usersData,
    });
};

const seedProducts = async () => {
    const users = await prisma.user.findMany();
    const modifiedProductsData = productsData.map((product, index) => {
        return { ...product, user_id: users[index % users.length].user_id };
    });
    await prisma.product.createMany({
        data: modifiedProductsData,
    });
};

const seedOrders = async () => {
    const users = await prisma.user.findMany();
    const modifiedOrdersData = ordersData.map((order, index) => {
        return { ...order, user_id: users[index % users.length].user_id };
    });
    await prisma.order.createMany({
        data: modifiedOrdersData,
    });
};

const seedCartItems = async () => {
    const products = await prisma.product.findMany();
    const orders = await prisma.order.findMany();
    const modifiedCartItemsData = cartItemsData.map((item, index) => {
        return {
            ...item,
            product_id: products[index % products.length].product_id,
            order_id: orders[index % orders.length].order_id
        };
    });
    await prisma.cartItem.createMany({
        data: modifiedCartItemsData,
    });
};

const seed = async () => {
    try {
        await clearTables();
        console.log('Tables cleared')
        await seedUsers();
        await seedProducts();
        await seedOrders();
        await seedCartItems();
        console.log('Tables seeded');
    } catch (error) {
        console.error('Error seeding tables:', error);
    } finally {
        await prisma.$disconnect();
    }
};

seed()
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
