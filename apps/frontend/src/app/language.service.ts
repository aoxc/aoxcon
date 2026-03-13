import { Injectable, signal, computed } from '@angular/core';

// 🌐 7-Language Sovereign Matrix
export type LanguageCode = 'EN' | 'TR' | 'DE' | 'FR' | 'JP' | 'RU' | 'ZH';

export interface LanguageDef {
  code: LanguageCode;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // --- STATE ---
  readonly currentLang = signal<LanguageCode>('EN');

  // --- CONFIGURATION ---
  readonly languages: LanguageDef[] = [
    { code: 'EN', name: 'English' },
    { code: 'TR', name: 'Türkçe' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JP', name: '日本語' },
    { code: 'RU', name: 'Русский' },
    { code: 'ZH', name: '中文' }
  ];

  private readonly translations: Record<LanguageCode, Record<string, string>> = {
    EN: {
      welcome: 'Welcome to AOXCON Sovereign Interface',
      alpha: 'Sovereign Alpha v2.1',
      searchPlaceholder: 'Search neural logs, blocks, or tx...',
      connectWallet: 'Connect Node',
      neuralModel: 'Neural Core',
      selectNetwork: 'Select Infrastructure',
      overview: 'Overview',
      networks: 'Sovereign Layers',
      aiBuilder: 'Neural Architect',
      dao: 'DAO Governance',
      tps: 'Throughput (TPS)',
      status: 'Engine State',
      efficiency: 'Neural Efficiency',
      lastTask: 'Last Sequence',
      general: 'Parameters',
      staking: 'Validators',
      neuralSync: 'Neural Sync',
      networkParams: 'Layer Config',
      validators: 'Active Nodes',
      recentActivity: 'Neural Logs',
      neuralActivity: 'Neural Activity Feed',
      treasuryValue: 'Treasury Value',
      activeProposals: 'Active Proposals',
      vote: 'Vote'
    },
    TR: {
      welcome: 'AOXCON Egemen Arayüzüne Hoş Geldiniz',
      alpha: 'Egemen Alfa v2.1',
      searchPlaceholder: 'Sinirsel günlükleri, blokları veya işlemleri arayın...',
      connectWallet: 'Düğümü Bağla',
      neuralModel: 'Sinirsel Çekirdek',
      selectNetwork: 'Altyapı Seçin',
      overview: 'Genel Bakış',
      networks: 'Egemen Katmanlar',
      aiBuilder: 'Sinirsel Mimar',
      dao: 'DAO Yönetimi',
      tps: 'İşlem Hızı (TPS)',
      status: 'Motor Durumu',
      efficiency: 'Sinirsel Verimlilik',
      lastTask: 'Son Dizi',
      general: 'Parametreler',
      staking: 'Doğrulayıcılar',
      neuralSync: 'Sinirsel Eşitleme',
      networkParams: 'Katman Yapılandırması',
      validators: 'Aktif Düğümler',
      recentActivity: 'Sinirsel Günlükler',
      neuralActivity: 'Sinirsel Etkinlik Akışı',
      treasuryValue: 'Hazine Değeri',
      activeProposals: 'Aktif Teklifler',
      vote: 'Oy Ver'
    },
    DE: {
      welcome: 'Willkommen beim AOXCON Sovereign Interface',
      alpha: 'Souveräne Alpha v2.1',
      searchPlaceholder: 'Suche in neuronalen Protokollen...',
      connectWallet: 'Knoten verbinden',
      neuralModel: 'Neuronaler Kern',
      selectNetwork: 'Infrastruktur auswählen',
      overview: 'Übersicht',
      networks: 'Souveräne Ebenen',
      aiBuilder: 'Neuronaler Architekt',
      dao: 'DAO-Gouvernance',
      tps: 'Durchsatz (TPS)',
      status: 'Motorstatus',
      efficiency: 'Effizienz',
      lastTask: 'Letzte Sequenz',
      general: 'Parameter',
      staking: 'Validatoren',
      neuralSync: 'Neuronaler Sync',
      networkParams: 'Ebenenkonfiguration',
      validators: 'Aktive Knoten',
      recentActivity: 'Protokolle',
      neuralActivity: 'Aktivitäts-Feed',
      treasuryValue: 'Tresorwert',
      activeProposals: 'Aktive Vorschläge',
      vote: 'Abstimmen'
    },
    FR: {
      welcome: 'Bienvenue sur l\'interface souveraine AOXCON',
      alpha: 'Alpha souveraine v2.1',
      searchPlaceholder: 'Rechercher des journaux neuraux...',
      connectWallet: 'Connecter le nœud',
      neuralModel: 'Noyau neural',
      selectNetwork: 'Sélectionner l\'infrastructure',
      overview: 'Aperçu',
      networks: 'Couches souveraines',
      aiBuilder: 'Architecte neural',
      dao: 'Gouvernance DAO',
      tps: 'Débit (TPS)',
      status: 'État du moteur',
      efficiency: 'Efficacité neurale',
      lastTask: 'Dernière séquence',
      general: 'Paramètres',
      staking: 'Validateurs',
      neuralSync: 'Sync neurale',
      networkParams: 'Config couche',
      validators: 'Nœuds actifs',
      recentActivity: 'Journaux neuraux',
      neuralActivity: 'Flux d\'activité',
      treasuryValue: 'Valeur du trésor',
      activeProposals: 'Propositions actives',
      vote: 'Voter'
    },
    JP: {
      welcome: 'AOXCONソブリンインターフェースへようこそ',
      alpha: 'ソブリンアルファ v2.1',
      searchPlaceholder: 'ニューラルログ、ブロックを検索...',
      connectWallet: 'ノードを接続',
      neuralModel: 'ニューラルコア',
      selectNetwork: 'インフラを選択',
      overview: '概要',
      networks: 'ソブリンレイヤー',
      aiBuilder: 'ニューラルアーキテクト',
      dao: 'DAOガバナンス',
      tps: 'スループット (TPS)',
      status: 'エンジン状態',
      efficiency: 'ニューラル効率',
      lastTask: '最終シーケンス',
      general: 'パラメータ',
      staking: 'バリデーター',
      neuralSync: 'ニューラル同期',
      networkParams: 'レイヤー設定',
      validators: 'アクティブノード',
      recentActivity: 'ニューラルログ',
      neuralActivity: 'アクティビティフィード',
      treasuryValue: '財務価値',
      activeProposals: '有効な提案',
      vote: '投票'
    },
    RU: {
      welcome: 'Добро пожаловать в суверенный интерфейс AOXCON',
      alpha: 'Суверенная альфа v2.1',
      searchPlaceholder: 'Поиск нейронных журналов...',
      connectWallet: 'Подключить узел',
      neuralModel: 'Нейронное ядро',
      selectNetwork: 'Выбрать инфраструктуру',
      overview: 'Обзор',
      networks: 'Суверенные слои',
      aiBuilder: 'Нейроархитектор',
      dao: 'Управление DAO',
      tps: 'Пропускная способность',
      status: 'Состояние двигателя',
      efficiency: 'Эффективность',
      lastTask: 'Последняя задача',
      general: 'Параметры',
      staking: 'Валидаторы',
      neuralSync: 'Нейросинхронизация',
      networkParams: 'Конфигурация слоя',
      validators: 'Активные узлы',
      recentActivity: 'Нейрожурналы',
      neuralActivity: 'Лента активности',
      treasuryValue: 'Стоимость казны',
      activeProposals: 'Активные предложения',
      vote: 'Голосовать'
    },
    ZH: {
      welcome: '欢迎来到 AOXCON 主权界面',
      alpha: '主权 Alpha v2.1',
      searchPlaceholder: '搜索神经日志、区块...',
      connectWallet: '连接节点',
      neuralModel: '神经核心',
      selectNetwork: '选择基础设施',
      overview: '概览',
      networks: '主权层',
      aiBuilder: '神经架构师',
      dao: 'DAO 治理',
      tps: '吞吐量 (TPS)',
      status: '引擎状态',
      efficiency: '神经效率',
      lastTask: '最后序列',
      general: '参数',
      staking: '验证者',
      neuralSync: '神经同步',
      networkParams: '层配置',
      validators: '活动节点',
      recentActivity: '神经日志',
      neuralActivity: '活动提要',
      treasuryValue: '国库价值',
      activeProposals: '当前提案',
      vote: '投票'
    }
  };

  // --- COMPUTED ---
  readonly currentLangDef = computed(() => 
    this.languages.find(l => l.code === this.currentLang())!
  );

  // --- ACTIONS ---
  setLanguage(code: LanguageCode) {
    console.info(`🛡️ [AOXC-LANG]: Neural Translation set to ${code}`);
    this.currentLang.set(code);
    localStorage.setItem('aoxc_pref_lang', code);
  }

  /**
   * T-Translator: Optimized for high-throughput UI rendering
   */
  t(key: string): string {
    const translationSet = this.translations[this.currentLang()];
    return translationSet[key] || key;
  }
}
