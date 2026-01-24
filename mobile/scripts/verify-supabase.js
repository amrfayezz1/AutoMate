const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase Config');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(tableName) {
    console.log(`Checking table: ${tableName}...`);
    // Attempt to select 0 rows. 
    // If table exists: Returns { data: [], error: null } (or RLS error)
    // If table missing: Returns error code 42P01 (relation does not exist)
    const { data, error } = await supabase.from(tableName).select('*').limit(0);

    if (error) {
        if (error.code === '42P01') {
            console.error(`❌ Table '${tableName}' DOES NOT EXIST.`);
            return false;
        }
        console.log(`✅ Table '${tableName}' exists (RLS active: ${error.message})`);
        return true;
    }

    console.log(`✅ Table '${tableName}' exists and is accessible.`);
    return true;
}

async function verify() {
    console.log('Verifying Supabase Schema...');
    const tables = ['profiles', 'cars', 'reminders', 'maintenance_logs'];
    let allGood = true;

    for (const table of tables) {
        const exists = await checkTable(table);
        if (!exists) allGood = false;
    }

    if (allGood) {
        console.log('\n✨ Database Verification PasSeed! All tables found.');
    } else {
        console.error('\n⚠️ Verification FAILED. Some tables are missing.');
        process.exit(1);
    }
}

verify();
