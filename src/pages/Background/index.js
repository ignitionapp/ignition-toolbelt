// Bubble activation
import './set-bubble-activation';

// Features
import './set-github-ticket-autolink';
import './set-jira-mission-control-login';
import './set-npe-exit';
import './set-comic-sans';
import './set-github-autofill';
import './set-local-ai-assistant';

// Onboarding autofill
import './set-initial-faker-seed-value';
import './set-payment-setup-autofill';
import './set-signup-autofill';
import './set-stripe-connect-autofill';
import './set-subscription-autofill';

chrome.runtime.onMessage.addListener(async (request) => {
  // It seems I have to keep this otherwise it raises error when I run chrome.runtime.sendMessage
});
