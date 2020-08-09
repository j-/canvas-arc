import * as React from 'react';

const round = (value: number, places: number) => Math.round(value * 10 ** places) / 10 ** places;

const PI = Math.PI;
const TAU = PI * 2;
const PRECISION = 2;
const DEFAULT_START_ANGLE = 0;
const DEFAULT_END_ANGLE = round(Math.PI / 4, PRECISION);
const ANGLE_THRESHOLD = 0.05;

const App: React.FC = () => {
  const [startAngle, setStartAngle] = React.useState(DEFAULT_START_ANGLE);
  const [endAngle, setEndAngle] = React.useState(DEFAULT_END_ANGLE);
  const [anticlockwise, setAnticlockwise] = React.useState<undefined | boolean>(undefined);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const handleSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();
  }, []);

  const handleChangeStartAngle = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    setStartAngle(round(e.currentTarget.valueAsNumber, PRECISION));
  }, []);

  const handleChangeEndAngle = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    setEndAngle(round(e.currentTarget.valueAsNumber, PRECISION));
  }, []);

  const handleChangeAnticlockwise = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    switch (e.currentTarget.value) {
      case 'true': return setAnticlockwise(true);
      case 'false': return setAnticlockwise(false);
      case 'undefined': return setAnticlockwise(undefined);
    }
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const radius = Math.min(width, height) * 0.5;

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);
    ctx.scale(0.95, 0.95);

    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.arc(0, 0, radius, 0, TAU);
    ctx.setLineDash([15, 10]);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius, startAngle, endAngle, anticlockwise);
    ctx.setLineDash([])
    ctx.strokeStyle = '#008';
    ctx.lineCap = 'round';
    ctx.lineWidth = 15;
    ctx.stroke();

    if (Math.abs(Math.abs(startAngle - endAngle) - TAU) % TAU > ANGLE_THRESHOLD) {
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.fillStyle = '#333';
      ctx.rotate(startAngle);
      ctx.fillText('S', radius * 0.85, 0);
      ctx.rotate(endAngle - startAngle);
      ctx.fillText('E', radius * 0.85, 0);
    }

    ctx.restore();
  }, [startAngle, endAngle, anticlockwise]);

  return (
    <div className="App container my-5">
      <a href="https://skeoh.com/" className="text-secondary">&larr; skeoh.com</a>
      <h1 className="mb-5">Canvas arc</h1>

      <form onSubmit={handleSubmit}>
        <div className="container px-sm-2">
          <div className="row mx-sm-n3">
            <div className="col-lg-5 px-sm-2">
              <div className="form-group my-3 card card-body">
                <label htmlFor="App-start-angle"><code>startAngle</code></label><br />
                <input
                  id="App-start-angle"
                  className="form-control-range"
                  type="range"
                  list="App-tickmarks"
                  min={0}
                  max={TAU}
                  step="any"
                  value={startAngle}
                  onChange={handleChangeStartAngle}
                />
                <br />
                <input
                  className="form-control"
                  type="number"
                  step={PI * 1 / 4}
                  value={startAngle}
                  onChange={handleChangeStartAngle}
                />
              </div>
            </div>

            <div className="col-lg-5 px-sm-2">
              <div className="form-group my-3 card card-body">
                <label htmlFor="App-end-angle"><code>endAngle</code></label><br />
                <input
                  id="App-end-angle"
                  className="form-control-range"
                  type="range"
                  list="App-tickmarks"
                  min={0}
                  max={TAU}
                  step="any"
                  value={endAngle}
                  onChange={handleChangeEndAngle}
                />
                <br />
                <input
                  className="form-control"
                  type="number"
                  step={PI * 1 / 4}
                  value={endAngle}
                  onChange={handleChangeEndAngle}
                />
              </div>
            </div>

            <div className="col-lg-2 px-sm-2 d-flex">
              <div className="my-3 card card-body flex-fill">
                <code>anticlockwise</code><br />
                <div className="form-check">
                  <input
                    type="radio"
                    name="App-anticlockwise"
                    id="App-anticlockwise-true"
                    className="form-check-input"
                    value="true"
                    onChange={handleChangeAnticlockwise}
                    checked={anticlockwise === true}
                  /> <label htmlFor="App-anticlockwise-true" className="form-check-label"><code>true</code></label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    name="App-anticlockwise"
                    id="App-anticlockwise-false"
                    className="form-check-input"
                    value="false"
                    onChange={handleChangeAnticlockwise}
                    checked={anticlockwise === false}
                  /> <label htmlFor="App-anticlockwise-false" className="form-check-label"><code>false</code></label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    name="App-anticlockwise"
                    id="App-anticlockwise-undefined"
                    className="form-check-input"
                    value="undefined"
                    onChange={handleChangeAnticlockwise}
                    checked={anticlockwise === undefined}
                  /> <label htmlFor="App-anticlockwise-undefined" className="form-check-label"><code>undefined</code></label>
                </div>
              </div>
            </div>
          </div>

          <div className="row mx-sm-n3 my-md-3 my-lg-0">
            <div className="col-md-12 px-sm-2">
              <div className="card card-body text-white bg-dark overflow-auto">
                <div style={{ fontFamily: 'Consolas, "Courier New", monospace', whiteSpace: 'pre', userSelect: 'all' }}>
                  <span style={{ color: '#4fc1ff' }}>ctx</span>
                  <span style={{ color: '#d4d4d4' }}>.</span>
                  <span style={{ color: '#dcdcaa' }}>arc</span>
                  <span style={{ color: '#d4d4d4' }}>(</span>
                  <span style={{ color: '#4fc1ff' }}>x</span>
                  <span style={{ color: '#d4d4d4' }}>,&#160;</span>
                  <span style={{ color: '#4fc1ff' }}>y</span>
                  <span style={{ color: '#d4d4d4' }}>,&#160;</span>
                  <span style={{ color: '#4fc1ff' }}>radius</span>
                  <span style={{ color: '#d4d4d4' }}>,&#160;</span>
                  <span style={{ color: '#b5cea8' }}>{round(startAngle / PI, PRECISION)}</span>
                  <span style={{ color: '#d4d4d4' }}>&#160;*&#160;</span>
                  <span style={{ color: '#9cdcfe' }}>Math</span>
                  <span style={{ color: '#d4d4d4' }}>.</span>
                  <span style={{ color: '#4fc1ff' }}>PI</span>
                  <span style={{ color: '#d4d4d4' }}>,&#160;</span>
                  <span style={{ color: '#b5cea8' }}>{round(endAngle / PI, PRECISION)}</span>
                  <span style={{ color: '#d4d4d4' }}>&#160;*&#160;</span>
                  <span style={{ color: '#9cdcfe' }}>Math</span>
                  <span style={{ color: '#d4d4d4' }}>.</span>
                  <span style={{ color: '#4fc1ff' }}>PI</span>
                  {
                    anticlockwise === undefined || <>
                      <span style={{ color: '#d4d4d4' }}>,&#160;</span>
                      <span style={{ color: '#569cd6' }}>{String(anticlockwise)}</span>
                    </>
                  }
                  <span style={{ color: '#d4d4d4' }}>);</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <datalist id="App-tickmarks">
          <option value={PI * 0 / 4} label="0"></option>
          <option value={PI * 1 / 4}></option>
          <option value={PI * 2 / 4}></option>
          <option value={PI * 3 / 4}></option>
          <option value={PI * 4 / 4} label="PI"></option>
          <option value={PI * 5 / 4}></option>
          <option value={PI * 6 / 4}></option>
          <option value={PI * 7 / 4}></option>
          <option value={PI * 8 / 4} label="TAU"></option>
        </datalist>
      </form>

      <div className="d-flex justify-content-center">
        <canvas width={500} height={500} ref={canvasRef} className="my-5" />
      </div>
    </div>
  );
};

export default App;
