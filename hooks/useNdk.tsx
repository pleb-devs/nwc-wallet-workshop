import NDK, {
  NDKEvent,
  NDKFilter,
  NDKSubscriptionOptions,
} from "@nostr-dev-kit/ndk";
import React, { createContext, useContext, useEffect, useRef } from "react";

// define types for return value
let NDKContext: React.Context<{
  ndk: NDK;
  keyPair: { privateKey: string; publicKey: string };
  subscribeAndHandle: (
    filter: NDKFilter,
    handler: (event: NDKEvent) => void,
    opts?: NDKSubscriptionOptions
  ) => void;
}>;

export const NDKProvider = ({
  relays,
  children,
}: {
  relays: string[];
  children: React.ReactNode;
}) => {
  const seenEvents = new Set<string>();

  // create a new instance of NDK
  const ndk = useRef(new NDK({ explicitRelayUrls: relays }));

  // connect to relays
  useEffect(() => {
    ndk.current
      .connect()
      .then(() => console.log("NDK connected"))
      .catch(console.error);
  });

  const handleEvent = (event: NDKEvent, handler: (event: NDKEvent) => void) => {
    const seen = seenEvents.has(event.id);

    if (seen) {
      return;
    } else {
      seenEvents.add(event.id);
    }

    handler(event);
  };

  const subscribeAndHandle = (
    filter: NDKFilter,
    handler: (event: NDKEvent) => void,
    opts?: NDKSubscriptionOptions
  ) => {
    // subscribe to the filter
    const sub = ndk.current.subscribe(filter, opts);

    // handle the filter
    sub.on("event", (e: NDKEvent) => handleEvent(e, handler));
  };

  // this is what will be returned by the hook
  const contextValue = {
    ndk: ndk.current,
    subscribeAndHandle,
    keyPair: { privateKey: "", publicKey: "" },
  };

  // set the value of the context
  NDKContext = createContext(contextValue);

  // sets context value and returns a "provider"
  return (
    <NDKContext.Provider value={contextValue}>{children}</NDKContext.Provider>
  );
};

// gives all components access to what's defined in `contextValue`
export const useNdk = () => useContext(NDKContext);
