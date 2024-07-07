export const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
export const INVOICE_FUNCITON = {
  type: 'function',
  function: {
    name: 'searchInvoices',
    description:
      'Searches for invoices matching the given keyword and returns the matching invoices along with the total amount.',
    parameters: {
      type: 'object',
      properties: {
        keywords: {
          type: 'string',
          description: 'The keyword to search for in the invoices.',
        },
      },
      required: ['keywords'],
    },
  },
};
