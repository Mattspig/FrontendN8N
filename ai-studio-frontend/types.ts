import React from 'react';

export type Intent = 'Buyer' | 'Seller' | 'Renter' | 'Other';
export type Action = 'Auto-replied' | 'Routed to Other';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface Conversation {
  id: string;
  senderName: string;
  senderEmail: string;
  intent: Intent;
  confidenceScore: number;
  action: Action;
  label: string;
  responseTime?: string;
  date: string;
  subject: string;
  preview: string;
  fullBody: string;
  aiAnalysis: {
    decisionPath: string[];
    generatedReply?: string;
    detectedEntities: string[];
  };
}

export interface StatMetric {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ComponentType<any>;
  color: string;
}