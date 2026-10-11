import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useTimer } from '../context/TimerContext';
import { RefreshCw, ArrowLeft } from 'lucide-react';

interface AntiGravityCanvasProps {
  scenario: 'distracted' | 'reward';
}

export const AntiGravityCanvas: React.FC<AntiGravityCanvasProps> = ({ scenario }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  const { recoverFromDistraction, resetTimer } = useTimer();

  useEffect(() => {
    if (!sceneRef.current) return;

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
      Events,
    } = Matter;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create engine with zero/low gravity initially
    const engine = Engine.create({
      gravity: {
        x: 0,
        y: scenario === 'distracted' ? 0.2 : 0.8,
        scale: 0.001,
      },
    });
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
      },
    });
    renderRef.current = render;

    // Boundary walls (with restitution for bouncy anti-gravity feel)
    const wallOptions = {
      isStatic: true,
      restitution: 0.8,
      render: { visible: false },
    };

    const ground = Bodies.rectangle(width / 2, height + 30, width * 2, 60, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -30, width * 2, 60, wallOptions);
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height * 2, wallOptions);
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height * 2, wallOptions);

    const bodies: Matter.Body[] = [ground, ceiling, leftWall, rightWall];

    if (scenario === 'distracted') {
      // 1. Angry Monster Body
      const monster = Bodies.rectangle(width / 2, height / 3, 140, 160, {
        restitution: 0.9,
        frictionAir: 0.02,
        render: {
          sprite: {
            texture: '/IMG_6056.PNG',
            xScale: 0.25,
            yScale: 0.25,
          },
        },
      });
      bodies.push(monster);

      // 2. Fragmented UI Pieces (hand-drawn cream colored blocks with borders)
      const fragmentColors = ['#F2E4CD', '#E8D5B7', '#D4A373', '#7799D9', '#D97777'];
      const fragmentTexts = ['25:00', '分心了！', '英文', '專注中斷', '📕', '📘'];

      fragmentTexts.forEach((text, index) => {
        const x = (width / 4) + (index * 40) % (width / 2);
        const y = (height / 2) + ((index * 30) % 150);
        const block = Bodies.rectangle(x, y, 90, 45, {
          restitution: 0.85,
          frictionAir: 0.015,
          chamfer: { radius: 12 },
          render: {
            fillStyle: fragmentColors[index % fragmentColors.length],
            strokeStyle: '#5C4033',
            lineWidth: 3,
          },
        });
        (block as any).label = text;
        bodies.push(block);
      });
    } else {
      // REWARD / FEEDING SCENARIO:
      // Happy Monster near bottom
      const monster = Bodies.rectangle(width / 2, height * 0.65, 160, 180, {
        restitution: 0.6,
        frictionAir: 0.05,
        render: {
          sprite: {
            texture: '/IMG_6057.PNG',
            xScale: 0.28,
            yScale: 0.28,
          },
        },
      });
      bodies.push(monster);

      // Dropping Strawberries!
      for (let i = 0; i < 7; i++) {
        const x = 50 + Math.random() * (width - 100);
        const y = -50 - Math.random() * 200;
        const strawberry = Bodies.circle(x, y, 22, {
          restitution: 0.75,
          friction: 0.1,
          render: {
            fillStyle: '#FF5E7E',
            strokeStyle: '#5C4033',
            lineWidth: 2,
          },
        });
        (strawberry as any).isStrawberry = true;
        bodies.push(strawberry);
      }
    }

    Composite.add(engine.world, bodies);

    // Mouse & Touch interaction for flicking objects
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Custom label renderer for text on fragments / strawberries
    Events.on(render, 'afterRender', () => {
      const context = render.context;
      context.font = 'bold 15px Outfit, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      engine.world.bodies.forEach((body: any) => {
        if (body.label && body.label !== 'Rectangle Body') {
          context.save();
          context.translate(body.position.x, body.position.y);
          context.rotate(body.angle);
          context.fillStyle = '#5C4033';
          context.fillText(body.label, 0, 0);
          context.restore();
        } else if (body.isStrawberry) {
          context.save();
          context.translate(body.position.x, body.position.y);
          context.rotate(body.angle);
          context.font = '22px sans-serif';
          context.fillText('🍓', 0, 0);
          context.restore();
        }
      });
    });

    // Gyroscope DeviceOrientation integration
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null && event.beta !== null) {
        // gamma: left-to-right [-90, 90]
        // beta: front-to-back [-180, 180]
        const gx = Math.min(Math.max(event.gamma / 25, -1.5), 1.5);
        const gy = Math.min(Math.max((event.beta - 30) / 25, -1.5), 1.5);
        engine.world.gravity.x = gx;
        engine.world.gravity.y = gy;
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    // Run engine and renderer
    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Cleanup
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (runnerRef.current) Runner.stop(runnerRef.current);
      if (renderRef.current) {
        Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
        }
      }
      if (engineRef.current) Composite.clear(engineRef.current.world, false);
    };
  }, [scenario]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 100,
      backgroundColor: scenario === 'distracted' ? 'rgba(253, 244, 227, 0.88)' : 'rgba(253, 244, 227, 0.85)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2rem 1.5rem',
      touchAction: 'none',
      userSelect: 'none',
    }}>
      {/* Top Banner Notice */}
      <div style={{
        zIndex: 101,
        textAlign: 'center',
        background: '#FFFFFF',
        border: '3px solid #5C4033',
        borderRadius: '20px',
        padding: '12px 24px',
        boxShadow: '0 6px 0 #8B6B52',
        maxWidth: '340px',
        animation: 'pulse 2s infinite ease-in-out',
      }}>
        {scenario === 'distracted' ? (
          <>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97777', marginBottom: '4px' }}>
              💥 抓到了！你剛剛分心跑走了！
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#5C4033', fontWeight: 600 }}>
              手機偵測到切頁違規，介面失重散架了！傾斜手機把碎片推開吧～
            </p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B88655', marginBottom: '4px' }}>
              🎉 專注完成！強制放鬆時間
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#5C4033', fontWeight: 600 }}>
              轉動手機讓飄浮的草莓 🍓 滾向小怪獸餵食牠吧！
            </p>
          </>
        )}
      </div>

      {/* Matter.js Canvas Container */}
      <div 
        ref={sceneRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 100,
          pointerEvents: 'auto',
        }} 
      />

      {/* Bottom Action Button */}
      <div style={{ zIndex: 101, marginBottom: '1.5rem' }}>
        {scenario === 'distracted' ? (
          <button
            className="action-button"
            onClick={recoverFromDistraction}
            style={{
              padding: '14px 28px',
              fontSize: '1.15rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#B88655',
            }}
          >
            <RefreshCw size={22} />
            我反省好了，重新專注！
          </button>
        ) : (
          <button
            className="action-button"
            onClick={resetTimer}
            style={{
              padding: '14px 28px',
              fontSize: '1.15rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#D4A373',
            }}
          >
            <ArrowLeft size={22} />
            餵飽了，回到科目選擇
          </button>
        )}
      </div>
    </div>
  );
};
