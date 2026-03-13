import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * AOXCON Sovereign AI Framework v2.1
 * - Log Engine: Handles real-time activity stream
 * - Load Balancing: Calculates active neural strain
 * - Agent Management: Handles reactive state for autonomous nodes
 */

export type AIProvider = 'Google' | 'Local' | 'OpenAI' | 'Anthropic' | 'Sovereign';
export type EntityStatus = 'online' | 'offline' | 'loading' | 'working' | 'analyzing' | 'idle';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  status: EntityStatus;
  description: string;
  latency?: number;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: EntityStatus;
  lastTask: string;
  efficiency: number;
  selected: boolean;
  neuralLoad: number;
}

export interface NeuralLog {
  id: string;
  source: string;
  timestamp: string;
  message: string;
  level: 'info' | 'warning' | 'critical';
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private http = inject(HttpClient);

  // --- STATE MANAGEMENT ---
  readonly models = signal<AIModel[]>([
    { id: 'gemini-3-pro', name: 'Gemini 3.1 Pro', provider: 'Google', status: 'online', description: 'Advanced reasoning.', latency: 120 },
    { id: 'gemini-3-flash', name: 'Gemini 3 Flash', provider: 'Google', status: 'online', description: 'High-speed processing.', latency: 45 },
    { id: 'local-llama-3', name: 'Llama 3.1 (Local)', provider: 'Local', status: 'online', description: 'Privacy-focused.', latency: 15 }
  ]);

  readonly agents = signal<AIAgent[]>([
    { id: 'sentinel', name: 'AOXCAn Sentinel', role: 'Security Audit', status: 'idle', lastTask: 'Ready', efficiency: 99.8, selected: true, neuralLoad: 15 },
    { id: 'sync-master', name: 'AOXCAn Sync-Master', role: 'Cross-Chain', status: 'idle', lastTask: 'Ready', efficiency: 97.2, selected: true, neuralLoad: 20 },
    { id: 'architect', name: 'AOXCAn Architect', role: 'DApp Synthesis', status: 'idle', lastTask: 'Ready', efficiency: 94.5, selected: false, neuralLoad: 0 }
  ]);

  readonly selectedModelId = signal<string>('gemini-3-pro');
  
  // --- 🛰️ THE NEURAL LOG STREAM ---
  readonly neuralLogs = signal<NeuralLog[]>([]);

  // --- COMPUTED STATE ---
  readonly activeModel = computed(() => 
    this.models().find(m => m.id === this.selectedModelId()) ?? this.models()[0]
  );

  readonly selectedAgents = computed(() => 
    this.agents().filter(a => a.selected)
  );

  readonly totalNeuralLoad = computed(() => 
    this.agents().reduce((acc, curr) => acc + (curr.selected ? curr.neuralLoad : 0), 0)
  );

  constructor() {
    // Audit Logging: Model değişimlerini izle
    effect(() => {
      this.addLog('System-Core', `Neural routing switched to ${this.activeModel().name}`, 'info');
    });
  }

  // --- ACTIONS ---

  /**
   * 🛡️ CRITICAL FIX: Metodu ekledik. NetworkService artık buraya yazabilir.
   */
  addLog(source: string, message: string, level: NeuralLog['level'] = 'info') {
    const newLog: NeuralLog = {
      id: crypto.randomUUID(),
      source,
      timestamp: new Date().toLocaleTimeString(),
      message,
      level
    };

    // Bellek dostu güncelleme: Son 15 logu tutar
    this.neuralLogs.update(logs => [newLog, ...logs].slice(0, 15));
  }

  selectModel(id: string) {
    this.selectedModelId.set(id);
  }

  toggleAgent(id: string) {
    this.agents.update(agents => agents.map(a => 
      a.id === id ? { ...a, selected: !a.selected } : a
    ));
    const agent = this.agents().find(a => a.id === id);
    this.addLog('Agent-Core', `${agent?.name} neural status: ${agent?.selected ? 'ACTIVE' : 'OFFLINE'}`, 'info');
  }

  /**
   * Task Execution with Simulated AI Response
   */
  async executeNeuralTask(agentId: string, task: string) {
    this.addLog(agentId, `Initiating sequence: ${task}`, 'info');
    this.updateAgentStatus(agentId, 'working', task, 65);

    try {
      // API Gecikme Simülasyonu
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      this.updateAgentStatus(agentId, 'idle', `Completed: ${task}`, 15);
      this.addLog(agentId, `Neural handshake verified for ${task}`, 'info');
    } catch (error) {
      this.updateAgentStatus(agentId, 'offline', 'Protocol Error', 0);
      this.addLog(agentId, `Task failed: Critical exception`, 'critical');
    }
  }

  private updateAgentStatus(id: string, status: EntityStatus, task: string, load: number) {
    this.agents.update(agents => agents.map(a => 
      a.id === id ? { ...a, status, lastTask: task, neuralLoad: load } : a
    ));
  }
}
