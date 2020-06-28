# jsPodman

Use [Podman][podman] via [APIv2][podman-apiv2] and Javascript. The new API was announced on this  [blog post][podman-blog-apiv2].

**State**: start experimental

Start Podman API service (no timeout), process stays in foreground: 
```bash
$ podman system service --time 0
```

Start a container, eg.
```
$ podman run --rm --detach --name my-container alpine sh -c 'while [ 1 ] ; do sleep 1; date ; done'
```

Follow logs of (this) container via APIv2 and Javascript:
```
$ node main.js my-container
```

[podman]: https://github.com/containers/libpod
[podman-apiv2]: https://docs.podman.io/en/latest/_static/api.html
[podman-blog-apiv2]: https://podman.io/blogs/2020/01/17/podman-new-api.html
