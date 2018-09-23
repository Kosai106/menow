import * as firebase from 'firebase';

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
    added: firebase.firestore.Timestamp | number;
    updated: firebase.firestore.Timestamp | number;
    ttl?: number;

    // Visibility
    public: boolean;
    priority: number;
    save: true;

    // Meta
    meta?: {[k: string]: any};
}

export interface HistoryStatus extends Status {
    removed: firebase.firestore.Timestamp | number;
}

export interface User {
    name: string;
    bio: string;
    url?: string;
    token?: string;
    profile_image?: string;
}

export const defaultStatus: Partial<Status> = {
    icon: '🚀',
    priority: 1,
    public: true,
    save: true,
    text: 'Default Status',
    type: 'status',
}