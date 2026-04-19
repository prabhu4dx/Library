"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// ============================================================
// DATA LAYER
// ============================================================

const VENDORS = [
    // Enterprise
    {
        id: 'outreach', cat: 'enterprise', name: 'Outreach', tag: 'The Incumbent Rebrand', founded: 2014, hq: 'Seattle', funding: '$489M', fundingNum: 489, valuation: '$4.4B (2021)', rating: '4.3', reviews: '3,536', price: '~$120/seat/mo', priceNum: 120, priceModel: 'per-seat', target: 'Mid/Enterprise', color: '#4f46e5',
        scores: { autonomy: 7, data: 7, signal: 6, deliverability: 5, channels: 8, enterprise: 10, price: 3, maturity: 10 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'full', voice: 'partial', signals: 'partial', crmWrite: 'full', humanGate: 'full', multiAgent: 'full', mcp: 'partial' },
        channels: ['Email', 'Phone', 'LinkedIn tasks', 'SMS'], llm: 'Undisclosed', languages: '30+', integrations: 'Salesforce (deep), Dynamics, HubSpot, SAP, Marketo, 6sense, ZoomInfo',
    },
    {
        id: 'salesloft', cat: 'enterprise', name: 'Salesloft', tag: 'Vista → Clari Merger', founded: 2011, hq: 'Atlanta', funding: '$246M', fundingNum: 246, valuation: '~$2.3B', rating: '4.5', reviews: '4,269', price: '~$150/seat/mo', priceNum: 150, priceModel: 'per-seat', target: 'Mid/Enterprise', color: '#0ea5e9',
        scores: { autonomy: 7, data: 6, signal: 8, deliverability: 5, channels: 8, enterprise: 10, price: 3, maturity: 10 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'full', voice: 'partial', signals: 'full', crmWrite: 'full', humanGate: 'full', multiAgent: 'partial', mcp: 'partial' },
        channels: ['Email', 'Phone', 'LinkedIn', 'SMS', 'Drift chat'], llm: 'Undisclosed', languages: '20+', integrations: 'Salesforce, HubSpot, Clari (native), Drift, G2, Seismic',
    },
    {
        id: 'agentforce', cat: 'enterprise', name: 'Agentforce', tag: 'Salesforce Atlas Engine', founded: 2024, hq: 'San Francisco', funding: 'Public', fundingNum: 9999, valuation: '$300B+ cap', rating: '4.4', reviews: '—', price: '$0.10/action + seat', priceNum: 135, priceModel: 'usage-hybrid', target: 'Enterprise', color: '#00a1e0',
        scores: { autonomy: 8, data: 9, signal: 7, deliverability: 5, channels: 7, enterprise: 10, price: 2, maturity: 7 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'partial', voice: 'partial', signals: 'full', crmWrite: 'full', humanGate: 'full', multiAgent: 'full', mcp: 'full' },
        channels: ['Email', 'Slack', 'Salesforce-native'], llm: 'OpenAI + Anthropic + Gemini + Cohere + xGen', languages: '30+', integrations: 'Salesforce (native), Slack, AgentExchange',
    },
    {
        id: 'hubspot', cat: 'enterprise', name: 'Breeze', tag: "HubSpot's Outcome Bet", founded: 2024, hq: 'Cambridge MA', funding: 'Public', fundingNum: 9999, valuation: '$29–38B cap', rating: '4.4', reviews: '—', price: '$1/qualified lead', priceNum: 90, priceModel: 'outcome', target: 'SMB/Mid', color: '#ff7a59',
        scores: { autonomy: 7, data: 8, signal: 7, deliverability: 5, channels: 7, enterprise: 8, price: 8, maturity: 7 },
        capabilities: { autoSend: 'partial', research: 'full', replyHandling: 'partial', multiChannel: 'partial', voice: 'none', signals: 'full', crmWrite: 'full', humanGate: 'full', multiAgent: 'partial', mcp: 'full' },
        channels: ['Email', 'LinkedIn', 'CRM-native'], llm: 'Undisclosed', languages: '20+', integrations: 'HubSpot Smart CRM (native), 1,000+ Marketplace',
    },

    // Autonomous
    {
        id: 'artisan', cat: 'autonomous', name: 'Artisan', tag: '"Stop Hiring Humans"', founded: 2023, hq: 'San Francisco', funding: '$38.5M', fundingNum: 38.5, valuation: '~$5M ARR', rating: '3.9', reviews: '22', price: '~$2,000/mo', priceNum: 2000, priceModel: 'flat-tier', target: 'SMB–Mid', color: '#be185d',
        scores: { autonomy: 10, data: 7, signal: 6, deliverability: 6, channels: 6, enterprise: 5, price: 4, maturity: 5 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'partial', voice: 'partial', signals: 'partial', crmWrite: 'partial', humanGate: 'partial', multiAgent: 'full', mcp: 'none' },
        channels: ['Email', 'LinkedIn', 'Phone (dial)'], llm: 'Anthropic Claude', languages: '10+', integrations: 'HubSpot, Salesforce, Apollo',
    },
    {
        id: '11x', cat: 'autonomous', name: '11x', tag: 'The Cautionary Tale', founded: 2022, hq: 'London→SF', funding: '$76M', fundingNum: 76, valuation: '~$350M', rating: 'Mixed', reviews: '—', price: '~$5,000/mo', priceNum: 5000, priceModel: 'flat-tier', target: 'Mid–Enterprise', color: '#dc2626',
        scores: { autonomy: 10, data: 6, signal: 5, deliverability: 5, channels: 8, enterprise: 6, price: 2, maturity: 5 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'partial', multiChannel: 'full', voice: 'full', signals: 'partial', crmWrite: 'partial', humanGate: 'partial', multiAgent: 'full', mcp: 'none' },
        channels: ['Email', 'LinkedIn', 'Voice AI (Julian)'], llm: 'OpenAI + Anthropic (hierarchical)', languages: '10+', integrations: 'HubSpot, Salesforce',
    },
    {
        id: 'aisdr', cat: 'autonomous', name: 'AiSDR', tag: 'Transparent Pricing', founded: 2023, hq: 'SF', funding: '$3.5M', fundingNum: 3.5, valuation: 'Undisclosed', rating: '4.7', reviews: '76', price: '$900/mo', priceNum: 900, priceModel: 'tier', target: 'SMB–Mid', color: '#0891b2',
        scores: { autonomy: 9, data: 8, signal: 7, deliverability: 6, channels: 6, enterprise: 6, price: 6, maturity: 6 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'partial', voice: 'partial', signals: 'full', crmWrite: 'partial', humanGate: 'partial', multiAgent: 'partial', mcp: 'none' },
        channels: ['Email', 'LinkedIn', 'Aircall'], llm: 'GPT-5', languages: '20+', integrations: 'HubSpot, Salesforce, Aircall',
    },
    {
        id: 'salesforge', cat: 'autonomous', name: 'Salesforge', tag: 'The Forge Stack', founded: 2023, hq: 'Tallinn', funding: '$501K', fundingNum: 0.5, valuation: 'Undisclosed', rating: '4.6', reviews: '—', price: '$499/mo', priceNum: 499, priceModel: 'tier', target: 'Founder/SMB', color: '#ea580c',
        scores: { autonomy: 8, data: 7, signal: 4, deliverability: 9, channels: 5, enterprise: 4, price: 8, maturity: 6 },
        capabilities: { autoSend: 'full', research: 'partial', replyHandling: 'partial', multiChannel: 'partial', voice: 'none', signals: 'none', crmWrite: 'partial', humanGate: 'partial', multiAgent: 'partial', mcp: 'none' },
        channels: ['Email', 'LinkedIn'], llm: 'Undisclosed', languages: '20+', integrations: 'HubSpot (primary), CSV/API',
    },
    {
        id: 'topo', cat: 'autonomous', name: 'Topo.io', tag: 'The GTM Engineer', founded: 2022, hq: 'Paris', funding: '$1.6M', fundingNum: 1.6, valuation: 'Undisclosed', rating: '4.9', reviews: '118', price: '$875/mo', priceNum: 875, priceModel: 'tier', target: 'Mid', color: '#7c3aed',
        scores: { autonomy: 8, data: 7, signal: 9, deliverability: 6, channels: 7, enterprise: 7, price: 6, maturity: 6 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'full', voice: 'none', signals: 'full', crmWrite: 'full', humanGate: 'partial', multiAgent: 'full', mcp: 'none' },
        channels: ['Email', 'LinkedIn', 'Phone'], llm: 'Undisclosed (custom-trained)', languages: '15+', integrations: 'Salesforce, HubSpot',
    },
    {
        id: 'persana', cat: 'autonomous', name: 'Persana AI', tag: 'Agent Layer for GTM', founded: 2023, hq: 'SF', funding: '$3.1M', fundingNum: 3.1, valuation: 'Undisclosed', rating: '~4.5', reviews: '—', price: '$68/mo', priceNum: 68, priceModel: 'tier', target: 'SMB', color: '#059669',
        scores: { autonomy: 7, data: 10, signal: 8, deliverability: 5, channels: 5, enterprise: 5, price: 9, maturity: 5 },
        capabilities: { autoSend: 'partial', research: 'full', replyHandling: 'partial', multiChannel: 'partial', voice: 'none', signals: 'full', crmWrite: 'partial', humanGate: 'partial', multiAgent: 'partial', mcp: 'none' },
        channels: ['Email (push)', 'LinkedIn'], llm: 'Fine-tuned + RAG', languages: '10+', integrations: 'Salesforce, HubSpot, Pipedrive, Outreach, Salesloft, Apollo',
    },
    {
        id: 'relevance', cat: 'autonomous', name: 'Relevance AI', tag: 'AI Workforce OS', founded: 2020, hq: 'Sydney/SF', funding: '$37M', fundingNum: 37, valuation: 'Undisclosed', rating: '4.5', reviews: '—', price: '$19–599/mo', priceNum: 299, priceModel: 'tier', target: 'Mid–Enterprise', color: '#2563eb',
        scores: { autonomy: 9, data: 7, signal: 7, deliverability: 5, channels: 8, enterprise: 7, price: 6, maturity: 7 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'full', voice: 'partial', signals: 'partial', crmWrite: 'full', humanGate: 'full', multiAgent: 'full', mcp: 'partial' },
        channels: ['Email', 'LinkedIn', 'WhatsApp', 'Slack', 'Teams'], llm: 'Platform-agnostic', languages: '20+', integrations: '9,000+ via Zapier, 2,000+ native',
    },
    {
        id: 'regie', cat: 'autonomous', name: 'Regie.ai', tag: 'RegieOne Native SEP', founded: 2020, hq: 'SF', funding: '$65.6M', fundingNum: 65.6, valuation: 'Undisclosed', rating: '~4.5', reviews: '—', price: '~$35K/yr', priceNum: 2916, priceModel: 'enterprise', target: 'Mid–Enterprise', color: '#db2777',
        scores: { autonomy: 9, data: 7, signal: 7, deliverability: 6, channels: 8, enterprise: 8, price: 3, maturity: 7 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'full', voice: 'full', signals: 'full', crmWrite: 'full', humanGate: 'full', multiAgent: 'full', mcp: 'none' },
        channels: ['Email', 'LinkedIn', 'Phone (parallel dialer)'], llm: 'Undisclosed', languages: '15+', integrations: 'HubSpot, Salesforce, Outreach, Salesloft',
    },
    {
        id: 'rox', cat: 'autonomous', name: 'Rox', tag: 'Agentic CRM', founded: 2024, hq: 'SF', funding: '$50M+', fundingNum: 50, valuation: '$1.2B (Mar 2026)', rating: '—', reviews: '—', price: 'Enterprise', priceNum: 3000, priceModel: 'enterprise', target: 'Enterprise', color: '#7e22ce',
        scores: { autonomy: 9, data: 8, signal: 8, deliverability: 5, channels: 7, enterprise: 9, price: 2, maturity: 4 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'full', voice: 'none', signals: 'full', crmWrite: 'full', humanGate: 'full', multiAgent: 'full', mcp: 'partial' },
        channels: ['Email', 'LinkedIn', 'CRM-native'], llm: 'Undisclosed', languages: '10+', integrations: 'Salesforce, HubSpot',
    },
    {
        id: 'piper', cat: 'autonomous', name: 'Qualified Piper', tag: 'Inbound AI Leader', founded: 2018, hq: 'SF', funding: '$163M', fundingNum: 163, valuation: 'Undisclosed', rating: '4.9', reviews: '1,500+', price: 'Enterprise', priceNum: 2500, priceModel: 'enterprise', target: 'Enterprise', color: '#0d9488',
        scores: { autonomy: 10, data: 8, signal: 8, deliverability: 6, channels: 6, enterprise: 10, price: 3, maturity: 9 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'partial', voice: 'partial', signals: 'full', crmWrite: 'full', humanGate: 'full', multiAgent: 'full', mcp: 'partial' },
        channels: ['Website chat', 'Voice', 'Email (follow-up)', 'Demandbase ABM'], llm: 'Proprietary + partners', languages: '20+', integrations: 'Salesforce, HubSpot, Demandbase',
    },
    {
        id: 'landbase', cat: 'autonomous', name: 'Landbase', tag: 'GTM-1 Omni Model', founded: 2024, hq: 'SF', funding: '$42.5M', fundingNum: 42.5, valuation: 'Undisclosed', rating: '—', reviews: '—', price: 'Enterprise', priceNum: 2500, priceModel: 'enterprise', target: 'Mid–Enterprise', color: '#ca8a04',
        scores: { autonomy: 10, data: 9, signal: 9, deliverability: 6, channels: 7, enterprise: 8, price: 3, maturity: 4 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'full', voice: 'partial', signals: 'full', crmWrite: 'full', humanGate: 'partial', multiAgent: 'full', mcp: 'none' },
        channels: ['Email', 'LinkedIn', 'Phone'], llm: 'Proprietary GTM-1/2 Omni', languages: '15+', integrations: 'Salesforce, HubSpot',
    },
    {
        id: 'nooks', cat: 'autonomous', name: 'Nooks', tag: 'Voice AI Dialer', founded: 2020, hq: 'SF', funding: '$70M', fundingNum: 70, valuation: 'Undisclosed', rating: '4.7', reviews: '—', price: '~$5K/user/yr', priceNum: 416, priceModel: 'per-seat', target: 'Mid–Enterprise', color: '#be123c',
        scores: { autonomy: 8, data: 6, signal: 5, deliverability: 3, channels: 4, enterprise: 8, price: 4, maturity: 7 },
        capabilities: { autoSend: 'partial', research: 'partial', replyHandling: 'partial', multiChannel: 'partial', voice: 'full', signals: 'partial', crmWrite: 'full', humanGate: 'full', multiAgent: 'partial', mcp: 'none' },
        channels: ['Phone (parallel dialer)', 'AI coach'], llm: 'Undisclosed', languages: 'English', integrations: 'Salesforce, HubSpot, Outreach, Salesloft',
    },

    // Signal
    {
        id: 'clay', cat: 'signal', name: 'Clay', tag: 'The Orchestration Layer', founded: 2017, hq: 'Brooklyn', funding: '$204M+', fundingNum: 204, valuation: '$3.1B (Aug 2025)', rating: 'High', reviews: '—', price: '$185/mo', priceNum: 185, priceModel: 'credit', target: 'Mid–Enterprise', color: '#f59e0b',
        scores: { autonomy: 6, data: 10, signal: 10, deliverability: 6, channels: 5, enterprise: 8, price: 7, maturity: 8 },
        capabilities: { autoSend: 'partial', research: 'full', replyHandling: 'partial', multiChannel: 'partial', voice: 'none', signals: 'full', crmWrite: 'full', humanGate: 'full', multiAgent: 'full', mcp: 'full' },
        channels: ['Email (native)', 'Push to Outreach/Salesloft/HubSpot'], llm: 'Anthropic + OpenAI + Gemini', languages: '30+', integrations: '150+ data providers, 3M+ companies tracked',
    },
    {
        id: 'usergems', cat: 'signal', name: 'UserGems', tag: 'Job-Change Signal', founded: 2015, hq: 'SF', funding: '$22.4M', fundingNum: 22.4, valuation: 'Undisclosed', rating: '4.7', reviews: '144', price: '~$10K/yr', priceNum: 833, priceModel: 'enterprise', target: 'Mid–Enterprise', color: '#10b981',
        scores: { autonomy: 5, data: 8, signal: 9, deliverability: 5, channels: 4, enterprise: 9, price: 5, maturity: 9 },
        capabilities: { autoSend: 'none', research: 'full', replyHandling: 'none', multiChannel: 'none', voice: 'none', signals: 'full', crmWrite: 'full', humanGate: 'full', multiAgent: 'partial', mcp: 'none' },
        channels: ['Drafts only — requires Outreach/Salesloft/Gong/HubSpot to send'], llm: 'Undisclosed', languages: 'English', integrations: 'Outreach, Salesloft, Gong Engage, HubSpot',
    },
    {
        id: 'unify', cat: 'signal', name: 'Unify', tag: 'Coined Warm Outbound', founded: 2023, hq: 'SF', funding: '$52.3M', fundingNum: 52.3, valuation: '$260M (May 2025)', rating: '4.7', reviews: '37', price: '~$1,740/mo', priceNum: 1740, priceModel: 'credit', target: 'Mid–Enterprise', color: '#3b82f6',
        scores: { autonomy: 8, data: 9, signal: 10, deliverability: 6, channels: 6, enterprise: 8, price: 4, maturity: 6 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'full', voice: 'none', signals: 'full', crmWrite: 'full', humanGate: 'full', multiAgent: 'full', mcp: 'partial' },
        channels: ['Email', 'LinkedIn'], llm: 'Undisclosed', languages: '15+', integrations: '6sense, Clearbit, Demandbase, Snitcher, Salesforce, HubSpot',
    },
    {
        id: 'commonroom', cat: 'signal', name: 'Common Room', tag: '50+ Signal Sources', founded: 2020, hq: 'Seattle', funding: '$52.9M', fundingNum: 52.9, valuation: 'Undisclosed', rating: '4.5', reviews: '106', price: '~$1,000/mo', priceNum: 1000, priceModel: 'credit', target: 'Mid–Enterprise', color: '#8b5cf6',
        scores: { autonomy: 7, data: 8, signal: 10, deliverability: 4, channels: 5, enterprise: 8, price: 5, maturity: 7 },
        capabilities: { autoSend: 'partial', research: 'full', replyHandling: 'partial', multiChannel: 'partial', voice: 'none', signals: 'full', crmWrite: 'full', humanGate: 'full', multiAgent: 'full', mcp: 'none' },
        channels: ['Email', 'Slack internal'], llm: 'Undisclosed', languages: 'English', integrations: 'Slack, Discord, GitHub, npm, Bombora, Salesforce, HubSpot',
    },
    {
        id: 'coldreach', cat: 'signal', name: 'Coldreach', tag: 'Plain-English Intent', founded: 2023, hq: 'SF', funding: 'Seed', fundingNum: 1, valuation: 'Undisclosed', rating: '~4', reviews: '12', price: '$749/mo', priceNum: 749, priceModel: 'tier', target: 'SMB–Mid', color: '#0284c7',
        scores: { autonomy: 8, data: 8, signal: 9, deliverability: 8, channels: 3, enterprise: 5, price: 6, maturity: 4 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'partial', multiChannel: 'none', voice: 'none', signals: 'full', crmWrite: 'partial', humanGate: 'partial', multiAgent: 'partial', mcp: 'none' },
        channels: ['Email only'], llm: 'Undisclosed', languages: 'English', integrations: 'HubSpot, Salesforce, Slack, Gong',
    },

    // Copilot
    {
        id: 'amplemarket', cat: 'copilot', name: 'Amplemarket', tag: 'Augment Not Replace', founded: 2019, hq: 'SF/Portugal', funding: '$12M', fundingNum: 12, valuation: 'Undisclosed', rating: '4.6', reviews: '571', price: '~$600+/mo', priceNum: 600, priceModel: 'per-seat', target: 'SMB–Mid', color: '#4338ca',
        scores: { autonomy: 7, data: 8, signal: 8, deliverability: 8, channels: 9, enterprise: 8, price: 5, maturity: 8 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'full', voice: 'full', signals: 'full', crmWrite: 'full', humanGate: 'full', multiAgent: 'full', mcp: 'none' },
        channels: ['Email', 'LinkedIn', 'Phone', 'SMS', 'Voice', 'Social'], llm: 'Undisclosed', languages: '20+', integrations: 'Salesforce, HubSpot, Outreach, Salesloft',
    },
    {
        id: 'instantly', cat: 'copilot', name: 'Instantly', tag: 'Bootstrapped to $20M+ ARR', founded: 2021, hq: 'Tallinn', funding: 'Bootstrapped', fundingNum: 0, valuation: '$20M+ ARR', rating: '4.8', reviews: '2,500+', price: '$37.60/mo', priceNum: 37.60, priceModel: 'flat-fee', target: 'SMB/Agency', color: '#16a34a',
        scores: { autonomy: 6, data: 7, signal: 6, deliverability: 10, channels: 5, enterprise: 5, price: 10, maturity: 7 },
        capabilities: { autoSend: 'full', research: 'partial', replyHandling: 'full', multiChannel: 'partial', voice: 'partial', signals: 'partial', crmWrite: 'partial', humanGate: 'partial', multiAgent: 'partial', mcp: 'none' },
        channels: ['Email', 'SMS (Hyper CRM)', 'Calls (Hyper CRM)'], llm: 'Undisclosed', languages: '30+', integrations: 'HubSpot, Salesforce, Zapier, Webhooks',
    },
    {
        id: 'reply', cat: 'copilot', name: 'Reply.io', tag: 'Jason AI (Mar 2023)', founded: 2014, hq: 'San Jose/Ukraine', funding: '$400K', fundingNum: 0.4, valuation: '$14.7M ARR', rating: '4.6', reviews: '1,528', price: '$59/seat/mo', priceNum: 59, priceModel: 'per-seat', target: 'SMB–Mid', color: '#0369a1',
        scores: { autonomy: 7, data: 9, signal: 6, deliverability: 7, channels: 9, enterprise: 7, price: 8, maturity: 8 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'full', multiChannel: 'full', voice: 'partial', signals: 'partial', crmWrite: 'full', humanGate: 'full', multiAgent: 'partial', mcp: 'none' },
        channels: ['Email', 'LinkedIn', 'Calls', 'SMS', 'WhatsApp'], llm: 'GPT', languages: '20+', integrations: 'Salesforce, HubSpot, Pipedrive, Zapier',
    },
    {
        id: 'apollo', cat: 'copilot', name: 'Apollo.io', tag: 'Largest by Revenue', founded: 2015, hq: 'SF', funding: '$251.3M', fundingNum: 251.3, valuation: '$1.6B (Aug 2023)', rating: '4.7', reviews: '9,000+', price: '$49/seat/mo', priceNum: 49, priceModel: 'per-seat', target: 'SMB–Mid', color: '#6366f1',
        scores: { autonomy: 6, data: 10, signal: 7, deliverability: 6, channels: 8, enterprise: 7, price: 9, maturity: 10 },
        capabilities: { autoSend: 'full', research: 'full', replyHandling: 'partial', multiChannel: 'full', voice: 'full', signals: 'full', crmWrite: 'full', humanGate: 'full', multiAgent: 'partial', mcp: 'none' },
        channels: ['Email', 'LinkedIn tasks', 'Phone (parallel dialer)'], llm: 'Undisclosed', languages: '20+', integrations: 'Salesforce, HubSpot, LinkedIn, Gmail, Outlook',
    },
    {
        id: 'lavender', cat: 'copilot', name: 'Lavender', tag: 'Shadow AI for Emails', founded: 2020, hq: 'New York', funding: '$14.2M', fundingNum: 14.2, valuation: 'Undisclosed', rating: 'High', reviews: '—', price: '$27/mo', priceNum: 27, priceModel: 'per-seat', target: 'Individual–Mid', color: '#a855f7',
        scores: { autonomy: 2, data: 6, signal: 4, deliverability: 5, channels: 3, enterprise: 6, price: 10, maturity: 7 },
        capabilities: { autoSend: 'none', research: 'partial', replyHandling: 'none', multiChannel: 'none', voice: 'none', signals: 'partial', crmWrite: 'partial', humanGate: 'full', multiAgent: 'none', mcp: 'none' },
        channels: ['Email (Chrome extension in Gmail/Outlook)'], llm: 'Proprietary 2B email corpus + OpenAI', languages: '15+', integrations: 'Gmail, Outlook, Salesforce, HubSpot, Outreach, Salesloft',
    },

    // Infrastructure
    {
        id: 'smartlead', cat: 'infra', name: 'Smartlead', tag: 'Unlimited Inboxes', founded: 2021, hq: 'Sydney', funding: 'Bootstrapped', fundingNum: 0, valuation: '$20M+ ARR', rating: '4.6', reviews: '286', price: '$39/mo', priceNum: 39, priceModel: 'flat-fee', target: 'Agency/SMB', color: '#0f766e',
        scores: { autonomy: 5, data: 6, signal: 4, deliverability: 10, channels: 5, enterprise: 5, price: 10, maturity: 7 },
        capabilities: { autoSend: 'full', research: 'partial', replyHandling: 'full', multiChannel: 'partial', voice: 'partial', signals: 'partial', crmWrite: 'partial', humanGate: 'partial', multiAgent: 'partial', mcp: 'none' },
        channels: ['Email (unlimited inboxes)', 'SmartDialer (AI calls)'], llm: 'Undisclosed', languages: '20+', integrations: 'HubSpot, Salesforce, Zapier, Webhooks, whitelabel',
    },
    {
        id: 'lemlist', cat: 'infra', name: 'Lemlist', tag: 'Dynamic Personalization', founded: 2018, hq: 'Paris', funding: 'Bootstrapped', fundingNum: 0, valuation: '$40–45M ARR', rating: '4.4', reviews: '1,424', price: '€69/seat/mo', priceNum: 75, priceModel: 'per-seat', target: 'SMB–Mid', color: '#ec4899',
        scores: { autonomy: 6, data: 7, signal: 6, deliverability: 9, channels: 7, enterprise: 6, price: 8, maturity: 9 },
        capabilities: { autoSend: 'full', research: 'partial', replyHandling: 'full', multiChannel: 'full', voice: 'partial', signals: 'full', crmWrite: 'full', humanGate: 'full', multiAgent: 'partial', mcp: 'none' },
        channels: ['Email', 'LinkedIn', 'Calls', 'WhatsApp'], llm: 'Undisclosed', languages: '25+', integrations: 'HubSpot, Salesforce, Pipedrive, Zapier',
    },
    {
        id: 'forge', cat: 'infra', name: 'Mailforge Suite', tag: 'Full Vertical Stack', founded: 2024, hq: 'Tallinn', funding: 'Salesforge', fundingNum: 0.5, valuation: '—', rating: '4.6+', reviews: '—', price: '$2–4.5/mailbox', priceNum: 3, priceModel: 'usage', target: 'Agency/SMB', color: '#f97316',
        scores: { autonomy: 5, data: 8, signal: 3, deliverability: 10, channels: 3, enterprise: 5, price: 10, maturity: 5 },
        capabilities: { autoSend: 'full', research: 'partial', replyHandling: 'partial', multiChannel: 'none', voice: 'none', signals: 'none', crmWrite: 'none', humanGate: 'partial', multiAgent: 'none', mcp: 'none' },
        channels: ['Email infrastructure'], llm: 'N/A', languages: 'N/A', integrations: 'Salesforge, API, CSV',
    },
];

