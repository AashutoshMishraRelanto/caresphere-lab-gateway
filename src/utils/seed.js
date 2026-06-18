const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const User = require('../models/User');
const LabResult = require('../models/LabResult');
const connectDB = require('../config/db');

const testTypes = ['Complete Blood Count', 'Lipid Panel', 'Comprehensive Metabolic Panel', 'Urinalysis', 'COVID-19 PCR', 'HbA1c'];
const statuses = ['Pending', 'Completed', 'Cancelled'];
const priorities = ['Routine', 'High', 'STAT'];

const generateLabResults = (num) => {
  const labs = [];
  for (let i = 0; i < num; i++) {
    const testType = faker.helpers.arrayElement(testTypes);
    const status = faker.helpers.arrayElement(statuses);
    const priority = faker.helpers.arrayElement(priorities);
    
    // Create random patient IDs (simulate a patient pool)
    const patientId = `PAT${faker.number.int({ min: 10000, max: 99999 })}`;
    
    // Simulate orderedAt in the past year
    const orderedAt = faker.date.past({ years: 1 });
    let completedAt = null;
    let results = null;

    if (status === 'Completed') {
      completedAt = new Date(orderedAt.getTime() + faker.number.int({ min: 3600000, max: 172800000 })); // 1 to 48 hours later
      
      results = {
        value: faker.number.float({ min: 0.1, max: 200, fractionDigits: 2 }).toString(),
        unit: faker.helpers.arrayElement(['mg/dL', 'mmol/L', 'g/dL', '%']),
        referenceRange: 'Depends on test',
        isAbnormal: faker.datatype.boolean(0.15), // 15% chance of abnormal
        notes: faker.datatype.boolean(0.2) ? faker.lorem.sentence() : ''
      };
    }

    labs.push({
      orderId: `ORD${1000000 + i}`,
      patientId,
      testType,
      status,
      priority,
      results,
      orderedAt,
      completedAt
    });
  }
  return labs;
};

const seedDB = async () => {
  try {
    console.log('Clearing database...');
    await User.deleteMany();
    await LabResult.deleteMany();

    console.log('Creating Admin User...');
    const user = await User.create({
      username: 'salesforce_agent',
      password: 'sfdcpassword123',
      role: 'admin'
    });
    console.log('Admin user created: salesforce_agent / sfdcpassword123');

    console.log('Generating lab results...');
    const labs = generateLabResults(1111);
    
    await LabResult.insertMany(labs);
    console.log(`Successfully seeded ${labs.length} lab records.`);

    return { success: true, message: `Successfully seeded ${labs.length} lab records.` };
  } catch (error) {
    console.error('Error with seed data:', error);
    throw error;
  }
};

if (require.main === module) {
  connectDB().then(() => {
    seedDB().then(() => process.exit(0)).catch(() => process.exit(1));
  });
}

module.exports = { seedDB };
