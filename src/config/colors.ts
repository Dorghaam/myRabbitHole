import { NodeColor } from '../types'

export interface ColorConfig {
  bg: string
  border: string
  name: string
  accent: string
}

export const NODE_COLORS: Record<NodeColor, ColorConfig> = {
  [NodeColor.DEFAULT]: {
    bg: '#FFFFFF',
    border: '#E2E8F0',
    name: 'Default',
    accent: '#EC4899',
  },
  [NodeColor.CREAM]: {
    bg: '#FEF9E7',
    border: '#FDE68A',
    name: 'Cream',
    accent: '#F59E0B',
  },
  [NodeColor.PINK]: {
    bg: '#FDEEF4',
    border: '#FBCFE8',
    name: 'Pink',
    accent: '#EC4899',
  },
  [NodeColor.LAVENDER]: {
    bg: '#EDE9FE',
    border: '#DDD6FE',
    name: 'Lavender',
    accent: '#8B5CF6',
  },
  [NodeColor.PURPLE]: {
    bg: '#F3E8FF',
    border: '#E9D5FF',
    name: 'Purple',
    accent: '#A855F7',
  },
  [NodeColor.BLUE]: {
    bg: '#DBEAFE',
    border: '#BFDBFE',
    name: 'Blue',
    accent: '#3B82F6',
  },
  [NodeColor.CYAN]: {
    bg: '#CFFAFE',
    border: '#A5F3FC',
    name: 'Cyan',
    accent: '#06B6D4',
  },
  [NodeColor.MINT]: {
    bg: '#D1FAE5',
    border: '#A7F3D0',
    name: 'Mint',
    accent: '#10B981',
  },
  [NodeColor.YELLOW]: {
    bg: '#FEF3C7',
    border: '#FDE68A',
    name: 'Yellow',
    accent: '#F59E0B',
  },
  [NodeColor.ORANGE]: {
    bg: '#FFEDD5',
    border: '#FED7AA',
    name: 'Orange',
    accent: '#F97316',
  },
  [NodeColor.LIGHT_PINK]: {
    bg: '#FFF1F2',
    border: '#FECDD3',
    name: 'Light Pink',
    accent: '#FB7185',
  },
  [NodeColor.LIGHT_BLUE]: {
    bg: '#F0F9FF',
    border: '#E0F2FE',
    name: 'Light Blue',
    accent: '#0EA5E9',
  },
}

export const getNodeColors = (color: NodeColor): ColorConfig => {
  return NODE_COLORS[color] || NODE_COLORS[NodeColor.DEFAULT]
}
