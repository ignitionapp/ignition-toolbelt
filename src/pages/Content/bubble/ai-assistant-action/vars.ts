import {
  SearchDateFilterCondition,
  SearchInvoicePaymentProgressStatusType,
  SearchInvoicePaymentStatusType,
  SearchNumberFilterCondition,
} from '@generated/ignition/types';

const numberFilterConditions = Object.values(SearchNumberFilterCondition);
const dateFilterConditions = Object.values(SearchDateFilterCondition);
const invoicePaymentStatuses = Object.values(SearchInvoicePaymentStatusType);
const invoicePaymentProgressStatuses = Object.values(
  SearchInvoicePaymentProgressStatusType
);

export const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export const APP_CLIENTS_FUNCTION = {
  type: 'function',
  function: {
    name: 'searchAppClients',
    description:
      'Searches for app clients matching the given criteria and returns the results.',
    parameters: {
      type: 'object',
      properties: {
        searchQuery: {
          type: 'string',
          description: 'The keyword to search for in the app clients.',
        },
      },
      required: [],
    },
  },
};

export const BILLING_ITEMS_FUNCTION = {
  type: 'function',
  function: {
    name: 'searchBillingItems',
    description:
      "Searches for billing items matching the given criteria and returns the results. Note that a billing item does not equals to invoice. It's the stage before becoming an invoice",
    parameters: {
      type: 'object',
      properties: {
        searchQuery: {
          type: 'string',
          description: 'The keyword to search for in the billing items.',
        },
      },
      required: [],
    },
  },
};

export const CLIENT_FUNCTION = {
  type: 'function',
  function: {
    name: 'searchClients',
    description:
      'Searches for clients matching the given criteria and returns the results.',
    parameters: {
      type: 'object',
      properties: {
        searchQuery: {
          type: 'string',
          description: 'The keyword to search for in the clients.',
        },
      },
      required: [],
    },
  },
};

export const PROPOSAL_FUNCTION = {
  type: 'function',
  function: {
    name: 'searchProposals',
    description:
      'Searches for proposals matching the given criteria and returns the results.',
    parameters: {
      type: 'object',
      properties: {
        searchQuery: {
          type: 'string',
          description: 'The keyword to search for in the proposals.',
        },
      },
      required: [],
    },
  },
};

export const INVOICE_FUNCTION = {
  type: 'function',
  function: {
    name: 'searchInvoices',
    description:
      'Searches for invoices matching the given criteria and returns the results.',
    parameters: {
      type: 'object',
      properties: {
        amountWithTax: {
          type: 'number',
          description: 'The total amount of the invoice with tax.',
        },
        amountWithTaxCondition: {
          type: 'string',
          enum: numberFilterConditions,
          description: 'The condition to apply to the amount with tax.',
        },
        clientName: {
          type: 'string',
          description: 'The name of the client to search for in the invoices.',
        },
        collectionOn: {
          type: 'string',
          description: 'The estimated date for collection.',
        },
        collectionOnCondition: {
          type: 'string',
          enum: dateFilterConditions,
          description: 'The condition to apply to the collection date.',
        },
        billedOn: {
          type: 'string',
          description: 'The date the invoice was created and issued to client.',
        },
        billedOnCondition: {
          type: 'string',
          enum: dateFilterConditions,
          description: 'The condition to apply to the billed on date.',
        },
        paymentProgressStatues: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'The payment progress statuses to filter by.',
          enum: invoicePaymentProgressStatuses,
        },
        paymentStatus: {
          type: 'string',
          description: 'The payment status of the invoice.',
          enum: invoicePaymentStatuses,
        },
        payoutOn: {
          type: 'string',
          description: 'The date for payout.',
        },
        payoutOnCondition: {
          type: 'string',
          description: 'The condition to apply to the payout date.',
          enum: dateFilterConditions,
        },
        searchQuery: {
          type: 'string',
          description: 'The keyword to search for in the invoices.',
        },
      },
      required: [],
    },
  },
};
export const TOOLS = [
  APP_CLIENTS_FUNCTION,
  BILLING_ITEMS_FUNCTION,
  CLIENT_FUNCTION,
  INVOICE_FUNCTION,
  PROPOSAL_FUNCTION,
];
