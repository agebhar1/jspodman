const http = require("http");

// https://nodejs.org/docs/latest-v12.x/api/http.html#http_http_request_options_callback

function log(container, options) {
  // https://docs.podman.io/en/latest/_static/api.html#operation/libpodLogsFromContainer
  options = options || {
    socketPath: `${process.env["XDG_RUNTIME_DIR"]}/podman/podman.sock`,
    stdout: true,
    stderr: false,
    follow: true,
    timestamps: false,
  };

  let query = ["stdout", "stderr", "follow", "timestamps"].map((param) => `${param}=${options[param]}`).join("&");
  let path = `/v1/libpod/containers/${container}/logs?${query}`;

  let req = http
    .request(
      {
        socketPath: options.socketPath,
        path,
      },
      (res) => {
        console.log(`status: ${res.statusCode}`);

        res.setEncoding("utf-8");
        res.on("data", (chunk) => console.log(`body: ${chunk}`));
        res.on("end", () => console.log(`-- no more data available --`));
      }
    )
    .end();

  req.on("error", (e) => {
    console.log(`Error: ${e.message}`);
  });

  req.end();
}

let container = process.argv[2];

log(container);
