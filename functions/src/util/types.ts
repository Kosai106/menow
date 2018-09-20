import * as firebase from 'firebase-admin';

export interface Status {
    // Basic
    type: string;

    // Design
    icon: string;
    text: string;
    color?: string;

    // Link
    link?: string;
    link_text?: string;

    // Time Info
    added: firebase.firestore.Timestamp;
    updated: firebase.firestore.Timestamp;
    ttl?: number;

    // Visibility
    public: boolean;
    priority: number;
    save: true;

    // Meta
    meta?: {[k: string]: any};
}

export interface HistoryStatus extends Status {
    type: string;
    removed: firebase.firestore.Timestamp;
}

export interface User {
    name: string;
    bio: string;
    token: string;
}

export const defaultStatus: Partial<Status> = {
    type: 'status',
    icon: '🚀',
    text: 'Default Status',
    public: true,
    save: true,
    priority: 1,
}