#!/usr/bin/env powershell
# Quick Test Script for Retail Genie Integration
# Run this after starting all three services

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Retail Genie Integration Test" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Test Recommender
Write-Host "1. Testing Recommender (http://localhost:8000)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/" -Method Get -TimeoutSec 5
    Write-Host "   ✓ Recommender is running" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Recommender is NOT running" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test Orchestrator
Write-Host "2. Testing Orchestrator (http://localhost:5000)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/" -Method Get -TimeoutSec 5
    Write-Host "   ✓ Orchestrator is running" -ForegroundColor Green
    Write-Host "   Message: $($response)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Orchestrator is NOT running" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test Message Flow
Write-Host "3. Testing Message Flow" -ForegroundColor Yellow
try {
    $body = @{
        message = "I'm looking for party wear"
        session_id = $null
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:5000/message" `
        -Method Post `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -TimeoutSec 10

    if ($response.cards -and $response.cards.Count -gt 0) {
        Write-Host "   ✓ Message flow working!" -ForegroundColor Green
        Write-Host "   Session ID: $($response.session_id)" -ForegroundColor Green
        Write-Host "   Response: $($response.response)" -ForegroundColor Green
        Write-Host "   Products returned: $($response.cards.Count)" -ForegroundColor Green
        Write-Host "   First product: $($response.cards[0].name) - ₹$($response.cards[0].price)" -ForegroundColor Green
    } else {
        Write-Host "   ✓ Orchestrator responded (no products)" -ForegroundColor Yellow
        Write-Host "   Response: $($response.response)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Message flow failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test Recommendation Endpoint
Write-Host "4. Testing Direct Recommendation Endpoint" -ForegroundColor Yellow
try {
    $body = @{
        query = "party wear"
        top_k = 5
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:8000/recommend" `
        -Method Post `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -TimeoutSec 10

    if ($response.results -and $response.results.Count -gt 0) {
        Write-Host "   ✓ Recommendations working!" -ForegroundColor Green
        Write-Host "   Query: $($response.query_used)" -ForegroundColor Green
        Write-Host "   Results: $($response.count) products" -ForegroundColor Green
        Write-Host "   First product: $($response.results[0].name) - ₹$($response.results[0].price)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ No results but endpoint working" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Recommendation endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open browser to http://localhost:5173" -ForegroundColor White
Write-Host "2. Login with a customer account" -ForegroundColor White
Write-Host "3. Test queries in the chatbot" -ForegroundColor White
Write-Host ""
