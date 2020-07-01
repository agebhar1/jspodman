const http = require("http");

// https://nodejs.org/docs/latest-v12.x/api/http.html#http_http_request_options_callback

var close = function () {};

function log(container, socketPath, options) {
  // https://docs.podman.io/en/latest/_static/api.html#operation/libpodLogsFromContainer
  options = options || {
    socketPath,
    stdout: true,
    stderr: false,
    follow: true,
    timestamps: false,
  };

  let query = ["stdout", "stderr", "follow", "timestamps"].map((param) => `${param}=${options[param]}`).join("&");
  let path = `/v1/libpod/containers/${container}/logs?${query}`;

  let req = http.request(
    {
      socketPath: options.socketPath,
      path,
    },
    (res) => {
      console.log(`status: ${res.statusCode}`);

      res.setEncoding("utf-8");
      res.on("data", (chunk) => console.log(`body: ${chunk}`));
      res.on("end", () => console.log(`-- no more data available --`));

      close = function () {
        res.destroy();
      };
    }
  );

  req.on("error", (e) => {
    console.log(`Error: ${e.message}`);
  });

  req.end();
}

process.on("SIGINT", (signal) => {
  console.log(`received: ${signal}`);
  close();
});

let container = process.argv[2];
let socketPath = process.argv[3] || `${process.env["XDG_RUNTIME_DIR"]}/podman/podman.sock`;

log(container, socketPath);
