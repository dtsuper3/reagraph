import React, { FC, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { animationConfig } from '../utils/animation';
import { useSpring, a } from '@react-spring/three';
import { Sphere } from './Sphere';
import { Label } from './Label';
import { Icon } from './Icon';
import { Theme } from '../utils/themes';
import { Ring } from './Ring';
import { InternalGraphNode } from '../types';
import { MenuItem, RadialMenu } from '../RadialMenu';
import { Html, useCursor } from '@react-three/drei';

export interface NodeProps extends InternalGraphNode {
  theme: Theme;
  graph: any;
  disabled?: boolean;
  selections?: string[];
  animated?: boolean;
  contextMenuItems?: MenuItem[];
  onClick?: () => void;
}

export const Node: FC<NodeProps> = ({
  position,
  label,
  animated,
  icon,
  graph,
  size,
  fill,
  disabled,
  id,
  selections,
  labelVisible,
  theme,
  contextMenuItems,
  onClick
}) => {
  const group = useRef<THREE.Group | null>(null);
  const [isActive, setActive] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const hasSelections = selections?.length > 0;
  const isPrimarySelection = selections?.includes(id);

  const isSelected = useMemo(() => {
    if (isPrimarySelection) {
      return true;
    }

    if (selections?.length) {
      return selections.some(selection => graph.hasLink(selection, id));
    }

    return false;
  }, [selections, id, graph, isPrimarySelection]);

  const selectionOpacity = hasSelections
    ? isSelected || isActive
      ? 1
      : 0.2
    : 1;

  const labelOffset = size + 7;
  const { nodePosition, labelPosition } = useSpring({
    from: {
      nodePosition: [0, 0, 0],
      labelPosition: [0, -labelOffset, 2]
    },
    to: {
      nodePosition: position ? [position.x, position.y, position.z] : [0, 0, 0],
      labelPosition: [0, -labelOffset, 2]
    },
    config: {
      ...animationConfig,
      duration: animated ? undefined : 0
    }
  });

  useCursor(isActive, 'pointer');

  return (
    <a.group ref={group} position={nodePosition as any}>
      {icon ? (
        <Icon
          image={icon}
          size={size + 8}
          opacity={selectionOpacity}
          animated={animated}
          onClick={onClick}
          onActive={setActive}
          onContextMenu={() => {
            if (contextMenuItems?.length && !disabled) {
              setMenuVisible(true);
            }
          }}
        />
      ) : (
        <Sphere
          size={size}
          color={
            isSelected || isActive
              ? theme.node.activeFill
              : fill || theme.node.fill
          }
          opacity={selectionOpacity}
          animated={animated}
          onClick={onClick}
          onActive={val => {
            if (!disabled) {
              setActive(val);
            }
          }}
          onContextMenu={() => {
            if (contextMenuItems?.length && !disabled) {
              setMenuVisible(true);
            }
          }}
        />
      )}
      <Ring
        opacity={isPrimarySelection ? 0.5 : 0}
        size={size}
        animated={animated}
        color={isSelected || isActive ? theme.ring.activeFill : theme.ring.fill}
      />
      {menuVisible && (
        <Html prepend={true} center={true}>
          <RadialMenu
            theme={theme}
            items={contextMenuItems}
            onClose={() => setMenuVisible(false)}
          />
        </Html>
      )}
      {(labelVisible || isSelected || isActive) && label && (
        <a.group position={labelPosition as any}>
          <Label
            text={label}
            opacity={selectionOpacity}
            color={
              isSelected || isActive ? theme.node.activeColor : theme.node.color
            }
          />
        </a.group>
      )}
    </a.group>
  );
};

Node.defaultProps = {
  size: 7,
  labelVisible: true
};
