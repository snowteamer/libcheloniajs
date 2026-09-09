import '@sbp/okturtles.events';
import type { JSONObject, JSONType } from '../types.cjs';
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
type TimeoutID = ReturnType<typeof setTimeout>;
export type Options = {
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
    handlers?: Partial<ClientEventHandlers>;
    messageHandlers?: Partial<MessageHandlers>;
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
    [NOTIFICATION_TYPE.ENTRY](this: PubsubClient, msg: {
        data: JSONType;
        type: string;
        [x: string]: unknown;
    }): void;
    [NOTIFICATION_TYPE.PING](this: PubsubClient, msg: {
        data: JSONType;
    }): void;
    [NOTIFICATION_TYPE.PUB](this: PubsubClient, msg: {
        channelID: string;
        data: JSONType;
    }): void;
    [NOTIFICATION_TYPE.KV](this: PubsubClient, msg: {
        channelID: string;
        key: string;
        data: JSONType;
        cid?: string;
    }): void;
    [NOTIFICATION_TYPE.SUB](this: PubsubClient, msg: {
        channelID: string;
        type: string;
        data: JSONType;
    }): void;
    [NOTIFICATION_TYPE.UNSUB](this: PubsubClient, msg: {
        channelID: string;
        type: string;
        data: JSONType;
    }): void;
    [RESPONSE_TYPE.ERROR](this: PubsubClient, msg: {
        data: {
            type: string;
            channelID: string;
            data: JSONType;
            reason: string;
            actionType?: string;
            message?: string;
        };
    }): void;
    [RESPONSE_TYPE.OK](this: PubsubClient, msg: {
        data: {
            type: string;
            channelID: string;
            kvFilter?: string[];
        };
    }): void;
};
export type PubMessage = {
    type: 'pub';
    channelID: string;
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
    connectionTimeoutID?: TimeoutID;
    connectionTimeUsed: number;
    customEventHandlers: Partial<ClientEventHandlers>;
    failedConnectionAttempts: number;
    get isLocal(): boolean;
    isNew: boolean;
    kvFilter: Map<string, string[]>;
    listeners: ClientEventHandlers;
    messageHandlers: MessageHandlers;
    nextConnectionAttemptDelayID?: TimeoutID;
    options: Options;
    pendingOperations: TieredMap<RequestTypeEnum, string, object>;
    pingTimeoutID?: TimeoutID;
    shouldReconnect: boolean;
    socket: WebSocket | null;
    subscriptionSet: Set<string>;
    url: string;
    /**
     *
     * @param {Partial<Options>} options
     */
    constructor(options?: Partial<Options>);
    clearAllTimers(): void;
    /**
     * Performs a connection or reconnection attempt.
     * @param url - A HTTP or WebSocket URL to connect to.
     */
    connect(url: string): void;
    /**
     * Immediately close the socket, stop listening for events and clear any cache.
     *
     * This method is used in unit tests.
     * - In particular, no 'close' event handler will be called.
     * - Any incoming or outgoing buffered data will be discarded.
     * - Any pending messages will be discarded.
     */
    destroy(): void;
    getNextRandomDelay(): number;
    scheduleConnectionAttempt(): void;
    pub(channelID: string, data: JSONType): void;
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
export declare function createRequest(type: RequestTypeEnum, data: JSONObject): string;
export declare const messageParser: (data: string) => Message;
export {};
