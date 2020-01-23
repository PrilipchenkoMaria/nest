class App extends React.Component {
  state = {}

  submit = event => {
    event.preventDefault();
    const { lon, lat } = event.target.elements;

    this.cancel();
    const request = fetchBSONStream(`/api/weather?lat=${lat.value}&lon=${lon.value}`, this.onData);
    this.setState({ request });
  }

  cancel = () => {
    const { request } = this.state;

    if (request) {
      request.abort();
      this.setState({ request: null });
    }
  }

  onData = data => {
    console.log('chunk', data);
    this.setState({ data });
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <label>
          Latitude: <input name="lat" defaultValue="50" />
        </label>
        <label>
          Longitude: <input name="lon" defaultValue="36" />
        </label>
        <input type="submit" value="Subscribe" />
        <input type="button" value="Abort" onClick={this.cancel} disabled={!this.state.request} />
      </form>
    );
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('app'),
)


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
    if (done) {
      console.log("Stream completed");
      return;
    }

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
