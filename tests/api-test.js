#!/usr/bin/env node

/**
 * API Test Suite for Naija Rides
 *
 * This script tests all API endpoints to ensure they're working correctly.
 * Run with: node tests/api-test.js
 */

const BASE_URL = 'http://localhost:3000';

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Test utilities
function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.log(`❌ FAIL: ${message}`);
    failedTests++;
  }
}

function assertEqual(actual, expected, message) {
  assert(actual === expected, `${message} (expected: ${expected}, got: ${actual})`);
}

async function makeRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.text();

    let json = null;
    try {
      json = JSON.parse(data);
    } catch (e) {
      // Response is not JSON
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: json || data,
      headers: response.headers
    };
  } catch (error) {
    console.error(`Request failed for ${url}:`, error.message);
    return {
      status: 0,
      error: error.message
    };
  }
}

// Test suites
async function testHealthEndpoint() {
  console.log('\n🏥 Testing Health Endpoint...');

  const response = await makeRequest('/api/health');

  assert(response.status === 200, 'Health endpoint returns 200');
  assert(response.data && typeof response.data === 'object', 'Health endpoint returns JSON object');
  assert(response.data.status, 'Health response includes status');
  assert(response.data.timestamp, 'Health response includes timestamp');
  assert(response.data.checks, 'Health response includes checks');
  assertEqual(response.data.checks.api, 'healthy', 'API check is healthy');
}

async function testCarsEndpoints() {
  console.log('\n🚗 Testing Cars Endpoints...');

  // Test GET /api/cars (should work without auth)
  const getCarsResponse = await makeRequest('/api/cars');
  assert(getCarsResponse.status === 200, 'GET /api/cars returns 200');
  assert(getCarsResponse.data && Array.isArray(getCarsResponse.data.cars), 'GET /api/cars returns cars array');

  // Test GET /api/cars with query parameters
  const filteredCarsResponse = await makeRequest('/api/cars?page=1&limit=5&location=Lagos');
  assert(filteredCarsResponse.status === 200, 'GET /api/cars with filters returns 200');

  // Test POST /api/cars (should fail without auth)
  const createCarResponse = await makeRequest('/api/cars', {
    method: 'POST',
    body: JSON.stringify({
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'Black',
      plateNumber: 'TEST-123',
      fuelType: 'petrol',
      transmission: 'automatic',
      seats: 5,
      category: 'mid-size',
      dailyRate: 15000,
      location: 'Lagos'
    })
  });
  assert(createCarResponse.status === 401, 'POST /api/cars without auth returns 401');

  // Test GET /api/cars/invalid-id
  const invalidCarResponse = await makeRequest('/api/cars/invalid-id');
  assert(invalidCarResponse.status === 400 || invalidCarResponse.status === 404, 'GET /api/cars/invalid-id returns 400 or 404');
}

async function testUsersEndpoints() {
  console.log('\n👥 Testing Users Endpoints...');

  // Test GET /api/users/me (should fail without auth)
  const getMeResponse = await makeRequest('/api/users/me');
  assert(getMeResponse.status === 401, 'GET /api/users/me without auth returns 401');

  // Test PUT /api/users/me (should fail without auth)
  const updateMeResponse = await makeRequest('/api/users/me', {
    method: 'PUT',
    body: JSON.stringify({
      firstName: 'John',
      lastName: 'Doe'
    })
  });
  assert(updateMeResponse.status === 401, 'PUT /api/users/me without auth returns 401');
}

async function testBookingsEndpoints() {
  console.log('\n📅 Testing Bookings Endpoints...');

  // Test GET /api/bookings (should fail without auth)
  const getBookingsResponse = await makeRequest('/api/bookings');
  assert(getBookingsResponse.status === 401, 'GET /api/bookings without auth returns 401');

  // Test POST /api/bookings (should fail without auth)
  const createBookingResponse = await makeRequest('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      carId: 'test-car-id',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString() // +1 day
    })
  });
  assert(createBookingResponse.status === 401, 'POST /api/bookings without auth returns 401');
}

async function testReviewsEndpoints() {
  console.log('\n⭐ Testing Reviews Endpoints...');

  // Test GET /api/reviews (should work without auth)
  const getReviewsResponse = await makeRequest('/api/reviews');
  assert(getReviewsResponse.status === 200, 'GET /api/reviews returns 200');
  assert(getReviewsResponse.data && Array.isArray(getReviewsResponse.data.reviews), 'GET /api/reviews returns reviews array');

  // Test POST /api/reviews (should fail without auth)
  const createReviewResponse = await makeRequest('/api/reviews', {
    method: 'POST',
    body: JSON.stringify({
      bookingId: 'test-booking-id',
      reviewedId: 'test-user-id',
      rating: 5,
      comment: 'Great experience!',
      reviewType: 'renter_review'
    })
  });
  assert(createReviewResponse.status === 401, 'POST /api/reviews without auth returns 401');
}

async function testRateLimiting() {
  console.log('\n🚦 Testing Rate Limiting...');

  // Make multiple rapid requests to test rate limiting
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(makeRequest('/api/health'));
  }

  const responses = await Promise.all(promises);
  const successCount = responses.filter(r => r.status === 200).length;

  assert(successCount >= 5, 'Rate limiting allows reasonable request volume');
  console.log(`   Made 5 rapid requests, ${successCount} succeeded`);
}

async function testErrorHandling() {
  console.log('\n🚨 Testing Error Handling...');

  // Test invalid JSON body
  const invalidJsonResponse = await makeRequest('/api/cars', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer fake-token' // This will still fail auth, but test JSON parsing
    },
    body: 'invalid json'
  });
  assert(invalidJsonResponse.status >= 400, 'Invalid JSON returns error status');

  // Test non-existent endpoint
  const notFoundResponse = await makeRequest('/api/nonexistent');
  assert(notFoundResponse.status === 404, 'Non-existent endpoint returns 404');
}

// Main test runner
async function runTests() {
  console.log('🧪 Starting API Test Suite for Naija Rides\n');
  console.log(`Testing against: ${BASE_URL}`);

  try {
    await testHealthEndpoint();
    await testCarsEndpoints();
    await testUsersEndpoints();
    await testBookingsEndpoints();
    await testReviewsEndpoints();
    await testRateLimiting();
    await testErrorHandling();

    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (failedTests === 0) {
      console.log('\n🎉 All tests passed! API is working correctly.');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some tests failed. Please review the API implementation.');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 Test suite crashed:', error);
    process.exit(1);
  }
}

// Check if we're running this script directly
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  makeRequest,
  assert,
  assertEqual
};