const mongoose = require('mongoose');
const LabResult = require('./src/models/LabResult');

mongoose.connect('mongodb+srv://aashutoshmishra_db_user:c2H3YhRA0TidOAxA@cluster0.p2s7gt0.mongodb.net/lab_gateway?appName=Cluster0').then(async () => {
    console.log('Connected to DB');
    await LabResult.create([
        {
            orderId: 'ORD-JANE-001',
            patientId: 'a0Afj00000AdbjVEAR',
            testType: 'Complete Blood Count',
            status: 'Completed',
            priority: 'Routine',
            results: {
                value: '14.2',
                unit: 'g/dL',
                referenceRange: '12.0-15.5 g/dL',
                isAbnormal: false,
                notes: 'Normal results'
            },
            orderedAt: new Date(Date.now() - 86400000),
            completedAt: new Date()
        },
        {
            orderId: 'ORD-JANE-002',
            patientId: 'a0Afj00000AdbjVEAR',
            testType: 'Lipid Panel',
            status: 'Pending',
            priority: 'Routine',
            orderedAt: new Date()
        }
    ]);
    console.log('Inserted mock lab results for Jane Doe');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
