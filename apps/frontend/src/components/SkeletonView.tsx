import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, FolderOpen, FileCode, 
  Terminal, Github, Loader2, AlertCircle, 
  Cpu, Database, Network, ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * @title AOXC Neural Cluster Explorer
 * @version 3.0.0-PRO-AUDIT
 * @notice Real-time recursive mapping of the entire AOXC GitHub ecosystem.
 * @dev Connects to api.github.com/orgs/aoxc/repos
 */

interface RepoNode {
  name: string;
  type: 'repo' | 'dir' | 'file';
  path: string;
  description?: string;
  html_url?: string;
  children?: RepoNode[];
}

export const SkeletonView = () => {
  const [clusterData, setClusterData] = useState<RepoNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * @action CLUSTER_DISCOVERY
   * Fetches all repositories from the AOXC organization and maps their root structures.
   */
  const discoverCluster = useCallback(async () => {
    const org = 'aoxc';
    setIsLoading(true);
    
    try {
      // 1. Fetch Repository List from Organization
      const repoRes = await fetch(`https://api.github.com/users/${org}/repos?sort=updated&per_page=10`);
      if (!repoRes.ok) throw new Error('GITHUB_UPLINK_FAILURE');
      
      const repos = await repoRes.json();
      
      // 2. Map Repository Roots and Basic Metadata
      const mappedCluster: RepoNode[] = await Promise.all(repos.map(async (repo: any) => {
        // Her depo için başlangıç seviyesi dosya taraması (Lazy-loading için hazır yapı)
        return {
          name: repo.name,
          type: 'repo',
          path: repo.full_name,
          description: repo.description,
          html_url: repo.html_url,
          children: [] // Children will be fetched on-demand to respect rate limits
        };
      }));

      setClusterData(mappedCluster);
    } catch (err: any) {
      setError(err.message === 'GITHUB_UPLINK_FAILURE' ? 'ORG_UPLINK_CRITICAL_ERROR' : 'RATE_LIMIT_EXCEEDED');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    discoverCluster();
  }, [discoverCluster]);

  return (
    <div className="flex-1 flex flex-col bg-[#020202] p-6 md:p-10 font-mono overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* CLUSTER_TELEMETRY_HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <Network size={20} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-white font-black text-xs uppercase tracking-[0.5em] leading-none">
                Cluster_Infrastructure_Map
              </h2>
              <p className="text-cyan-500/40 text-[8px] uppercase font-bold mt-1 tracking-widest">
                Direct_Link: github.com/aoxc
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 bg-white/[0.02] px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-xl group">
          <Database size={14} className="text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 leading-none lowercase">
              aoxc@neural-os: <span className="text-cyan-500">./scan_cluster --full</span>
            </span>
            <span className="text-[7px] text-white/10 uppercase mt-1 tracking-tighter">Status: Multi_Repo_Sync_Active</span>
          </div>
        </div>
      </div>

      {/* SYSTEM_STAGING_AREA */}
      <div className="flex-1 bg-black/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 overflow-y-auto scrollbar-hide relative shadow-inner">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center gap-4 text-cyan-500/30"
            >
              <Loader2 className="animate-spin" size={32} />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black">Decrypting_GitHub_Manifests...</span>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="h-full flex flex-col items-center justify-center gap-4 text-rose-500/40"
            >
              <AlertCircle size={32} />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black">{error}</span>
              <button onClick={discoverCluster} className="mt-4 text-[9px] underline underline-offset-4 hover:text-rose-500 transition-colors">RETRY_UPLINK</button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {clusterData.map((repo, i) => (
                <ClusterNode key={repo.path} node={repo} isLast={i === clusterData.length - 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SCANNER_FOOTER */}
      <div className="mt-8 flex justify-between items-center px-4 opacity-30 pointer-events-none">
        <div className="flex items-center gap-3">
          <Github size={12} className="text-white" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Full_Sync: github.com/aoxc</span>
        </div>
        <span className="text-[8px] font-mono text-white tracking-widest uppercase italic">Neural_Architecture_v3.0.0-STABLE</span>
      </div>
    </div>
  );
};

const ClusterNode = ({ node, isLast }: { node: RepoNode; isLast: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<RepoNode[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * @action REPO_CONTENT_SCAN
   * Lazy-loads files from a specific repository upon expansion.
   */
  const fetchRepoContents = async () => {
    if (children.length > 0 || isSyncing) return;
    setIsSyncing(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${node.path}/contents`);
      const data = await res.json();
      setChildren(data.map((item: any) => ({
        name: item.name,
        type: item.type === 'dir' ? 'dir' : 'file',
        path: item.path
      })));
    } catch {
      console.error("REPO_SYNC_FAILED");
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleNode = () => {
    if (!isOpen) fetchRepoContents();
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col">
      {/* REPOSITORY_ENTRY_POINT */}
      <div 
        className={cn(
          "flex items-center justify-between group cursor-pointer py-3 px-5 rounded-2xl border transition-all",
          isOpen ? "bg-cyan-500/5 border-cyan-500/20" : "bg-white/[0.02] border-white/5 hover:border-white/10"
        )}
        onClick={toggleNode}
      >
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded-lg bg-black border transition-colors", isOpen ? "border-cyan-500/40 text-cyan-400" : "border-white/5 text-white/20")}>
            <Github size={16} />
          </div>
          <div className="flex flex-col">
            <h3 className={cn("text-xs font-black tracking-widest uppercase transition-colors", isOpen ? "text-white" : "text-white/40 group-hover:text-white/60")}>
              {node.name}
            </h3>
            {node.description && (
              <p className="text-[9px] text-white/10 uppercase tracking-tighter mt-0.5 line-clamp-1 group-hover:text-white/20">
                {node.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {isSyncing && <Loader2 size={12} className="animate-spin text-cyan-500" />}
           <a href={node.html_url} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:text-cyan-400 text-white/20">
             <ExternalLink size={14} />
           </a>
        </div>
      </div>

      {/* REPO_FILE_STRUCTURE: Recursive View */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden ml-8 mt-2 border-l border-white/5"
          >
            {children.length === 0 && !isSyncing ? (
              <span className="text-[9px] text-white/10 uppercase italic ml-6 p-2">Empty_Node or Root_Access_Restricted</span>
            ) : (
              <div className="py-2 space-y-0.5">
                {children.map((child, i) => (
                  <div key={child.path} className="flex items-center gap-3 py-1 px-4 group hover:bg-white/[0.02] rounded-lg transition-all">
                    <span className="text-white/5 font-mono text-[10px] whitespace-pre">
                       {i === children.length - 1 ? '└──' : '├──'}
                    </span>
                    {child.type === 'dir' ? <Folder size={12} className="text-cyan-900" /> : <FileCode size={12} className="text-white/10" />}
                    <span className="text-[10px] font-mono text-white/30 group-hover:text-cyan-500/80 transition-colors uppercase">{child.name}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
