import * as React from 'react';
import { CanvasEngine } from '../../CanvasEngine';
import { TransformLayerWidget } from '../layer/TransformLayerWidget';
import styled from '@emotion/styled';
import { SmartLayerWidget } from '../layer/SmartLayerWidget';

export interface DiagramProps {
  engine: CanvasEngine;
  className?: string;
}

namespace S {
  export const Canvas = styled.div`
    position: relative;
    cursor: move;
    overflow: hidden;
  `;
}

export function CanvasWidget(props: DiagramProps) {
  const ref = React.useRef(null);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  const {engine, className} = props;
  const model = engine.getModel();
  // @ts-ignore
  const keyDown = React.useCallback((event) => {
    engine.getActionEventBus().fireAction({event});
  }, [engine]);
  // @ts-ignore
  const keyUp = React.useCallback((event) => {
    engine.getActionEventBus().fireAction({event});
  }, [engine]);

  React.useEffect(() => {
    const canvasListener = engine.registerListener({
      repaintCanvas: () => {
        if (ref.current) {
          forceUpdate();
        }
      },
    });
    if (ref.current) {
      engine.setCanvas(ref.current);
    }

    document.addEventListener('keyup', keyUp);
    document.addEventListener('keydown', keyDown);
    engine.iterateListeners((list) => {
      list.rendered && list.rendered();
    });

    return () => {
      engine.deregisterListener(canvasListener);
      engine.setCanvas(undefined);

      document.removeEventListener('keyup', keyUp);
      document.removeEventListener('keydown', keyDown);
    };
  }, [engine, keyDown, keyUp]);

  return (
    <S.Canvas
      className={className}
      ref={ref}
      onWheel={(event) => {
        engine.getActionEventBus().fireAction({event});
      }}
      onMouseDown={(event) => {
        engine.getActionEventBus().fireAction({event});
      }}
      onMouseUp={(event) => {
        engine.getActionEventBus().fireAction({event});
      }}
      onMouseMove={(event) => {
        engine.getActionEventBus().fireAction({event});
      }}
      onTouchStart={(event) => {
        engine.getActionEventBus().fireAction({event});
      }}
      onTouchEnd={(event) => {
        engine.getActionEventBus().fireAction({event});
      }}
      onTouchMove={(event) => {
        engine.getActionEventBus().fireAction({event});
      }}>
      {model.getLayers().map((layer) => {
        return (
          <TransformLayerWidget layer={layer} key={layer.getID()}>
            <SmartLayerWidget
              layer={layer}
              engine={engine}
              key={layer.getID()}
            />
          </TransformLayerWidget>
        );
      })}
    </S.Canvas>
  );
}