// Timeline events
const TIMELINE_EVENTS = [
    { year: 2011, month: 1, type: 'founding', label: 'Salesloft founded', detail: 'Kyle Porter + Cummings + Forman + Dorr in Atlanta' },
    { year: 2014, month: 1, type: 'founding', label: 'Outreach founded', detail: 'Manny Medina + team pivot from GroupTalent' },
    { year: 2014, month: 1, type: 'founding', label: 'Reply.io founded', detail: 'Oleg Bilozor, Ukrainian/San Jose' },
    { year: 2015, month: 1, type: 'founding', label: 'UserGems founded', detail: 'Kletzl brothers, YC S14, SF' },
    { year: 2015, month: 1, type: 'founding', label: 'Apollo.io founded', detail: 'As ZenProspect, YC W16' },
    { year: 2017, month: 6, type: 'founding', label: 'Clay founded', detail: 'Amin + Rusan in Brooklyn' },
    { year: 2018, month: 1, type: 'founding', label: 'Lemlist founded', detail: '$1,000 starting capital, Paris' },
    { year: 2018, month: 1, type: 'founding', label: 'Qualified founded', detail: 'Ex-Salesforce CMO Swensrud' },
    { year: 2019, month: 1, type: 'founding', label: 'Amplemarket founded', detail: 'Portuguese founders, SF + Portugal' },
    { year: 2020, month: 1, type: 'founding', label: 'Relevance / Common Room / Lavender / Nooks / Regie all founded', detail: 'Pandemic-era cohort' },
    { year: 2021, month: 1, type: 'founding', label: 'Instantly founded', detail: 'Kaevand + Schneider, bootstrapped' },
    { year: 2022, month: 1, type: 'founding', label: 'Topo.io founded', detail: 'Ex-Aircall team, Paris' },
    { year: 2022, month: 12, type: 'founding', label: '11x founded', detail: 'Hasan Sukkar in London' },
    { year: 2023, month: 3, type: 'product', label: 'Jason AI launches (Reply.io)', detail: 'One of earliest ChatGPT-powered AI sales assistants' },
    { year: 2023, month: 7, type: 'founding', label: 'Artisan founded', detail: 'Jaspar Carmichael-Jack, YC W24' },
    { year: 2023, month: 8, type: 'founding', label: 'AiSDR + Salesforge + Persana + Unify all founded', detail: 'YC S23 cohort' },
    { year: 2023, month: 8, type: 'funding', label: 'Apollo Series D — $100M at $1.6B', detail: 'First sales-tech unicorn of 2023 (Bain CV)' },
    { year: 2024, month: 2, type: 'reg', label: 'FCC rules AI voice = "artificial voice"', detail: 'TCPA applies; $500–$1,500 per call, no cap' },
    { year: 2024, month: 2, type: 'reg', label: 'Google/Yahoo bulk sender rules', detail: 'SPF + DKIM + DMARC, 1-click unsub, <0.3% spam' },
    { year: 2024, month: 4, type: 'product', label: 'Piper (Qualified) launches', detail: 'Inbound AI SDR' },
    { year: 2024, month: 4, type: 'product', label: 'Bosh (Relevance AI) launches', detail: 'AI BDR Agent' },
    { year: 2024, month: 6, type: 'funding', label: 'Clay Series B — $46M at $500M', detail: 'Meritech-led' },
    { year: 2024, month: 9, type: 'funding', label: '11x Series A — $24M (Benchmark)', detail: '~$90M valuation' },
    { year: 2024, month: 9, type: 'product', label: 'Agentforce launches at Dreamforce', detail: 'Sep 12, 2024 — Einstein SDR Agent (GA Oct)' },
    { year: 2024, month: 9, type: 'product', label: 'Amplemarket Duo launches', detail: '3 agents: Signal, Research, Sequence' },
    { year: 2024, month: 9, type: 'product', label: 'HubSpot Breeze launches', detail: 'INBOUND 2024, Sep 18' },
    { year: 2024, month: 11, type: 'funding', label: '11x Series B — $50M (a16z)', detail: '~$350M valuation' },
    { year: 2024, month: 11, type: 'funding', label: 'Rox $50M seed+A (Sequoia + GC)', detail: 'Stanford-linked founding team' },
    { year: 2024, month: 12, type: 'marketing', label: 'Artisan SF billboard campaign', detail: '"Stop Hiring Humans" — drove ~$2M ARR + backlash' },
    { year: 2025, month: 2, type: 'funding', label: 'Regie.ai Series B — $30M', detail: 'Scale Venture Partners' },
    { year: 2025, month: 2, type: 'funding', label: 'Salesloft + Drift merger', detail: 'Both Vista-owned' },
    { year: 2025, month: 3, type: 'crisis', label: '11x reputational crisis', detail: 'TechCrunch: displayed non-customer logos (ZoomInfo, Airtable)' },
    { year: 2025, month: 4, type: 'funding', label: 'Artisan Series A — $25M (Glade Brook)', detail: '~$5M ARR at close' },
    { year: 2025, month: 5, type: 'ceo', label: '11x CEO change', detail: 'Hasan Sukkar replaced by Prabhav Jain' },
    { year: 2025, month: 5, type: 'funding', label: 'Unify Series B — $40.3M at $260M', detail: 'Battery-led' },
    { year: 2025, month: 5, type: 'reg', label: 'Microsoft Outlook enforces sender rules', detail: 'Bounce code "550 5.7.515 Access denied"' },
    { year: 2025, month: 6, type: 'product', label: 'Outreach.ai rebrand (Unleash 2025)', detail: 'Seven agents unveiled' },
    { year: 2025, month: 6, type: 'funding', label: 'Landbase Series A — $30M', detail: 'Sound Ventures / Ashton Kutcher co-led' },
    { year: 2025, month: 7, type: 'product', label: 'Agentforce 3.0 — MCP client', detail: 'Certified servers via AgentExchange' },
    { year: 2025, month: 8, type: 'product', label: 'Qualified PiperX launches', detail: 'Multi-modal face-to-face digital human' },
    { year: 2025, month: 8, type: 'funding', label: 'Clay Series C — $100M at $3.1B', detail: 'CapitalG-led; ~$100M ARR' },
    { year: 2025, month: 9, type: 'crisis', label: 'Salesloft/Drift OAuth breach', detail: 'Affected 700+ orgs across Salesforce, Slack, Google Workspace' },
    { year: 2025, month: 10, type: 'product', label: 'Gong MCP support announced', detail: 'Integrations to Dynamics 365, M365 Copilot' },
    { year: 2025, month: 11, type: 'reg', label: 'Gmail permanent SMTP rejections', detail: 'For non-compliant mail' },
    { year: 2025, month: 12, type: 'funding', label: 'Salesloft + Clari merger closes', detail: 'Combined 5,000+ customers, $10T RUM' },
    { year: 2025, month: 12, type: 'funding', label: 'Jeeva AI $9M seed', detail: 'Marc Benioff among angels' },
    { year: 2026, month: 3, type: 'funding', label: 'Rox valuation ~$1.2B', detail: 'TechCrunch-sourced, March 2026' },
    { year: 2026, month: 3, type: 'reg', label: 'FTC settles with Air.ai', detail: '~$19M consumer losses, permanent ban on business-opp marketing' },
    { year: 2026, month: 3, type: 'product', label: 'Clay pricing overhaul', detail: 'Split into Data Credits and Actions' },
    { year: 2026, month: 4, type: 'product', label: 'HubSpot outcome-based pricing', detail: '$1 per qualified lead — first major SaaS to do this' },
    { year: 2026, month: 8, type: 'reg', label: 'EU AI Act Article 50 in force', detail: 'AI output transparency obligations' },
];

