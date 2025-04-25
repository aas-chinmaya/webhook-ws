const axios = require('axios');

const baseUrl = 'http://localhost:3000/api';
const whatsappToken = 'EAA4YU5sRk5QBO86fFZA0M6RMu7Mw35eAlm4PtxlO2haED4icRyyEneUeYsLF3FZCqveHYRRZBTN08DV4zeSZB5RrPmYs5ZA3ZCzCxBuQEDM5lKFPOAzpyE2uuZA82hGVGsOzRxJapMVSfmYQeiJ0T2lNGVwxNdDbINgHpCZBk2HgGxYCY5nRwIBiXTQXaPdE9JTor3sVmQrEj8TpP3CuM9ZBqfKz0KKtlfffe44JHxeya';

async function runTests() {
    try {
        // Test 1: Health Check
        console.log('\n🔍 Testing Health Check endpoint...');
        const healthResponse = await axios.get(`${baseUrl}/health`, {
            headers: { 'Authorization': `Bearer ${whatsappToken}` }
        });
        console.log('✅ Health Check passed:', healthResponse.data);

        // Test 2: Send Template Message
        console.log('\n🔍 Testing Template Message...');
        const templateResponse = await axios.post(`${baseUrl}/webhook`, {
            type: 'template',
            parameters: {
                template_name: 'hello_world',
                language: {
                    code: 'en_US'
                }
            },
            customerMobile: '916370073215'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${whatsappToken}`
            }
        });
        console.log('✅ Template Message sent:', templateResponse.data);

        // Test 3: Send Text Message
        console.log('\n🔍 Testing Text Message...');
        const textResponse = await axios.post(`${baseUrl}/webhook`, {
            type: 'text',
            parameters: {
                message: 'Test message from webhook'
            },
            customerMobile: '916370073215'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${whatsappToken}`
            }
        });
        console.log('✅ Text Message sent:', textResponse.data);

    } catch (error) {
        console.error('\n❌ Test failed:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });
    }
}

// Run the tests
console.log('🚀 Starting Webhook Tests...');
runTests().then(() => {
    console.log('\n✨ Tests completed!');
});