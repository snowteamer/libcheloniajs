import '@sbp/okturtles.events';
import type { JSONObject, JSONType } from '../types.mjs';
export declare const DELETION = "deletion";
export declare const ENTRY = "entry";
export declare const ERROR = "error";
export declare const KV = "kv";
export declare const KV_FILTER = "kv_filter";
export declare const OK = "ok";
export declare const PING = "ping";
export declare const PONG = "pong";
export declare const PUB = "pub";
export declare const PUSH_ACTION = "push_action";
export declare const RSI = "rsi";
export declare const RSI_ERROR = "rsi-error";
export declare const RSI_OK = "rsi-ok";
export declare const SUB = "sub";
export declare const UNSUB = "unsub";
export declare const VERSION_INFO = "version_info";
export declare const NOTIFICATION_TYPE: Readonly<{
    ENTRY: "entry";
    DELETION: "deletion";
    KV: "kv";
    KV_FILTER: "kv_filter";
    PING: "ping";
    PONG: "pong";
    PUB: "pub";
    SUB: "sub";
    UNSUB: "unsub";
    VERSION_INFO: "version_info";
}>;
export declare const REQUEST_TYPE: Readonly<{
    PUB: "pub";
    SUB: "sub";
    UNSUB: "unsub";
    PUSH_ACTION: "push_action";
    KV_FILTER: "kv_filter";
}>;
export declare const RESPONSE_TYPE: Readonly<{
    ERROR: "error";
    OK: "ok";
}>;
export declare const PUSH_SERVER_ACTION_TYPE: Readonly<{
    SEND_PUBLIC_KEY: "send-public-key";
    STORE_SUBSCRIPTION: "store-subscription";
    DELETE_SUBSCRIPTION: "delete-subscription";
    SEND_PUSH_NOTIFICATION: "send-push-notification";
}>;
export type NotificationTypeEnum = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
export type RequestTypeEnum = (typeof REQUEST_TYPE)[keyof typeof REQUEST_TYPE];
export type ResponseTypeEnum = (typeof RESPONSE_TYPE)[keyof typeof RESPONSE_TYPE];
type JsonSbpInvocation = [selector: string, ...args: JSONType[]];
type TimeoutID = ReturnType<typeof setTimeout>;
export type PubsubOptions = typeof PubsubClient.defaultOptions & {
    handlers: Partial<ClientEventHandlers>;
    messageHandlers: MessageHandlers;
};
export type Message = {
    [key: string]: JSONType;
    type: string;
};
type ClientEventHandlers = {
    close(this: PubsubClient, event: CloseEvent): void;
    error(this: PubsubClient, event: Event): void;
    message(this: PubsubClient, event: MessageEvent): void;
    offline(this: PubsubClient, event: Event): void;
    online(this: PubsubClient, event: Event): void;
    open(this: PubsubClient, event: Event): void;
    'reconnection-attempt'(this: PubsubClient, event: CustomEvent): void;
    'reconnection-succeeded'(this: PubsubClient, event: CustomEvent): void;
    'reconnection-failed'(this: PubsubClient, event: CustomEvent): void;
    'reconnection-scheduled'(this: PubsubClient, event: CustomEvent): void;
    'subscription-succeeded'(this: PubsubClient, event: CustomEvent): void;
};
type MessageHandlers = {
    [ENTRY](this: PubsubClient, msg: {
        data: JSONType;
        type: string;
        [x: string]: unknown;
    }): void;
    [PING](this: PubsubClient, msg: {
        data: JSONType;
    }): void;
    [PUB](this: PubsubClient, msg: {
        channelID: string;
        data: JSONType;
    }): void;
    [KV](this: PubsubClient, msg: {
        channelID: string;
        key: string;
        data: JSONType;
        cid?: string;
    }): void;
    [SUB](this: PubsubClient, msg: {
        channelID: string;
        type: string;
        data: JSONType;
    }): void;
    [UNSUB](this: PubsubClient, msg: {
        channelID: string;
        type: string;
        data: JSONType;
    }): void;
    [ERROR](this: PubsubClient, msg: {
        data: {
            type: string;
            channelID: string;
            data: JSONType;
            reason: string;
            actionType?: string;
            message?: string;
        };
    }): void;
    [OK](this: PubsubClient, msg: {
        data: {
            type: string;
            channelID: string;
            kvFilter?: string[];
        };
    }): void;
    [RSI](this: PubsubClient, msg: RsiMessage): void;
    [RSI_ERROR](this: PubsubClient, msg: RsiErrorMessage): void;
    [RSI_OK](this: PubsubClient, msg: RsiOkMessage): void;
};
export type PubMessage = {
    type: 'pub';
    channelID: string;
    data: JSONType;
};
export type RsiMessage = {
    type: typeof RSI;
    id: string;
    data: JsonSbpInvocation;
};
export type RsiErrorMessage = {
    type: typeof RSI_ERROR;
    to: string;
    data: JSONType;
};
export type RsiOkMessage = {
    type: typeof RSI_OK;
    to: string;
    data: JSONType;
};
export type SubMessage = {
    [key: string]: JSONType;
    type: 'sub';
    channelID: string;
} & {
    kvFilter?: Array<string>;
};
export type UnsubMessage = {
    [key: string]: JSONType;
    type: 'unsub';
    channelID: string;
};
export declare const PUBSUB_ERROR = "pubsub-error";
export declare const PUBSUB_RECONNECTION_ATTEMPT = "pubsub-reconnection-attempt";
export declare const PUBSUB_RECONNECTION_FAILED = "pubsub-reconnection-failed";
export declare const PUBSUB_RECONNECTION_SCHEDULED = "pubsub-reconnection-scheduled";
export declare const PUBSUB_RECONNECTION_SUCCEEDED = "pubsub-reconnection-succeeded";
export declare const PUBSUB_SUBSCRIPTION_SUCCEEDED = "pubsub-subscription-succeeded";
declare class TieredMap<K, L, V> extends Map<K, Map<L, V>> {
    tGet(k1: K, k2: L): V | undefined;
    tHas(k1: K, k2: L): boolean;
    tSet(k1: K, k2: L, v: V): Map<L, V>;
    tDelete(k1: K, k2: L): boolean;
    tClear(k1: K): void;
}
export default class PubsubClient {
    static defaultOptions: {
        logPingMessages: boolean;
        pingTimeout: number;
        maxReconnectionDelay: number;
        maxRetries: number;
        minReconnectionDelay: number;
        reconnectOnDisconnection: boolean;
        reconnectOnOnline: boolean;
        reconnectOnTimeout: boolean;
        reconnectionDelayGrowFactor: number;
        timeout: number;
        maxOpRetries: number;
        opRetryInterval: number;
    };
    connectionTimeoutID?: TimeoutID;
    connectionTimeUsed: number;
    customEventHandlers: Partial<ClientEventHandlers>;
    failedConnectionAttempts: number;
    id: string;
    get isLocal(): boolean;
    isNew: boolean;
    kvFilter: Map<string, string[]>;
    listeners: ClientEventHandlers;
    messageCounter: number;
    messageHandlers: MessageHandlers;
    nextConnectionAttemptDelayID?: TimeoutID;
    options: {
        logPingMessages: boolean;
        pingTimeout: number;
        maxReconnectionDelay: number;
        maxRetries: number;
        minReconnectionDelay: number;
        reconnectOnDisconnection: boolean;
        reconnectOnOnline: boolean;
        reconnectOnTimeout: boolean;
        reconnectionDelayGrowFactor: number;
        timeout: number;
        maxOpRetries: number;
        opRetryInterval: number;
    };
    pendingOperations: TieredMap<string, string, object>;
    pendingRsiOperations: Map<string, RsiMessage>;
    pingTimeoutID?: TimeoutID;
    promiseRejectersByMessageID: Map<string, (reason?: any) => void>;
    promiseResolversByMessageID: Map<string, (value: unknown) => void>;
    shouldReconnect: boolean;
    socket: WebSocket | null;
    subscriptionSet: Set<string>;
    url: string;
    constructor(options?: Partial<PubsubOptions>);
    clearAllTimers(): void;
    /**
     * Performs a connection or reconnection attempt.
     * @param url - A HTTP or WebSocket URL to connect to.
     */
    connect(url: string): void;
    createRsiMessage(data: JsonSbpInvocation): {
        type: "rsi";
        id: string;
        data: JsonSbpInvocation;
    };
    /**
     * Immediately close the socket, stop listening for events and clear any cache.
     *
     * This method is used in unit tests.
     * - In particular, no 'close' event handler will be called.
     * - Any incoming or outgoing buffered data will be discarded.
     * - Any pending messages will be discarded.
     */
    destroy(): void;
    generateMessageID(): string;
    getNextRandomDelay(): number;
    scheduleConnectionAttempt(): void;
    pub(channelID: string, data: JSONType): void;
    rsi(data: JsonSbpInvocation): Promise<unknown>;
    /**
     * Sends a SUB request to the server as soon as possible.
     *
     * - The given channel ID will be cached until we get a relevant server
     * response, allowing us to resend the same request if necessary.
     * - Any identical UNSUB request that has not been sent yet will be cancelled.
     * - Calling this method again before the server has responded has no effect.
     * @param channelID - The ID of the channel whose updates we want to subscribe to.
     */
    sub(channelID: string): void;
    /**
     * Sends a KV_FILTER request to the server as soon as possible.
     */
    setKvFilter(channelID: string, kvFilter?: string[]): void;
    tryRsiOperation(op: RsiMessage): void;
    /**
     * Sends an UNSUB request to the server as soon as possible.
     *
     * - The given channel ID will be cached until we get a relevant server
     * response, allowing us to resend the same request if necessary.
     * - Any identical SUB request that has not been sent yet will be cancelled.
     * - Calling this method again before the server has responded has no effect.
     * @param channelID - The ID of the channel whose updates we want to unsubscribe from.
     */
    unsub(channelID: string): void;
}
export declare function createMessage(type: string, data: JSONType, meta?: object | null | undefined): {
    type: string;
    data: JSONType;
    [x: string]: JSONType;
};
export declare function createKvMessage(channelID: string, key: string, data: JSONType, cid?: string): string;
export declare function createPubMessage(channelID: string, data: JSONType): string;
export declare function createRequest(type: string, data: JSONObject): string;
export declare const messageParser: (data: string) => Message;
export {};