const CAPABILITY_LABELS = {
    autoSend: 'Auto-send',
    research: 'Research agent',
    replyHandling: 'Reply handling',
    multiChannel: 'Multi-channel',
    voice: 'Voice AI',
    signals: 'Signal detection',
    crmWrite: 'CRM write-back',
    humanGate: 'Human approval',
    multiAgent: 'Multi-agent',
    mcp: 'MCP support',
};

const RADAR_AXES = [
    { key: 'autonomy', label: 'Autonomy', desc: 'Copilot → fully autonomous' },
    { key: 'data', label: 'Data depth', desc: 'Shallow → deep waterfall enrichment' },
    { key: 'signal', label: 'Signal richness', desc: 'Few signals → 50+ sources' },
    { key: 'deliverability', label: 'Deliverability', desc: 'Basic → full infra control' },
    { key: 'channels', label: 'Channel breadth', desc: 'Email-only → 5+ channels' },
    { key: 'enterprise', label: 'Enterprise readiness', desc: 'SMB → governance/compliance' },
    { key: 'price', label: 'Price accessibility', desc: 'Expensive → affordable' },
    { key: 'maturity', label: 'Maturity', desc: 'New → proven track record' },
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AgenticAIMagazine() {
    const [theme, setTheme] = useState('light');
    const isDark = theme === 'dark';
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // True neutral white/black palette
    const p = isDark ? {
        bg: '#0a0a0a',
        bgAlt: '#141414',
        bgSubtle: '#1c1c1c',
        text: '#fafafa',
        textMuted: '#a1a1a1',
        textFaint: '#525252',
        accent: '#ef4444',
        accentSoft: 'rgba(239,68,68,0.12)',
        line: 'rgba(255,255,255,0.08)',
        lineStrong: 'rgba(255,255,255,0.18)',
        glass: 'rgba(20,20,20,0.6)',
        glassBorder: 'rgba(255,255,255,0.06)',
    } : {
        bg: '#ffffff',
        bgAlt: '#fafafa',
        bgSubtle: '#f4f4f5',
        text: '#0a0a0a',
        textMuted: '#525252',
        textFaint: '#a3a3a3',
        accent: '#dc2626',
        accentSoft: 'rgba(220,38,38,0.08)',
        line: 'rgba(0,0,0,0.08)',
        lineStrong: 'rgba(0,0,0,0.15)',
        glass: 'rgba(255,255,255,0.75)',
        glassBorder: 'rgba(0,0,0,0.06)',
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: p.bg,
            color: p.text,
            fontFamily: "'Inter Tight', -apple-system, sans-serif",
            position: 'relative',
            transition: 'background 0.5s ease, color 0.5s ease',
        }}>
            <GlobalStyles p={p} isDark={isDark} />
            <TopNav p={p} isDark={isDark} theme={theme} setTheme={setTheme} scrollY={scrollY} />
            <Marquee p={p} />

            <main style={{ paddingTop: 92, position: 'relative', zIndex: 2 }}>
                <CoverSection p={p} />
                <div className="rule" />
                <MarketSection p={p} />
                <div className="rule" />
                <TimelineSection p={p} />
                <div className="rule" />
                <VendorExplorerSection p={p} />
                <div className="rule" />
                <PricingSection p={p} />
                <div className="rule" />
                <CapabilityMatrixSection p={p} />
                <div className="rule" />
                <FeatureTableSection p={p} />
                <div className="rule" />
                <RadarCompareSection p={p} isDark={isDark} />
                <div className="rule" />
                <SelectionWizardSection p={p} />
                <div className="rule" />
                <RegulationSection p={p} />
                <div className="rule" />
                <ArchitectureSection p={p} />
                <div className="rule" />
                <BenchmarksSection p={p} />
                <div className="rule" />
                <ConclusionSection p={p} />
                <Footer p={p} />
            </main>
        </div>
    );
}

// ============================================================
// GLOBAL STYLES
// ============================================================

