import { FeatureItem } from './types';

export const FEATURE_LIST: FeatureItem[] = [
  {
    id: 'feature::autofill-pages',
    title: 'Autofill onboarding pages',
    description:
      'Automatically fill in the onboarding pages with dummy data. (Not available in production)',
  },
  {
    id: 'feature::comic-sans',
    title: 'Comic Sans',
    description: 'Use Comic Sans font for the entire application.',
  },
  {
    id: 'feature::github-autolink',
    title: 'Autolink Jira ticket in GitHub',
    description:
      'Automatically convert Jira ticket numbers to links in GitHub.',
  },
  {
    id: 'feature::github-autofill',
    title: 'Autofill new GitHub PR',
    description: 'Automatically fill in a new Github PR',
  },
  {
    id: 'feature::jira-mission-control-login',
    title: 'Simplify MC login in Jira',
    description:
      'Allow users to log in to Ignition account directly from Jira.',
  },
  {
    id: 'feature::npe-exit',
    title: 'NPE Exit',
    description: 'Close NPE editor quickly with an obvious button',
  },
  {
    id: 'feature::ai-assistant',
    title: 'AI Assistant',
    description: 'Get information and help from AI assistant',
  },
];
