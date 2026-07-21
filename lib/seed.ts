import { prisma } from "./prisma";
import { hashPassword } from "@better-auth/utils/password";

const permissions = [
    { resource: "products", action: "view", description: "View products" },
    { resource: "products", action: "create", description: "Create products" },
    { resource: "products", action: "edit", description: "Edit products" },
    { resource: "products", action: "delete", description: "Delete products" },
    { resource: "products", action: "export", description: "Export products" },
    { resource: "orders", action: "view", description: "View orders" },
    { resource: "orders", action: "create", description: "Create orders" },
    { resource: "orders", action: "edit", description: "Edit orders" },
    { resource: "orders", action: "delete", description: "Delete orders" },
    { resource: "orders", action: "export", description: "Export orders" },
    { resource: "orders", action: "fulfill", description: "Fulfill orders" },
    { resource: "orders", action: "refund", description: "Issue refunds" },
    { resource: "inventory", action: "view", description: "View inventory" },
    { resource: "inventory", action: "adjust", description: "Adjust stock" },
    { resource: "users", action: "view", description: "View staff users" },
    { resource: "users", action: "create", description: "Create staff users" },
    { resource: "users", action: "edit", description: "Edit staff users" },
    { resource: "users", action: "delete", description: "Delete staff users" },
    { resource: "customers", action: "view", description: "View customers" },
    { resource: "customers", action: "edit", description: "Edit customer records" },
    { resource: "customers", action: "delete", description: "Anonymize/delete customers" },
    { resource: "payments", action: "view", description: "View payments" },
    { resource: "payments", action: "refund", description: "Issue payment refunds" },
    { resource: "payments", action: "configure", description: "Configure PSPs" },
    { resource: "gallery", action: "view", description: "View media gallery" },
    { resource: "gallery", action: "upload", description: "Upload images" },
    { resource: "gallery", action: "edit", description: "Edit image metadata" },
    { resource: "gallery", action: "delete", description: "Delete images" },
    { resource: "analytics", action: "view", description: "View analytics" },
    { resource: "settings", action: "view", description: "View settings" },
    { resource: "settings", action: "edit", description: "Edit settings" },
    { resource: "audit", action: "view", description: "View audit log" },
    { resource: "roles", action: "view", description: "View roles" },
    { resource: "roles", action: "create", description: "Create roles" },
    { resource: "roles", action: "edit", description: "Edit roles" },
    { resource: "roles", action: "delete", description: "Delete roles" },
];

const permissionMap = new Map<string, string>();

async function seedPermissions() {
    for (const perm of permissions) {
        const created = await prisma.permission.upsert({
            where: { resource_action: { resource: perm.resource, action: perm.action } },
            update: { description: perm.description },
            create: { resource: perm.resource, action: perm.action, description: perm.description },
        });
        permissionMap.set(`${perm.resource}:${perm.action}`, created.id);
    }
    console.log(`Seeded ${permissions.length} permissions`);
}

async function seedRoles() {
    const roleDefs = [
        {
            name: "Owner/SuperAdmin",
            guardName: "web",
            isSystem: true,
            permissions: permissions.map((p) => `${p.resource}:${p.action}`),
        },
        {
            name: "Admin",
            guardName: "web",
            isSystem: true,
            permissions: permissions.map((p) => `${p.resource}:${p.action}`),
        },
        {
            name: "Inventory Manager",
            guardName: "web",
            isSystem: true,
            permissions: [
                "products:view",
                "products:create",
                "products:edit",
                "products:export",
                "inventory:view",
                "inventory:adjust",
                "categories:view",
                "categories:create",
                "categories:edit",
                "suppliers:view",
                "suppliers:create",
                "suppliers:edit",
                "orders:view",
                "gallery:view",
                "gallery:upload",
                "gallery:edit",
            ],
        },
        {
            name: "Fulfillment Staff",
            guardName: "web",
            isSystem: true,
            permissions: [
                "orders:view",
                "orders:edit",
                "orders:fulfill",
                "inventory:view",
                "customers:view",
            ],
        },
        {
            name: "Support Agent",
            guardName: "web",
            isSystem: true,
            permissions: [
                "orders:view",
                "orders:edit",
                "orders:refund",
                "customers:view",
                "customers:edit",
                "payments:view",
                "payments:refund",
            ],
        },
        {
            name: "Content Editor",
            guardName: "web",
            isSystem: true,
            permissions: [
                "products:view",
                "products:create",
                "products:edit",
                "categories:view",
                "categories:create",
                "categories:edit",
                "gallery:view",
                "gallery:upload",
                "gallery:edit",
                "gallery:delete",
            ],
        },
    ];

    for (const roleDef of roleDefs) {
        const role = await prisma.role.upsert({
            where: { name: roleDef.name },
            update: { guardName: roleDef.guardName, isSystem: roleDef.isSystem },
            create: {
                name: roleDef.name,
                guardName: roleDef.guardName,
                isSystem: roleDef.isSystem,
                description: `${roleDef.name} role`,
            },
        });

        const permissionIds = roleDef.permissions
            .map((key) => permissionMap.get(key))
            .filter(Boolean) as string[];

        for (const permissionId of permissionIds) {
            await prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: role.id, permissionId } },
                update: {},
                create: { roleId: role.id, permissionId },
            });
        }

        console.log(`Seeded role: ${roleDef.name} (${permissionIds.length} permissions)`);
    }
}

