import type { LucideIcon } from "lucide-react";
import type * as THREE from "three";
import type { Group3 } from "./theme";

export type Category = "all" | Group3;

export interface ServiceTreeNode {
  key: string;
  category: Group3;
  /** Localized service name — shown in the hover tooltip. */
  name: string;
  icon: LucideIcon;
}

// ── Scene object types ──────────────────────────────────────────────────────
export type BranchKind = "trunk" | "main" | "sub";
export type BranchCat = "trunk" | Group3;

export interface BranchLayer {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  baseOp: number;
  core: boolean;
  idxFull: number;
}
export interface Branch {
  layers: BranchLayer[];
  base: THREE.Color;
  coreCol: THREE.Color;
  cat: BranchCat;
  t0: number;
  t1: number;
  curve: THREE.QuadraticBezierCurve3;
  kind: BranchKind;
}
export interface NodeObj {
  key: string;
  cat: Group3;
  group: THREE.Group;
  glow: THREE.Sprite;
  glowMat: THREE.SpriteMaterial;
  leafMat: THREE.SpriteMaterial;
  iconMat: THREE.SpriteMaterial;
  baseColor: THREE.Color;
  pos: THREE.Vector3;
  growAt: number;
  scale: number;
}
export interface HubGlow {
  sp: THREE.Sprite;
  cat: Group3;
  growAt: number;
}
export interface PulseObj {
  sprite: THREE.Sprite;
  curve: THREE.QuadraticBezierCurve3;
  cat: BranchCat;
  speed: number;
  offset: number;
}
