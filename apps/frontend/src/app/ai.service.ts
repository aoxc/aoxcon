import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * AOXCON Sovereign AI Framework v2.1
 * - Log Engine: Optimized real-time telemetry stream
 * - Load Balancing: Reactive neural strain calculation
 * - Audit Grade: Zero-warning TypeScript implementation
 */

export type AIProvider = 'Google' | 'Local' | 'OpenAI' | 'Anthropic' | 'Sovereign';
export type EntityStatus = 'online' | 'offline' | 'loading' | 'working' | 'analyzing' | 'idle';
export type LogSeverity = 'info' | 'warning' | 'critical' | 'success';

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
  level: LogSeverity;
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private readonly http = inject(HttpClient);

  // --- REAKTİF STATE ---
  public readonly models = signal<AIModel[]>([
    { id: 'gemini-3-pro', name: 'Gemini 3.1 Pro', provider: 'Google', status: 'online', description: 'Advanced reasoning.', latency: 120 },
    { id: 'gemini-3-flash', name: 'Gemini 3 Flash', provider: 'Google', status: 'online', description: 'High-speed processing.', latency: 45 },
    { id: 'local-llama-3', name: 'Llama 3.1 (Local)', provider: 'Local', status: 'online', description: 'Privacy-focused.', latency: 15 }
  ]);

  public readonly agents = signal<AIAgent[]>([
    { id: 'sentinel', name: 'AOXCAn Sentinel', role: 'Security Audit', status: 'idle', lastTask: 'Ready', efficiency: 99.8, selected: true, neuralLoad: 15 },
    { id: 'sync-master', name: 'AOXCAn Sync-Master', role: 'Cross-Chain', status: 'idle', lastTask: 'Ready', efficiency: 97.2, selected: true, neuralLoad: 20 },
    { id: 'architect', name: 'AOXCAn Architect', role: 'DApp Synthesis', status: 'idle', lastTask: 'Ready', efficiency: 94.5, selected: false, neuralLoad: 0 }
  ]);

  public readonly selectedModelId = signal<string>('gemini-3-pro');
  public readonly neuralLogs = signal<NeuralLog[]>([]);

  // --- COMPUTED TELEMETRY ---
  public readonly activeModel = computed(() => 
    this.models().find(m => m.id === this.selectedModelId()) ?? this.models()[0]
  );

  public readonly selectedAgents = computed(() => 
    this.agents().filter(a => a.selected)
  );

  public readonly totalNeuralLoad = computed(() => 
    this.agents().reduce((acc, curr) => acc + (curr.selected ? curr.neuralLoad : 0), 0)
  );

  constructor() {
    /**
     * LOG SYNCHRONIZER
     * Model değişimlerini otomatik olarak neural log stream'e aktarır.
     */
    effect(() => {
      this.addLog('System-Core', `Neural routing switched to ${this.activeModel().name}`, 'info');
    });
  }

  // --- PUBLIC INTERFACE ---

  public addLog(source: string, message: string, level: LogSeverity = 'info'): void {
    const newLog: NeuralLog = {
      id: crypto.randomUUID(),
      source,
      timestamp: new Date().toLocaleTimeString(),
      message,
      level
    };
    // Buffer management: Sadece en güncel 15 logu tutarak memory overhead'i engeller.
    this.neuralLogs.update(logs => [newLog, ...logs].slice(0, 15));
  }

  public selectModel(id: string): void {
    this.selectedModelId.set(id);
  }

  public toggleAgent(id: string): void {
    this.agents.update(agents => agents.map(a => 
      a.id === id ? { ...a, selected: !a.selected } : a
    ));
    const agent = this.agents().find(a => a.id === id);
    this.addLog('Agent-Core', `${agent?.name} neural status: ${agent?.selected ? 'ACTIVE' : 'OFFLINE'}`, 'info');
  }

  /**
   * SOVEREIGN TASK EXECUTION
   * Simulates AI reasoning and infrastructure deployment.
   */
  public async executeNeuralTask(agentId: string, task: string): Promise<void> {
    this.addLog(agentId, `Initiating sequence: ${task}`, 'info');
    this.updateAgentStatus(agentId, 'working', task, 65);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      this.updateAgentStatus(agentId, 'idle', `Completed: ${task}`, 15);
      this.addLog(agentId, `Neural handshake verified for ${task}`, 'info');
    } catch {
      /**
       * FIX: catch (_error: unknown) yerine doğrudan catch {} kullanarak 
       * 'defined but never used' hatasını (no-unused-vars) fiziksel olarak sildik.
       */
      this.updateAgentStatus(agentId, 'offline', 'Protocol Error', 0);
      this.addLog(agentId, `Task failed: Critical exception in neural link`, 'critical');
    }
  }

  private updateAgentStatus(id: string, status: EntityStatus, task: string, load: number): void {
    this.agents.update(agents => agents.map(a => 
      a.id === id ? { ...a, status, lastTask: task, neuralLoad: load } : a
    ));
  }
}