async function seedAdminUser() {
    const email = "admin@audiophile.com";
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        console.log("Admin user already exists");
        return;
    }

    const hashedPassword = await hashPassword("admin123");

    const user = await prisma.user.create({
        data: {
            name: "Admin",
            email,
            isActive: true,
        },
    });

    await prisma.account.create({
        data: {
            userId: user.id,
            provider: "credential",
            type: "email",
            providerAccountId: user.id,
            password: hashedPassword,
        },
    });

    const ownerRole = await prisma.role.findUnique({
        where: { name: "Owner/SuperAdmin" },
    });

    if (ownerRole) {
        await prisma.userRole.create({
            data: { userId: user.id, roleId: ownerRole.id },
        });
    }

    console.log(`Seeded admin user: ${email} / admin123`);
}

async function seedCatalog() {
    const categories = [
        { name: "Headphones", slug: "headphones", description: "Premium over-ear and in-ear headphones for audiophiles" },
        { name: "Speakers", slug: "speakers", description: "High-fidelity speakers for studio and home" },
        { name: "Earphones", slug: "earphones", description: "Portable wireless earphones for premium audio on the go" },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name, description: cat.description },
            create: { name: cat.name, slug: cat.slug, description: cat.description, sortOrder: categories.indexOf(cat) },
        });
    }
    console.log("Seeded categories");

    const productDefs = [
        {
            name: "XX99 Mark II",
            slug: "xx99-mark-ii",
            description: "The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone experience by reproducing the balanced depth and precision of studio-quality sound.",
            basePrice: 2999,
            brand: "audiophile",
            status: "active",
            categorySlug: "headphones",
            features: [
                "Featuring a genuine leather head strap and premium earcups, these headphones deliver superior comfort for those who like to enjoy endless listening. It includes intuitive controls designed for any situation. Whether you're taking a business call or just in your own personal space, the auto on/off and pause features ensure that you'll never miss a beat.",
                "The advanced Active Noise Cancellation with built-in equalizer allow you to experience your audio world on your terms. It lets you enjoy your audio in peace, but quickly interact with your surroundings when you need to. Combined with Bluetooth 5.0 compliant connectivity and 17 hour battery life, the XX99 Mark II headphones gives you superior sound, cutting-edge technology, and a modern design aesthetic.",
            ],
            box: [
                { name: "Headphone Unit", quantity: 1 },
                { name: "Replacement Earcups", quantity: 2 },
                { name: "User Manual", quantity: 1 },
                { name: "3.5mm Audio Cable", quantity: 1 },
                { name: "USB-C Charging Cable", quantity: 1 },
            ],
            variants: [{ sku: "XX99MKII-BLK", name: "Black", priceDelta: 0, stock: 25 }],
        },
        {
            name: "XX99 Mark I",
            slug: "xx99-mark-i",
            description: "As the gold standard for headphones, the classic XX99 Mark I offers detailed and natural audio with an active noise cancellation design. A truly one-of-a-kind listening experience.",
            basePrice: 1750,
            brand: "audiophile",
            status: "active",
            categorySlug: "headphones",
            features: [
                "As the gold standard for headphones, the classic XX99 Mark I offers detailed and natural audio with an active noise cancellation design. A truly one-of-a-kind listening experience that brings your music to life.",
                "The XX99 Mark I features a lightweight design with premium materials, ensuring comfort during extended listening sessions. Its advanced noise cancellation technology adapts to your environment, providing an immersive audio experience whether you're at home, in the office, or on the go.",
            ],
            box: [
                { name: "Headphone Unit", quantity: 1 },
                { name: "Replacement Earcups", quantity: 2 },
                { name: "User Manual", quantity: 1 },
                { name: "3.5mm Audio Cable", quantity: 1 },
            ],
            variants: [{ sku: "XX99MKI-BLK", name: "Black", priceDelta: 0, stock: 15 }],
        },
        {
            name: "XX59",
            slug: "xx59",
            description: "Enjoy your audio almost anywhere and customize it to your specific tastes with the XX59 headphones. The stylish yet durable versatile wireless headset is a brilliant companion at home or on the move.",
            basePrice: 899,
            brand: "audiophile",
            status: "active",
            categorySlug: "headphones",
            features: [
                "Enjoy your audio almost anywhere and customize it to your specific tastes with the XX59 headphones. The stylish yet durable versatile wireless headset is a brilliant companion at home or on the move.",
                "With built-in EQ controls and long-lasting battery life, the XX59 adapts to your listening preferences. Its comfortable over-ear design features premium memory foam ear cushions and a lightweight frame for all-day wear.",
            ],
            box: [
                { name: "Headphone Unit", quantity: 1 },
                { name: "User Manual", quantity: 1 },
                { name: "3.5mm Audio Cable", quantity: 1 },
                { name: "USB-C Charging Cable", quantity: 1 },
            ],
            variants: [{ sku: "XX59-BLK", name: "Black", priceDelta: 0, stock: 30 }],
        },
        {
            name: "ZX9 Speaker",
            slug: "zx9",
            description: "Upgrade your sound system with the all new ZX9 active speaker. It's a bookshelf speaker system that offers truly wireless connectivity — creating new possibilities for more pleasing and practical audio setups.",
            basePrice: 4500,
            brand: "audiophile",
            status: "active",
            categorySlug: "speakers",
            features: [
                "Upgrade your sound system with the all new ZX9 active speaker. It's a bookshelf speaker system that offers truly wireless connectivity — creating new possibilities for more pleasing and practical audio setups.",
                "The ZX9 features a powerful built-in amplifier and dual drivers that deliver room-filling sound with exceptional clarity. Its wireless connectivity supports Bluetooth 5.0, AirPlay 2, and Spotify Connect, making it the centerpiece of your modern audio setup.",
            ],
            box: [
                { name: "Speaker Unit", quantity: 2 },
                { name: "Power Cables", quantity: 2 },
                { name: "User Manual", quantity: 1 },
                { name: "Remote Control", quantity: 1 },
            ],
            variants: [{ sku: "ZX9-BLK", name: "Black", priceDelta: 0, stock: 10 }],
        },
        {
            name: "ZX7 Speaker",
            slug: "zx7",
            description: "Stream high quality sound wirelessly with minimal loss. The ZX7 bookshelf speaker uses high-end audiophile components that represents the top of the line powered speakers for home or studio use.",
            basePrice: 3500,
            brand: "audiophile",
            status: "active",
            categorySlug: "speakers",
            features: [
                "Stream high quality sound wirelessly with minimal loss. The ZX7 bookshelf speaker uses high-end audiophile components that represents the top of the line powered speakers for home or studio use.",
                "Featuring a bi-amplified design with separate tweeter and woofer amplifiers, the ZX7 delivers precise, distortion-free audio across the entire frequency range. Its compact form factor fits seamlessly into any room while delivering sound that fills the space.",
            ],
            box: [
                { name: "Speaker Unit", quantity: 2 },
                { name: "Power Cables", quantity: 2 },
                { name: "User Manual", quantity: 1 },
                { name: "Speaker Cables", quantity: 2 },
            ],
            variants: [{ sku: "ZX7-BLK", name: "Black", priceDelta: 0, stock: 8 }],
        },
        {
            name: "YX1 Wireless Earphones",
            slug: "yx1",
            description: "Tailor your listening experience with bespoke dynamic drivers from the new YX1 Wireless Earphones. Enjoy incredible high-fidelity sound even in noisy environments with its active noise cancellation feature.",
            basePrice: 599,
            brand: "audiophile",
            status: "active",
            categorySlug: "earphones",
            features: [
                "Tailor your listening experience with bespoke dynamic drivers from the new YX1 Wireless Earphones. Enjoy incredible high-fidelity sound even in noisy environments with its active noise cancellation feature.",
                "The YX1 features a comfortable ergonomic design with multiple ear tip sizes for a perfect fit. With IPX5 water resistance and 8 hours of battery life, these earphones are built for your active lifestyle.",
            ],
            box: [
                { name: "Earphone Unit", quantity: 1 },
                { name: "Charging Case", quantity: 1 },
                { name: "USB-C Charging Cable", quantity: 1 },
                { name: "Ear Tips (S/M/L)", quantity: 3 },
                { name: "User Manual", quantity: 1 },
            ],
            variants: [{ sku: "YX1-BLK", name: "Black", priceDelta: 0, stock: 20 }],
        },
    ];

    for (const def of productDefs) {
        const category = await prisma.category.findUnique({ where: { slug: def.categorySlug } });
        if (!category) {
            console.warn(`Category ${def.categorySlug} not found, skipping product ${def.name}`);
            continue;
        }

        const product = await prisma.product.upsert({
            where: { slug: def.slug },
            update: {
                name: def.name,
                description: def.description,
                basePrice: def.basePrice,
                brand: def.brand,
                status: def.status,
                categoryId: category.id,
                features: def.features,
                box: def.box,
            },
            create: {
                name: def.name,
                slug: def.slug,
                sku: def.variants[0].sku,
                description: def.description,
                basePrice: def.basePrice,
                brand: def.brand,
                status: def.status,
                categoryId: category.id,
                features: def.features,
                box: def.box,
            },
        });

        for (const v of def.variants) {
            await prisma.productVariant.upsert({
                where: { sku: v.sku },
                update: { name: v.name, priceDelta: v.priceDelta, stock: v.stock, isActive: true },
                create: {
                    productId: product.id,
                    sku: v.sku,
                    name: v.name,
                    priceDelta: v.priceDelta,
                    stock: v.stock,
                    isActive: true,
                },
            });
        }

        console.log(`Seeded product: ${def.name} (${def.variants.length} variants)`);
    }
}

async function main() {
    console.log("Seeding database...");
    await seedPermissions();
    await seedRoles();
    await seedAdminUser();
    await seedCatalog();
    console.log("Seeding complete");
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
});
