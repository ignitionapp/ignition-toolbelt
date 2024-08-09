import {
  SearchDateFilterCondition,
  SearchInvoicePaymentProgressStatusType,
  SearchInvoicePaymentStatusType,
  SearchNumberFilterCondition,
  SearchSortDirection,
  SearchType,
} from '@generated/ignition/types';
import { Tool } from './types';

const numberFilterConditions = Object.values(SearchNumberFilterCondition);
const dateFilterConditions = Object.values(SearchDateFilterCondition);
const invoicePaymentStatuses = Object.values(SearchInvoicePaymentStatusType);
const invoicePaymentProgressStatuses = Object.values(
  SearchInvoicePaymentProgressStatusType
);

export const APP_CLIENTS_FUNCTION: Tool = {
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

export const BILLING_ITEMS_FUNCTION: Tool = {
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

export const CLIENT_FUNCTION: Tool = {
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

export const PROPOSAL_FUNCTION: Tool = {
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

export const INVOICE_FUNCTION: Tool = {
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
            enum: invoicePaymentProgressStatuses,
          },
          description: 'The payment progress statuses to filter by.',
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
        sortAttribute: {
          type: 'string',
          description: 'The attribute to sort the invoices by.',
          enum: [
            'billed_on',
            'collection_on',
            'payout_on',
            'amount_with_tax_cents',
          ],
        },
        sortDirection: {
          type: 'string',
          description: 'The relation to sort the invoices by.',
          enum: [SearchSortDirection.ASC, SearchSortDirection.DESC],
        },
        sortRelation: {
          type: 'string',
          description: 'The relation to sort the invoices by.',
          enum: [SearchType.INVOICE, SearchType.CLIENT],
        },
        pageNumber: {
          type: 'number',
          description: 'The page number to return.',
        },
        pageSize: {
          type: 'number',
          description: 'The number of items to return per page.',
        },
      },
      required: [],
    },
  },
};
export const TOOLS: Tool[] = [
  APP_CLIENTS_FUNCTION,
  BILLING_ITEMS_FUNCTION,
  CLIENT_FUNCTION,
  INVOICE_FUNCTION,
  PROPOSAL_FUNCTION,
];

export enum ProgressType {
  LOADING = 'loading',
  DOWNLOADING = 'downloading',
  DOWNLOAD_PREPARING = 'downloadPreparing',
  IDLE = 'idle'
}
