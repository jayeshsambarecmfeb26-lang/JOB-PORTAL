const BASE_URL = 'http://localhost:8080/api';

const companies = [];
const candidates = [];

// Helper to generate a random string
const randomId = () => Math.random().toString(36).substring(7);

async function registerUser(name, email, role) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
            email,
            password: 'password123',
            role,
            phone: `+91 98${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
        })
    });
    if (!res.ok) {
        console.error(`Failed to register ${email}`);
        return null;
    }
    const data = await res.json();
    return data.token;
}

async function postJob(token, title, type, location) {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title,
            description: `We are looking for a highly skilled ${title} to join our amazing team.`,
            location,
            salary: Math.floor(Math.random() * 2000000) + 500000,
            type,
            status: 'OPEN'
        })
    });
    if (!res.ok) {
        console.error(`Failed to post job ${title}`);
    }
}

async function seed() {
    console.log("🌱 Starting Data Seeding...");

    // 1. Create 10 Companies
    console.log("Building Companies...");
    for (let i = 1; i <= 10; i++) {
        const token = await registerUser(`Company ${i} Corp`, `company${i}@email.com`, 'COMPANY');
        if (token) companies.push(token);
    }

    // 2. Create 20 Candidates
    console.log("Building Candidates...");
    for (let i = 1; i <= 20; i++) {
        await registerUser(`Candidate ${i} Name`, `candidate${i}@email.com`, 'CANDIDATE');
    }

    // 3. Post Jobs for Companies
    console.log("Posting Jobs...");
    const jobTypes = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP'];
    const locations = ['Mumbai', 'Bengaluru', 'Pune', 'Remote', 'Delhi'];
    const titles = ['Java Developer', 'React Engineer', 'DevOps Specialist', 'UI/UX Designer', 'Product Manager'];

    for (let token of companies) {
        // Each company posts 3 random jobs
        for (let j = 0; j < 3; j++) {
            const title = titles[Math.floor(Math.random() * titles.length)];
            const type = jobTypes[Math.floor(Math.random() * jobTypes.length)];
            const loc = locations[Math.floor(Math.random() * locations.length)];
            await postJob(token, title, type, loc);
        }
    }

    console.log("✅ Seeding Complete! 10 Companies, 20 Candidates, and 30 Jobs created.");
    console.log("You can log in with any email (e.g. company1@email.com) and password: password123");
}

seed();
