class App extends React.Component {
  state = {}

  submit = event => {
    event.preventDefault();
    const { lon, lat } = event.target.elements;

    this.cancel();
    const request = fetchBSONStream(`/api/weather?lat=${lat.value}&lon=${lon.value}`, this.onData);
    this.setState({
      request,
      count: 0,
    });
  }

  cancel = () => {
    const { request } = this.state;

    if (request) {
      request.abort();
      this.setState({ request: null });
    }
  }

  onData = data => {
    console.info('chunk', data);
    this.setState({
      data,
      count: this.state.count + 1,
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.submit}>
          <label>
            Latitude:
            <input name="lat" type="number" step="0.000001" min="-90" max="90" defaultValue="50" required />
          </label>
          <label>
            Longitude:
            <input name="lon" type="number" step="0.000001" min="-180" max="180" defaultValue="36" required />
          </label>
          <input type="submit" value="Subscribe" />
          <input type="button" value="Abort" onClick={this.cancel} disabled={!this.state.request} />
        </form>
        <StreamStats active={this.state.request} count={this.state.count} />
        <ResultsTable data={this.state.data} />
      </div>
    );
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('app'),
)

function ResultsTable({ data }) {
  if (!data) return null;

  return (
    <dl>
      <dt>Coords (lat/lon)</dt>
      <dd>{data.coord.lat} / {data.coord.lon}</dd>
      <dt>Humidity</dt>
      <dd>{data.main.humidity}</dd>
      <dt>Temperature</dt>
      <dd>{data.main.temp}</dd>
    </dl>
  );
}

function StreamStats({ active, count }) {
  if (!active) return null;

  return (
    <p>
      The stream is running. The number of updates received: {count}.<br />
      The updates will be pushed by backend every 10 seconds.<br />
      This is done for demonstration purposes.<br />
      In the actual app, this should be reduced to once per 10 minutes<br />
      according to the data update rate on <a href="http://openweathermap.org">openweathermap.org</a>.
    </p>
  )
}

function fetchBSONStream(url, cb) {
  const controller = new AbortController();
  const signal = controller.signal;

  fetch(url, { signal })
    .then(res => drainStream(res.body, chunk => cb(parseChunk(chunk))))
    .catch(console.error);

  return {
    abort: () => controller.abort(),
  };
}

function drainStream(stream, cb) {
  const reader = stream.getReader();

  return reader.read().then(function next({ done, value }) {
    cb(value);
    if (done) return;

    return reader.read().then(next);
  });
}

function parseChunk(chunk) {
  const [text] = new TextDecoder("utf-8").decode(chunk).split('\n');
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('error parsing:', text);
  }
}
