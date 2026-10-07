FROM mcr.microsoft.com/devcontainers/typescript-node:22-trixie

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable

CMD ["sleep", "infinity"]