function GlobalStyles({ p, isDark }) {
    return (
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200..900;1,9..144,200..900&family=JetBrains+Mono:wght@300;400;500;700&family=Inter+Tight:wght@300;400;500;600;700;800&display=swap');

      * { box-sizing: border-box; }
      body { margin: 0; background: ${p.bg}; }
      html { scroll-behavior: smooth; }

      .display { font-family: 'Fraunces', serif; letter-spacing: -0.02em; }
      .mono { font-family: 'JetBrains Mono', monospace; }

      .glass {
        background: ${p.glass};
        backdrop-filter: blur(20px) saturate(140%);
        -webkit-backdrop-filter: blur(20px) saturate(140%);
        border: 1px solid ${p.glassBorder};
      }

      .rule {
        height: 1px;
        background: ${p.line};
        margin: 0 auto;
        max-width: 1400px;
      }

      .bignum {
        font-family: 'Fraunces', serif;
        font-weight: 300;
        line-height: 0.9;
        letter-spacing: -0.04em;
      }

      ::selection { background: ${p.accent}; color: ${p.bg}; }

      ::-webkit-scrollbar { width: 10px; height: 10px; }
      ::-webkit-scrollbar-track { background: ${p.bg}; }
      ::-webkit-scrollbar-thumb { background: ${p.line}; border-radius: 8px; }
      ::-webkit-scrollbar-thumb:hover { background: ${p.textFaint}; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .fade-in { animation: fadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; }

      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .marquee-inner { animation: marquee 50s linear infinite; }

      .link-hover:hover { color: ${p.accent} !important; }
      .link-hover { transition: color 0.2s; }

      .btn-hover:hover { background: ${p.text}; color: ${p.bg}; border-color: ${p.text}; }

      .cap-cell { transition: all 0.2s; cursor: pointer; }
      .cap-cell:hover { transform: scale(1.05); z-index: 2; }

      .vendor-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
      }
      .vendor-card:hover {
        transform: translateY(-2px);
        border-color: ${p.accent};
      }

      .pill {
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        border-radius: 999px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
    `}</style>
    );
}

// ============================================================
// NAV
// ============================================================

function TopNav({ p, isDark, theme, setTheme, scrollY }) {
    const docHeight = typeof document !== 'undefined' ? document.body.scrollHeight - window.innerHeight : 1;
    const progress = Math.min(100, Math.round((scrollY / (docHeight || 1)) * 100));

    return (
        <nav style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            zIndex: 100,
            padding: '14px 32px',
            background: isDark ? 'rgba(10,10,10,0.85)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: `1px solid ${p.line}`,
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1600, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                    <span className="display" style={{ fontSize: 22, fontWeight: 700, fontStyle: 'italic' }}>
                        The Agentic Quarterly
                    </span>
                    <span className="mono" style={{ fontSize: 10, color: p.textMuted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        VOL. 01 · 2026
                    </span>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span className="mono" style={{ fontSize: 10, color: p.textMuted, letterSpacing: '0.15em' }}>
                        {String(progress).padStart(2, '0')}%
                    </span>
                    <div style={{ width: 60, height: 2, background: p.line }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: p.accent, transition: 'width 0.2s' }} />
                    </div>
                    <button
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        className="mono btn-hover"
                        style={{
                            background: 'transparent',
                            border: `1px solid ${p.lineStrong}`,
                            color: p.text,
                            padding: '6px 14px',
                            borderRadius: 999,
                            cursor: 'pointer',
                            fontSize: 10,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            transition: 'all 0.2s',
                        }}
                    >
                        {isDark ? '☼' : '☾'} {isDark ? 'Light' : 'Dark'}
                    </button>
                </div>
            </div>
        </nav>
    );
}

function Marquee({ p }) {
    const items = [
        'CLAY $3.1B VALUATION AUG 2025',
        '11X REPUTATIONAL COLLAPSE MAR 2025',
        'HUBSPOT $1/LEAD OUTCOME PRICING APR 2026',
        'FCC: AI VOICE = TCPA ARTIFICIAL VOICE',
        'GARTNER: PEAK OF INFLATED EXPECTATIONS',
        'SALESLOFT + CLARI MERGER DEC 2025',
        'DELIVERABILITY 49.98% → 27.63% Q1 2025',
        'OUTREACH → AI REVENUE WORKFLOW',
    ];
    return (
        <div style={{
            position: 'fixed',
            top: 56,
            left: 0, right: 0,
            zIndex: 99,
            overflow: 'hidden',
            background: p.bgAlt,
            borderBottom: `1px solid ${p.line}`,
            padding: '6px 0',
        }}>
            <div className="mono marquee-inner" style={{
                display: 'flex',
                whiteSpace: 'nowrap',
                fontSize: 10,
                letterSpacing: '0.2em',
                color: p.textMuted,
            }}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ display: 'inline-flex', gap: 32, paddingRight: 32 }}>
                        {items.map((t, j) => (
                            <span key={j}>◆ {t}</span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================
// COVER
// ============================================================

function CoverSection({ p }) {
    const stats = [
        { n: '28', l: 'Vendors profiled' },
        { n: '$3.1B', l: 'Clay valuation', s: 'Aug 2025' },
        { n: '$1', l: 'Per qualified lead', s: 'HubSpot outcome pricing' },
        { n: '40%', l: 'Agentic projects cancelled', s: 'Gartner, by 2027' },
    ];

    const chapters = [
        'Market', 'Timeline', 'The Field', 'Pricing', 'Capability Matrix',
        'Feature Table', 'Radar Compare', 'Selection Wizard', 'Regulation',
        'Architecture', 'Benchmarks', 'Conclusion',
    ];

    return (
        <section id="cover" style={{ minHeight: 'calc(100vh - 92px)', padding: '40px 48px 80px' }}>
            <div style={{ maxWidth: 1500, margin: '0 auto' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 80 }}>
                    <div className="mono fade-in" style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: p.textMuted, lineHeight: 1.6 }}>
                        A Field Guide<br />
                        <span style={{ color: p.accent }}>to the 2026</span><br />
                        Agentic Sales Era
                    </div>
                    <div className="mono fade-in" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'right', color: p.textMuted, lineHeight: 1.6, animationDelay: '0.1s' }}>
                        EDITION TWO<br />
                        INTERACTIVE<br />
                        FOR THE TECHNICAL FOUNDER
                    </div>
                </div>

                <div style={{ marginBottom: 80 }}>
                    <div className="mono fade-in" style={{ fontSize: 11, color: p.accent, letterSpacing: '0.3em', marginBottom: 20, animationDelay: '0.2s' }}>
                        ▼ FEATURE
                    </div>
                    <h1 className="display fade-in" style={{
                        fontSize: 'clamp(56px, 13vw, 200px)',
                        fontWeight: 300,
                        lineHeight: 0.85,
                        margin: 0,
                        animationDelay: '0.3s',
                    }}>
                        The Machines<br />
                        <span style={{ fontStyle: 'italic', fontWeight: 400, color: p.accent }}>are sending</span><br />
                        the emails now.
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 32, marginBottom: 80 }}>
                    <div style={{ gridColumn: 'span 7' }} className="fade-in">
                        <p style={{ fontSize: 22, lineHeight: 1.5, fontWeight: 300, margin: 0, animationDelay: '0.5s' }}>
                            Twenty-eight vendors. Four billion in aggregate funding. A category at Gartner's Peak of Inflated Expectations. This is the <em style={{ color: p.accent, fontFamily: 'Fraunces', fontWeight: 400 }}>interactive field report</em> for founders who want to read the whole board before they move — with timelines, pricing maps, capability matrices, and radar charts built to decide from.
                        </p>
                    </div>
                    <div style={{ gridColumn: 'span 4', gridColumnStart: 9 }}>
                        <div className="glass fade-in" style={{ padding: 24, borderRadius: 2, animationDelay: '0.6s' }}>
                            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.textMuted, marginBottom: 12 }}>
                                In this edition
                            </div>
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 13, lineHeight: 1.9 }}>
                                <li>→ Interactive vendor timeline</li>
                                <li>→ Pricing comparison (3 views)</li>
                                <li>→ Agentic capability matrix</li>
                                <li>→ Feature comparison table</li>
                                <li>→ Radar chart · compare up to 3</li>
                                <li>→ Selection wizard</li>
                                <li>→ Regulatory timeline</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Big numbers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: p.line, borderTop: `1px solid ${p.line}`, borderBottom: `1px solid ${p.line}` }}>
                    {stats.map((item, i) => (
                        <div key={i} style={{ background: p.bg, padding: '32px 24px' }} className="fade-in">
                            <div className="bignum" style={{ fontSize: 'clamp(40px, 5vw, 80px)', color: p.accent, animationDelay: `${0.7 + i * 0.1}s` }}>{item.n}</div>
                            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: p.textMuted, marginTop: 8 }}>{item.l}</div>
                            {item.s && <div className="mono" style={{ fontSize: 9, color: p.textFaint, marginTop: 4 }}>{item.s}</div>}
                        </div>
                    ))}
                </div>

                {/* Jump nav */}
                <div style={{ marginTop: 64, display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                    {chapters.map((c, i) => (
                        <a key={i} href={`#${c.toLowerCase().replace(/\s+/g, '-')}`}
                            className="mono link-hover"
                            style={{
                                fontSize: 11,
                                color: p.textMuted,
                                textDecoration: 'none',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                            }}>
                            <span style={{ color: p.accent, fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</span> · {c}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({ num, label, subtitle, p }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, paddingBottom: 24, borderBottom: `1px solid ${p.line}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 32 }}>
                <div className="display bignum" style={{ fontSize: 'clamp(56px, 8vw, 120px)', color: p.accent, lineHeight: 0.9 }}>
                    {num}
                </div>
                <div>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: p.textMuted, marginBottom: 8 }}>
                        ▼ Chapter
                    </div>
                    <div className="display" style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 500, letterSpacing: '-0.02em' }}>
                        {label}
                    </div>
                </div>
            </div>
            <div style={{ fontSize: 14, fontStyle: 'italic', color: p.textMuted, maxWidth: 380 }}>
                {subtitle}
            </div>
        </div>
    );
}

// ============================================================
// MARKET
// ============================================================

function MarketSection({ p }) {
    return (
        <section id="market" style={{ padding: '80px 48px 120px' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <SectionHeader num="01" label="Market" subtitle="Sizing the agentic sales era" p={p} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 48, marginTop: 64 }}>
                    <div style={{ gridColumn: 'span 7' }}>
                        <h2 className="display" style={{
                            fontSize: 'clamp(36px, 5vw, 72px)',
                            lineHeight: 0.95,
                            fontWeight: 300,
                            margin: '0 0 40px',
                        }}>
                            A three-camp market<br />
                            <em style={{ color: p.accent, fontWeight: 400 }}>split</em> in the span of two years.
                        </h2>

                        <p style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 20 }}>
                            Enterprise incumbents — Outreach, Salesloft, Salesforce, HubSpot — reframed themselves as "AI revenue platforms." Venture-backed autonomous AI SDRs pitched agent-led replacement of the human SDR role, with public reversals as early customers churned. Signal/intent and copilot vendors took the defensible middle: intent-driven, human-approved outreach grounded in real data.
                        </p>

                        <p style={{ fontSize: 17, lineHeight: 1.7 }}>
                            By early 2026, <strong style={{ color: p.accent }}>Gartner placed AI sales agents at the Peak of Inflated Expectations</strong> and forecast that more than 40% of agentic AI projects will be cancelled by 2027 — even as 40% of enterprise apps are projected to ship task-specific agents by year-end 2026.
                        </p>

                        <div style={{ marginTop: 48, paddingLeft: 24, borderLeft: `3px solid ${p.accent}` }}>
                            <div className="display" style={{ fontSize: 26, fontStyle: 'italic', fontWeight: 300, lineHeight: 1.3 }}>
                                "11x's product performed significantly worse than our SDR employees."
                            </div>
                            <div className="mono" style={{ marginTop: 14, fontSize: 11, color: p.textMuted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                — ZoomInfo spokesperson, TechCrunch, March 24, 2025
                            </div>
                        </div>
                    </div>

                    <div style={{ gridColumn: 'span 5' }}>
                        <div className="glass" style={{ padding: 32, borderRadius: 2 }}>
                            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.accent, marginBottom: 24 }}>
                                ▼ Market Vitals
                            </div>
                            {[
                                { label: 'Sales Engagement TAM', value: '$6.6B – $9.1B', year: '2024–25', growth: '8.8–16.3% CAGR' },
                                { label: 'Enterprise AI spend', value: '$307B → $632B', year: '2025→28', growth: '29.0% CAGR · IDC' },
                                { label: 'McKinsey S&M upside', value: '$0.8–1.2T', year: 'annual global', growth: 'GenAI productivity' },
                                { label: 'Voice AI market', value: '$11.6B → $82.5B', year: '2024→34', growth: '21.0–23.7% CAGR' },
                                { label: 'Gartner prediction', value: '>40% cancelled', year: 'by 2027', growth: 'Agentic AI projects' },
                            ].map((row, i) => (
                                <div key={i} style={{ padding: '18px 0', borderBottom: i < 4 ? `1px solid ${p.line}` : 'none' }}>
                                    <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.textMuted, marginBottom: 6 }}>
                                        {row.label}
                                    </div>
                                    <div className="display" style={{ fontSize: 22, fontWeight: 400, marginBottom: 4 }}>
                                        {row.value}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: p.textMuted }} className="mono">
                                        <span>{row.year}</span>
                                        <span style={{ color: p.accent }}>{row.growth}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// TIMELINE SECTION
// ============================================================

function TimelineSection({ p }) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [typeFilter, setTypeFilter] = useState('all');

    const types = {
        founding: { label: 'Founding', color: '#3b82f6' },
        funding: { label: 'Funding', color: '#10b981' },
        product: { label: 'Product', color: '#f59e0b' },
        reg: { label: 'Regulation', color: '#ef4444' },
        crisis: { label: 'Crisis', color: '#dc2626' },
        marketing: { label: 'Marketing', color: '#8b5cf6' },
        ceo: { label: 'Leadership', color: '#ec4899' },
    };

    const filtered = typeFilter === 'all' ? TIMELINE_EVENTS : TIMELINE_EVENTS.filter(e => e.type === typeFilter);

    // Group by year
    const years = [...new Set(TIMELINE_EVENTS.map(e => e.year))].sort();
    const grouped = {};
    filtered.forEach(e => {
        if (!grouped[e.year]) grouped[e.year] = [];
        grouped[e.year].push(e);
    });

    return (
        <section id="timeline" style={{ padding: '80px 48px 120px', background: p.bgAlt }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <SectionHeader num="02" label="Timeline" subtitle="15 years of the category, plotted" p={p} />

                <div style={{ marginTop: 48, marginBottom: 32, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.textMuted, marginRight: 12 }}>Filter:</span>
                    <button
                        onClick={() => setTypeFilter('all')}
                        className="mono"
                        style={{
                            padding: '6px 14px',
                            background: typeFilter === 'all' ? p.text : 'transparent',
                            color: typeFilter === 'all' ? p.bg : p.text,
                            border: `1px solid ${typeFilter === 'all' ? p.text : p.line}`,
                            borderRadius: 2,
                            cursor: 'pointer',
                            fontSize: 10,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                        }}
                    >
                        All · {TIMELINE_EVENTS.length}
                    </button>
                    {Object.entries(types).map(([k, v]) => {
                        const n = TIMELINE_EVENTS.filter(e => e.type === k).length;
                        const active = typeFilter === k;
                        return (
                            <button
                                key={k}
                                onClick={() => setTypeFilter(k)}
                                className="mono"
                                style={{
                                    padding: '6px 14px',
                                    background: active ? v.color : 'transparent',
                                    color: active ? '#fff' : p.text,
                                    border: `1px solid ${active ? v.color : p.line}`,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    fontSize: 10,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                <span style={{ display: 'inline-block', width: 6, height: 6, background: v.color, borderRadius: '50%', marginRight: 6, verticalAlign: 'middle' }} />
                                {v.label} · {n}
                            </button>
                        );
                    })}
                </div>

                {/* Timeline main */}
                <div style={{ position: 'relative', paddingTop: 20 }}>
                    {years.map((year, yi) => {
                        const events = grouped[year] || [];
                        if (!events.length) return null;

                        return (
                            <div key={year} style={{ position: 'relative', marginBottom: 40 }}>
                                {/* Year marker */}
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                                    <div className="display" style={{
                                        fontSize: 72,
                                        fontWeight: 300,
                                        color: p.text,
                                        lineHeight: 1,
                                        minWidth: 160,
                                    }}>
                                        {year}
                                    </div>
                                    <div style={{ flex: 1, height: 1, background: p.line, marginLeft: 24 }} />
                                    <span className="mono" style={{ marginLeft: 16, fontSize: 10, color: p.textMuted, letterSpacing: '0.2em' }}>
                                        {events.length} EVENT{events.length !== 1 ? 'S' : ''}
                                    </span>
                                </div>

                                {/* Events */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                    gap: 12,
                                    paddingLeft: 160,
                                }}>
                                    {events.map((e, ei) => {
                                        const typeInfo = types[e.type];
                                        const monthLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][e.month - 1];
                                        return (
                                            <div
                                                key={ei}
                                                onClick={() => setSelectedEvent(selectedEvent === `${year}-${ei}` ? null : `${year}-${ei}`)}
                                                style={{
                                                    padding: 16,
                                                    background: p.bg,
                                                    border: `1px solid ${selectedEvent === `${year}-${ei}` ? p.accent : p.line}`,
                                                    borderLeft: `4px solid ${typeInfo.color}`,
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                    <span className="mono" style={{ fontSize: 9, color: typeInfo.color, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
                                                        {monthLabel} · {typeInfo.label}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, marginBottom: selectedEvent === `${year}-${ei}` ? 10 : 0 }}>
                                                    {e.label}
                                                </div>
                                                {selectedEvent === `${year}-${ei}` && (
                                                    <div style={{ fontSize: 12, lineHeight: 1.5, color: p.textMuted, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${p.line}` }}>
                                                        {e.detail}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ============================================================
// VENDOR EXPLORER
// ============================================================

function VendorExplorerSection({ p }) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedVendor, setExpandedVendor] = useState(null);

    const categories = [
        { id: 'all', label: 'All Vendors' },
        { id: 'enterprise', label: 'Enterprise' },
        { id: 'autonomous', label: 'Autonomous SDR' },
        { id: 'signal', label: 'Signal / Intent' },
        { id: 'copilot', label: 'Copilot' },
        { id: 'infra', label: 'Infrastructure' },
    ];

    const filtered = activeCategory === 'all' ? VENDORS : VENDORS.filter(v => v.cat === activeCategory);

    return (
        <section id="the-field" style={{ padding: '80px 48px 120px' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <SectionHeader num="03" label="The Field" subtitle="All 28 vendors, with full data rows" p={p} />

                <div style={{ display: 'flex', gap: 6, marginTop: 48, marginBottom: 40, flexWrap: 'wrap' }}>
                    {categories.map(c => {
                        const n = c.id === 'all' ? VENDORS.length : VENDORS.filter(v => v.cat === c.id).length;
                        const active = activeCategory === c.id;
                        return (
                            <button
                                key={c.id}
                                onClick={() => setActiveCategory(c.id)}
                                className="mono"
                                style={{
                                    padding: '8px 14px',
                                    background: active ? p.text : 'transparent',
                                    color: active ? p.bg : p.text,
                                    border: `1px solid ${active ? p.text : p.line}`,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    fontSize: 10,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {c.label} · {n}
                            </button>
                        );
                    })}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
                    gap: 16,
                }}>
                    {filtered.map((v) => (
                        <div
                            key={v.id}
                            className="vendor-card glass"
                            onClick={() => setExpandedVendor(expandedVendor === v.id ? null : v.id)}
                            style={{
                                padding: 24,
                                borderRadius: 2,
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, bottom: 0,
                                width: 3,
                                background: v.color,
                            }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div>
                                    <div className="mono" style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.textMuted, marginBottom: 6 }}>
                                        {v.cat} · {v.founded}
                                    </div>
                                    <h3 className="display" style={{ fontSize: 24, fontWeight: 500, margin: '0 0 4px' }}>
                                        {v.name}
                                    </h3>
                                    <div style={{ fontSize: 12, color: p.textMuted, fontStyle: 'italic' }}>
                                        {v.tag}
                                    </div>
                                </div>
                                <div className="mono" style={{ fontSize: 11, color: p.accent, fontWeight: 600 }}>
                                    ★ {v.rating}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11 }} className="mono">
                                <DataRow label="HQ" value={v.hq} p={p} />
                                <DataRow label="Funding" value={v.funding} p={p} />
                                <DataRow label="Price" value={v.price} p={p} />
                                <DataRow label="Target" value={v.target} p={p} />
                            </div>

                            {expandedVendor === v.id && (
                                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${p.line}`, animation: 'fadeUp 0.4s ease both' }}>
                                    <div style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 10 }}>
                                        <strong style={{ color: p.accent, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Channels</strong>
                                        {v.channels.join(' · ')}
                                    </div>
                                    <div style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 10 }}>
                                        <strong style={{ color: p.accent, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>LLM</strong>
                                        {v.llm}
                                    </div>
                                    <div style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 10 }}>
                                        <strong style={{ color: p.accent, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Integrations</strong>
                                        {v.integrations}
                                    </div>
                                    <div style={{ fontSize: 11, lineHeight: 1.5 }}>
                                        <strong style={{ color: p.accent, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Languages</strong>
                                        {v.languages}
                                    </div>
                                </div>
                            )}

                            <div className="mono" style={{
                                marginTop: 14,
                                fontSize: 10,
                                color: p.accent,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                paddingTop: 12,
                                borderTop: `1px solid ${p.line}`,
                            }}>
                                {expandedVendor === v.id ? '— Close' : '→ More'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function DataRow({ label, value, p }) {
    return (
        <div>
            <div style={{ color: p.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 8, marginBottom: 3 }}>{label}</div>
            <div>{value}</div>
        </div>
    );
}

// ============================================================
// PRICING SECTION
// ============================================================

function PricingSection({ p }) {
    const [view, setView] = useState('bars');
    const [priceFilter, setPriceFilter] = useState(10000);

    // Exclude public-company vendors with unknown priceNum
    const pricedVendors = VENDORS.filter(v => v.priceNum < 9999);
    const maxPrice = Math.max(...pricedVendors.map(v => v.priceNum));
    const sorted = [...pricedVendors].sort((a, b) => b.priceNum - a.priceNum);

    const inRange = pricedVendors.filter(v => v.priceNum <= priceFilter);

    // For model map
    const modelGroups = {
        'per-seat': { label: 'Per-seat', color: '#3b82f6', desc: 'Per-user monthly, standard SaaS.' },
        'flat-fee': { label: 'Flat-fee unlimited', color: '#10b981', desc: 'Flat monthly price, unlimited inboxes/users.' },
        'tier': { label: 'Tiered', color: '#8b5cf6', desc: 'Volume-based tiers (e.g., contacts/month).' },
        'credit': { label: 'Credit-based', color: '#f59e0b', desc: 'Pay per API action or enrichment credit.' },
        'flat-tier': { label: 'Flat tier (autonomous)', color: '#ec4899', desc: 'Single-price-tier for autonomous agents.' },
        'enterprise': { label: 'Enterprise-only', color: '#dc2626', desc: 'Custom quote, typically $30–100K/year+.' },
        'outcome': { label: 'Outcome-based', color: '#059669', desc: 'Pay per result (lead, resolution).' },
        'usage': { label: 'Usage-based', color: '#0ea5e9', desc: 'Pay per unit consumed (e.g., mailbox/mo).' },
        'usage-hybrid': { label: 'Usage + seat hybrid', color: '#7c3aed', desc: 'Flex credits layered on per-user.' },
    };

    return (
        <section id="pricing" style={{ padding: '80px 48px 120px', background: p.bgAlt }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <SectionHeader num="04" label="Pricing" subtitle="Three lenses on the same spread" p={p} />

                <div style={{ marginTop: 48, marginBottom: 32, display: 'flex', gap: 8 }}>
                    {[
                        { id: 'bars', label: 'Spread (log)' },
                        { id: 'models', label: 'Pricing models' },
                        { id: 'slider', label: 'What $X buys' },
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setView(t.id)}
                            className="mono"
                            style={{
                                padding: '10px 18px',
                                background: view === t.id ? p.text : 'transparent',
                                color: view === t.id ? p.bg : p.text,
                                border: `1px solid ${view === t.id ? p.text : p.line}`,
                                borderRadius: 2,
                                cursor: 'pointer',
                                fontSize: 10,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {view === 'bars' && (
                    <div>
                        <p style={{ fontSize: 14, color: p.textMuted, lineHeight: 1.6, maxWidth: 700, marginBottom: 40 }}>
                            Log scale because the spread is three orders of magnitude — from Lavender at $27/mo to Regie.ai at ~$2,916/mo. Public-company vendors (Agentforce, Breeze) omitted because their pricing is hybrid/outcome-based. Per-seat rates normalized to monthly cost at mid-tier seat count.
                        </p>

                        <div className="glass" style={{ padding: 32, borderRadius: 2 }}>
                            {sorted.map(v => {
                                // log scale
                                const logPrice = Math.log10(Math.max(v.priceNum, 1));
                                const maxLog = Math.log10(Math.max(maxPrice, 1));
                                const width = (logPrice / maxLog) * 100;

                                return (
                                    <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: `1px solid ${p.line}` }}>
                                        <div style={{ width: 160, fontSize: 13, fontWeight: 500 }}>{v.name}</div>
                                        <div className="mono" style={{ width: 100, fontSize: 10, color: p.textMuted, letterSpacing: '0.1em' }}>
                                            {v.cat.slice(0, 10)}
                                        </div>
                                        <div style={{ flex: 1, height: 6, background: p.line, position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${width}%`,
                                                background: v.color,
                                                borderRadius: 4,
                                                transition: 'width 0.6s',
                                            }} />
                                        </div>
                                        <div className="mono" style={{ width: 140, textAlign: 'right', fontSize: 13, color: p.accent, fontWeight: 600 }}>
                                            {v.price}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ marginTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 11 }} className="mono">
                            <div><span style={{ color: p.textMuted }}>LOWEST:</span> <strong>{sorted[sorted.length - 1].name}</strong> · {sorted[sorted.length - 1].price}</div>
                            <div><span style={{ color: p.textMuted }}>HIGHEST:</span> <strong>{sorted[0].name}</strong> · {sorted[0].price}</div>
                            <div><span style={{ color: p.textMuted }}>SPREAD:</span> <strong>{(sorted[0].priceNum / sorted[sorted.length - 1].priceNum).toFixed(0)}×</strong></div>
                        </div>
                    </div>
                )}

                {view === 'models' && (
                    <div>
                        <p style={{ fontSize: 14, color: p.textMuted, lineHeight: 1.6, maxWidth: 700, marginBottom: 40 }}>
                            Nine distinct pricing models across 28 vendors. The move to <strong style={{ color: p.accent }}>outcome-based pricing</strong> by HubSpot in April 2026 is the category's biggest GTM experiment — a bet that buyers will pay per qualified lead rather than per seat.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                            {Object.entries(modelGroups).map(([k, info]) => {
                                const vendorsInModel = VENDORS.filter(v => v.priceModel === k);
                                if (!vendorsInModel.length) return null;
                                return (
                                    <div key={k} className="glass" style={{ padding: 24, borderRadius: 2, borderLeft: `4px solid ${info.color}` }}>
                                        <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: info.color, marginBottom: 6, fontWeight: 700 }}>
                                            {info.label}
                                        </div>
                                        <div className="display" style={{ fontSize: 28, fontWeight: 500, marginBottom: 10 }}>
                                            {vendorsInModel.length}<span style={{ fontSize: 14, color: p.textMuted, fontFamily: 'Inter Tight', fontWeight: 400, marginLeft: 6 }}>vendor{vendorsInModel.length > 1 ? 's' : ''}</span>
                                        </div>
                                        <div style={{ fontSize: 12, color: p.textMuted, lineHeight: 1.5, marginBottom: 14 }}>
                                            {info.desc}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                            {vendorsInModel.map(v => (
                                                <span key={v.id} className="pill" style={{ background: p.bg, color: p.text, border: `1px solid ${p.line}` }}>
                                                    {v.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {view === 'slider' && (
                    <div>
                        <p style={{ fontSize: 14, color: p.textMuted, lineHeight: 1.6, maxWidth: 700, marginBottom: 40 }}>
                            Drag the slider. See which vendors fit the budget, and what you get at that tier.
                        </p>

                        <div className="glass" style={{ padding: 40, borderRadius: 2, marginBottom: 32 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
                                <div>
                                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.textMuted, marginBottom: 8 }}>
                                        Budget cap
                                    </div>
                                    <div className="display bignum" style={{ fontSize: 80, color: p.accent }}>
                                        ${priceFilter.toLocaleString()}<span style={{ fontSize: 24, color: p.textMuted, fontWeight: 400 }}>/mo</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.textMuted, marginBottom: 8 }}>
                                        Vendors in range
                                    </div>
                                    <div className="display bignum" style={{ fontSize: 80, color: p.text }}>
                                        {inRange.length}
                                    </div>
                                </div>
                            </div>

                            <input
                                type="range"
                                min="20"
                                max="5000"
                                step="10"
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    accentColor: p.accent,
                                    height: 6,
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }} className="mono">
                                <span style={{ fontSize: 10, color: p.textMuted }}>$20</span>
                                <span style={{ fontSize: 10, color: p.textMuted }}>$500</span>
                                <span style={{ fontSize: 10, color: p.textMuted }}>$1,000</span>
                                <span style={{ fontSize: 10, color: p.textMuted }}>$2,500</span>
                                <span style={{ fontSize: 10, color: p.textMuted }}>$5,000</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                            {inRange.sort((a, b) => a.priceNum - b.priceNum).map(v => (
                                <div key={v.id} style={{ padding: 20, background: p.bg, border: `1px solid ${p.line}`, borderLeft: `3px solid ${v.color}`, borderRadius: 2 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                                        <div style={{ fontSize: 15, fontWeight: 600 }}>{v.name}</div>
                                        <div className="mono" style={{ fontSize: 11, color: p.accent }}>{v.price}</div>
                                    </div>
                                    <div className="mono" style={{ fontSize: 9, color: p.textMuted, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                                        {v.cat} · {v.target}
                                    </div>
                                    <div style={{ fontSize: 11, color: p.textMuted, fontStyle: 'italic' }}>
                                        {v.tag}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {inRange.length === 0 && (
                            <div style={{ padding: 60, textAlign: 'center', color: p.textMuted }}>
                                No vendors in this range. Slide right.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

// ============================================================
// CAPABILITY MATRIX
// ============================================================

function CapabilityMatrixSection({ p }) {
    const [sortKey, setSortKey] = useState('name');
    const [hoverCell, setHoverCell] = useState(null);

    const capKeys = Object.keys(CAPABILITY_LABELS);

    // Calculate total capability score per vendor for sorting
    const scored = VENDORS.map(v => {
        const capScore = capKeys.reduce((sum, k) => {
            const val = v.capabilities[k];
            return sum + (val === 'full' ? 2 : val === 'partial' ? 1 : 0);
        }, 0);
        return { ...v, capScore };
    });

    const sorted = useMemo(() => {
        if (sortKey === 'name') return [...scored].sort((a, b) => a.name.localeCompare(b.name));
        if (sortKey === 'score') return [...scored].sort((a, b) => b.capScore - a.capScore);
        if (sortKey === 'cat') return [...scored].sort((a, b) => a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name));
        return [...scored].sort((a, b) => {
            const getCapVal = (cap) => cap === 'full' ? 2 : cap === 'partial' ? 1 : 0;
            return getCapVal(b.capabilities[sortKey]) - getCapVal(a.capabilities[sortKey]);
        });
    }, [sortKey, scored]);

    const cellStyle = (val) => {
        if (val === 'full') return { background: p.accent, color: '#fff' };
        if (val === 'partial') return { background: p.accentSoft, color: p.accent };
        return { background: 'transparent', color: p.textFaint };
    };

    const cellChar = (val) => {
        if (val === 'full') return '●';
        if (val === 'partial') return '◐';
        return '○';
    };

    return (
        <section id="capability-matrix" style={{ padding: '80px 48px 120px' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <SectionHeader num="05" label="Capability Matrix" subtitle="Ten agentic capabilities across all 28 vendors" p={p} />

                <div style={{ marginTop: 48, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.textMuted }}>Sort:</span>
                    {[
                        { k: 'name', l: 'Alphabetical' },
                        { k: 'score', l: 'Capability score' },
                        { k: 'cat', l: 'Category' },
                    ].map(s => (
                        <button
                            key={s.k}
                            onClick={() => setSortKey(s.k)}
                            className="mono"
                            style={{
                                padding: '6px 14px',
                                background: sortKey === s.k ? p.text : 'transparent',
                                color: sortKey === s.k ? p.bg : p.text,
                                border: `1px solid ${sortKey === s.k ? p.text : p.line}`,
                                borderRadius: 2,
                                cursor: 'pointer',
                                fontSize: 10,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {s.l}
                        </button>
                    ))}
                    <span style={{ flex: 1 }} />
                    <div style={{ display: 'flex', gap: 16, fontSize: 11 }} className="mono">
                        <span><span style={{ color: p.accent, marginRight: 4, fontSize: 14 }}>●</span> Full</span>
                        <span><span style={{ color: p.accent, marginRight: 4, fontSize: 14 }}>◐</span> Partial</span>
                        <span><span style={{ color: p.textFaint, marginRight: 4, fontSize: 14 }}>○</span> None</span>
                    </div>
                </div>

                <div className="glass" style={{ padding: 0, borderRadius: 2, overflow: 'auto', maxWidth: '100%' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 1100 }}>
                        <thead>
                            <tr style={{ background: p.bgSubtle }}>
                                <th
                                    onClick={() => setSortKey('name')}
                                    className="mono"
                                    style={{
                                        padding: 14,
                                        fontSize: 10,
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        textAlign: 'left',
                                        color: p.textMuted,
                                        borderBottom: `2px solid ${p.lineStrong}`,
                                        cursor: 'pointer',
                                        position: 'sticky',
                                        left: 0,
                                        background: p.bgSubtle,
                                        zIndex: 2,
                                    }}
                                >
                                    Vendor
                                </th>
                                {capKeys.map(k => (
                                    <th
                                        key={k}
                                        onClick={() => setSortKey(k)}
                                        className="mono"
                                        style={{
                                            padding: '14px 8px',
                                            fontSize: 9,
                                            letterSpacing: '0.15em',
                                            textTransform: 'uppercase',
                                            color: sortKey === k ? p.accent : p.textMuted,
                                            borderBottom: `2px solid ${p.lineStrong}`,
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            writingMode: 'vertical-lr',
                                            transform: 'rotate(180deg)',
                                            minHeight: 100,
                                            minWidth: 40,
                                        }}
                                    >
                                        {CAPABILITY_LABELS[k]}
                                    </th>
                                ))}
                                <th
                                    onClick={() => setSortKey('score')}
                                    className="mono"
                                    style={{
                                        padding: 14,
                                        fontSize: 10,
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        textAlign: 'center',
                                        color: sortKey === 'score' ? p.accent : p.textMuted,
                                        borderBottom: `2px solid ${p.lineStrong}`,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Score
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((v, i) => (
                                <tr key={v.id} style={{ borderBottom: `1px solid ${p.line}` }}>
                                    <td
                                        style={{
                                            padding: 14,
                                            position: 'sticky',
                                            left: 0,
                                            background: i % 2 === 0 ? p.bg : p.bgAlt,
                                            zIndex: 1,
                                            borderLeft: `3px solid ${v.color}`,
                                        }}
                                    >
                                        <div style={{ fontSize: 13, fontWeight: 500 }}>{v.name}</div>
                                        <div className="mono" style={{ fontSize: 9, color: p.textMuted, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>
                                            {v.cat}
                                        </div>
                                    </td>
                                    {capKeys.map(k => {
                                        const val = v.capabilities[k];
                                        const id = `${v.id}-${k}`;
                                        return (
                                            <td
                                                key={k}
                                                className="cap-cell"
                                                onMouseEnter={() => setHoverCell(id)}
                                                onMouseLeave={() => setHoverCell(null)}
                                                style={{
                                                    padding: 0,
                                                    textAlign: 'center',
                                                    background: i % 2 === 0 ? p.bg : p.bgAlt,
                                                    position: 'relative',
                                                }}
                                            >
                                                <div style={{
                                                    margin: 6,
                                                    height: 32,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 2,
                                                    fontSize: 16,
                                                    ...cellStyle(val),
                                                }}>
                                                    {cellChar(val)}
                                                </div>
                                                {hoverCell === id && (
                                                    <div className="mono" style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        background: p.text,
                                                        color: p.bg,
                                                        padding: '6px 10px',
                                                        fontSize: 10,
                                                        borderRadius: 2,
                                                        whiteSpace: 'nowrap',
                                                        zIndex: 10,
                                                        pointerEvents: 'none',
                                                    }}>
                                                        {CAPABILITY_LABELS[k]}: {val}
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td
                                        className="mono"
                                        style={{
                                            padding: 14,
                                            textAlign: 'center',
                                            background: i % 2 === 0 ? p.bg : p.bgAlt,
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: v.capScore >= 16 ? p.accent : p.text,
                                        }}
                                    >
                                        {v.capScore}/20
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// FEATURE TABLE
// ============================================================

function FeatureTableSection({ p }) {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('all');
    const [cols, setCols] = useState({
        channels: true,
        llm: true,
        languages: true,
        integrations: true,
        funding: true,
        rating: true,
    });

    const filtered = VENDORS.filter(v => {
        const matchCat = catFilter === 'all' || v.cat === catFilter;
        const matchSearch = !search ||
            v.name.toLowerCase().includes(search.toLowerCase()) ||
            (v.channels || []).some(c => c.toLowerCase().includes(search.toLowerCase())) ||
            (v.llm || '').toLowerCase().includes(search.toLowerCase()) ||
            (v.integrations || '').toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <section id="feature-table" style={{ padding: '80px 48px 120px', background: p.bgAlt }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <SectionHeader num="06" label="Feature Table" subtitle="The full comparison, searchable" p={p} />

                <div style={{ marginTop: 48, marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search channels, LLM, integrations…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mono"
                        style={{
                            padding: '10px 16px',
                            background: p.bg,
                            border: `1px solid ${p.line}`,
                            color: p.text,
                            fontSize: 12,
                            borderRadius: 2,
                            minWidth: 280,
                            outline: 'none',
                        }}
                    />
                    <select
                        value={catFilter}
                        onChange={(e) => setCatFilter(e.target.value)}
                        className="mono"
                        style={{
                            padding: '10px 16px',
                            background: p.bg,
                            border: `1px solid ${p.line}`,
                            color: p.text,
                            fontSize: 11,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            borderRadius: 2,
                            cursor: 'pointer',
                        }}
                    >
                        <option value="all">All Categories</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="autonomous">Autonomous</option>
                        <option value="signal">Signal</option>
                        <option value="copilot">Copilot</option>
                        <option value="infra">Infrastructure</option>
                    </select>
                    <span style={{ flex: 1 }} />
                    <span className="mono" style={{ fontSize: 10, color: p.textMuted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        {filtered.length} / {VENDORS.length} vendors
                    </span>
                </div>

                <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="mono" style={{ fontSize: 10, color: p.textMuted, letterSpacing: '0.2em', textTransform: 'uppercase', alignSelf: 'center' }}>Columns:</span>
                    {Object.keys(cols).map(k => (
                        <button
                            key={k}
                            onClick={() => setCols({ ...cols, [k]: !cols[k] })}
                            className="mono"
                            style={{
                                padding: '4px 10px',
                                background: cols[k] ? p.accentSoft : 'transparent',
                                color: cols[k] ? p.accent : p.textMuted,
                                border: `1px solid ${cols[k] ? p.accent : p.line}`,
                                borderRadius: 2,
                                cursor: 'pointer',
                                fontSize: 9,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {cols[k] ? '✓' : '+'} {k}
                        </button>
                    ))}
                </div>

                <div className="glass" style={{ borderRadius: 2, overflow: 'auto' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 900 }}>
                        <thead>
                            <tr style={{ background: p.bgSubtle }}>
                                <th className="mono" style={thStyle(p)}>Vendor</th>
                                <th className="mono" style={thStyle(p)}>Cat</th>
                                {cols.channels && <th className="mono" style={thStyle(p)}>Channels</th>}
                                {cols.llm && <th className="mono" style={thStyle(p)}>LLM</th>}
                                {cols.languages && <th className="mono" style={thStyle(p)}>Languages</th>}
                                {cols.integrations && <th className="mono" style={thStyle(p)}>Integrations</th>}
                                {cols.funding && <th className="mono" style={thStyle(p)}>Funding</th>}
                                {cols.rating && <th className="mono" style={thStyle(p)}>Rating</th>}
                                <th className="mono" style={thStyle(p)}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((v, i) => (
                                <tr key={v.id} style={{ borderBottom: `1px solid ${p.line}`, background: i % 2 === 0 ? p.bg : p.bgAlt }}>
                                    <td style={{ ...tdStyle(p), borderLeft: `3px solid ${v.color}` }}>
                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{v.name}</div>
                                        <div style={{ fontSize: 11, color: p.textMuted, fontStyle: 'italic' }}>{v.tag}</div>
                                    </td>
                                    <td style={{ ...tdStyle(p), fontSize: 11 }} className="mono">{v.cat}</td>
                                    {cols.channels && <td style={{ ...tdStyle(p), fontSize: 11, lineHeight: 1.4 }}>{v.channels.join(', ')}</td>}
                                    {cols.llm && <td style={{ ...tdStyle(p), fontSize: 11 }}>{v.llm}</td>}
                                    {cols.languages && <td style={{ ...tdStyle(p), fontSize: 11 }} className="mono">{v.languages}</td>}
                                    {cols.integrations && <td style={{ ...tdStyle(p), fontSize: 11, lineHeight: 1.4, maxWidth: 260 }}>{v.integrations}</td>}
                                    {cols.funding && <td style={{ ...tdStyle(p), fontSize: 11 }} className="mono">{v.funding}</td>}
                                    {cols.rating && <td style={{ ...tdStyle(p), fontSize: 11 }} className="mono">★ {v.rating} <span style={{ color: p.textMuted }}>({v.reviews})</span></td>}
                                    <td style={{ ...tdStyle(p), fontSize: 11, color: p.accent, fontWeight: 600 }} className="mono">{v.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div style={{ padding: 60, textAlign: 'center', color: p.textMuted }}>No matches.</div>
                )}
            </div>
        </section>
    );
}

const thStyle = (p: any): React.CSSProperties => ({
    padding: '14px 12px',
    fontSize: 9,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: p.textMuted,
    borderBottom: `2px solid ${p.lineStrong}`,
    textAlign: 'left',
    whiteSpace: 'nowrap',
});

const tdStyle = (p: any): React.CSSProperties => ({
    padding: 14,
    verticalAlign: 'top',
});

// ============================================================
// RADAR COMPARE
// ============================================================

function RadarCompareSection({ p, isDark }) {
    const [selected, setSelected] = useState(['outreach', 'clay', 'artisan']);
    const [focusVendor, setFocusVendor] = useState(null);

    const toggleSelect = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(s => s !== id));
        } else if (selected.length < 3) {
            setSelected([...selected, id]);
        } else {
            setSelected([...selected.slice(1), id]);
        }
    };

    const chartData = RADAR_AXES.map(axis => {
        const row = { axis: axis.label };
        selected.forEach(id => {
            const v = VENDORS.find(x => x.id === id);
            if (v) row[v.name] = v.scores[axis.key];
        });
        return row;
    });

    const selectedVendors = selected.map(id => VENDORS.find(v => v.id === id)).filter(Boolean);

    return (
        <section id="radar-compare" style={{ padding: '80px 48px 120px' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <SectionHeader num="07" label="Radar Compare" subtitle="Select up to 3 vendors · 8 aspects · overlaid" p={p} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 32, marginTop: 48 }}>

                    <div style={{ gridColumn: 'span 4' }}>
                        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.textMuted, marginBottom: 16 }}>
                            ▼ Pick up to 3
                        </div>
                        <div style={{ maxHeight: 600, overflowY: 'auto', paddingRight: 8 }}>
                            {VENDORS.map(v => {
                                const isSelected = selected.includes(v.id);
                                return (
                                    <div
                                        key={v.id}
                                        onClick={() => toggleSelect(v.id)}
                                        style={{
                                            padding: '10px 14px',
                                            background: isSelected ? p.accentSoft : 'transparent',
                                            border: `1px solid ${isSelected ? p.accent : p.line}`,
                                            borderLeft: `4px solid ${v.color}`,
                                            borderRadius: 2,
                                            marginBottom: 6,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 500 }}>{v.name}</div>
                                            <div className="mono" style={{ fontSize: 9, color: p.textMuted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                                {v.cat}
                                            </div>
                                        </div>
                                        {isSelected && <span style={{ color: p.accent, fontWeight: 700 }}>✓</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ gridColumn: 'span 8' }}>
                        <div className="glass" style={{ padding: 32, borderRadius: 2, minHeight: 500 }}>
                            {selectedVendors.length === 0 ? (
                                <div style={{ textAlign: 'center', color: p.textMuted, paddingTop: 200 }}>
                                    Select a vendor from the left.
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                                        <div>
                                            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.textMuted, marginBottom: 6 }}>
                                                Comparing
                                            </div>
                                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                                {selectedVendors.map(v => (
                                                    <span key={v.id} className="pill" style={{ background: v.color + '33', color: v.color, border: `1px solid ${v.color}`, fontWeight: 600 }}>
                                                        {v.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelected([])}
                                            className="mono"
                                            style={{
                                                padding: '6px 12px',
                                                background: 'transparent',
                                                border: `1px solid ${p.line}`,
                                                color: p.textMuted,
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                fontSize: 10,
                                                letterSpacing: '0.2em',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            Clear
                                        </button>
                                    </div>

                                    <ResponsiveContainer width="100%" height={400}>
                                        <RadarChart data={chartData}>
                                            <PolarGrid stroke={p.line} />
                                            <PolarAngleAxis dataKey="axis" tick={{ fill: p.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }} />
                                            <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: p.textFaint, fontSize: 9 }} axisLine={false} />
                                            {selectedVendors.map(v => (
                                                <Radar
                                                    key={v.id}
                                                    name={v.name}
                                                    dataKey={v.name}
                                                    stroke={v.color}
                                                    fill={v.color}
                                                    fillOpacity={0.18}
                                                    strokeWidth={2}
                                                />
                                            ))}
                                            <Tooltip
                                                contentStyle={{
                                                    background: p.bg,
                                                    border: `1px solid ${p.lineStrong}`,
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    fontSize: 11,
                                                    color: p.text,
                                                }}
                                            />
                                            <Legend />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </>
                            )}
                        </div>

                        {/* Per-axis scores breakdown */}
                        {selectedVendors.length > 0 && (
                            <div style={{ marginTop: 24 }}>
                                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.textMuted, marginBottom: 16 }}>
                                    ▼ Axis-by-axis
                                </div>
                                <div style={{ display: 'grid', gap: 10 }}>
                                    {RADAR_AXES.map(axis => (
                                        <div key={axis.key} style={{ padding: 16, background: p.bgAlt, borderRadius: 2 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{axis.label}</div>
                                                    <div style={{ fontSize: 11, color: p.textMuted, fontStyle: 'italic' }}>{axis.desc}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                                {selectedVendors.map(v => (
                                                    <div key={v.id} style={{ flex: '1 1 180px', minWidth: 180 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                            <span className="mono" style={{ fontSize: 11, color: v.color, fontWeight: 600 }}>{v.name}</span>
                                                            <span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>{v.scores[axis.key]}/10</span>
                                                        </div>
                                                        <div style={{ height: 4, background: p.line, borderRadius: 4, overflow: 'hidden' }}>
                                                            <div style={{ height: '100%', width: `${v.scores[axis.key] * 10}%`, background: v.color, borderRadius: 4 }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scoring methodology */}
                <div style={{ marginTop: 48, padding: 24, background: p.bgSubtle, borderRadius: 2, borderLeft: `3px solid ${p.accent}` }}>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.accent, marginBottom: 10 }}>
                        ▼ Scoring methodology · Disagree freely
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: p.textMuted, margin: 0 }}>
                        Scores are 0–10 based on public documentation, vendor materials, G2 reviews, and industry reporting through April 2026. <strong>Price accessibility</strong> inverts cost (cheaper = higher score). <strong>Enterprise readiness</strong> weighs governance, compliance, and mid-market+ customer base. <strong>Maturity</strong> weighs years in market + review count + named enterprise customers. These are editorial judgments for navigation, not benchmarks. Your weighting should reflect your buyer.
                    </p>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// SELECTION WIZARD
// ============================================================

function SelectionWizardSection({ p }) {
    const [prefs, setPrefs] = useState({
        budget: 'mid',
        buyer: 'mid',
        channels: [],
        autonomy: 'any',
        priority: 'data',
    });

    const budgetMap = { low: [0, 100], mid: [100, 1000], high: [1000, 3000], enterprise: [3000, 10000] };
    const buyerMap = { solo: 'SMB', smb: 'SMB', mid: 'Mid', enterprise: 'Enterprise' };
    const priorityMap = { autonomy: 'autonomy', data: 'data', signal: 'signal', deliverability: 'deliverability', channels: 'channels', enterprise: 'enterprise' };

    const matches = useMemo(() => {
        const [low, high] = budgetMap[prefs.budget];
        const buyerKey = buyerMap[prefs.buyer];

        return VENDORS.map(v => {
            let score = 0;
            let reasons = [];

            // Budget
            if (v.priceNum >= low && v.priceNum <= high) { score += 20; reasons.push('Budget fit'); }
            else if (v.priceNum < low * 2 && v.priceNum > low / 2) { score += 10; reasons.push('Budget close'); }

            // Buyer
            if (v.target.toLowerCase().includes(buyerKey.toLowerCase())) { score += 15; reasons.push('Buyer fit'); }

            // Autonomy
            if (prefs.autonomy === 'autonomous' && v.scores.autonomy >= 8) { score += 15; reasons.push('High autonomy'); }
            if (prefs.autonomy === 'copilot' && v.scores.autonomy <= 6) { score += 15; reasons.push('Copilot'); }
            if (prefs.autonomy === 'any') score += 8;

            // Priority
            const prioKey = priorityMap[prefs.priority];
            score += v.scores[prioKey] * 3;
            if (v.scores[prioKey] >= 8) reasons.push(`Strong ${prefs.priority}`);

            // Channels
            if (prefs.channels.length) {
                const hasAll = prefs.channels.every(c =>
                    v.channels.some(vc => vc.toLowerCase().includes(c.toLowerCase()))
                );
                if (hasAll) { score += 15; reasons.push('All channels'); }
                else {
                    const some = prefs.channels.some(c =>
                        v.channels.some(vc => vc.toLowerCase().includes(c.toLowerCase()))
                    );
                    if (some) { score += 5; reasons.push('Some channels'); }
                }
            } else {
                score += 8;
            }

            return { ...v, matchScore: score, reasons };
        }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
    }, [prefs]);

    return (
        <section id="selection-wizard" style={{ padding: '80px 48px 120px', background: p.bgAlt }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <SectionHeader num="08" label="Selection Wizard" subtitle="Tell me what matters · I'll rank them" p={p} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 32, marginTop: 48 }}>

                    <div style={{ gridColumn: 'span 5' }}>
                        <div className="glass" style={{ padding: 32, borderRadius: 2 }}>

                            <WizardRow label="Budget range" p={p}>
                                {[
                                    { v: 'low', l: '<$100/mo' },
                                    { v: 'mid', l: '$100–1K/mo' },
                                    { v: 'high', l: '$1–3K/mo' },
                                    { v: 'enterprise', l: '$3K+/mo' },
                                ].map(o => (
                                    <WizardChip key={o.v} active={prefs.budget === o.v} onClick={() => setPrefs({ ...prefs, budget: o.v })} p={p}>
                                        {o.l}
                                    </WizardChip>
                                ))}
                            </WizardRow>

                            <WizardRow label="Who are you selling to?" p={p}>
                                {[
                                    { v: 'solo', l: 'Solo / founder' },
                                    { v: 'smb', l: 'SMB' },
                                    { v: 'mid', l: 'Mid-market' },
                                    { v: 'enterprise', l: 'Enterprise' },
                                ].map(o => (
                                    <WizardChip key={o.v} active={prefs.buyer === o.v} onClick={() => setPrefs({ ...prefs, buyer: o.v })} p={p}>
                                        {o.l}
                                    </WizardChip>
                                ))}
                            </WizardRow>

                            <WizardRow label="Autonomy preference" p={p}>
                                {[
                                    { v: 'any', l: 'Either' },
                                    { v: 'copilot', l: 'Copilot' },
                                    { v: 'autonomous', l: 'Autonomous' },
                                ].map(o => (
                                    <WizardChip key={o.v} active={prefs.autonomy === o.v} onClick={() => setPrefs({ ...prefs, autonomy: o.v })} p={p}>
                                        {o.l}
                                    </WizardChip>
                                ))}
                            </WizardRow>

                            <WizardRow label="Must-have channels" p={p}>
                                {['Email', 'LinkedIn', 'Phone', 'Voice', 'SMS', 'WhatsApp'].map(c => (
                                    <WizardChip
                                        key={c}
                                        active={prefs.channels.includes(c)}
                                        onClick={() => setPrefs({
                                            ...prefs,
                                            channels: prefs.channels.includes(c)
                                                ? prefs.channels.filter(x => x !== c)
                                                : [...prefs.channels, c]
                                        })}
                                        p={p}
                                    >
                                        {c}
                                    </WizardChip>
                                ))}
                            </WizardRow>

                            <WizardRow label="What matters most?" p={p}>
                                {[
                                    { v: 'autonomy', l: 'Autonomy' },
                                    { v: 'data', l: 'Data depth' },
                                    { v: 'signal', l: 'Signal richness' },
                                    { v: 'deliverability', l: 'Deliverability' },
                                    { v: 'channels', l: 'Channel breadth' },
                                    { v: 'enterprise', l: 'Enterprise-ready' },
                                ].map(o => (
                                    <WizardChip key={o.v} active={prefs.priority === o.v} onClick={() => setPrefs({ ...prefs, priority: o.v })} p={p}>
                                        {o.l}
                                    </WizardChip>
                                ))}
                            </WizardRow>
                        </div>
                    </div>

                    <div style={{ gridColumn: 'span 7' }}>
                        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.textMuted, marginBottom: 16 }}>
                            ▼ Top 6 matches
                        </div>

                        <div style={{ display: 'grid', gap: 10 }}>
                            {matches.map((v, i) => (
                                <div key={v.id} style={{
                                    padding: 20,
                                    background: p.bg,
                                    border: `1px solid ${i === 0 ? p.accent : p.line}`,
                                    borderLeft: `4px solid ${v.color}`,
                                    borderRadius: 2,
                                    position: 'relative',
                                }}>
                                    {i === 0 && (
                                        <span className="pill" style={{
                                            position: 'absolute',
                                            top: 14,
                                            right: 14,
                                            background: p.accent,
                                            color: '#fff',
                                            fontWeight: 700,
                                        }}>
                                            ▲ Top match
                                        </span>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                                            <span className="display bignum" style={{ fontSize: 32, color: p.textFaint }}>
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <div>
                                                <div style={{ fontSize: 18, fontWeight: 600 }}>{v.name}</div>
                                                <div className="mono" style={{ fontSize: 10, color: p.textMuted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                                    {v.cat} · {v.target}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                            {v.reasons.map((r, ri) => (
                                                <span key={ri} className="pill" style={{ background: p.accentSoft, color: p.accent }}>
                                                    {r}
                                                </span>
                                            ))}
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className="mono" style={{ fontSize: 10, color: p.textMuted, letterSpacing: '0.15em' }}>MATCH</div>
                                            <div className="display" style={{ fontSize: 22, fontWeight: 600, color: p.accent }}>
                                                {v.matchScore}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${p.line}`, fontSize: 12, color: p.textMuted, display: 'flex', gap: 16, flexWrap: 'wrap' }} className="mono">
                                        <span>PRICE · <strong style={{ color: p.text }}>{v.price}</strong></span>
                                        <span>FUNDING · <strong style={{ color: p.text }}>{v.funding}</strong></span>
                                        <span>RATING · <strong style={{ color: p.text }}>★ {v.rating}</strong></span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 24, fontSize: 12, color: p.textFaint, lineHeight: 1.6, fontStyle: 'italic' }}>
                            Ranking is a weighted sum of fit signals. Top match is not "best overall" — it's "best fit for your inputs." Adjust filters to explore trade-offs.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function WizardRow({ label, children, p }) {
    return (
        <div style={{ marginBottom: 22 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.textMuted, marginBottom: 10 }}>
                {label}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {children}
            </div>
        </div>
    );
}

function WizardChip({ active, onClick, children, p }) {
    return (
        <button
            onClick={onClick}
            className="mono"
            style={{
                padding: '8px 14px',
                background: active ? p.text : 'transparent',
                color: active ? p.bg : p.text,
                border: `1px solid ${active ? p.text : p.line}`,
                borderRadius: 2,
                cursor: 'pointer',
                fontSize: 10,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                transition: 'all 0.15s',
            }}
        >
            {children}
        </button>
    );
}

// ============================================================
// REGULATION
// ============================================================

function RegulationSection({ p }) {
    const regs = [
        { r: 'TCPA / FCC', scope: 'AI voice calls', key: 'Feb 8, 2024 — FCC Declaratory Ruling 24-17: AI voice = "artificial voice" under TCPA.', penalty: '$500–$1,500 per call, no cap', impact: '10,000-call campaign = $5M–$15M exposure. Mar 24, 2026: FTC settled with Air.ai for ~$19M.', harsh: true },
        { r: 'CAN-SPAM', scope: 'US cold email', key: 'Permits cold email without consent. Requires truthful headers, physical postal address, 10-day unsubscribe.', penalty: '~$51,744–$53,088 per email', impact: '31% of audited SDR templates lacked physical postal address.', harsh: false },
        { r: 'GDPR + LIA', scope: 'EU B2B cold email', key: 'Legitimate Interest (Art. 6(1)(f)) valid for B2B, requires documented LIA per campaign.', penalty: '€20M or 4% of global turnover', impact: 'Cumulative fines €5.88B by Jan 2025. French CNIL SMB inspections +300% (2023-24).', harsh: false },
        { r: 'CASL', scope: 'Canada', key: 'Strictest major regime. Express or implied consent required even for B2B.', penalty: 'CAD $10M per violation per corp', impact: 'CRTC received 152,603 complaints in 6 months of 2025. Many US senders geofence Canada.', harsh: true },
        { r: 'LinkedIn ToS', scope: 'Scraping & automation', key: 'hiQ v. LinkedIn: scraping public data ≠ CFAA violation. BUT Nov 2022: breach-of-contract ruling + $500K judgment.', penalty: 'Account restrictions, civil judgments', impact: 'Early 2025: Apollo and Seamless.AI Company Pages temporarily removed. Late 2025: Artisan accounts restricted.', harsh: true },
        { r: 'EU AI Act Art. 50', scope: 'AI-generated content', key: 'Transparency obligations: outputs machine-readable marked, deepfakes on public-interest matters labeled.', penalty: 'Enters force Aug 2026', impact: 'AI SDR emails may need watermarking. AI voice agents may need to disclose non-human identity.', harsh: false },
    ];

    return (
        <section id="regulation" style={{ padding: '80px 48px 120px' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <SectionHeader num="09" label="Regulation" subtitle="The legal frame around agentic sales" p={p} />

                <h2 className="display" style={{ fontSize: 'clamp(40px, 6vw, 96px)', fontWeight: 300, lineHeight: 0.9, margin: '48px 0 48px' }}>
                    $500–$1,500 per call.<br />
                    <em style={{ color: p.accent, fontWeight: 400 }}>No cap.</em>
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                    {regs.map((item, i) => (
                        <div key={i} className="glass" style={{ padding: 28, borderRadius: 2, borderTop: `3px solid ${item.harsh ? p.accent : p.text}` }}>
                            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.textMuted, marginBottom: 10 }}>
                                {item.scope}
                            </div>
                            <h3 className="display" style={{ fontSize: 24, fontWeight: 500, margin: '0 0 20px' }}>{item.r}</h3>

                            <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>{item.key}</div>

                            <div style={{ padding: '10px 14px', background: p.bgAlt, borderRadius: 2, marginBottom: 14 }}>
                                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.textMuted, marginBottom: 4 }}>Penalty</div>
                                <div className="mono" style={{ fontSize: 12, color: item.harsh ? p.accent : p.text, fontWeight: 600 }}>{item.penalty}</div>
                            </div>

                            <div style={{ fontSize: 12, lineHeight: 1.6, color: p.textMuted, fontStyle: 'italic' }}>{item.impact}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================================
// ARCHITECTURE
// ============================================================

function ArchitectureSection({ p }) {
    const layers = [
        { n: '01', l: 'Data', e: 'Waterfall enrichment: Apollo → ZoomInfo → Clearbit → Hunter → PDL → ContactOut. Tuned waterfall covers 85–95% of an ICP list.' },
        { n: '02', l: 'Signal', e: 'Bombora / 6sense intent · UserGems / Champify job changes · BuiltWith technographics · funding, hiring, news · RB2B / Warmly visitor-ID.' },
        { n: '03', l: 'AI/LLM', e: 'GPT-4/5, Claude 3.5/4, Gemini. 11x confirmed hierarchical multi-agent on LangChain + FastAPI + Postgres with both OpenAI and Anthropic.' },
        { n: '04', l: 'Orchestration', e: 'Durable execution: Cargo runs on Temporal ("all our orchestration relies on Temporal"). Inngest, Trigger.dev as TS alternatives.' },
        { n: '05', l: 'Send', e: 'Transactional (SendGrid, Resend, Postmark) vs mailbox-based via Gmail API and Microsoft Graph with domain/mailbox rotation for cold.' },
        { n: '06', l: 'Voice', e: 'Vapi, Bland, Retell, Synthflow · Twilio + ElevenLabs / Cartesia / Deepgram. 11x Julian runs on Cartesia (TTS) + Ultravox (speech-to-speech).' },
    ];

    const failures = [
        'Hallucinated personalization damages credibility',
        'Deliverability collapse — 10–15% bounces degrade domain reputation',
        "Stale emails — many platforms don't re-verify in real time",
        'Reply handling fails on OOO / auto-replies',
        'Over-sending generic templates recognized as automated',
        'Poor CRM integration — AiSDR/Regie.ai reviews cite this',
        'Meeting-scheduling friction across Calendly / Chili Piper / Default',
        'Pricing vs ROI disappointment — 8-month payback for best-in-class',
        '"GPT wrapper" criticism — thin prompt-chains over OpenAI',
    ];

    return (
        <section id="architecture" style={{ padding: '80px 48px 120px', background: p.bgAlt }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <SectionHeader num="10" label="Architecture" subtitle="What's actually inside these products" p={p} />

                <h2 className="display" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, lineHeight: 0.95, margin: '48px 0 40px' }}>
                    The <em style={{ color: p.accent, fontWeight: 400 }}>six-layer stack.</em>
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                    {layers.map((layer, i) => (
                        <div key={i} style={{
                            padding: 24,
                            background: p.bg,
                            borderRadius: 2,
                            position: 'relative',
                            overflow: 'hidden',
                            border: `1px solid ${p.line}`,
                        }}>
                            <div className="display" style={{
                                position: 'absolute',
                                top: -20,
                                right: -10,
                                fontSize: 120,
                                fontWeight: 200,
                                color: p.line,
                                lineHeight: 1,
                            }}>
                                {layer.n}
                            </div>
                            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.accent, marginBottom: 12, position: 'relative' }}>
                                Layer {layer.n}
                            </div>
                            <h3 className="display" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 12px', position: 'relative' }}>{layer.l}</h3>
                            <p style={{ fontSize: 12, lineHeight: 1.6, margin: 0, color: p.textMuted, position: 'relative' }}>{layer.e}</p>
                        </div>
                    ))}
                </div>

                <div style={{ paddingTop: 64, marginTop: 64, borderTop: `1px solid ${p.line}` }}>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: p.accent, marginBottom: 20 }}>
                        ▼ Nine recurring failure modes
                    </div>
                    <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, lineHeight: 0.95, margin: '0 0 40px' }}>
                        <em style={{ color: p.accent, fontWeight: 400 }}>50–70% of buyers</em> churn within 90 days.
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: p.line }}>
                        {failures.map((f, i) => (
                            <div key={i} style={{ background: p.bg, padding: 24 }}>
                                <div className="bignum" style={{ fontSize: 36, color: p.accent, marginBottom: 8 }}>
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                                <div style={{ fontSize: 13, lineHeight: 1.5 }}>{f}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// BENCHMARKS
// ============================================================

function BenchmarksSection({ p }) {
    const benchmarks = [
        { metric: 'Open rate', median: '25–40%', top: '45–55%', elite: '60%+' },
        { metric: 'Reply rate', median: '1.6–3%', top: '3–5%', elite: '5–8%' },
        { metric: 'Positive reply', median: '0.5–1%', top: '1–2%', elite: '2–4%' },
        { metric: 'Meeting booked', median: '0.5–1%', top: '1.5–2%', elite: '2%+' },
        { metric: 'Bounce', median: '<3%', top: '<1%', elite: '<0.5%' },
    ];

    return (
        <section id="benchmarks" style={{ padding: '80px 48px 120px' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <SectionHeader num="11" label="Benchmarks" subtitle="What good looks like in 2026" p={p} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 32, marginTop: 48 }}>
                    <div style={{ gridColumn: 'span 6' }}>
                        <h2 className="display" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, lineHeight: 0.95, margin: 0 }}>
                            Cold reply rates:<br />
                            <em style={{ color: p.accent, fontWeight: 400 }}>8.5% → 5%</em> in six years.
                        </h2>

                        <p style={{ fontSize: 17, lineHeight: 1.7, marginTop: 28 }}>
                            Industry-wide decline is structural, not cyclical. Gmail and Microsoft now deploy AI filters reportedly blocking 99.9% of unwanted mail. <strong>Warmup no longer offsets poor copy and poor ICP targeting</strong> — deliverability is now a product of signal quality, not just infrastructure.
                        </p>

                        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                            {[
                                { y: '2019', n: '8.5%' },
                                { y: '2023', n: '7%' },
                                { y: '2025', n: '5%' },
                            ].map((row, i) => (
                                <div key={i} style={{ padding: 20, background: p.bgSubtle, borderRadius: 2, textAlign: 'center' }}>
                                    <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: p.textMuted, marginBottom: 8 }}>{row.y}</div>
                                    <div className="bignum" style={{ fontSize: 52, color: p.accent }}>{row.n}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ gridColumn: 'span 6' }}>
                        <div className="glass" style={{ padding: 32, borderRadius: 2 }}>
                            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.accent, marginBottom: 20 }}>
                                ▼ 2026 Benchmark Targets
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: `2px solid ${p.text}` }}>
                                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.textMuted }}>Metric</div>
                                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.textMuted, textAlign: 'right' }}>Median</div>
                                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.textMuted, textAlign: 'right' }}>Top Q</div>
                                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.accent, textAlign: 'right' }}>Elite</div>
                            </div>

                            {benchmarks.map((b, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, alignItems: 'center', padding: '14px 0', borderBottom: i < benchmarks.length - 1 ? `1px solid ${p.line}` : 'none' }}>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>{b.metric}</div>
                                    <div className="mono" style={{ fontSize: 12, textAlign: 'right', color: p.textMuted }}>{b.median}</div>
                                    <div className="mono" style={{ fontSize: 12, textAlign: 'right' }}>{b.top}</div>
                                    <div className="mono" style={{ fontSize: 12, textAlign: 'right', color: p.accent, fontWeight: 600 }}>{b.elite}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 24, padding: 28, background: p.bgSubtle, borderRadius: 2 }}>
                            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.accent, marginBottom: 16 }}>
                                ROI Comparison
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div>
                                    <div className="mono" style={{ fontSize: 9, color: p.textMuted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 6 }}>Human SDR (loaded)</div>
                                    <div className="bignum" style={{ fontSize: 36 }}>$88–173K</div>
                                    <div style={{ fontSize: 11, color: p.textMuted, marginTop: 4 }}>per year · 1.4–1.8y tenure</div>
                                </div>
                                <div>
                                    <div className="mono" style={{ fontSize: 9, color: p.textMuted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 6 }}>AI SDR platform</div>
                                    <div className="bignum" style={{ fontSize: 36, color: p.accent }}>$2.4–60K</div>
                                    <div style={{ fontSize: 11, color: p.textMuted, marginTop: 4 }}>per year · 85–95% cheaper</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// CONCLUSION
// ============================================================

function ConclusionSection({ p }) {
    const lessons = [
        {
            n: '01',
            t: 'Data quality and signal freshness are the product, not the LLM.',
            b: "Clay's $3.1B valuation, UserGems' 47× median pipeline ROI, Unify's \"warm outbound\" thesis, and Common Room's 50+ signal sources all succeed where autonomous AI SDRs churn — because their output is grounded in live evidence that the buyer recognizes as specific to them.",
        },
        {
            n: '02',
            t: 'The value layer is shifting from sending to deciding.',
            b: 'Gmail, Microsoft Outlook, LinkedIn, and the FCC have collectively eliminated "cheap volume" as a strategy. The winning architectures route around these gates with intent detection, multi-agent decision-making, and governance.',
        },
        {
            n: '03',
            t: 'Pricing models are unstable and the market is watching HubSpot.',
            b: "Outcome-based pricing ($1/qualified lead) is the single biggest GTM experiment of 2026. Salesforce's Flex Credits failed to stabilize. Autonomous AI SDRs are piloting per-response. Builders should assume their initial pricing will not be their final pricing.",
        },
    ];

    const gaps = [
        { t: 'Vertical-native AI SDRs', b: 'HIPAA-native healthcare, bar-compliant legal, FINRA-compliant finance. Regulation is the moat.' },
        { t: 'True multi-channel orchestration', b: 'Shared state across email, LinkedIn, SMS, voice — deduplicated, cadence-aware, as a single stateful agent.' },
        { t: 'Write-back governance', b: 'Agents that safely mutate structured CRM fields with audit trail and rollback.' },
        { t: 'Honest AI-skeptical analytics', b: 'Meetings-held, opp-to-close, and negative externalities — unsubscribes, spam, domain reputation — against pre-AI baseline.' },
        { t: 'Long-tail channels', b: 'WhatsApp Business API, compliant TCPA-voice, WeChat / LINE / KakaoTalk. Underserved.' },
        { t: 'Agentic RFP / security questionnaire', b: 'Inventive AI exists but the gap remains for mid-market and below.' },
    ];

    return (
        <section id="conclusion" style={{ padding: '80px 48px 120px', background: p.bgAlt }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <SectionHeader num="12" label="Conclusion" subtitle="Three lessons and six open spaces" p={p} />

                <h2 className="display" style={{ fontSize: 'clamp(48px, 7vw, 120px)', fontWeight: 300, lineHeight: 0.85, margin: '64px 0 56px' }}>
                    The open<br />
                    <em style={{ fontStyle: 'italic', color: p.accent, fontWeight: 400 }}>spaces</em> are<br />
                    visible.
                </h2>

                <div style={{ display: 'grid', gap: 24 }}>
                    {lessons.map((l) => (
                        <div key={l.n} className="glass" style={{ padding: 40, borderRadius: 2, display: 'grid', gridTemplateColumns: '100px 1fr', gap: 24 }}>
                            <div className="display bignum" style={{ fontSize: 80, color: p.accent, lineHeight: 0.9 }}>{l.n}</div>
                            <div>
                                <h3 className="display" style={{ fontSize: 24, fontWeight: 400, lineHeight: 1.25, margin: '0 0 14px' }}>
                                    {l.t}
                                </h3>
                                <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: p.textMuted }}>
                                    {l.b}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 72, padding: 48, background: p.bg, borderRadius: 2, border: `1px solid ${p.accent}` }}>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: p.accent, marginBottom: 24 }}>
                        ▼ Unmet Needs · For The Builder
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}>
                        {gaps.map((g, i) => (
                            <div key={i}>
                                <div className="display" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.2, marginBottom: 10, color: p.accent }}>
                                    {g.t}
                                </div>
                                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                                    {g.b}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 72, textAlign: 'center', padding: '48px 0' }}>
                    <div className="display" style={{
                        fontSize: 'clamp(26px, 4vw, 44px)',
                        fontStyle: 'italic',
                        fontWeight: 300,
                        lineHeight: 1.2,
                        maxWidth: 900,
                        margin: '0 auto',
                    }}>
                        The category's capital, branding, and analyst attention are crowded;<br />
                        <span style={{ color: p.accent }}>its execution quality is not.</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// FOOTER
// ============================================================

function Footer({ p }) {
    return (
        <footer style={{ padding: '60px 48px 40px', borderTop: `1px solid ${p.line}` }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}>
                <div>
                    <div className="display" style={{ fontSize: 22, fontStyle: 'italic', fontWeight: 700, marginBottom: 14 }}>
                        The Agentic Quarterly
                    </div>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.textMuted, lineHeight: 1.8 }}>
                        Vol. 01 · Edition 02<br />
                        April 2026<br />
                        Interactive Field Guide
                    </div>
                </div>

                <div>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.accent, marginBottom: 12 }}>
                        Typography
                    </div>
                    <div style={{ fontSize: 12, lineHeight: 1.8, color: p.textMuted }}>
                        Display · <em>Fraunces</em><br />
                        Body · Inter Tight<br />
                        Mono · JetBrains Mono
                    </div>
                </div>

                <div>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.accent, marginBottom: 12 }}>
                        Method
                    </div>
                    <div style={{ fontSize: 12, lineHeight: 1.8, color: p.textMuted }}>
                        Synthesis of G2 / Capterra reviews, vendor documentation, TechCrunch / Bloomberg reporting, Gartner / Forrester / IDC analyst coverage through April 2026.
                    </div>
                </div>

                <div>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: p.accent, marginBottom: 12 }}>
                        Verification flags
                    </div>
                    <div style={{ fontSize: 12, lineHeight: 1.8, color: p.textMuted }}>
                        Amplemarket Series B 2025 — unverified.<br />
                        Common Room total funding — discrepancy.<br />
                        11x retained ARR — disputed.<br />
                        Radar scores — editorial, not benchmarks.
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 56, paddingTop: 20, borderTop: `1px solid ${p.line}`, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.textMuted }}>
                    — End of edition —
                </div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.textMuted }}>
                    Prepared for the technical founder
                </div>
            </div>
        </footer>
    );
}