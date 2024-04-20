import NDK, { NDKEvent, NostrEvent } from "@nostr-dev-kit/ndk";
import { generateSecretKey, getPublicKey, nip04 } from "nostr-tools";

enum ErrorCodes {
  NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
  UNAUTHORIZED = "UNAUTHORIZED",
  INTERNAL = "INTERNAL",
  OTHER = "OTHER",
  // TODO: add remaining nip47 error
}

enum NWCMethods {
  payInvoice = "pay_invoice",
  makeInvoice = "make_invoice",
  payKeysend = "pay_keysend",
  listTransactions = "list_transactions",
  lookupInvoice = "lookup_invoice",
  getBalance = "get_balance",
  getInfo = "get_info",
  multiPayInvoice = "multi_pay_invoice",
  multiPayKeysend = "multi_pay_keysend",
}

type PayInvoiceResult = {
  preimage: string;
};

type GetInfoResult = {
  alias: string;
  network: string;
  pubkey: string;
  methods: NWCMethods[];
};

type NWCResult = PayInvoiceResult | GetInfoResult;

type NWCResponseContent = {
  result_type: NWCMethods;
  result?: NWCResult;
  error?: {
    code: string;
    message?: string;
  };
};

export class NWCError extends Error {
  constructor(public readonly code: ErrorCodes, message?: string) {
    super(message);
  }
}

interface UseNwcProps {
  ndk: NDK;
  privateKey: string;
  publicKey: string;
}

const useNwc = ({ ndk, privateKey, publicKey }: UseNwcProps) => {
  /**
   * Generate and store a new connection uri
   * @param opts - `budget` to set max amount spendable and `expiryUnix` to set when connection in invalid
   * @returns new uri string
   */
  const generateNwcUri = (opts?: {
    budgetSat?: number;
    expiryUnix?: number;
  }): string => {};

  /**
   * Use NIP04 to decrypt
   * @param appPubkey The public key of the app the nwc connection was issued to
   * @param encryptedContent Encrypted event content that contains nip47 request data
   * @returns nip47 method and corresponding params
   */
  const decryptNwcRequest = async (
    appPubkey: string,
    encryptedContent: string
  ): Promise<{ method: NWCMethods; params: object }> => {};

  /**
   * Checks that our wallet issued this connection and that budget not exceeded nore is connection expired
   * @param appPubkey - the pubkey of the request event
   * @param params - optional params to validate
   * @throws Error if invalid connection
   * @returns nothing if valid connection
   */
  const validateConnection = (
    appPubkey: string,
    params?: { invoice?: string }
  ): void => {
    // pull connection out of storage
    const connection = localStorage.getItem(appPubkey);

    // if we never issued a connection for this pubkey, do not proceed
    if (!connection) {
      throw new NWCError(ErrorCodes.UNAUTHORIZED);
    }

    // TODO:
    // 1. make sure not expired
    // 2. if there is an invoice, make sure there is a sufficient remaining budget

    // NOTE: No need to validate a signature because if we can decrypt the event content with app's pubkey,
    // then they obviously had a private key

    // return void if everything checks out
    return;
  };

  /**
   * Broadcast kind 23195 response event to nostr
   * @param method nip 47 method
   * @param requestEvent incoming kind 23194 request event
   * @param result result to return if no error (optional)
   * @param error error to return if no result (optional)
   */
  const sendNwcResponse = async (
    method: NWCMethods,
    requestEvent: NDKEvent,
    result?: NWCResult,
    error?: NWCError
  ) => {};

  /**
   * Pay invoice using webln
   * @param params - Input data corresponding to the nip 47 method
   */
  const payInvoice = async (params: {
    invoice: string;
  }): Promise<PayInvoiceResult> => {};

  const requestHandlers = new Map<NWCMethods, (params: any) => Promise<any>>(
    []
  );

  /**
   * Decrypts and processes incoming requests
   * @param event NDKEvent
   */
  const handleNwcRequest = async (event: NDKEvent) => {};

  return {
    generateNwcUri,
    handleNwcRequest,
  };
};

export default useNwc;
