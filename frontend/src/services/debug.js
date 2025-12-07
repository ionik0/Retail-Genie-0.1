// Debug utility for Retail Genie integration
import { orchestratorAPI, recommenderAPI } from './api';

export const debugAPI = {
  /**
   * Check if all services are running
   */
  async checkAllServices() {
    const results = {
      orchestrator: { status: 'checking', url: 'http://localhost:5000' },
      recommender: { status: 'checking', url: 'http://localhost:8000' },
      frontend: { status: 'checking', url: window.location.href },
    };

    try {
      const orchestratorCheck = await orchestratorAPI.healthCheck();
      results.orchestrator.status = 'ok';
      results.orchestrator.data = orchestratorCheck;
    } catch (error) {
      results.orchestrator.status = 'error';
      results.orchestrator.error = error.message;
    }

    try {
      const recommenderCheck = await recommenderAPI.healthCheck();
      results.recommender.status = 'ok';
      results.recommender.data = recommenderCheck;
    } catch (error) {
      results.recommender.status = 'error';
      results.recommender.error = error.message;
    }

    results.frontend.status = 'ok';

    return results;
  },

  /**
   * Test a sample recommendation flow
   */
  async testRecommendationFlow(query = 'party wear') {
    console.log('Testing recommendation flow with query:', query);

    const result = {
      query,
      steps: [],
    };

    // Step 1: Send to orchestrator
    try {
      console.log('Step 1: Sending to orchestrator...');
      const orchestratorResponse = await orchestratorAPI.sendMessage(query);
      result.steps.push({
        name: 'Orchestrator',
        status: 'success',
        response: orchestratorResponse,
      });
      console.log('Orchestrator response:', orchestratorResponse);
    } catch (error) {
      result.steps.push({
        name: 'Orchestrator',
        status: 'error',
        error: error.message,
      });
      console.error('Orchestrator error:', error);
      return result;
    }

    // Step 2: Try direct recommender call
    try {
      console.log('Step 2: Testing recommender directly...');
      const recommenderResponse = await recommenderAPI.getRecommendations(query);
      result.steps.push({
        name: 'Recommender',
        status: 'success',
        response: recommenderResponse,
      });
      console.log('Recommender response:', recommenderResponse);
    } catch (error) {
      result.steps.push({
        name: 'Recommender',
        status: 'error',
        error: error.message,
      });
      console.error('Recommender error:', error);
    }

    return result;
  },

  /**
   * Log environment configuration
   */
  logEnvironment() {
    const config = {
      orchestratorUrl: import.meta.env.VITE_ORCHESTRATOR_URL || 'http://localhost:5000',
      recommenderUrl: import.meta.env.VITE_RECOMMENDER_URL || 'http://localhost:8000',
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
    };

    console.log('=== Environment Configuration ===');
    console.table(config);
    return config;
  },

  /**
   * Print a formatted debug report
   */
  async generateReport() {
    console.clear();
    console.log('%c=== Retail Genie Debug Report ===', 'color: cyan; font-size: 16px; font-weight: bold');

    // Environment
    console.log('%cEnvironment:', 'color: blue; font-weight: bold');
    this.logEnvironment();

    // Service health
    console.log('%cService Health:', 'color: blue; font-weight: bold');
    const healthCheck = await this.checkAllServices();
    console.table(healthCheck);

    // Recommendation flow test
    console.log('%cRecommendation Flow Test:', 'color: blue; font-weight: bold');
    const flowTest = await this.testRecommendationFlow('wedding wear');
    console.log(flowTest);

    console.log('%c=== Report Complete ===', 'color: cyan; font-size: 16px; font-weight: bold');

    return {
      environment: this.logEnvironment(),
      health: healthCheck,
      flowTest,
    };
  },
};

// Export for browser console access
window.debugAPI = debugAPI;

export default debugAPI;
