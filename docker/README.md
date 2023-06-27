# InvokeAI Containerized

All commands are to be run from the `docker` directory: `cd docker`

Linux

1. Ensure builkit is enabled in the Docker daemon settings (`/etc/docker/daemon.json`)
2. Install `docker-compose`
3. Ensure docker daemon is able to access the GPU.

macOS

1. Ensure Docker has at least 16GB RAM
2. Enable VirtioFS for file sharing
3. Enable `docker-compose` V2 support

This is done via Docker Desktop preferences

## Quickstart


1. Make a copy of `env.sample` and name it `.env` (`cp env.sample .env` (Mac/Linux) or `copy example.env .env` (Windows)). Make changes as necessary. Set `INVOKEAI_ROOT` to an absolute path to:
    a. the desired location of the InvokeAI runtime directory, or
    b. an existing, v3.0.0 compatible runtime directory.
1. `docker-compose up`

The image will be built automatically if needed.

The runtime directory (holding models and outputs) will be created in the location specified by `INVOKEAI_ROOT`. The default location is `~/invokeai`. The runtime directory will be populated with the base configs and models necessary to start generating.

### Use a GPU

- Linux is *recommended* for GPU support in Docker.
- WSL2 is *required* for Windows.
- only `x86_64` architecture is supported.

The Docker daemon on the system must be already set up to use the GPU. In case of Linux, this involves installing `nvidia-docker-runtime` and configuring the `nvidia` runtime as default. Steps will be different for AMD. Please see Docker documentation for the most up-to-date instructions for using your GPU with Docker.

## Customize

Check the `.env.sample` file. It contains some environment variables for running in Docker. Copy it, name it `.env`, and fill it in with your own values. Next time you run `docker-compose up`, your custom values will be used.

You can also set these values in `docker-compose.yml` directly, but `.env` will help avoid conflicts when code is updated.

Example (most values are optional):

```
INVOKEAI_ROOT=/Volumes/WorkDrive/invokeai
HUGGINGFACE_TOKEN=the_actual_token
CONTAINER_UID=1000
GPU_DRIVER=cuda
```

## Even Moar Customize!

See the `docker-compose.yaml` file. The `command` instruction can be uncommented and used to run arbitrary startup commands. Some examples below.

### Reconfigure the runtime directory

Can be used to download additional models from the supported model list

In conjunction with `INVOKEAI_ROOT` can be also used to initialize a runtime directory

```
command:
  - invokeai-configure
  - --yes
```

Or install models:

```
command:
  - invokeai-model-install
```